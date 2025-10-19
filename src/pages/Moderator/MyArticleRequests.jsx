import React, { useEffect, useMemo, useState } from "react";
import { Link, useLocation, useNavigate, useParams, useSearchParams } from "react-router-dom";
import { articleService } from "../../services/articleService";

const statusConfigs = {
  draft: { label: "Draft", badge: "bg-gray-100 text-gray-600", indicator: "bg-gray-400" },
  pending: { label: "Pending", badge: "bg-amber-100 text-amber-700", indicator: "bg-amber-500" },
  published: { label: "Published", badge: "bg-emerald-100 text-emerald-700", indicator: "bg-emerald-500" },
  archived: { label: "Archived", badge: "bg-slate-200 text-slate-600", indicator: "bg-slate-500" },
  rejected: { label: "Rejected", badge: "bg-rose-100 text-rose-700", indicator: "bg-rose-500" },
};

const formatDate = (value) => {
  if (!value) return "--";
  try {
    return new Date(value).toLocaleString(undefined, {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  } catch (error) {
    return value;
  }
};

const getStoredUserId = () => {
  try {
    const stored = localStorage.getItem("user");
    if (!stored) return null;
    const parsed = JSON.parse(stored);
    return Number(parsed?.id ?? parsed?.user_id ?? null) || null;
  } catch (error) {
    console.warn("Failed to read stored user", error);
    return null;
  }
};

const buildExcerpt = (text, limit = 320) => {
  if (!text) return "";
  const normalized = text.toString().trim();
  if (normalized.length <= limit) {
    return normalized;
  }
  return `${normalized.slice(0, limit - 3).trimEnd()}...`;
};

const renderDescriptionContent = (text) => {
  if (!text) return null;
  const normalized = text.toString().replace(/\r/g, "");
  const blocks = normalized.split(/\n{2,}/).map((block) => block.trim()).filter(Boolean);

  if (blocks.length === 0) {
    return (
      <p className="text-sm leading-relaxed text-gray-600 whitespace-pre-line">{normalized.trim()}</p>
    );
  }

  return blocks.map((block, index) => {
    const lines = block.split(/\n/).map((line) => line.trim()).filter(Boolean);
    const isList = lines.length > 1 && lines.every((line) => /^[-*•\u2022]\s+/.test(line));

    if (isList) {
      return (
        <ul key={`desc-list-${index}`} className="list-disc space-y-2 pl-5 text-sm leading-relaxed text-gray-600">
          {lines.map((line, idx) => (
            <li key={`desc-list-${index}-item-${idx}`}>{line.replace(/^[-*•\u2022]\s+/, "")}</li>
          ))}
        </ul>
      );
    }

    return (
      <p key={`desc-paragraph-${index}`} className="text-sm leading-relaxed text-gray-600">
        {block}
      </p>
    );
  });
};

const useFilteredArticles = (articles, query, status, userId) =>
  useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();
    const scopedUserId = Number(userId) || null;
    return articles.filter((article) => {
      const titleText = article.title ? article.title.toLowerCase() : "";
      const descriptionText = article.description ? article.description.toLowerCase() : "";
      const matchesSearch = normalizedQuery
        ? titleText.includes(normalizedQuery) || descriptionText.includes(normalizedQuery)
        : true;
      const matchesStatus = status === "all" ? true : article.status === status;
      const matchesOwner = scopedUserId ? Number(article.requestedBy) === scopedUserId : true;
      return matchesSearch && matchesStatus && matchesOwner;
    });
  }, [articles, query, status, userId]);

const MyArticleRequests = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const params = useParams();
  const [searchParams] = useSearchParams();
  const [articles, setArticles] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const [query, setQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [expandedArticles, setExpandedArticles] = useState(() => new Set());
  const [feedbackMessage, setFeedbackMessage] = useState(location.state?.feedback ?? "");
  const [deletingArticleId, setDeletingArticleId] = useState(null);
  const currentUserId = useMemo(() => getStoredUserId(), []);
  const parseArticleId = (value) => {
    if (value == null) return null;
    const numeric = Number(value);
    return Number.isFinite(numeric) ? numeric : null;
  };
  const routeArticleId = parseArticleId(params?.articleId);
  const stateArticleId = parseArticleId(location.state?.articleId);
  const queryArticleId = parseArticleId(searchParams.get("articleId"));
  const focusArticleId = routeArticleId ?? stateArticleId ?? queryArticleId ?? null;

  const filtered = useFilteredArticles(articles, query, statusFilter, currentUserId);
  const isFocusedView = Boolean(focusArticleId);
  const toggleExpanded = (articleId) => {
    setExpandedArticles((prev) => {
      const next = new Set(prev);
      if (next.has(articleId)) {
        next.delete(articleId);
      } else {
        next.add(articleId);
      }
      return next;
    });
  };

  useEffect(() => {
    if (location.state?.feedback) {
      setFeedbackMessage(location.state.feedback);
      const nextState = { ...(location.state || {}) };
      delete nextState.feedback;
      const cleanedState = Object.keys(nextState).length > 0 ? nextState : undefined;
      navigate(location.pathname + location.search, { replace: true, state: cleanedState });
    }
  }, [location.pathname, location.search, location.state, navigate]);

  const handleEdit = (articleId) => {
    navigate(`/my-article-requests/${articleId}/edit`, { state: { articleId } });
  };

  const handleDelete = async (articleId) => {
    if (deletingArticleId) {
      return;
    }

    const confirmed = typeof window !== "undefined" ? window.confirm("Delete this article request?") : true;
    if (!confirmed) {
      return;
    }

    setDeletingArticleId(articleId);
    setError("");
    setFeedbackMessage("");

    try {
      const response = await articleService.deleteArticle(articleId);
      const message = response?.message || "Article request deleted successfully.";
      setArticles((prev) => prev.filter((item) => item.articleId !== articleId));
      setExpandedArticles((prev) => {
        const next = new Set(prev);
        next.delete(articleId);
        return next;
      });
      setFeedbackMessage(message);

      if (isFocusedView) {
        navigate("/my-article-requests", { replace: true, state: { feedback: message } });
      }
    } catch (err) {
      const message = err?.response?.data?.message || "Unable to delete this article request.";
      setError(message);
    } finally {
      setDeletingArticleId(null);
    }
  };

  const renderActions = (article) => {
    if (!currentUserId || article.status !== "pending" || Number(article.requestedBy) !== currentUserId) {
      return null;
    }

    const isDeleting = deletingArticleId === article.articleId;

    return (
      <div className="flex flex-wrap items-center gap-3">
        <button
          type="button"
          onClick={() => handleEdit(article.articleId)}
          className="inline-flex items-center gap-2 rounded-full border border-emerald-200 px-4 py-2 text-xs font-semibold text-emerald-700 transition hover:bg-emerald-50"
        >
          Edit request
        </button>
        <button
          type="button"
          onClick={() => handleDelete(article.articleId)}
          disabled={isDeleting}
          className={`inline-flex items-center gap-2 rounded-full px-4 py-2 text-xs font-semibold text-white shadow transition ${
            isDeleting ? "bg-emerald-400 cursor-not-allowed" : "bg-rose-500 hover:bg-rose-600"
          }`}
        >
          {isDeleting ? "Deleting..." : "Delete request"}
        </button>
      </div>
    );
  };

  useEffect(() => {
    let isMounted = true;

    const normalizeArticle = (article) => ({
      ...article,
      requestedBy: article?.requestedBy != null ? Number(article.requestedBy) : null,
      supportingImages: Array.isArray(article?.supportingImages) ? article.supportingImages : [],
    });

    const fetchArticles = async () => {
      setIsLoading(true);
      setError("");
      try {
        const response = await articleService.fetchArticles();
        const data = response?.data || response;
        if (isMounted) {
          const nextArticles = Array.isArray(data) ? data.map(normalizeArticle) : [];
          setArticles(nextArticles);
        }
      } catch (err) {
        if (!isMounted) return;
        const message =
          err?.response?.data?.message || "Unable to load your article requests at the moment.";
        setError(message);
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    };

    const fetchFocusedArticle = async (articleId) => {
      setIsLoading(true);
      setError("");
      try {
        const response = await articleService.fetchArticleById(articleId);
        const data = response?.data || response;
        if (isMounted) {
          const normalized = data ? normalizeArticle(data) : null;
          if (normalized && currentUserId && normalized.requestedBy !== currentUserId) {
            setError("You do not have permission to view this article request.");
            setArticles([]);
            return;
          }
          setArticles(normalized ? [normalized] : []);
        }
      } catch (err) {
        if (!isMounted) return;
        const message = err?.response?.data?.message || "Unable to load this article request.";
        setError(message);
        setArticles([]);
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    };

    if (focusArticleId) {
      fetchFocusedArticle(focusArticleId);
    } else {
      fetchArticles();
    }

    return () => {
      isMounted = false;
    };
  }, [focusArticleId, currentUserId]);

  const renderStatusBadge = (status) => {
    const config = statusConfigs[status] ?? {
      label: status,
      badge: "bg-gray-100 text-gray-600",
      indicator: "bg-gray-400",
    };
    return (
      <span className={`inline-flex items-center gap-2 rounded-full px-3 py-1 text-xs font-semibold ${config.badge}`}>
        <span className={`h-2 w-2 rounded-full ${config.indicator}`} />
        {config.label}
      </span>
    );
  };

  return (
    <section className="min-h-screen bg-gradient-to-br from-emerald-100 via-white to-green-100 py-16 px-4">
      <div className="mx-auto w-full max-w-6xl">
        <div className="relative overflow-hidden rounded-[2.5rem] border border-emerald-100 bg-white/80 shadow-[0_30px_80px_-40px_rgba(16,185,129,0.6)] backdrop-blur">
          <div className="pointer-events-none absolute -top-24 -left-10 h-56 w-56 rounded-full bg-emerald-200 opacity-40 blur-3xl" />
          <div className="pointer-events-none absolute -bottom-20 -right-16 h-60 w-60 rounded-full bg-green-200 opacity-30 blur-3xl" />
          <div className="relative z-10 p-12">
            <header className="mb-10 text-center">
              <span className="inline-flex items-center rounded-full bg-emerald-100 px-4 py-1 text-xs font-semibold uppercase tracking-widest text-emerald-700">
                Moderator Console
              </span>
              <h1 className="mt-4 text-4xl font-semibold text-emerald-800">My Article Requests</h1>
              <p className="mt-3 text-sm text-emerald-600">
                {isFocusedView
                  ? "Review the article brief you selected and monitor its progress."
                  : "Track every article brief you have shared with the editorial team. Stay informed on where each request stands."}
              </p>
            </header>

            {feedbackMessage && (
              <div className="mb-8 rounded-3xl border border-emerald-100 bg-emerald-50 px-6 py-4 text-sm text-emerald-700 shadow-inner">
                {feedbackMessage}
              </div>
            )}

            {isFocusedView && (
              <div className="mb-8 flex justify-center">
                <Link
                  to="/my-article-requests"
                  className="inline-flex items-center gap-2 rounded-full border border-emerald-200 px-5 py-2 text-sm font-semibold text-emerald-700 transition hover:bg-emerald-50"
                >
                  View all requests
                </Link>
              </div>
            )}

            {!isFocusedView && (
              <div className="mb-10 grid gap-4 md:grid-cols-[1fr_200px]">
                <div className="relative">
                  <input
                    type="search"
                    value={query}
                    onChange={(event) => setQuery(event.target.value)}
                    placeholder="Search by title or description"
                    className="w-full rounded-2xl border border-emerald-100 bg-white px-5 py-4 text-sm text-gray-700 shadow-inner outline-none transition focus:border-emerald-300 focus:ring-4 focus:ring-emerald-100"
                  />
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={1.5}
                    stroke="currentColor"
                    className="pointer-events-none absolute right-5 top-1/2 h-5 w-5 -translate-y-1/2 text-emerald-500"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M21 21l-4.35-4.35M17.25 10.5a6.75 6.75 0 11-13.5 0 6.75 6.75 0 0113.5 0z"
                    />
                  </svg>
                </div>
                <select
                  value={statusFilter}
                  onChange={(event) => setStatusFilter(event.target.value)}
                  className="rounded-2xl border border-emerald-100 bg-white px-4 py-4 text-sm font-semibold text-emerald-700 shadow-inner outline-none transition focus:border-emerald-300 focus:ring-4 focus:ring-emerald-100"
                >
                  <option value="all">All statuses</option>
                  <option value="draft">Draft</option>
                  <option value="pending">Pending</option>
                  <option value="published">Published</option>
                  <option value="archived">Archived</option>
                  <option value="rejected">Rejected</option>
                </select>
              </div>
            )}

            {isLoading ? (
              <div className="flex flex-col items-center justify-center rounded-3xl border border-emerald-100 bg-emerald-50/60 py-20 text-emerald-600 shadow-inner">
                <span className="mb-4 inline-flex h-12 w-12 animate-spin items-center justify-center rounded-full border-2 border-emerald-500 border-t-transparent" />
                <p className="text-sm font-semibold">Fetching your article requests...</p>
              </div>
            ) : error ? (
              <div className="rounded-3xl border border-red-100 bg-red-50 py-10 text-center text-red-500 shadow-inner">
                <p className="text-sm font-semibold">{error}</p>
              </div>
            ) : filtered.length === 0 ? (
              <div className="rounded-3xl border border-emerald-100 bg-emerald-50/50 py-16 text-center text-emerald-600 shadow-inner">
                <h2 className="text-xl font-semibold">No matching requests found</h2>
                <p className="mt-2 text-sm">
                  {isFocusedView
                    ? "We couldn't locate that article request. It may have been removed or you no longer have access to it."
                    : "Try adjusting your search or submit a new article request to see it here."}
                </p>
              </div>
            ) : (
              <div className="space-y-6">
                {filtered.map((article) => {
                  const isExpanded = expandedArticles.has(article.articleId);
                  const hasCoverImage = article.coverImage?.hasImage && article.coverImage?.data;
                  return (
                    <article
                      key={article.articleId}
                      className="group relative overflow-hidden rounded-3xl border border-emerald-100 bg-white/90 shadow-[0_10px_40px_-20px_rgba(16,185,129,0.4)] transition hover:-translate-y-1 hover:shadow-[0_30px_60px_-25px_rgba(16,185,129,0.35)]"
                    >
                      <div className="absolute inset-0 bg-gradient-to-r from-emerald-50/60 to-transparent opacity-0 transition group-hover:opacity-100" />
                      {isExpanded ? (
                        <div className="relative z-10 flex flex-col gap-8 p-8 lg:flex-row">
                          <div className="flex flex-shrink-0 flex-col justify-between gap-6 rounded-2xl border border-emerald-100 bg-emerald-50/60 p-6 text-sm text-emerald-700 lg:w-72">
                            <div className="space-y-3 text-center">
                              <span className="text-xs uppercase tracking-[0.3em] text-emerald-500">Created</span>
                              <strong className="text-lg">{formatDate(article.createdAt)}</strong>
                            </div>
                            <div className="space-y-3 text-center">
                              <span className="text-xs uppercase tracking-[0.3em] text-emerald-500">Last update</span>
                              <span className="text-sm">{formatDate(article.updatedAt)}</span>
                            </div>
                            <div className="flex justify-center">{renderStatusBadge(article.status)}</div>
                          </div>
                          <div className="flex min-w-0 flex-1 flex-col gap-6">
                            <div className="space-y-3">
                              <h2 className="break-words text-3xl font-semibold text-emerald-800">{article.title}</h2>
                              <div className="space-y-4 max-h-60 overflow-y-auto pr-1">
                                {renderDescriptionContent(article.description) || (
                                  <p className="text-sm leading-relaxed text-gray-500">No description provided.</p>
                                )}
                              </div>
                            </div>

                            <div className="flex flex-col gap-6 lg:flex-row">
                              {hasCoverImage ? (
                                <div className="group/cover relative flex-1 overflow-hidden rounded-3xl border border-emerald-100 bg-emerald-50/40 shadow-inner">
                                  <img
                                    className="h-64 w-full object-cover transition duration-500 group-hover/cover:scale-[1.03]"
                                    src={`data:${article.coverImage.mimeType};base64,${article.coverImage.data}`}
                                    alt={article.coverImage.filename || "Cover visual"}
                                  />
                                  <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/70 to-transparent px-5 pb-4 pt-6 text-sm text-white">
                                    <span className="block text-xs uppercase tracking-[0.4em] opacity-60">Cover image</span>
                                    <span className="line-clamp-1 font-medium">{article.coverImage.filename || "Cover visual"}</span>
                                  </div>
                                </div>
                              ) : (
                                <div className="flex h-64 flex-1 items-center justify-center rounded-3xl border border-dashed border-emerald-200 bg-emerald-50/30 text-sm text-emerald-500">
                                  No cover image uploaded
                                </div>
                              )}

                              <div className="flex min-w-[220px] max-w-full flex-col gap-3 lg:w-64">
                                <span className="text-xs font-semibold uppercase tracking-[0.3em] text-emerald-500">
                                  Visual references
                                </span>
                                {article.supportingImages && article.supportingImages.length > 0 ? (
                                  <div className="flex gap-3 overflow-y-hidden overflow-x-auto pb-2">
                                    {article.supportingImages.map((image) => (
                                      <div
                                        key={image.imageId}
                                        className="group/support relative h-32 w-40 flex-shrink-0 overflow-hidden rounded-2xl border border-emerald-100 bg-emerald-50/60 shadow-inner"
                                      >
                                        {image.data ? (
                                          <img
                                            className="h-full w-full object-cover transition duration-300 group-hover/support:scale-105"
                                            src={`data:${image.mimeType};base64,${image.data}`}
                                            alt={image.filename || "Supporting visual"}
                                          />
                                        ) : (
                                          <div className="flex h-full items-center justify-center text-xs text-emerald-600">
                                            Image unavailable
                                          </div>
                                        )}
                                        <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/60 to-transparent px-3 py-2 text-[11px] text-white">
                                          <span className="line-clamp-1">{image.filename}</span>
                                        </div>
                                      </div>
                                    ))}
                                  </div>
                                ) : (
                                  <div className="flex h-32 items-center justify-center rounded-2xl border border-dashed border-emerald-200 bg-emerald-50/40 text-xs text-emerald-500">
                                    No supporting visuals added
                                  </div>
                                )}
                              </div>
                            </div>

                            <div className="flex flex-wrap items-center justify-between gap-4 border-t border-emerald-100 pt-6">
                              <div className="text-sm text-emerald-700">
                                {article.supportingImages?.length || 0} supporting visual
                                {article.supportingImages?.length === 1 ? "" : "s"}
                              </div>
                              {renderActions(article)}
                              <button
                                type="button"
                                onClick={() => toggleExpanded(article.articleId)}
                                className="inline-flex items-center gap-2 rounded-full bg-emerald-600 px-5 py-2 text-sm font-semibold text-white shadow transition hover:bg-emerald-700"
                              >
                                Hide details
                                <svg
                                  xmlns="http://www.w3.org/2000/svg"
                                  viewBox="0 0 24 24"
                                  fill="none"
                                  stroke="currentColor"
                                  strokeWidth={1.5}
                                  className="h-4 w-4"
                                >
                                  <path strokeLinecap="round" strokeLinejoin="round" d="M18 12H6" />
                                </svg>
                              </button>
                            </div>
                          </div>
                        </div>
                      ) : (
                        <div className="relative z-10 flex flex-col gap-6 p-8 sm:flex-row">
                          <div className="flex w-full flex-shrink-0 overflow-hidden rounded-2xl border border-emerald-100 bg-emerald-50/40 sm:w-56">
                            {hasCoverImage ? (
                              <img
                                className="h-48 w-full object-cover"
                                src={`data:${article.coverImage.mimeType};base64,${article.coverImage.data}`}
                                alt={article.coverImage.filename || "Cover visual"}
                              />
                            ) : (
                              <div className="flex h-48 w-full items-center justify-center text-sm text-emerald-500">
                                No cover image
                              </div>
                            )}
                          </div>
                          <div className="flex min-w-0 flex-1 flex-col gap-4">
                            <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                              <h2 className="break-words text-2xl font-semibold text-emerald-800">{article.title}</h2>
                              {renderStatusBadge(article.status)}
                            </div>
                            <p className="text-sm leading-relaxed text-gray-600 line-clamp-2">
                              {buildExcerpt(article.description, 220)}
                            </p>
                            <div className="flex flex-wrap gap-3 text-xs font-semibold uppercase tracking-[0.25em] text-emerald-500">
                              <span className="rounded-full bg-emerald-50 px-3 py-1 text-emerald-600">
                                Created {formatDate(article.createdAt)}
                              </span>
                              <span className="rounded-full bg-emerald-50 px-3 py-1 text-emerald-600">
                                Updated {formatDate(article.updatedAt)}
                              </span>
                              <span className="rounded-full bg-emerald-50 px-3 py-1 text-emerald-600">
                                {article.supportingImages?.length || 0} visuals
                              </span>
                            </div>
                            <div className="flex flex-wrap items-center justify-between gap-3">
                              {renderActions(article)}
                              <button
                                type="button"
                                onClick={() => toggleExpanded(article.articleId)}
                                className="inline-flex items-center gap-2 rounded-full bg-emerald-600 px-5 py-2 text-sm font-semibold text-white shadow transition hover:bg-emerald-700"
                              >
                                View details
                                <svg
                                  xmlns="http://www.w3.org/2000/svg"
                                  viewBox="0 0 24 24"
                                  fill="none"
                                  stroke="currentColor"
                                  strokeWidth={1.5}
                                  className="h-4 w-4"
                                >
                                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                                </svg>
                              </button>
                            </div>
                          </div>
                        </div>
                      )}
                    </article>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};

export default MyArticleRequests;
