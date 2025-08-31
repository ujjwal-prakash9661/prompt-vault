import React, { useEffect, useState } from "react";
import Navbar from '../components/Navbar'
import MobileSidebar from "../components/MobileSidebar";

import api from '../services/api'

const PromptBox = () => {
  const [promptBox, setPromptBox] = useState([]);
  const [loading, setLoading] = useState(true);

  // const navigate = useNavigate();

  const loadPrompts = async () => {
    try {
      const res = await api.get('/prompts');
      if (res.status === 200) {
        const items = Array.isArray(res.data?.prompts)
          ? res.data.prompts
          : [];

        const sorted = [...items].sort(
          (a, b) => new Date(b.createdAt || 0) - new Date(a.createdAt || 0)
        );
        setPromptBox(sorted);
      } else {
        console.error('Error fetching prompts', res.data);
      }
    } catch (err) {
      console.error('Error fetching prompts', err);
    } finally {
      setLoading(false);
    }
  };

  const clearAllPrompts = async () => {
    if (!window.confirm('This will delete ALL your prompts permanently. Continue?')) return;
    try {
      const res = await api.delete('/prompts/all');
      if (res.status === 200) {
        setPromptBox([]);
        alert('All prompts deleted');
      }
    } catch (err) {
      console.error('Failed to delete all prompts', err);
      alert('Failed to delete all prompts');
    }
  };

  useEffect(() => {
    loadPrompts();
  }, []);

  const handleDelete = async (id) => {
    try {
      const res = await api.delete(`/prompts/${id}`);
      if (res.status === 200 || res.status === 204) {

        setPromptBox((prev) => prev.filter((p) => p._id !== id));

        alert('Deleted!');
      }
    } catch (err) {
      console.error('Failed to delete prompt', err);
    }
  };

  const handleUpdate = async (item) => {
    try {
      const newContent = window.prompt('Enter a new prompt', item.content || item.title || '');
      if (newContent == null) return; 

      const payload = item.content !== undefined
        ? { content: newContent }
        : { title: newContent };

      const updated = await api.put(`/prompts/${item._id}`, payload);
      if (updated.status === 200) {
        
        setPromptBox((prev) => prev.map((p) => p._id === item._id ? { ...p, ...payload } : p));
      }
    } catch (err) {
      console.error('Failed to update prompt', err);
    }
  };

  return (
    <div className="min-h-screen app-bg app-container">
      <Navbar />
      <MobileSidebar />

      <div className="w-full p-2 md:p-3">
          <div className="w-full flex flex-col md:flex-row md:items-center md:justify-between items-center gap-3">
            <h2 className="text-2xl md:text-3xl font-bold tracking-wide text-purple-600 dark:text-purple-400">
              YOUR PROMPT VAULT
            </h2>
            <button
              className="cursor-pointer px-3 md:px-4 py-2 rounded-lg bg-red-600 hover:bg-red-700 text-white text-sm md:text-base transition"
              onClick={clearAllPrompts}
            >
              Clear all prompts
            </button>
          </div>

          {loading ? (
            <p className="text-center text-gray-600 dark:text-gray-400">Loading...</p>
          ) : promptBox.length === 0 ? (
            <p className="text-center text-gray-600 dark:text-gray-400">No Prompt yet</p>
          ) : (
            promptBox.map((item) => (
              <div
                key={item._id}
                className="bg-white dark:bg-gray-900 rounded-2xl shadow-lg overflow-hidden border border-gray-200 dark:border-gray-800 hover:border-purple-500 transition-all duration-300 mb-4"
              >
                <div className="p-4 md:p-6 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors duration-300">
                  <h1 className="text-lg md:text-xl font-medium text-gray-900 dark:text-purple-400">
                    {item.content || item.title}
                  </h1>
                  <div className="flex justify-end gap-4 mt-3">
                    <button
                      className="cursor-pointer hover:scale-95"
                      onClick={() => handleDelete(item._id)}
                      title="Delete"
                    >
                      🗑️
                    </button>

                    <button
                      className="cursor-pointer hover:scale-95"
                      onClick={() => handleUpdate(item)}
                      title="Edit"
                    >
                      ✏️
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
  )
}

export default PromptBox