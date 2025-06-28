import React, { useState, useRef } from "react";
import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Image from "@tiptap/extension-image";

const CreateArticle = () => {
  const [figures, setFigures] = useState([]);
  const fileInputRef = useRef();

  const editor = useEditor({
    extensions: [StarterKit, Image],
    content: "<p>Start writing here...</p>",
  });

  const handleImageSelection = (e) => {
    const files = Array.from(e.target.files);
    const figurePrompts = [];

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
      default:
        break;
    }
  };

  return (
    <div className="max-w-5xl mx-auto p-6 space-y-6 bg-white rounded shadow text-gray-800">
      <h1 className="text-2xl font-bold text-green-700">Create New Article</h1>

      {/* Action Bar */}
      <div className="flex flex-wrap items-center gap-3 border-b pb-2 mb-4">
        <button onClick={() => insert("bold")} className="text-sm px-3 py-1 bg-green-100 rounded hover:bg-green-200">
          Bold
        </button>
        <button onClick={() => insert("italic")} className="text-sm px-3 py-1 bg-green-100 rounded hover:bg-green-200">
          Italic
        </button>
        <button onClick={() => insert("ul")} className="text-sm px-3 py-1 bg-green-100 rounded hover:bg-green-200">
          • List
        </button>
        <button onClick={() => insert("ol")} className="text-sm px-3 py-1 bg-green-100 rounded hover:bg-green-200">
          1. List
        </button>
        <button onClick={() => insert("code")} className="text-sm px-3 py-1 bg-green-100 rounded hover:bg-green-200">
          Code Block
        </button>
        <button
          onClick={() => fileInputRef.current?.click()}
          className="text-sm px-3 py-1 bg-blue-100 text-blue-700 rounded hover:bg-blue-200"
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
      <div className="border border-gray-300 rounded p-4 min-h-[300px]">
        <EditorContent editor={editor} />
      </div>

      {/* Uploaded Figures */}
      {figures.length > 0 && (
        <div className="pt-4">
          <p className="text-sm font-semibold text-gray-600 mb-2">Figures:</p>
          <ul className="list-disc pl-5 space-y-1">
            {figures.map((name, idx) => (
              <li key={idx} className="text-sm text-gray-700">
                {name}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default CreateArticle;