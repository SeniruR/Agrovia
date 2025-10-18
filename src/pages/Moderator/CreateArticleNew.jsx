import React, { useEffect, useRef, useState } from "react";
import { articleService } from "../../services/articleService";

const CreateArticleNew = () => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [coverImage, setCoverImage] = useState(null);
  const [coverPreview, setCoverPreview] = useState("");
  const [supportingImages, setSupportingImages] = useState([]);
  const [formError, setFormError] = useState("");
  const [feedback, setFeedback] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const coverInputRef = useRef(null);
  const supportingInputRef = useRef(null);
  const coverPreviewRef = useRef("");
  const supportingImagesRef = useRef([]);

  useEffect(() => {
    coverPreviewRef.current = coverPreview;
  }, [coverPreview]);

  useEffect(() => {
    supportingImagesRef.current = supportingImages;
  }, [supportingImages]);

  useEffect(() => {
    return () => {
      if (coverPreviewRef.current) {
        URL.revokeObjectURL(coverPreviewRef.current);
      }
      supportingImagesRef.current.forEach((item) => URL.revokeObjectURL(item.preview));
    };
  }, []);

  const resetCoverImage = () => {
    if (coverPreview) {
      URL.revokeObjectURL(coverPreview);
    }
    setCoverPreview("");
    setCoverImage(null);
    if (coverInputRef.current) {
      coverInputRef.current.value = "";
    }
  };

  const removeSupportingImage = (id) => {
    setSupportingImages((prev) => {
      const next = prev.filter((item) => {
        if (item.id === id) {
          URL.revokeObjectURL(item.preview);
        }
        return item.id !== id;
      });
      return next;
    });
    if (supportingInputRef.current) {
      supportingInputRef.current.value = "";
    }
  };

  const resetSupportingImages = () => {
    supportingImagesRef.current.forEach((item) => URL.revokeObjectURL(item.preview));
    setSupportingImages([]);
    if (supportingInputRef.current) {
      supportingInputRef.current.value = "";
    }
  };

  const resetForm = ({ resetFeedback = true } = {}) => {
    setTitle("");
    setDescription("");
    resetCoverImage();
    resetSupportingImages();
    setFormError("");
    if (resetFeedback) {
      setFeedback(null);
    }
  };

  const handleCoverSelection = (event) => {
    const file = event.target.files?.[0];
    if (!file) {
      resetCoverImage();
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
    const files = Array.from(event.target.files ?? []);
    if (files.length === 0) {
      return;
    }

    const nextImages = files.map((file) => ({
      id: `${file.name}-${Date.now()}-${Math.random().toString(16).slice(2, 8)}`,
      file,
      preview: URL.createObjectURL(file),
    }));

    setSupportingImages((prev) => [...prev, ...nextImages]);
    setFormError("");
    if (supportingInputRef.current) {
      supportingInputRef.current.value = "";
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!title.trim() || !description.trim()) {
      setFormError("Title and description are required.");
      return;
    }

    if (!coverImage) {
      setFormError("Please upload a cover image for this article.");
      return;
    }

    const token = localStorage.getItem("authToken");
    if (!token) {
      setFormError("Please log in again to submit an article request.");
      return;
    }

    setFormError("");

    setIsSubmitting(true);
    setFeedback(null);

    const payload = new FormData();
    payload.append("title", title.trim());
    payload.append("description", description.trim());
    payload.append("status", "pending");
    payload.append("coverImage", coverImage);
    supportingImages.forEach((item) => {
      payload.append("supportingImages", item.file);
    });

    try {
      const response = await articleService.submitArticleRequest(payload);
      resetForm({ resetFeedback: false });
      setFeedback({
        type: "success",
        message: response?.message || "Article request submitted successfully.",
      });
      if (typeof window !== "undefined") {
        window.alert(response?.message || "Article request submitted successfully.");
      }
    } catch (error) {
      const fallbackMessage =
        error?.response?.data?.message || "Failed to submit article request. Please try again.";
      setFormError(fallbackMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

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
              <h1 className="mt-4 text-4xl font-semibold text-emerald-800">Request a New Article</h1>
              <p className="mt-3 text-sm text-emerald-600">
                Provide the essential brief so the editorial team can craft the perfect story. Add inspirational visuals to help set the tone.
              </p>
            </header>

            <form className="space-y-10" onSubmit={handleSubmit}>
              <div className="grid gap-8 md:grid-cols-2">
                <div className="space-y-3">
                  <label className="text-sm font-semibold text-emerald-800" htmlFor="article-title">
                    Title
                  </label>
                  <input
                    id="article-title"
                    type="text"
                    value={title}
                    onChange={(event) => setTitle(event.target.value)}
                    placeholder="A concise headline that captures the idea"
                    className="w-full rounded-2xl border border-emerald-100 bg-white px-5 py-4 text-gray-800 shadow-inner outline-none transition focus:border-emerald-300 focus:ring-4 focus:ring-emerald-100"
                  />
                </div>

                <div className="space-y-3">
                  <label className="text-sm font-semibold text-emerald-800" htmlFor="article-description">
                    Description
                  </label>
                  <textarea
                    id="article-description"
                    value={description}
                    onChange={(event) => setDescription(event.target.value)}
                    placeholder="Share the narrative angle, voice, and key talking points."
                    rows={6}
                    className="h-full w-full resize-none rounded-2xl border border-emerald-100 bg-white px-5 py-4 text-gray-800 shadow-inner outline-none transition focus:border-emerald-300 focus:ring-4 focus:ring-emerald-100"
                  />
                </div>
              </div>

              <div className="grid gap-8 lg:grid-cols-[1.1fr_0.9fr]">
                <div className="space-y-5">
                  <div className="space-y-2">
                    <span className="text-sm font-semibold text-emerald-800">Cover Image</span>
                    <p className="text-xs text-emerald-600">
                      Choose a striking hero image. It will be used as the primary visual for the article request.
                    </p>
                  </div>
                  <div className="flex flex-col gap-5 rounded-3xl border border-dashed border-emerald-200 bg-gradient-to-br from-emerald-50/70 to-white p-6 text-center transition hover:border-emerald-300">
                    {coverPreview ? (
                      <div className="flex flex-col items-center gap-4">
                        <img
                          src={coverPreview}
                          alt="Selected cover"
                          className="h-56 w-full rounded-2xl object-cover shadow-lg"
                        />
                        <div className="flex flex-wrap items-center gap-3 text-xs text-emerald-700">
                          <span className="rounded-full bg-white px-4 py-1 font-medium shadow-sm">
                            {coverImage?.name}
                          </span>
                          <button
                            type="button"
                            onClick={resetCoverImage}
                            className="rounded-full bg-emerald-600 px-4 py-1 font-semibold text-white transition hover:bg-emerald-700"
                          >
                            Change cover
                          </button>
                        </div>
                      </div>
                    ) : (
                      <div className="space-y-4">
                        <p className="text-sm text-emerald-600">
                          Drop an image here or browse your device.
                        </p>
                        <button
                          type="button"
                          onClick={() => coverInputRef.current?.click()}
                          className="rounded-full bg-emerald-500 px-6 py-3 text-sm font-semibold text-white shadow-lg transition hover:bg-emerald-600"
                        >
                          Select cover image
                        </button>
                      </div>
                    )}
                    <input
                      ref={coverInputRef}
                      className="hidden"
                      type="file"
                      accept="image/*"
                      onChange={handleCoverSelection}
                    />
                  </div>
                </div>

                <div className="space-y-5">
                  <div className="space-y-2">
                    <span className="text-sm font-semibold text-emerald-800">Supporting Images</span>
                    <p className="text-xs text-emerald-600">
                      Add mood boards, reference shots, or diagrams that can inspire the content and layout.
                    </p>
                  </div>
                  <div className="flex flex-col gap-5 rounded-3xl border border-dashed border-emerald-200 bg-gradient-to-br from-white to-emerald-50/60 p-6 text-center transition hover:border-emerald-300">
                    <button
                      type="button"
                      onClick={() => supportingInputRef.current?.click()}
                      className="rounded-full bg-white px-5 py-3 text-sm font-semibold text-emerald-600 shadow-inner transition hover:bg-emerald-50"
                    >
                      Upload supporting images
                    </button>
                    <input
                      ref={supportingInputRef}
                      className="hidden"
                      type="file"
                      accept="image/*"
                      multiple
                      onChange={handleSupportingSelection}
                    />
                    {supportingImages.length > 0 && (
                      <div className="grid grid-cols-2 gap-4 text-left text-xs">
                        {supportingImages.map((item) => (
                          <div
                            key={item.id}
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
                                onClick={() => removeSupportingImage(item.id)}
                                className="text-xs font-semibold text-emerald-500 transition hover:text-emerald-700"
                              >
                                Remove
                              </button>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {formError && (
                <p className="rounded-2xl border border-red-100 bg-red-50 px-5 py-4 text-sm text-red-600">
                  {formError}
                </p>
              )}

              {feedback?.type === "success" && (
                <p className="rounded-2xl border border-emerald-100 bg-emerald-50 px-5 py-4 text-sm text-emerald-700 shadow-sm">
                  {feedback.message}
                </p>
              )}

              <div className="flex flex-col gap-4 pt-2 sm:flex-row sm:items-center sm:justify-end">
                <button
                  type="button"
                  onClick={() => resetForm()}
                  className="w-full rounded-full border border-emerald-200 px-8 py-3 text-sm font-semibold text-emerald-700 transition hover:bg-emerald-50 sm:w-auto"
                >
                  Clear form
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className={`w-full rounded-full px-10 py-3 text-sm font-semibold text-white shadow-xl transition sm:w-auto ${
                    isSubmitting
                      ? "bg-emerald-400 cursor-not-allowed opacity-80"
                      : "bg-gradient-to-r from-emerald-500 via-green-500 to-emerald-600 hover:brightness-110"
                  }`}
                >
                  {isSubmitting ? "Submitting..." : "Submit request"}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CreateArticleNew;
