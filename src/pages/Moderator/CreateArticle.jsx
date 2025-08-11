import React, { useState, useRef } from "react";
import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Image from "@tiptap/extension-image";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";

const CreateArticle = () => {
  const navigate = useNavigate();
  const { token, isAuthenticated } = useAuth();
  const [figures, setFigures] = useState([]);
  const [title, setTitle] = useState("");
  const [cover, setCover] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");
  const fileInputRef = useRef();
  const coverInputRef = useRef();

  const editor = useEditor({
    extensions: [StarterKit, Image],
    content: "<p>Start writing here...</p>",
  });

  const handleImageSelection = (e) => {
    const files = Array.from(e.target.files);

    files.forEach((file, index) => {
      const label = prompt(`Enter figure name for "${file.name}" (e.g., Figure-${index + 1})`);
      if (!label) return;

      const renamed = `${label}${file.name.slice(file.name.lastIndexOf("."))}`;
      const reader = new FileReader();

      reader.onload = () => {
        editor?.chain().focus().setImage({ src: reader.result, alt: renamed }).run();
        setFigures((prev) => [...prev, renamed]);
      };

      reader.readAsDataURL(new File([file], renamed, { type: file.type }));
    });
  };

  const handleCoverSelection = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => setCover(reader.result);
    reader.readAsDataURL(file);
  };

  const insert = (command) => {
    if (!editor) return;
    switch (command) {
      case "bold":
        editor.chain().focus().toggleBold().run();
        break;
      case "italic":
        editor.chain().focus().toggleItalic().run();
        break;
      case "ul":
        editor.chain().focus().toggleBulletList().run();
        break;
      case "ol":
        editor.chain().focus().toggleOrderedList().run();
        break;
      case "code":
        editor.chain().focus().toggleCodeBlock().run();
        break;
      case "blockquote":
        editor.chain().focus().toggleBlockquote().run();
        break;
      case "hr":
        editor.chain().focus().setHorizontalRule().run();
        break;
      default:
        break;
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-8 bg-white rounded-2xl shadow-lg text-gray-800 border border-green-100">
      {/* Article Title */}
      <div className="flex flex-col gap-2">
        <label className="text-lg font-semibold text-green-700">Article Title</label>
        <input
          type="text"
          className="border border-green-200 rounded-lg px-4 py-2 focus:ring-2 focus:ring-green-300 outline-none text-xl font-bold bg-green-50 text-green-700 placeholder-green-400 transition"
          placeholder="Enter your article title..."
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
      </div>

      {/* Cover Image */}
      <div className="flex flex-col gap-2">
        <label className="text-lg font-semibold text-green-700">Cover Image</label>
        <div className="flex items-center gap-4">
          {cover && (
            <img
              src={cover}
              alt="Cover"
              className="w-32 h-20 object-cover rounded-lg border border-green-200 shadow"
            />
          )}
          <button
            onClick={() => coverInputRef.current?.click()}
            className="px-4 py-2 bg-gradient-to-r from-green-500 to-emerald-500 text-white rounded-lg font-semibold shadow hover:from-green-600 hover:to-emerald-600 transition"
          >
            {cover ? "Change Cover" : "Upload Cover"}
          </button>
          <input
            type="file"
            accept="image/*"
            ref={coverInputRef}
            onChange={handleCoverSelection}
            className="hidden"
          />
        </div>
      </div>

      {/* Action Bar */}
      <div className="flex flex-wrap items-center gap-3 border-b pb-2 mb-4">
        <button onClick={() => insert("bold")} className="text-sm px-3 py-1 bg-green-100 rounded hover:bg-green-200 font-semibold">
          <span className="font-bold">B</span>
        </button>
        <button onClick={() => insert("italic")} className="text-sm px-3 py-1 bg-green-100 rounded hover:bg-green-200 font-semibold italic">
          I
        </button>
        <button onClick={() => insert("ul")} className="text-sm px-3 py-1 bg-green-100 rounded hover:bg-green-200 font-semibold">
          • List
        </button>
        <button onClick={() => insert("ol")} className="text-sm px-3 py-1 bg-green-100 rounded hover:bg-green-200 font-semibold">
          1. List
        </button>
        <button onClick={() => insert("code")} className="text-sm px-3 py-1 bg-green-100 rounded hover:bg-green-200 font-semibold">
          {"</>"}
        </button>
        <button onClick={() => insert("blockquote")} className="text-sm px-3 py-1 bg-green-100 rounded hover:bg-green-200 font-semibold">
          “
        </button>
        <button onClick={() => insert("hr")} className="text-sm px-3 py-1 bg-green-100 rounded hover:bg-green-200 font-semibold">
          <span className="text-lg">―</span>
        </button>
        <button
          onClick={() => fileInputRef.current?.click()}
          className="text-sm px-3 py-1 bg-blue-100 text-blue-700 rounded hover:bg-blue-200 font-semibold"
        >
          Upload Image(s)
        </button>
        <input
          type="file"
          accept="image/*"
          multiple
          ref={fileInputRef}
          onChange={handleImageSelection}
          className="hidden"
        />
      </div>

      {/* Writing Section */}
      <div className="border border-green-200 rounded-xl p-4 min-h-[300px] bg-green-50/30 shadow-inner">
        <EditorContent editor={editor} />
      </div>

      {/* Uploaded Figures */}
      {figures.length > 0 && (
        <div className="pt-4">
          <p className="text-sm font-semibold text-green-700 mb-2">Figures:</p>
          <ul className="list-disc pl-5 space-y-1">
            {figures.map((name, idx) => (
              <li key={idx} className="text-sm text-gray-700">
                <span className="inline-block bg-green-100 text-green-800 px-2 py-0.5 rounded mr-2">{idx + 1}</span>
                {name}
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Error Message */}
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
          {error}
        </div>
      )}

      {/* Submit Button */}
      <div className="flex justify-end pt-4">
        <button
          onClick={async () => {
            try {
              setError("");
              setIsSubmitting(true);

              if (!title.trim()) {
                throw new Error("Title is required");
              }

              if (!editor?.getHTML() || editor?.getHTML() === "<p>Start writing here...</p>") {
                throw new Error("Content is required");
              }

              const formData = new FormData();
              formData.append("title", title);
              formData.append("content", editor.getHTML());

              if (cover) {
                // Convert base64 to blob
                const response = await fetch(cover);
                const blob = await response.blob();
                formData.append("cover_image", blob, "cover.jpg");
              }

              // Get all image elements from the editor
              const editorImages = document.querySelectorAll(".ProseMirror img");
              for (let i = 0; i < editorImages.length; i++) {
                const img = editorImages[i];
                if (img.src.startsWith("data:")) {
                  // Convert base64 to blob
                  const base64 = img.src;
                  const response = await fetch(base64);
                  const blob = await response.blob();
                  formData.append("figures", blob, figures[i] || `figure-${i + 1}.jpg`);
                }
              }

              // Check authentication
              if (!isAuthenticated()) {
                throw new Error('Please login to create an article');
              }

              const response = await axios.post(
                "http://localhost:5000/api/v1/articles",
                formData,
                {
                  headers: {
                    "Content-Type": "multipart/form-data",
                    "Authorization": `Bearer ${token}`
                  },
                }
              );

              if (response.data.success) {
                navigate("/knowledge-hub");
              } else {
                throw new Error(response.data.message || "Failed to create article");
              }
            } catch (err) {
              if (err.response) {
                // Server responded with an error
                setError(err.response.data?.message || err.response.statusText || "Server error");
                console.error("Server error details:", err.response.data);
              } else if (err.request) {
                // Request was made but no response
                setError("No response from server. Please try again.");
                console.error("No response from server:", err.request);
              } else {
                // Error in request setup
                setError(err.message || "Failed to create article");
                console.error("Request setup error:", err);
              }
            } finally {
              setIsSubmitting(false);
            }
          }}
          disabled={isSubmitting}
          className="bg-gradient-to-r from-green-500 to-emerald-500 text-white px-8 py-3 rounded-lg font-semibold shadow hover:from-green-600 hover:to-emerald-600 transition disabled:opacity-50"
        >
          {isSubmitting ? "Publishing..." : "Publish Article"}
        </button>
      </div>
    </div>
  );
};

export default CreateArticle;