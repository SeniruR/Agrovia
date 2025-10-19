import React, { useEffect, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { articleService } from "../../services/articleService";

const EditArticleRequest = () => {
  const { articleId } = useParams();
  const navigate = useNavigate();

  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formError, setFormError] = useState("");
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [currentStatus, setCurrentStatus] = useState("");
  const [existingCover, setExistingCover] = useState(null);
  const [coverImage, setCoverImage] = useState(null);
  const [coverPreview, setCoverPreview] = useState("");
  const [existingSupportingImages, setExistingSupportingImages] = useState([]);
  const [removedImageIds, setRemovedImageIds] = useState([]);
  const [newSupportingImages, setNewSupportingImages] = useState([]);

  const coverInputRef = useRef(null);
  const supportInputRef = useRef(null);
  const coverPreviewRef = useRef("");
  const newSupportPreviewsRef = useRef([]);

  useEffect(() => {
    coverPreviewRef.current = coverPreview;
  }, [coverPreview]);

  useEffect(() => {
    newSupportPreviewsRef.current = newSupportingImages;
  }, [newSupportingImages]);

  useEffect(() => {
    return () => {
      if (coverPreviewRef.current) {
        URL.revokeObjectURL(coverPreviewRef.current);
      }
      newSupportPreviewsRef.current.forEach((item) => {
        if (item.preview) {
          URL.revokeObjectURL(item.preview);
        }
      });
    };
  }, []);

  useEffect(() => {
    let isMounted = true;

    const loadArticle = async () => {
      setIsLoading(true);
      setFormError("");
      try {
        const response = await articleService.fetchArticleById(articleId);
        const data = response?.data || response;

        if (!isMounted) {
          return;
        }

        if (!data) {
          setFormError("Article request not found.");
          setIsLoading(false);
          return;
        }

        if (coverPreviewRef.current) {
          URL.revokeObjectURL(coverPreviewRef.current);
        }

        setCoverImage(null);
        setCoverPreview("");
        setRemovedImageIds([]);
        setNewSupportingImages([]);
        if (coverInputRef.current) {
          coverInputRef.current.value = "";
        }
        if (supportInputRef.current) {
          supportInputRef.current.value = "";
        }

        setTitle(data.title || "");
        setDescription(data.description || "");
        setCurrentStatus(data.status || "");
        setExistingCover(data.coverImage?.hasImage ? data.coverImage : null);
        setExistingSupportingImages(Array.isArray(data.supportingImages) ? data.supportingImages : []);

        if (data.status !== "pending") {
          setFormError("Only pending article requests can be edited.");
        }
      } catch (error) {
        const message = error?.response?.data?.message || "Unable to load this article request.";
        setFormError(message);
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    };

    if (articleId) {
      loadArticle();
    } else {
      setFormError("Invalid article reference.");
      setIsLoading(false);
    }

    return () => {
      isMounted = false;
    };
  }, [articleId]);

  const isEditable = currentStatus === "pending";

  const resetCoverSelection = () => {
    if (coverPreview) {
      URL.revokeObjectURL(coverPreview);
    }
    setCoverImage(null);
    setCoverPreview("");
    if (coverInputRef.current) {
      coverInputRef.current.value = "";
    }
  };

  const handleCoverSelection = (event) => {
    if (!isEditable) {
      return;
    }

    const file = event.target.files?.[0];
    if (!file) {
      resetCoverSelection();
      return;
    }

    if (coverPreview) {
      URL.revokeObjectURL(coverPreview);
    }

    const nextPreview = URL.createObjectURL(file);
    setCoverImage(file);
    setCoverPreview(nextPreview);
    setFormError("");
  };

  const handleSupportingSelection = (event) => {
    if (!isEditable) {
      return;
    }

    const files = Array.from(event.target.files ?? []);
    if (files.length === 0) {
      return;
    }

    const additions = files.map((file) => ({
      id: `${file.name}-${Date.now()}-${Math.random().toString(16).slice(2, 8)}`,
      file,
      preview: URL.createObjectURL(file),
    }));

    setNewSupportingImages((prev) => [...prev, ...additions]);
    setFormError("");
    if (supportInputRef.current) {
      supportInputRef.current.value = "";
    }
  };

  const removeNewSupportingImage = (id) => {
    setNewSupportingImages((prev) => {
      const next = prev.filter((item) => {
        if (item.id === id && item.preview) {
          URL.revokeObjectURL(item.preview);
        }
        return item.id !== id;
      });
      if (supportInputRef.current) {
        supportInputRef.current.value = "";
      }
      return next;
    });
  };

  const removeExistingSupportingImage = (imageId) => {
    if (!isEditable) {
      return;
    }

    const numericId = Number(imageId);
    if (!Number.isFinite(numericId)) {
      return;
    }

    setExistingSupportingImages((prev) => prev.filter((item) => item.imageId !== numericId));
    setRemovedImageIds((prev) => (prev.includes(numericId) ? prev : [...prev, numericId]));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!isEditable) {
      setFormError("This article request can no longer be edited.");
      return;
    }

    if (!title.trim() || !description.trim()) {
      setFormError("Title and description are required.");
      return;
    }

    if (!existingCover?.hasImage && !coverImage) {
      setFormError("Please keep or upload a cover image.");
      return;
    }

    setFormError("");
    setIsSubmitting(true);

    const payload = new FormData();
    payload.append("title", title.trim());
    payload.append("description", description.trim());

    if (coverImage) {
      payload.append("coverImage", coverImage);
    }

    if (removedImageIds.length > 0) {
      payload.append("removeImageIds", JSON.stringify(removedImageIds));
    }

    newSupportingImages.forEach((item) => {
      payload.append("supportingImages", item.file);
    });

    try {
      const response = await articleService.updateArticle(articleId, payload);
      const message = response?.message || "Article request updated successfully.";
      if (typeof window !== "undefined") {
        window.alert(message);
      }
      navigate("/my-article-requests", {
        state: {
          articleId: Number(articleId) || undefined,
          feedback: message,
        },
        replace: true,
      });
    } catch (error) {
      const message = error?.response?.data?.message || "Failed to update article request. Please try again.";
      setFormError(message);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <section className="min-h-screen bg-gradient-to-br from-emerald-100 via-white to-green-100 py-16 px-4">
        <div className="mx-auto w-full max-w-4xl">
          <div className="flex flex-col items-center justify-center rounded-3xl border border-emerald-100 bg-white/80 py-24 text-emerald-600 shadow-inner">
            <span className="mb-4 inline-flex h-12 w-12 animate-spin items-center justify-center rounded-full border-2 border-emerald-500 border-t-transparent" />
            <p className="text-sm font-semibold">Loading article request...</p>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="min-h-screen bg-gradient-to-br from-emerald-100 via-white to-green-100 py-16 px-4">
      <div className="mx-auto w-full max-w-4xl">
        <div className="relative overflow-hidden rounded-[2.5rem] border border-emerald-100 bg-white/80 shadow-[0_30px_80px_-40px_rgba(16,185,129,0.8)] backdrop-blur">
          <div className="pointer-events-none absolute -top-24 -right-24 h-64 w-64 rounded-full bg-emerald-200 opacity-40 blur-3xl" />
          <div className="pointer-events-none absolute -bottom-20 -left-20 h-56 w-56 rounded-full bg-green-200 opacity-30 blur-3xl" />
          <div className="relative z-10 p-10">
            <header className="mb-10 text-center">
              <span className="inline-flex items-center rounded-full bg-emerald-100 px-4 py-1 text-xs font-semibold uppercase tracking-widest text-emerald-700">
                Moderator Tools
              </span>
              <h1 className="mt-4 text-4xl font-semibold text-emerald-800">Edit Article Request</h1>
              <p className="mt-3 text-sm text-emerald-600">
                Update your article brief and visual references while it awaits editorial review. Changes are allowed only while the request is pending.
              </p>
            </header>

            {formError && (
              <p className="mb-8 rounded-2xl border border-red-100 bg-red-50 px-5 py-4 text-sm text-red-600">
                {formError}
              </p>
            )}

            <form className="space-y-10" onSubmit={handleSubmit}>
              <div className="grid gap-8 md:grid-cols-2">
                <div className="space-y-3">
                  <label className="text-sm font-semibold text-emerald-800" htmlFor="edit-article-title">
                    Title
                  </label>
                  <input
                    id="edit-article-title"
                    type="text"
                    value={title}
                    onChange={(event) => setTitle(event.target.value)}
                    disabled={!isEditable || isSubmitting}
                    placeholder="Update the headline for this request"
                    className="w-full rounded-2xl border border-emerald-100 bg-white px-5 py-4 text-gray-800 shadow-inner outline-none transition focus:border-emerald-300 focus:ring-4 focus:ring-emerald-100 disabled:cursor-not-allowed disabled:opacity-60"
                  />
                </div>

                <div className="space-y-3">
                  <label className="text-sm font-semibold text-emerald-800" htmlFor="edit-article-description">
                    Description
                  </label>
                  <textarea
                    id="edit-article-description"
                    value={description}
                    onChange={(event) => setDescription(event.target.value)}
                    disabled={!isEditable || isSubmitting}
                    placeholder="Refine the narrative, tone, and key points."
                    rows={6}
                    className="h-full w-full resize-none rounded-2xl border border-emerald-100 bg-white px-5 py-4 text-gray-800 shadow-inner outline-none transition focus:border-emerald-300 focus:ring-4 focus:ring-emerald-100 disabled:cursor-not-allowed disabled:opacity-60"
                  />
                </div>
              </div>

              <div className="grid gap-8 lg:grid-cols-[1.1fr_0.9fr]">
                <div className="space-y-5">
                  <div className="space-y-2">
                    <span className="text-sm font-semibold text-emerald-800">Cover Image</span>
                    <p className="text-xs text-emerald-600">Replace the hero visual if you have a stronger option.</p>
                  </div>
                  <div className="flex flex-col gap-5 rounded-3xl border border-dashed border-emerald-200 bg-gradient-to-br from-emerald-50/70 to-white p-6 text-center transition hover:border-emerald-300">
                    {coverPreview ? (
                      <div className="flex flex-col items-center gap-4">
                        <img src={coverPreview} alt="Selected cover" className="h-56 w-full rounded-2xl object-cover shadow-lg" />
                        <div className="flex flex-wrap items-center gap-3 text-xs text-emerald-700">
                          <span className="rounded-full bg-white px-4 py-1 font-medium shadow-sm">
                            {coverImage?.name}
                          </span>
                          <button
                            type="button"
                            onClick={resetCoverSelection}
                            disabled={isSubmitting}
                            className="rounded-full bg-emerald-600 px-4 py-1 font-semibold text-white transition hover:bg-emerald-700 disabled:cursor-not-allowed disabled:opacity-60"
                          >
                            Use existing cover
                          </button>
                        </div>
                      </div>
                    ) : existingCover?.hasImage ? (
                      <div className="flex flex-col items-center gap-4">
                        <img
                          src={`data:${existingCover.mimeType};base64,${existingCover.data}`}
                          alt={existingCover.filename || "Current cover"}
                          className="h-56 w-full rounded-2xl object-cover shadow-lg"
                        />
                        <div className="flex flex-wrap items-center gap-3 text-xs text-emerald-700">
                          <span className="rounded-full bg-white px-4 py-1 font-medium shadow-sm">
                            {existingCover.filename || "Current cover"}
                          </span>
                          {isEditable && (
                            <button
                              type="button"
                              onClick={() => coverInputRef.current?.click()}
                              disabled={isSubmitting}
                              className="rounded-full bg-emerald-500 px-4 py-2 font-semibold text-white shadow-lg transition hover:bg-emerald-600 disabled:cursor-not-allowed disabled:opacity-60"
                            >
                              Replace cover
                            </button>
                          )}
                        </div>
                      </div>
                    ) : (
                      <div className="space-y-4">
                        <p className="text-sm text-emerald-600">No cover image stored. Upload a new one to continue.</p>
                        {isEditable && (
                          <button
                            type="button"
                            onClick={() => coverInputRef.current?.click()}
                            disabled={isSubmitting}
                            className="rounded-full bg-emerald-500 px-6 py-3 text-sm font-semibold text-white shadow-lg transition hover:bg-emerald-600 disabled:cursor-not-allowed disabled:opacity-60"
                          >
                            Select cover image
                          </button>
                        )}
                      </div>
                    )}
                    <input
                      ref={coverInputRef}
                      className="hidden"
                      type="file"
                      accept="image/*"
                      onChange={handleCoverSelection}
                      disabled={!isEditable || isSubmitting}
                    />
                  </div>
                </div>

                <div className="space-y-5">
                  <div className="space-y-2">
                    <span className="text-sm font-semibold text-emerald-800">Supporting Images</span>
                    <p className="text-xs text-emerald-600">Add or refresh mood boards and reference visuals.</p>
                  </div>
                  <div className="flex flex-col gap-5 rounded-3xl border border-dashed border-emerald-200 bg-gradient-to-br from-white to-emerald-50/60 p-6 text-center transition hover:border-emerald-300">
                    {isEditable && (
                      <button
                        type="button"
                        onClick={() => supportInputRef.current?.click()}
                        disabled={isSubmitting}
                        className="rounded-full bg-white px-5 py-3 text-sm font-semibold text-emerald-600 shadow-inner transition hover:bg-emerald-50 disabled:cursor-not-allowed disabled:opacity-60"
                      >
                        Upload supporting images
                      </button>
                    )}
                    <input
                      ref={supportInputRef}
                      className="hidden"
                      type="file"
                      accept="image/*"
                      multiple
                      onChange={handleSupportingSelection}
                      disabled={!isEditable || isSubmitting}
                    />
                    <div className="grid gap-4 text-left text-xs md:grid-cols-2">
                      {existingSupportingImages.map((item) => (
                        <div
                          key={`existing-${item.imageId}`}
                          className="group relative overflow-hidden rounded-2xl border border-emerald-100 bg-white shadow-sm"
                        >
                          {item.data ? (
                            <img
                              src={`data:${item.mimeType};base64,${item.data}`}
                              alt={item.filename || "Supporting visual"}
                              className="h-28 w-full object-cover transition duration-300 group-hover:scale-105"
                            />
                          ) : (
                            <div className="flex h-28 items-center justify-center text-emerald-600">Image unavailable</div>
                          )}
                          <div className="flex items-center justify-between px-3 py-2">
                            <span className="line-clamp-1 text-emerald-700">{item.filename || "Supporting visual"}</span>
                            {isEditable && (
                              <button
                                type="button"
                                onClick={() => removeExistingSupportingImage(item.imageId)}
                                disabled={isSubmitting}
                                className="text-xs font-semibold text-emerald-500 transition hover:text-emerald-700 disabled:cursor-not-allowed disabled:opacity-60"
                              >
                                Remove
                              </button>
                            )}
                          </div>
                        </div>
                      ))}
                      {newSupportingImages.map((item) => (
                        <div
                          key={`new-${item.id}`}
                          className="group relative overflow-hidden rounded-2xl border border-emerald-100 bg-white shadow-sm"
                        >
                          <img
                            src={item.preview}
                            alt={item.file.name}
                            className="h-28 w-full object-cover transition duration-300 group-hover:scale-105"
                          />
                          <div className="flex items-center justify-between px-3 py-2">
                            <span className="line-clamp-1 text-emerald-700">{item.file.name}</span>
                            <button
                              type="button"
                              onClick={() => removeNewSupportingImage(item.id)}
                              disabled={isSubmitting}
                              className="text-xs font-semibold text-emerald-500 transition hover:text-emerald-700 disabled:cursor-not-allowed disabled:opacity-60"
                            >
                              Remove
                            </button>
                          </div>
                        </div>
                      ))}
                      {existingSupportingImages.length === 0 && newSupportingImages.length === 0 && (
                        <div className="flex h-28 items-center justify-center rounded-2xl border border-dashed border-emerald-200 bg-emerald-50/40 text-emerald-500">
                          No supporting visuals added
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex flex-col gap-4 pt-2 sm:flex-row sm:items-center sm:justify-between">
                <span className="text-xs font-semibold uppercase tracking-[0.3em] text-emerald-500">
                  Status: {currentStatus || "Unknown"}
                </span>
                <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:gap-4">
                  <button
                    type="button"
                    onClick={() => navigate(-1)}
                    disabled={isSubmitting}
                    className="w-full rounded-full border border-emerald-200 px-8 py-3 text-sm font-semibold text-emerald-700 transition hover:bg-emerald-50 disabled:cursor-not-allowed disabled:opacity-60 sm:w-auto"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={!isEditable || isSubmitting}
                    className={`w-full rounded-full px-10 py-3 text-sm font-semibold text-white shadow-xl transition sm:w-auto ${
                      !isEditable || isSubmitting
                        ? "bg-emerald-400 cursor-not-allowed opacity-80"
                        : "bg-gradient-to-r from-emerald-500 via-green-500 to-emerald-600 hover:brightness-110"
                    }`}
                  >
                    {isSubmitting ? "Saving..." : "Save changes"}
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
};

export default EditArticleRequest;
