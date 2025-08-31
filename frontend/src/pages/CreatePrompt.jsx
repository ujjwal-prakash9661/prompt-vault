import React, { useState } from "react";
import Navbar from "../components/Navbar";
import MobileSidebar from "../components/MobileSidebar";

import { useNavigate } from "react-router-dom";
import api from "../services/api";

const CreatePrompt = () => {
  const [title, setTitle] = useState("");
  const [category, setCategory] = useState("General");
  const [content, setContent] = useState("");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleSend = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError("");

    try 
    {
      await api.post("/prompts", { title, content, category, tags: [category].filter(Boolean) });
      navigate("/dashboard");
    } 
    catch(err) 
    {
      const msg = err?.response?.data?.message || "Failed to save prompt";
      setError(msg);
    } 
    finally 
    {
      setSaving(false);
    }
  };

  return (
    <div className="min-h-screen app-bg app-container">
      <Navbar />

      <MobileSidebar />
      <div className="flex">
        
        <main className="flex-1 p-3 md:p-6 max-w-3xl">
          <div className="max-w-3xl mx-auto">
            <h1 className="text-2xl font-extrabold mb-4">Create Prompt</h1>

            <form onSubmit={handleSend} className="space-y-4">
              <div>
                <label className="block text-sm mb-1">Title</label>
                <input
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="Prompt title"
                  className="w-full px-3 py-2 rounded border bg-white dark:bg-gray-800"
                  required
                />
              </div>

              <div>
                <label className="block text-sm mb-1">Category</label>
                <input
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  placeholder="Category"
                  className="w-full px-3 py-2 rounded border bg-white dark:bg-gray-800"
                />
              </div>

              <div>
                <label className="block text-sm mb-1">Prompt</label>
                <textarea
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  rows={8}
                  placeholder="Write your prompt here..."
                  className="w-full px-3 py-2 rounded border bg-white dark:bg-gray-800"
                  required
                />
              </div>

              {error && <p className="text-red-500 text-sm">{error}</p>}

              <div className="flex items-center gap-3">
                <button
                  type="submit"
                  className="bg-indigo-600 text-white px-4 py-2 rounded"
                  disabled={saving}
                >
                  {saving ? "Saving…" : "Send"}
                </button>
                <button
                  type="button"
                  className="px-4 py-2 rounded border"
                  onClick={() => navigate("/dashboard")}
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </main>
      </div>
    </div>
  );
};

export default CreatePrompt;
