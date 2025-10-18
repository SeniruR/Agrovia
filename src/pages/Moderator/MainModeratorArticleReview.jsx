import React, { useEffect, useMemo, useState } from "react";
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

const normalizeArticle = (article) => ({
  ...article,
  requestedBy:
    article?.requestedBy != null
      ? Number(article.requestedBy)
      : article?.requested_by != null
      ? Number(article.requested_by)
      : null,
  requestedByName: article?.requestedByName || article?.requested_by_name || null,
  supportingImages: Array.isArray(article?.supportingImages)
    ? article.supportingImages
    : Array.isArray(article?.supporting_images)
    ? article.supporting_images
    : [],
});

const getStoredUserType = () => {
  try {
    const stored = localStorage.getItem("user");
    if (!stored) return null;
    const parsed = JSON.parse(stored);
    return parsed?.user_type ?? parsed?.type ?? parsed?.role ?? null;
  } catch (error) {
    console.warn("Failed to read stored user type", error);
    return null;
  }
};

const FILTER_OPTIONS = [
  { value: "pending", label: "Pending" },
  { value: "draft", label: "Draft" },
  { value: "published", label: "Published" },
  { value: "rejected", label: "Rejected" },
  { value: "archived", label: "Archived" },
  { value: "all", label: "All statuses" },
];

const MainModeratorArticleReview = () => {
  const [articles, setArticles] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const [query, setQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("pending");
  const [feedback, setFeedback] = useState(null);
  const [processingId, setProcessingId] = useState(null);
  const [isMainModerator, setIsMainModerator] = useState(false);

  const filteredArticles = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();
    return articles.filter((article) => {
      const titleText = article.title ? article.title.toLowerCase() : "";
      const descriptionText = article.description ? article.description.toLowerCase() : "";
      const requesterName = article.requestedByName ? article.requestedByName.toLowerCase() : "";
      const matchesSearch = normalizedQuery
        ? titleText.includes(normalizedQuery) ||
            descriptionText.includes(normalizedQuery) ||
            requesterName.includes(normalizedQuery)
        : true;
      const matchesStatus =
        statusFilter === "all" ? true : article.status === statusFilter;
      return matchesSearch && matchesStatus;
    });
  }, [articles, query, statusFilter]);

  useEffect(() => {
    loadArticles();
  }, []);

  useEffect(() => {
    const storedType = getStoredUserType();
    const isMainRole =
      storedType === 'main_moderator' ||
      storedType === 'MAIN_MODERATOR' ||
      storedType === '5.1' ||
      storedType === 5.1 ||
      storedType === '5_1';
    const isAdminRole =
      storedType === 'admin' ||
      storedType === 'ADMIN' ||
      storedType === '0' ||
      storedType === 0;
    setIsMainModerator(Boolean(isMainRole || isAdminRole));
  }, []);

  const loadArticles = async () => {
    setIsLoading(true);
    setError("");
    try {
      const response = await articleService.fetchArticles();
      const data = response?.data || response;
      const nextArticles = Array.isArray(data) ? data.map(normalizeArticle) : [];
      setArticles(nextArticles);
    } catch (err) {
      const message =
        err?.response?.data?.message || "Unable to load article requests for review.";
      setError(message);
    } finally {
      setIsLoading(false);
    }
  };

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

  const handleDecision = async (articleId, nextStatus) => {
    if (!isMainModerator) {
      setFeedback({
        type: "error",
        message: "Only main moderators can approve or reject article requests.",
      });
      return;
    }

    setProcessingId(articleId);
    setFeedback(null);
    try {
      const response = await articleService.updateArticleStatus(articleId, nextStatus);
      const updated = response?.data || response;
      const normalized = updated ? normalizeArticle(updated) : null;
      setArticles((prev) =>
        prev.map((article) =>
          article.articleId === articleId
            ? normalized ?? { ...article, status: nextStatus }
            : article
        ),
      );
      const message =
        nextStatus === "published"
          ? "Article approved and marked as published."
          : "Article request has been rejected.";
      setFeedback({ type: "success", message });
    } catch (err) {
      const message = err?.response?.data?.message || "Failed to update article status.";
      setFeedback({ type: "error", message });
    } finally {
      setProcessingId(null);
    }
  };

  return (
    <section className="min-h-screen bg-gradient-to-br from-emerald-100 via-white to-green-100 py-16 px-4">
      <div className="mx-auto w-full max-w-7xl">
        <div className="relative overflow-hidden rounded-[2.5rem] border border-emerald-100 bg-white/85 shadow-[0_30px_80px_-40px_rgba(16,185,129,0.65)] backdrop-blur">
          <div className="pointer-events-none absolute -top-24 -left-12 h-56 w-56 rounded-full bg-emerald-200 opacity-40 blur-3xl" />
          <div className="pointer-events-none absolute -bottom-24 -right-20 h-60 w-60 rounded-full bg-green-200 opacity-30 blur-3xl" />
          <div className="relative z-10 p-12">
            <header className="mb-10 text-center">
              <span className="inline-flex items-center rounded-full bg-emerald-100 px-4 py-1 text-xs font-semibold uppercase tracking-[0.4em] text-emerald-700">
                Main Moderator Desk
              </span>
              <h1 className="mt-4 text-4xl font-semibold text-emerald-800">Article Request Review</h1>
              <p className="mt-3 text-sm text-emerald-600">
                Approve or reject article briefs submitted by moderators. Approved requests will be published immediately.
              </p>
            </header>

            <div className="mb-8 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
              <div className="flex flex-1 flex-col gap-4 md:flex-row md:items-center md:gap-6">
                <div className="relative w-full md:max-w-sm">
                  <input
                    type="search"
                    value={query}
                    onChange={(event) => setQuery(event.target.value)}
                    placeholder="Search by title, requester, or description"
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
                  {FILTER_OPTIONS.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </div>
              <button
                type="button"
                onClick={loadArticles}
                className="inline-flex items-center justify-center rounded-full border border-emerald-200 px-5 py-2 text-sm font-semibold text-emerald-700 transition hover:bg-emerald-50"
              >
                Refresh list
              </button>
            </div>

            {feedback && (
              <div
                className={`mb-8 rounded-3xl border px-6 py-4 text-sm font-semibold shadow-inner ${
                  feedback.type === "success"
                    ? "border-emerald-100 bg-emerald-50 text-emerald-700"
                    : "border-rose-100 bg-rose-50 text-rose-600"
                }`}
              >
                {feedback.message}
              </div>
            )}

                {!isMainModerator && !isLoading && !error && (
                  <div className="mb-8 rounded-3xl border border-amber-100 bg-amber-50 px-6 py-4 text-sm text-amber-700 shadow-inner">
                    You can view pending requests here. Approve or reject actions are reserved for main moderators.
                  </div>
                )}

            {isLoading ? (
              <div className="flex flex-col items-center justify-center rounded-3xl border border-emerald-100 bg-emerald-50/60 py-20 text-emerald-600 shadow-inner">
                <span className="mb-4 inline-flex h-12 w-12 animate-spin items-center justify-center rounded-full border-2 border-emerald-500 border-t-transparent" />
                <p className="text-sm font-semibold">Loading article requests...</p>
              </div>
            ) : error ? (
              <div className="rounded-3xl border border-rose-100 bg-rose-50 py-10 text-center text-rose-600 shadow-inner">
                <p className="text-sm font-semibold">{error}</p>
              </div>
            ) : filteredArticles.length === 0 ? (
              <div className="rounded-3xl border border-emerald-100 bg-emerald-50/50 py-16 text-center text-emerald-600 shadow-inner">
                <h2 className="text-xl font-semibold">No requests match the current filters</h2>
                <p className="mt-2 text-sm">Try switching the status filter or adjust your search keywords.</p>
              </div>
            ) : (
              <div className="space-y-6">
                {filteredArticles.map((article) => (
                  <article
                    key={article.articleId}
                    className="group relative overflow-hidden rounded-3xl border border-emerald-100 bg-white/90 shadow-[0_10px_40px_-20px_rgba(16,185,129,0.4)] transition hover:-translate-y-1 hover:shadow-[0_30px_60px_-25px_rgba(16,185,129,0.35)]"
                  >
                    <div className="absolute inset-0 bg-gradient-to-r from-emerald-50/60 to-transparent opacity-0 transition group-hover:opacity-100" />
                    <div className="relative z-10 grid gap-8 p-8 md:grid-cols-[220px_1fr]">
                      <div className="flex flex-col gap-6 rounded-2xl border border-emerald-100 bg-emerald-50/60 p-6 text-sm text-emerald-700">
                        <div className="text-center">
                          <span className="text-xs uppercase tracking-[0.3em] text-emerald-500">Submitted</span>
                          <strong className="mt-2 block text-lg">{formatDate(article.createdAt)}</strong>
                        </div>
                        <div className="text-center">
                          <span className="text-xs uppercase tracking-[0.3em] text-emerald-500">Last update</span>
                          <span className="mt-2 block text-sm">{formatDate(article.updatedAt)}</span>
                        </div>
                        <div className="text-center">
                          <span className="text-xs uppercase tracking-[0.3em] text-emerald-500">Requested by</span>
                          <span className="mt-2 block text-sm font-semibold">
                            {article.requestedBy != null ? `#${article.requestedBy}` : "Unknown ID"}
                            {article.requestedByName ? ` - ${article.requestedByName}` : ""}
                          </span>
                        </div>
                      </div>
                      <div className="space-y-6">
                        <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
                          <h2 className="text-2xl font-semibold text-emerald-800">{article.title}</h2>
                          {renderStatusBadge(article.status)}
                        </div>
                        <p className="text-sm leading-relaxed text-gray-600 line-clamp-4 md:line-clamp-3">
                          {article.description}
                        </p>
                        <div className="grid gap-4 lg:grid-cols-[minmax(0,1fr)_minmax(0,260px)]">
                          {article.coverImage?.hasImage && article.coverImage?.data ? (
                            <div className="group/cover relative overflow-hidden rounded-3xl border border-emerald-100 bg-emerald-50/40 shadow-inner">
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
                            <div className="flex h-64 items-center justify-center rounded-3xl border border-dashed border-emerald-200 bg-emerald-50/30 text-sm text-emerald-500">
                              No cover image provided
                            </div>
                          )}

                          <div className="space-y-3">
                            <span className="text-xs font-semibold uppercase tracking-[0.3em] text-emerald-500">
                              Supporting visuals
                            </span>
                            {article.supportingImages && article.supportingImages.length > 0 ? (
                              <div className="grid gap-3 sm:grid-cols-2">
                                {article.supportingImages.map((image) => (
                                  <div
                                    key={image.imageId}
                                    className="group/support relative overflow-hidden rounded-2xl border border-emerald-100 bg-emerald-50/60 shadow-inner"
                                  >
                                    {image.data ? (
                                      <img
                                        className="h-32 w-full object-cover transition duration-300 group-hover/support:scale-105"
                                        src={`data:${image.mimeType};base64,${image.data}`}
                                        alt={image.filename || "Supporting visual"}
                                      />
                                    ) : (
                                      <div className="flex h-32 items-center justify-center text-xs text-emerald-600">
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
                                No supporting visuals supplied
                              </div>
                            )}
                          </div>
                        </div>

                        <div className="flex flex-col gap-3 border-t border-emerald-100 pt-6 md:flex-row md:items-center md:justify-between">
                          <div className="text-xs uppercase tracking-[0.3em] text-emerald-400">
                            Moderation actions
                          </div>
                          <div className="flex flex-wrap gap-3">
                            <button
                              type="button"
                              onClick={() => handleDecision(article.articleId, "published")}
                              disabled={
                                processingId === article.articleId ||
                                article.status === "published" ||
                                !isMainModerator
                              }
                              className={`rounded-full px-6 py-2 text-sm font-semibold text-white shadow transition focus:outline-none focus:ring-4 focus:ring-emerald-200 ${
                                article.status === "published" || !isMainModerator
                                  ? "bg-emerald-400/80 cursor-not-allowed"
                                  : "bg-emerald-500 hover:bg-emerald-600"
                              }`}
                            >
                              {processingId === article.articleId && article.status !== "published"
                                ? "Publishing..."
                                : article.status === "published"
                                ? "Already published"
                                : !isMainModerator
                                ? "Approval restricted"
                                : "Approve & publish"}
                            </button>
                            <button
                              type="button"
                              onClick={() => handleDecision(article.articleId, "rejected")}
                              disabled={
                                processingId === article.articleId ||
                                article.status === "rejected" ||
                                !isMainModerator
                              }
                              className={`rounded-full px-6 py-2 text-sm font-semibold text-rose-600 transition focus:outline-none focus:ring-4 focus:ring-rose-200 ${
                                article.status === "rejected" || !isMainModerator
                                  ? "border border-rose-200 bg-rose-50 cursor-not-allowed"
                                  : "border border-rose-200 bg-white hover:bg-rose-50"
                              }`}
                            >
                              {processingId === article.articleId && article.status !== "rejected"
                                ? "Applying..."
                                : article.status === "rejected"
                                ? "Already rejected"
                                : !isMainModerator
                                ? "Rejection restricted"
                                : "Reject request"}
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </article>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};

export default MainModeratorArticleReview;
