import React, { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { articleService } from "../services/articleService";
import {
  ArrowLeft,
  BookOpen,
  Calendar,
  Loader2,
  Search,
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

const normalizeArticle = (article) => {
  const cover = article?.coverImage ?? article?.cover_image ?? {};
  const hasEmbeddedImage = cover?.hasImage && cover?.data;
  const supporting = Array.isArray(article?.supportingImages)
    ? article.supportingImages
    : Array.isArray(article?.supporting_images)
    ? article.supporting_images
    : [];

  return {
    id: article?.articleId ?? article?.id ?? article?.article_id ?? `${Date.now()}-${Math.random()}`,
    title: article?.title ?? "Untitled request",
    description: article?.description ?? "",
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
  };
};

const PublishedArticles = () => {
  const navigate = useNavigate();
  const [articles, setArticles] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortOption, setSortOption] = useState("newest");
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const [activeArticle, setActiveArticle] = useState(null);

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

  const stats = useMemo(() => {
    if (articles.length === 0) {
      return {
        total: 0,
        newestTitle: "",
        uniqueAuthors: 0,
      };
    }
    const newest = articles[0];
    const unique = new Set(articles.map((item) => item.requestedByName));
    return {
      total: articles.length,
      newestTitle: newest.title,
      uniqueAuthors: unique.size,
    };
  }, [articles]);

  return (
    <section className="min-h-screen bg-gradient-to-br from-emerald-50 via-white to-green-50 py-16 px-4">
      <div className="mx-auto w-full max-w-7xl">
        <header className="flex flex-col gap-8 lg:flex-row lg:items-center lg:justify-between">
          <div className="max-w-2xl space-y-6">
            <div className="space-y-4">
              <span className="inline-flex items-center gap-2 rounded-full bg-emerald-100 px-4 py-1 text-xs font-semibold uppercase tracking-[0.3em] text-emerald-700">
                Published Briefs
              </span>
              <h1 className="text-4xl font-semibold text-emerald-900 sm:text-5xl">
                Explore the latest stories nurtured by our community
              </h1>
              <p className="text-base text-emerald-700 sm:text-lg">
                Every brief here has been reviewed and published for farmers and buyers. Dive into curated guidance,
                visuals, and campaign-ready inspiration crafted by Agrovia moderators.
              </p>
            </div>
          </div>
          <div className="grid w-full max-w-md grid-cols-1 gap-4 sm:grid-cols-3 lg:max-w-xl">
            <div className="rounded-3xl border border-emerald-100 bg-white/80 p-5 text-center shadow-sm">
              <p className="text-xs font-semibold uppercase tracking-[0.3em] text-emerald-500">Published</p>
              <p className="mt-2 text-3xl font-semibold text-emerald-900">{stats.total}</p>
            </div>
            <div className="rounded-3xl border border-emerald-100 bg-white/80 p-5 text-center shadow-sm">
              <p className="text-xs font-semibold uppercase tracking-[0.3em] text-emerald-500">Latest highlight</p>
              <p className="mt-2 text-sm font-semibold text-emerald-800 line-clamp-3">{stats.newestTitle || "Coming soon"}</p>
            </div>
            <div className="rounded-3xl border border-emerald-100 bg-white/80 p-5 text-center shadow-sm">
              <p className="text-xs font-semibold uppercase tracking-[0.3em] text-emerald-500">Contributors</p>
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

          <div className="mt-10">
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
              <div className="grid gap-8 sm:grid-cols-2 xl:grid-cols-3">
                {filteredArticles.map((article, index) => (
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
                        <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
                      </div>
                    ) : (
                      <div
                        className={`flex h-52 items-center justify-center bg-gradient-to-br ${gradients[index % gradients.length]} text-white`}
                      >
                        <BookOpen className="h-10 w-10" />
                      </div>
                    )}

                    <div className="space-y-4 p-6">
                      <div className="flex flex-wrap items-center justify-between gap-2 text-xs font-semibold uppercase tracking-[0.3em] text-emerald-500">
                        <span className="inline-flex items-center gap-2 text-emerald-600">
                          <User className="h-4 w-4" />
                          {article.requestedByName}
                        </span>
                        <span className="inline-flex items-center gap-2 text-gray-500">
                          <Calendar className="h-4 w-4" />
                          {formatDate(article.updatedAt || article.createdAt)}
                        </span>
                      </div>

                      <h2 className="text-xl font-semibold text-gray-900">{article.title}</h2>
                      <p className="text-sm text-gray-600 line-clamp-3">{article.description}</p>

                      <div className="flex items-center justify-between pt-2">
                        <span className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.3em] text-emerald-500">
                          Published
                        </span>
                        <button
                          type="button"
                          onClick={() => setActiveArticle(article)}
                          className="inline-flex items-center gap-2 rounded-full bg-emerald-100 px-4 py-2 text-sm font-semibold text-emerald-700 transition hover:bg-emerald-200"
                        >
                          View highlights
                          <Sparkles className="h-4 w-4" />
                        </button>
                      </div>
                    </div>
                  </article>
                ))}
              </div>
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
              className="absolute right-5 top-5 inline-flex h-11 w-11 items-center justify-center rounded-full border border-red-200 bg-white text-red-500 shadow-md transition hover:scale-105 hover:bg-red-50"
              aria-label="Close highlights"
            >
              <X className="h-5 w-5 text-red-500" strokeWidth={2.5} />
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
              <div className="flex flex-wrap items-start justify-between gap-4">
                <div className="space-y-2">
                  <h2 className="text-3xl font-semibold text-emerald-900">{activeArticle.title}</h2>
                  <div className="flex flex-wrap items-center gap-4 text-sm text-gray-500">
                    <span className="inline-flex items-center gap-2">
                      <User className="h-4 w-4" />
                      {activeArticle.requestedByName}
                    </span>
                    <span className="inline-flex items-center gap-2">
                      <Calendar className="h-4 w-4" />
                      {formatDate(activeArticle.updatedAt || activeArticle.createdAt)}
                    </span>
                  </div>
                </div>
              </div>
              <p className="mt-4 text-base leading-relaxed text-gray-600">{activeArticle.description}</p>
              {activeArticle.supportingImages.length > 0 && (
                <div className="mt-8 space-y-3">
                  <p className="text-sm font-semibold uppercase tracking-[0.3em] text-emerald-500">
                    Supporting visuals
                  </p>
                  <div className="grid gap-4 sm:grid-cols-2">
                    {activeArticle.supportingImages.map((image) => {
                      const hasImageData = image?.data;
                      const imageSrc = hasImageData ? `data:${image.mimeType};base64,${image.data}` : image?.url;
                      return (
                        <div
                          key={image?.imageId ?? image?.id ?? `${activeArticle.id}-${Math.random()}`}
                          className="overflow-hidden rounded-2xl border border-emerald-100"
                        >
                          {imageSrc ? (
                            <img src={imageSrc} alt={image?.filename ?? "Supporting visual"} className="h-48 w-full object-cover" />
                          ) : (
                            <div className="flex h-48 items-center justify-center bg-emerald-50 text-sm text-emerald-500">
                              Visual unavailable
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}
              <div className="mt-8 flex flex-col gap-3 rounded-2xl border border-emerald-100 bg-emerald-50/60 p-6 text-sm text-emerald-700">
                <p className="font-semibold uppercase tracking-[0.3em]">How to use this brief</p>
                <p>
                  Share these insights with your community or adapt them into your next marketing, training, or buyer
                  activation campaign. The Agrovia editorial team keeps refining these stories, so check back for updated
                  versions.
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};

export default PublishedArticles;
