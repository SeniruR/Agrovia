import React, { useEffect, useMemo, useRef, useState } from "react";
import { articleService } from "../services/articleService";
import {
  BookOpen,
  Calendar,
  Clock,
  Copy,
  Loader2,
  Search,
  Share2,
  Sparkles,
  User,
  X,
} from "lucide-react";

const gradients = [
  "from-emerald-500 via-green-500 to-emerald-600",
  "from-lime-500 via-green-400 to-teal-500",
  "from-teal-500 via-cyan-500 to-emerald-500",
  "from-emerald-600 via-teal-500 to-sky-500",
];

const toTimestamp = (value) => {
  if (!value) return 0;
  const parsed = new Date(value);
  return Number.isNaN(parsed.getTime()) ? 0 : parsed.getTime();
};

const formatDate = (value) => {
  if (!value) return "Recently updated";
  const timestamp = toTimestamp(value);
  if (!timestamp) return "Recently updated";
  return new Date(timestamp).toLocaleDateString(undefined, {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
};

const estimateReadingTime = (text) => {
  if (!text) return "Quick read";
  const words = text.toString().trim().split(/\s+/).filter(Boolean).length;
  if (!words) return "Quick read";
  const minutes = Math.max(1, Math.round(words / 180));
  return `${minutes} min read`;
};

const buildExcerpt = (text, limit = 160) => {
  if (!text) return "";
  const normalized = text.toString().trim();
  if (normalized.length <= limit) {
    return normalized;
  }
  return `${normalized.slice(0, limit - 3).trimEnd()}...`;
};

const renderFullDescription = (text) => {
  if (!text) return null;
  const normalized = text.toString().replace(/\r/g, "");
  const blocks = normalized
    .split(/\n{2,}/)
    .map((block) => block.trim())
    .filter(Boolean);

  if (blocks.length === 0) {
    return (
      <p className="text-base leading-relaxed text-gray-600 whitespace-pre-line">{normalized.trim()}</p>
    );
  }

  return blocks.map((block, index) => {
    const lines = block.split(/\n/).map((line) => line.trim()).filter(Boolean);
    const isList = lines.length > 1 && lines.every((line) => /^[-*•\u2022]\s+/.test(line));

    if (isList) {
      return (
        <ul key={`desc-list-${index}`} className="list-disc space-y-2 pl-5 text-base leading-relaxed text-gray-600">
          {lines.map((line, idx) => (
            <li key={`desc-item-${index}-${idx}`}>{line.replace(/^[-*•\u2022]\s+/, "")}</li>
          ))}
        </ul>
      );
    }

    return (
      <p key={`desc-paragraph-${index}`} className="text-base leading-relaxed text-gray-600">
        {block}
      </p>
    );
  });
};

const resolveImageSrc = (image) => {
  if (!image) return null;
  if (image?.data) {
    return `data:${image.mimeType};base64,${image.data}`;
  }
  if (image?.url) {
    return image.url;
  }
  return null;
};

const normalizeArticle = (article) => {
  const cover = article?.coverImage ?? article?.cover_image ?? {};
  const hasEmbeddedImage = cover?.hasImage && cover?.data;
  const supporting = Array.isArray(article?.supportingImages)
    ? article.supportingImages
    : Array.isArray(article?.supporting_images)
    ? article.supporting_images
    : [];
  const rawDescription = article?.description ?? "";
  const words = rawDescription ? rawDescription.toString().trim().split(/\s+/).filter(Boolean).length : 0;
  const minutes = words ? Math.max(1, Math.round(words / 180)) : 1;

  return {
    id: article?.articleId ?? article?.id ?? article?.article_id ?? `${Date.now()}-${Math.random()}`,
    title: article?.title ?? "Untitled request",
    description: rawDescription,
    coverImage: hasEmbeddedImage ? `data:${cover.mimeType};base64,${cover.data}` : cover?.url ?? null,
    status: article?.status ?? article?.current_status ?? "draft",
    requestedByName:
      article?.requestedByName ??
      article?.requested_by_name ??
      article?.authorName ??
      "Agrovia Content Team",
    createdAt: article?.createdAt ?? article?.created_at ?? null,
    updatedAt: article?.updatedAt ?? article?.updated_at ?? null,
    supportingImages: supporting,
    readingTime: `${minutes} min read`,
    readingMinutes: minutes,
    wordCount: words,
    excerpt: buildExcerpt(rawDescription, 220),
  };
};

const PublishedArticles = () => {
  const [articles, setArticles] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortOption, setSortOption] = useState("newest");
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const [activeArticle, setActiveArticle] = useState(null);
  const [shareFeedback, setShareFeedback] = useState({ message: "", tone: "success" });
  const shareTimeoutRef = useRef(null);

  useEffect(() => {
    let isMounted = true;
    const fetchArticles = async () => {
      setIsLoading(true);
      setError("");
      try {
        const response = await articleService.fetchPublishedArticles();
        const payload = response?.data ?? response;
        const list = Array.isArray(payload) ? payload : Array.isArray(payload?.data) ? payload.data : [];
        if (!isMounted) return;
        const published = list
          .filter((item) => (item?.status ?? item?.current_status) === "published")
          .map(normalizeArticle)
          .sort((a, b) => toTimestamp(b.updatedAt || b.createdAt) - toTimestamp(a.updatedAt || a.createdAt));
        setArticles(published);
      } catch (err) {
        if (!isMounted) return;
        const message =
          err?.response?.data?.message ?? "We could not load the published briefs right now. Please try again.";
        setError(message);
        setArticles([]);
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    };

    fetchArticles();
    return () => {
      isMounted = false;
    };
  }, []);

  useEffect(() => {
    if (!activeArticle) return;
    const handleKeyDown = (event) => {
      if (event.key === "Escape") {
        setActiveArticle(null);
      }
    };
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [activeArticle]);

  useEffect(() => {
    return () => {
      if (shareTimeoutRef.current) {
        clearTimeout(shareTimeoutRef.current);
      }
    };
  }, []);

  const filteredArticles = useMemo(() => {
    const normalizedQuery = searchTerm.trim().toLowerCase();
    const scoped = normalizedQuery
      ? articles.filter((article) => {
          const haystack = `${article.title} ${article.description} ${article.requestedByName}`.toLowerCase();
          return haystack.includes(normalizedQuery);
        })
      : [...articles];

    return scoped.sort((a, b) => {
      if (sortOption === "oldest") {
        return toTimestamp(a.updatedAt || a.createdAt) - toTimestamp(b.updatedAt || b.createdAt);
      }
      if (sortOption === "title") {
        return a.title.localeCompare(b.title);
      }
      return toTimestamp(b.updatedAt || b.createdAt) - toTimestamp(a.updatedAt || a.createdAt);
    });
  }, [articles, searchTerm, sortOption]);

  const heroArticle = filteredArticles.length > 0 ? filteredArticles[0] : null;
  const otherArticles = heroArticle ? filteredArticles.slice(1) : [];
  const heroPreviews = heroArticle ? (heroArticle.supportingImages ?? []).slice(0, 4) : [];

  const stats = useMemo(() => {
    if (articles.length === 0) {
      return {
        total: 0,
        newestTitle: "",
        uniqueAuthors: 0,
        averageMinutes: 0,
      };
    }
    const newest = articles[0];
    const unique = new Set(articles.map((item) => item.requestedByName));
    const averageMinutes = Math.max(
      1,
      Math.round(
        articles.reduce((minutes, item) => minutes + (item.readingMinutes || 0), 0) /
          articles.length,
      ),
    );
    return {
      total: articles.length,
      newestTitle: newest.title,
      uniqueAuthors: unique.size,
      averageMinutes,
    };
  }, [articles]);

  const displayShareFeedback = (message, tone = "success") => {
    setShareFeedback({ message, tone });
    if (shareTimeoutRef.current) {
      clearTimeout(shareTimeoutRef.current);
    }
    shareTimeoutRef.current = setTimeout(() => {
      setShareFeedback({ message: "", tone: "success" });
    }, 3200);
  };

  const handleShareArticle = async (article) => {
    if (!article) return;
    try {
      const hasWindow = typeof window !== "undefined";
      const shareUrl = hasWindow
        ? `${window.location.origin}${window.location.pathname}?articleId=${article.id}`
        : "";
      const sharePayload = {
        title: article.title,
        text: article.excerpt || article.description,
        url: shareUrl,
      };

      if (typeof navigator !== "undefined" && navigator.share) {
        await navigator.share(sharePayload);
        displayShareFeedback("Thanks for amplifying this story!", "success");
      } else if (typeof navigator !== "undefined" && navigator.clipboard) {
        await navigator.clipboard.writeText(`${article.title} — ${shareUrl}`.trim());
        displayShareFeedback("Link copied. Share it with your community!", "success");
      } else {
        displayShareFeedback("Sharing isn't supported on this device.", "error");
      }
    } catch (shareError) {
      displayShareFeedback("We couldn't share that just now. Please try again.", "error");
    }
  };

  const copyArticleLink = async (article) => {
    if (!article) return;
    try {
      if (typeof navigator === "undefined" || !navigator.clipboard) {
        displayShareFeedback("Copying isn't supported on this device.", "error");
        return;
      }
      const shareUrl = typeof window !== "undefined"
        ? `${window.location.origin}${window.location.pathname}?articleId=${article.id}`
        : "";
      await navigator.clipboard.writeText(`${article.title} — ${shareUrl}`.trim());
      displayShareFeedback("Link copied to your clipboard.", "success");
    } catch (error) {
      displayShareFeedback("We couldn't copy that link. Please try again.", "error");
    }
  };

  return (
    <section className="min-h-screen bg-gradient-to-br from-emerald-50 via-white to-green-50 py-16 px-4">
      <div className="mx-auto w-full max-w-7xl">
        <header className="flex flex-col gap-8 lg:flex-row lg:items-center lg:justify-between">
          <div className="max-w-2xl space-y-6">
            <div className="space-y-4">
              <span className="inline-flex items-center gap-2 rounded-full bg-emerald-100 px-4 py-1 text-xs font-semibold uppercase tracking-[0.35em] text-emerald-700">
                Open Library · For every visitor
              </span>
              <h1 className="text-4xl font-semibold text-emerald-900 sm:text-5xl">
                Fresh guidance and inspiration, ready for your next idea
              </h1>
              <p className="text-base text-emerald-700 sm:text-lg">
                These stories are crafted by Agrovia’s moderators and available to everyone—whether you are logged in or
                just exploring. Discover play-ready briefs, visuals, and insights designed to help farmers, buyers, and
                curious learners make confident decisions.
              </p>
            </div>
          </div>
          <div className="grid w-full max-w-xl grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
            <div className="flex min-h-[9.5rem] flex-col items-center justify-center rounded-3xl border border-emerald-100 bg-white/80 p-7 text-center shadow-sm">
              <p className="text-xs font-semibold uppercase tracking-[0.3em] text-emerald-500">Published briefs</p>
              <p className="mt-2 text-3xl font-semibold text-emerald-900">{stats.total}</p>
            </div>
            <div className="flex min-h-[9.5rem] flex-col items-center justify-center rounded-3xl border border-emerald-100 bg-white/80 p-7 text-center shadow-sm">
              <p className="text-xs font-semibold uppercase tracking-[0.3em] text-emerald-500">Newest headline</p>
              <p className="mt-2 text-sm font-semibold text-emerald-800 line-clamp-3">{stats.newestTitle || "Coming soon"}</p>
            </div>
            <div className="flex min-h-[9.5rem] flex-col items-center justify-center rounded-3xl border border-emerald-100 bg-white/80 p-7 text-center shadow-sm">
              <p className="text-xs font-semibold uppercase tracking-[0.3em] text-emerald-500">Avg. read time</p>
              <p className="mt-2 text-3xl font-semibold text-emerald-900">
                {stats.averageMinutes ? `${stats.averageMinutes} min` : "––"}
              </p>
            </div>
            <div className="flex min-h-[9.5rem] flex-col items-center justify-center rounded-3xl border border-emerald-100 bg-white/80 p-7 text-center shadow-sm">
              <p className="text-xs font-semibold uppercase tracking-[0.3em] text-emerald-500">Contributing voices</p>
              <p className="mt-2 text-3xl font-semibold text-emerald-900">{stats.uniqueAuthors}</p>
            </div>
          </div>
        </header>

        <div className="mt-14 rounded-[2.5rem] border border-emerald-100 bg-white/80 p-8 shadow-[0_30px_80px_-60px_rgba(16,185,129,0.7)] backdrop-blur lg:p-12">
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div className="relative w-full md:max-w-xl">
              <Search className="pointer-events-none absolute left-5 top-1/2 h-5 w-5 -translate-y-1/2 text-emerald-400" />
              <input
                type="search"
                value={searchTerm}
                onChange={(event) => setSearchTerm(event.target.value)}
                placeholder="Search by theme, description, or contributor"
                className="w-full rounded-2xl border border-emerald-100 bg-white px-12 py-4 text-sm text-gray-700 shadow-inner outline-none transition focus:border-emerald-300 focus:ring-4 focus:ring-emerald-100"
              />
            </div>
            <select
              value={sortOption}
              onChange={(event) => setSortOption(event.target.value)}
              className="w-full rounded-2xl border border-emerald-100 bg-white px-5 py-4 text-sm font-semibold text-emerald-700 shadow-inner outline-none transition focus:border-emerald-300 focus:ring-4 focus:ring-emerald-100 md:w-auto"
            >
              <option value="newest">Newest first</option>
              <option value="oldest">Oldest first</option>
              <option value="title">Title A-Z</option>
            </select>
          </div>

          <div className="mt-10 space-y-12">
            {isLoading ? (
              <div className="flex flex-col items-center justify-center gap-4 py-24 text-emerald-600">
                <Loader2 className="h-10 w-10 animate-spin" />
                <p className="text-sm font-semibold">Gathering the latest published briefs...</p>
              </div>
            ) : error ? (
              <div className="rounded-3xl border border-rose-100 bg-rose-50 py-16 text-center text-rose-600 shadow-inner">
                <p className="text-sm font-semibold">{error}</p>
              </div>
            ) : filteredArticles.length === 0 ? (
              <div className="rounded-3xl border border-emerald-100 bg-emerald-50/60 py-16 text-center text-emerald-600 shadow-inner">
                <p className="text-xl font-semibold">No published briefs found</p>
                <p className="mt-2 text-sm">Try a different search or check back soon for fresh inspiration.</p>
              </div>
            ) : (
              <>
                {heroArticle && (
                  <article className="overflow-hidden rounded-[2.75rem] border border-emerald-100 bg-white shadow-[0_40px_120px_-70px_rgba(16,185,129,0.45)]">
                    <div className="grid gap-8 lg:grid-cols-[minmax(0,1.1fr)_minmax(0,0.95fr)]">
                      <div className="relative min-h-[18rem] lg:min-h-[24rem]">
                        {heroArticle.coverImage ? (
                          <img
                            src={heroArticle.coverImage}
                            alt={heroArticle.title}
                            className="absolute inset-0 h-full w-full object-cover"
                          />
                        ) : (
                          <div
                            className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-emerald-500 via-emerald-600 to-teal-500 text-white"
                            aria-hidden="true"
                          >
                            <BookOpen className="h-16 w-16" />
                          </div>
                        )}
                        <div className="absolute inset-x-0 top-0 flex justify-between p-6">
                          <span className="inline-flex items-center gap-2 rounded-full bg-black/40 px-4 py-1 text-xs font-semibold uppercase tracking-[0.35em] text-white backdrop-blur">
                            <Sparkles className="h-4 w-4" /> Featured story
                          </span>
                        </div>
                        {heroPreviews.length > 0 && (
                          <div className="absolute inset-x-0 bottom-0 hidden gap-3 overflow-x-auto px-6 pb-5 lg:flex">
                            {heroPreviews.map((image, idx) => {
                              const previewSrc = resolveImageSrc(image);
                              return (
                                <div
                                  key={image?.imageId ?? image?.id ?? `${heroArticle.id}-preview-${idx}`}
                                  className="relative h-20 w-28 flex-shrink-0 overflow-hidden rounded-2xl border border-white/40 bg-white/20"
                                >
                                  {previewSrc ? (
                                    <img
                                      src={previewSrc}
                                      alt={image?.filename || `Supporting visual ${idx + 1}`}
                                      className="h-full w-full object-cover"
                                    />
                                  ) : (
                                    <div className="flex h-full items-center justify-center text-[11px] text-white/80">
                                      Visual coming soon
                                    </div>
                                  )}
                                </div>
                              );
                            })}
                          </div>
                        )}
                      </div>
                      <div className="flex flex-col gap-6 p-8 sm:p-12">
                        <h2 className="text-3xl font-semibold leading-tight text-emerald-900 sm:text-4xl">
                          {heroArticle.title}
                        </h2>
                        <p className="text-base text-emerald-800 sm:text-lg">
                          {heroArticle.description}
                        </p>
                        <div className="flex flex-wrap gap-3 text-xs font-semibold uppercase tracking-[0.3em] text-emerald-500">
                          <span className="inline-flex items-center gap-2 rounded-full bg-emerald-50 px-3 py-1 text-emerald-600">
                            <User className="h-4 w-4" /> {heroArticle.requestedByName}
                          </span>
                          <span className="inline-flex items-center gap-2 rounded-full bg-emerald-50 px-3 py-1 text-emerald-600">
                            <Calendar className="h-4 w-4" /> {formatDate(heroArticle.updatedAt || heroArticle.createdAt)}
                          </span>
                          <span className="inline-flex items-center gap-2 rounded-full bg-emerald-50 px-3 py-1 text-emerald-600">
                            <Clock className="h-4 w-4" /> {heroArticle.readingTime}
                          </span>
                        </div>
                        <div className="flex flex-wrap gap-3">
                          <button
                            type="button"
                            onClick={() => setActiveArticle(heroArticle)}
                            className="inline-flex items-center gap-2 rounded-full bg-emerald-600 px-5 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-emerald-700"
                          >
                            View full story
                            <Sparkles className="h-4 w-4" />
                          </button>
                          <button
                            type="button"
                            onClick={() => handleShareArticle(heroArticle)}
                            className="inline-flex items-center gap-2 rounded-full border border-emerald-100 bg-white px-5 py-2 text-sm font-semibold text-emerald-600 transition hover:bg-emerald-50"
                          >
                            <Share2 className="h-4 w-4" /> Share story
                          </button>
                          <button
                            type="button"
                            onClick={() => copyArticleLink(heroArticle)}
                            className="inline-flex items-center gap-2 rounded-full border border-emerald-100 bg-white px-5 py-2 text-sm font-semibold text-emerald-600 transition hover:bg-emerald-50"
                          >
                            <Copy className="h-4 w-4" /> Copy link
                          </button>
                        </div>
                        {heroPreviews.length > 0 && (
                          <div className="flex gap-3 overflow-x-auto pb-2 lg:hidden">
                            {heroPreviews.map((image, idx) => {
                              const previewSrc = resolveImageSrc(image);
                              return (
                                <div
                                  key={image?.imageId ?? image?.id ?? `${heroArticle.id}-thumb-${idx}`}
                                  className="relative h-24 w-32 flex-shrink-0 overflow-hidden rounded-2xl border border-emerald-100"
                                >
                                  {previewSrc ? (
                                    <img
                                      src={previewSrc}
                                      alt={image?.filename || `Supporting visual ${idx + 1}`}
                                      className="h-full w-full object-cover"
                                    />
                                  ) : (
                                    <div className="flex h-full items-center justify-center text-[11px] text-emerald-500">
                                      Visual coming soon
                                    </div>
                                  )}
                                </div>
                              );
                            })}
                          </div>
                        )}
                      </div>
                    </div>
                  </article>
                )}

                {shareFeedback.message && (
                  <div
                    className={`rounded-3xl border px-5 py-3 text-sm font-semibold text-center ${
                      shareFeedback.tone === "error"
                        ? "border-rose-200 bg-rose-50/90 text-rose-600"
                        : "border-emerald-200 bg-emerald-50/90 text-emerald-700"
                    }`}
                    aria-live="polite"
                  >
                    {shareFeedback.message}
                  </div>
                )}

                {otherArticles.length > 0 && (
                  <div className="grid gap-8 sm:grid-cols-2 xl:grid-cols-3">
                    {otherArticles.map((article, index) => (
                      <article
                        key={article.id}
                        className="group relative overflow-hidden rounded-3xl border border-emerald-100 bg-white shadow-[0_20px_60px_-40px_rgba(16,185,129,0.6)] transition hover:-translate-y-1 hover:shadow-[0_30px_80px_-40px_rgba(16,185,129,0.65)]"
                      >
                        {article.coverImage ? (
                          <div className="relative h-52 overflow-hidden">
                            <img
                              src={article.coverImage}
                              alt={article.title}
                              className="h-full w-full object-cover transition duration-700 group-hover:scale-105"
                              loading="lazy"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/45 to-transparent" />
                          </div>
                        ) : (
                          <div
                            className={`flex h-52 items-center justify-center bg-gradient-to-br ${gradients[index % gradients.length]} text-white`}
                          >
                            <BookOpen className="h-10 w-10" />
                          </div>
                        )}

                        <div className="space-y-5 p-6">
                          <div className="flex flex-wrap items-center justify-between gap-3 text-xs font-semibold uppercase tracking-[0.3em] text-emerald-500">
                            <span className="inline-flex items-center gap-2 text-emerald-600">
                              <User className="h-4 w-4" />
                              {article.requestedByName}
                            </span>
                            <div className="flex flex-wrap items-center gap-3 text-gray-500">
                              <span className="inline-flex items-center gap-2">
                                <Clock className="h-4 w-4" /> {article.readingTime}
                              </span>
                              <span className="inline-flex items-center gap-2">
                                <Calendar className="h-4 w-4" />
                                {formatDate(article.updatedAt || article.createdAt)}
                              </span>
                            </div>
                          </div>

                          <h2 className="line-clamp-2 text-xl font-semibold text-gray-900">{article.title}</h2>
                          <p className="text-sm text-gray-600 line-clamp-3">{article.excerpt}</p>

                          <div className="flex items-center justify-between pt-1">
                            <button
                              type="button"
                              onClick={() => setActiveArticle(article)}
                              className="inline-flex items-center gap-2 rounded-full bg-emerald-100 px-4 py-2 text-sm font-semibold text-emerald-700 transition hover:bg-emerald-200"
                            >
                              View highlights
                              <Sparkles className="h-4 w-4" />
                            </button>
                            <button
                              type="button"
                              onClick={() => handleShareArticle(article)}
                              className="inline-flex items-center gap-2 rounded-full border border-emerald-100 px-4 py-2 text-sm font-semibold text-emerald-600 transition hover:bg-emerald-50"
                            >
                              <Share2 className="h-4 w-4" /> Share
                            </button>
                          </div>
                        </div>
                      </article>
                    ))}
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>

      {activeArticle && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 px-4 py-8 backdrop-blur-sm">
          <div className="relative flex w-full max-w-4xl max-h-[90vh] flex-col overflow-hidden rounded-3xl border border-emerald-100 bg-white shadow-2xl">
            <button
              type="button"
              onClick={() => setActiveArticle(null)}
              className="absolute right-5 top-5 inline-flex h-11 w-11 items-center justify-center rounded-full border border-rose-100 bg-rose-50 text-rose-400 shadow-md transition hover:scale-105 hover:bg-rose-100"
              aria-label="Close highlights"
            >
              <X className="h-5 w-5 text-rose-400" strokeWidth={2.5} />
            </button>
            {activeArticle.coverImage ? (
              <div className="h-64 w-full flex-shrink-0 overflow-hidden sm:h-72">
                <img
                  src={activeArticle.coverImage}
                  alt={activeArticle.title}
                  className="h-full w-full object-cover"
                />
              </div>
            ) : (
              <div className="flex h-64 flex-shrink-0 items-center justify-center bg-gradient-to-br from-emerald-500 via-green-500 to-emerald-600 text-white sm:h-72">
                <BookOpen className="h-12 w-12" />
              </div>
            )}
            <div className="flex-1 overflow-y-auto p-8 sm:p-10">
              <div className="flex flex-col gap-8">
                <div className="flex flex-wrap items-start justify-between gap-4">
                  <div className="max-w-2xl space-y-3">
                    <span className="inline-flex items-center gap-2 rounded-full bg-emerald-50 px-4 py-1 text-xs font-semibold uppercase tracking-[0.35em] text-emerald-600">
                      Published brief
                    </span>
                    <h2 className="text-3xl font-semibold text-emerald-900 sm:text-4xl">{activeArticle.title}</h2>
                    <div className="flex flex-wrap items-center gap-4 text-sm text-gray-500">
                      <span className="inline-flex items-center gap-2">
                        <User className="h-4 w-4" />
                        {activeArticle.requestedByName}
                      </span>
                      <span className="inline-flex items-center gap-2">
                        <Calendar className="h-4 w-4" />
                        {formatDate(activeArticle.updatedAt || activeArticle.createdAt)}
                      </span>
                      <span className="inline-flex items-center gap-2">
                        <Clock className="h-4 w-4" />
                        {activeArticle.readingTime}
                      </span>
                    </div>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    <button
                      type="button"
                      onClick={() => handleShareArticle(activeArticle)}
                      className="inline-flex items-center gap-2 rounded-full border border-emerald-200 bg-white px-4 py-2 text-sm font-semibold text-emerald-600 transition hover:bg-emerald-50"
                    >
                      <Share2 className="h-4 w-4" /> Share brief
                    </button>
                    <button
                      type="button"
                      onClick={() => copyArticleLink(activeArticle)}
                      className="inline-flex items-center gap-2 rounded-full border border-emerald-200 bg-white px-4 py-2 text-sm font-semibold text-emerald-600 transition hover:bg-emerald-50"
                    >
                      <Copy className="h-4 w-4" /> Copy link
                    </button>
                  </div>
                </div>

                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                  <div className="rounded-2xl border border-emerald-100 bg-emerald-50/70 p-4 text-sm text-emerald-700">
                    <span className="text-xs font-semibold uppercase tracking-[0.3em]">Published</span>
                    <p className="mt-2 text-gray-700">{formatDate(activeArticle.createdAt)}</p>
                  </div>
                  <div className="rounded-2xl border border-emerald-100 bg-emerald-50/70 p-4 text-sm text-emerald-700">
                    <span className="text-xs font-semibold uppercase tracking-[0.3em]">Last update</span>
                    <p className="mt-2 text-gray-700">{formatDate(activeArticle.updatedAt || activeArticle.createdAt)}</p>
                  </div>
                  <div className="rounded-2xl border border-emerald-100 bg-emerald-50/70 p-4 text-sm text-emerald-700">
                    <span className="text-xs font-semibold uppercase tracking-[0.3em]">Estimated read</span>
                    <p className="mt-2 text-gray-700">{activeArticle.readingTime}</p>
                  </div>
                  <div className="rounded-2xl border border-emerald-100 bg-emerald-50/70 p-4 text-sm text-emerald-700">
                    <span className="text-xs font-semibold uppercase tracking-[0.3em]">Visuals included</span>
                    <p className="mt-2 text-gray-700">{activeArticle.supportingImages.length} asset{activeArticle.supportingImages.length === 1 ? "" : "s"}</p>
                  </div>
                </div>

                <div className="space-y-4 text-base leading-relaxed text-gray-600">
                  {renderFullDescription(activeArticle.description) || (
                    <p className="text-gray-500">Detailed description will be available soon.</p>
                  )}
                </div>

                {activeArticle.supportingImages.length > 0 && (
                  <div className="space-y-3">
                    <p className="text-sm font-semibold uppercase tracking-[0.3em] text-emerald-500">
                      Supporting visuals
                    </p>
                    <div className="flex gap-4 overflow-x-auto pb-3">
                      {activeArticle.supportingImages.map((image, index) => {
                        const imageSrc = resolveImageSrc(image);
                        return (
                          <div
                            key={image?.imageId ?? image?.id ?? `${activeArticle.id}-${index}`}
                            className="relative h-48 w-72 flex-shrink-0 overflow-hidden rounded-2xl border border-emerald-100 bg-white"
                          >
                            {imageSrc ? (
                              <img src={imageSrc} alt={image?.filename ?? "Supporting visual"} className="h-full w-full object-cover" />
                            ) : (
                              <div className="flex h-full items-center justify-center bg-emerald-50 text-sm text-emerald-500">
                                Visual unavailable
                              </div>
                            )}
                            <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/65 to-transparent px-4 py-2 text-xs text-white">
                              <span className="line-clamp-1">{image?.filename || "Supporting visual"}</span>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}

                <div className="flex flex-col gap-3 rounded-2xl border border-emerald-100 bg-emerald-50/60 p-6 text-sm text-emerald-700">
                  <p className="font-semibold uppercase tracking-[0.3em]">How to use this brief</p>
                  <p>
                    Share these insights with your community or adapt them into your next marketing, training, or buyer
                    activation campaign. The Agrovia editorial team keeps refining these stories, so check back for
                    refreshed visuals and updated talking points.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};

export default PublishedArticles;
