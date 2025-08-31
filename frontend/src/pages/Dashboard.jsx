import React, { useEffect, useState, useRef, useMemo } from "react";
import Navbar from "../components/Navbar";
import MobileSidebar from "../components/MobileSidebar";

import { useNavigate } from "react-router-dom";
import api from "../services/api";

const PromptItem = ({ id, title, cat, time, navigate, favorites }) => (
  <div className="bg-white rounded p-3 flex items-center justify-between shadow-sm">
    <div>
      <div className="font-medium">{title}</div>
      <div className="text-xs text-gray-500">
        {cat} · Updated {new Date(time).toLocaleString()}
      </div>
    </div>
    <div className="flex items-center gap-3">

      <button
        onClick={async () => {
          try {
            await api.post(`/user/favourites/${id}`);
            navigate(`/favourites`);
          } catch (err) {
            console.error("Failed to add favourite:", err);
          }
        }}
        className="text-yellow-500 cursor-pointer hover:scale-90"
        title="Add to favourites"
      >
        ★
      </button>
      
      <button 
        onClick={ async() => {
          const new_prompt = prompt("Update Prompt Title") 

          const updatePrompt = await api.put(`/prompts/${id}`, {
            title : new_prompt,
          })

          console.log("Prompt Updated", updatePrompt);
        }}
        className="text-gray-400 cursor-pointer hover:scale-90"
      >
        ✏️
      </button>
      
      <button
        onClick={async () => {
          try {

            try {
              if(favorites.includes(id))
              {
                await api.delete(`/user/favourites/${id}`);
              }
              navigate('/dashboard')
            } catch (e) {
              if (!(e && e.response && e.response.status === 404)) {
                throw e;
              }
            }

            const resPrompt = await api.delete(`/prompts/${id}`);
            if (resPrompt.status === 200 || resPrompt.status === 204) {
              navigate('/dashboard');
            }
            console.log('deleted successfully');
          } catch (err) {
            console.log('failed to delete prompt', err);
          }
        }}
        className="text-gray-400 cursor-pointer hover:scale-90"
      >
        🗑️
      </button>
    </div>
  </div>
);

const Dashboard = () => {
  const navigate = useNavigate();
  const [prompts, setPrompts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [favorites, setFavourites] = useState([]);
  const [promptCount, setPromptCount] = useState(0)
  const [search, setSearch] = useState("");
  const fileInputRef = useRef(null);

  // Derived: filter recent prompts by title (case-insensitive)
  const filteredPrompts = useMemo(() => {
    const q = search.trim().toLowerCase();
    const base = prompts;
    // Ensure newest first by createdAt
    const ordered = [...base].sort((a,b) => new Date(b.createdAt) - new Date(a.createdAt));
    const list = q ? ordered.filter(p => (p.title || "").toLowerCase().includes(q)) : ordered;
    // Show at most 5 recent prompts
    return list.slice(0, 5);
  }, [prompts, search]);

  // Reusable fetchers so we can refresh after import
  const fetchPrompts = async () => {
    try {
      const res = await fetch("http://localhost:3000/api/prompts", {
        credentials: "include",
      });
      const data = await res.json();

      if (res.ok) {
        const ordered = [...(data.prompts || [])].sort(
          (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
        );
        setPrompts(ordered);
      } else {
        console.error("Error fetching prompts:", data.message);
      }
    } catch (err) {
      console.error("Failed to fetch prompts:", err);
    } finally {
      setLoading(false);
    }
  };

  const fetchFavourites = async() => {
    try {
      const res = await api.get('/user/favourites', {
        withCredentials : true
      })

      if(res.status===200) {
        const items = Array.isArray(res.data?.favourites)
          ? res.data.favourites : [];

        setFavourites(items)
      }

    } catch(err) {
      console.log("failed to fetch favourites",err)
    }
  }

  const fetchCount = async() => {
    try {
      const res = await api.get('/user/promptCount', { withCredentials: true });
      
      const count = (typeof res.data?.promptCount === 'number' ? res.data.promptCount : 0);
      setPromptCount(count);
    } catch (err) {
      console.error('Failed to fetch user prompt count', err);
    }
  }

  useEffect(() => {
    fetchPrompts();
    fetchFavourites();
    fetchCount();
  }, []);

  // CSV helpers (supports quoted fields and escaped quotes)
  const splitCSVLine = (line) => {
    const result = [];
    let current = '';
    let inQuotes = false;
    for (let i = 0; i < line.length; i++) {
      const c = line[i];
      if (c === '"') {
        if (inQuotes && line[i + 1] === '"') { current += '"'; i++; }
        else { inQuotes = !inQuotes; }
      } else if (c === ',' && !inQuotes) {
        result.push(current);
        current = '';
      } else {
        current += c;
      }
    }
    result.push(current);
    return result;
  };

  const parseCSV = (text) => {
    const lines = text.trim().split(/\r?\n/);
    if (lines.length === 0) return [];
    const headers = splitCSVLine(lines[0]).map(h => h.trim());
    return lines.slice(1)
      .filter(l => l.trim())
      .map(line => {
        const cols = splitCSVLine(line);
        const obj = {};
        headers.forEach((h, i) => { obj[h] = (cols[i] ?? '').trim(); });
        return obj;
      });
  };

  const normalizePrompts = (items) => {
    return items
      .map((p) => {
        const title = (p.title || '').trim();
        const content = (p.content || '').trim();
        const category = (p.category || 'General').trim();
        const tagsRaw = p.tags || '';
        const tags = Array.isArray(tagsRaw)
          ? tagsRaw
          : String(tagsRaw)
              .split(/[|;,]/)
              .map((t) => t.trim())
              .filter(Boolean);
        return title && content ? { title, content, category, tags } : null;
      })
      .filter(Boolean);
  };

  const handleFileChange = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      const text = await file.text();
      let items = [];

      if (file.name.toLowerCase().endsWith('.json')) {
        const data = JSON.parse(text);
        if (Array.isArray(data)) items = data;
        else if (Array.isArray(data?.prompts)) items = data.prompts;
        else throw new Error('Invalid JSON format. Expect an array or { prompts: [...] }');
      } else if (file.name.toLowerCase().endsWith('.csv')) {
        const rows = parseCSV(text);
        items = rows;
      } else {
        throw new Error('Unsupported file type. Use .json or .csv');
      }

      const payload = normalizePrompts(items);
      if (!payload.length) throw new Error('No valid prompts found (need title, content)');

      const res = await api.post('/prompts/import', { prompts: payload });
      if (res.status === 200) {
        window.alert(`${res.data?.count ?? payload.length} prompts imported successfully!`);
        await fetchPrompts();
      }
    } catch (err) {
      console.error('Import failed:', err);
      window.alert(`Import failed: ${err?.response?.data?.message || err.message}`);
    } finally {
      // reset input so same file can be re-selected
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  return (
    <div className="min-h-screen app-bg app-container">
      <Navbar />
      <MobileSidebar />

      <div className="w-full p-3 md:p-4">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
            <h1 className="text-2xl md:text-3xl font-extrabold">Dashboard</h1>
            <div className="w-full md:w-80">
              <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search recent prompts by title..."
                className="w-full px-3 py-2 rounded border bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 focus:outline-none"
              />
            </div>
          </div>

          {/* Stats section */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mt-6">
            <div className="frost-card rounded-lg p-3 shadow-sm flex items-center justify-between">
              <div>
                <div className="text-sm text-gray-500">Total Prompts</div>
                <div className="text-2xl font-bold">{prompts.length}</div>
                <div className="text-xs text-green-500 mt-1">
                  + New prompts loaded
                </div>
              </div>
              <div className="text-3xl">📄</div>
            </div>

            <div className="frost-card rounded-lg p-3 shadow-sm flex items-center justify-between">
              <div>
                <div className="text-sm text-gray-500">Categories</div>
                <div className="text-2xl font-bold">
                  {[...new Set(prompts.map((p) => p.category))].length}
                </div>
                <div className="text-xs text-green-500 mt-1">+ updated</div>
              </div>
              <div className="text-3xl">📂</div>
            </div>

            <div className="frost-card rounded-lg p-3 shadow-sm flex items-center justify-between">
              <div>
                <div className="text-sm text-gray-500">Favorites</div>
                <div className="text-2xl font-bold">{favorites.length}</div>
                <div className="text-xs text-green-500 mt-1">+ Your Favourite Prompts</div>
              </div>
              <div className="text-3xl">⭐</div>
            </div>

            <div className="frost-card rounded-lg p-3 shadow-sm flex items-center justify-between">
              <div>
                <div className="text-sm text-gray-500">Usage This Month</div>
                <div className="text-2xl font-bold">{promptCount}</div>
                <div className="text-xs text-green-500 mt-1">Prompts created this month</div>
              </div>
              <div className="text-3xl">📈</div>
            </div>
          </div>

          <div className="mt-6 grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2">
              <div className="bg-white dark:bg-gray-800 rounded-lg p-4 shadow-sm">
                <div className="flex items-center justify-between mb-4">
                  <div className="font-semibold">Recent Prompts</div>
                  <a onClick={() => navigate('/prompt/allPrompt')} className="text-sm text-indigo-600 cursor-pointer">View All</a>
                </div>

                {loading ? (
                  <p>Loading...</p>
                ) : (
                  <div className="space-y-2">
                    {filteredPrompts.length > 0 ? (
                      filteredPrompts.map((p) => (
                        <PromptItem
                          key={p._id}
                          id={p._id}
                          title={p.title}
                          cat={p.category}
                          time={p.createdAt}
                          navigate={navigate}
                          favorites={favorites}
                        />
                      ))
                    ) : (
                      <p>{search ? 'No results for your search.' : 'No prompts available.'}</p>
                    )}
                  </div>
                )}
              </div>
            </div>

            <div>
              <div className="bg-white dark:bg-gray-900 rounded-lg p-4 shadow-sm mb-4 border border-gray-200 dark:border-gray-800">
                <div className="font-semibold mb-2">Quick Actions</div>
                <div className="space-y-2">
                  <button
                    onClick={() => navigate("/prompt")}
                    className="w-full text-left px-3 py-2 rounded bg-indigo-50 dark:bg-indigo-900/40 cursor-pointer hover:scale-98"
                  >
                    ➕ Create New Prompt
                  </button>

                  <button
                    onClick={() => fileInputRef.current?.click()}
                    className="w-full text-left px-3 py-2 rounded bg-green-50 dark:bg-emerald-900/20 cursor-pointer hover:scale-98"
                  >
                    ⬆️ Import Prompts
                  </button>
                  <input
                    type="file"
                    accept=".json,.csv"
                    ref={fileInputRef}
                    onChange={handleFileChange}
                    className="hidden"
                  />

                  <button 
                    onClick={() => navigate('/prompt/allPrompt')}
                    className="w-full text-left px-3 py-2 rounded bg-gray-50 dark:bg-gray-800 cursor-pointer hover:scale-98"
                  >
                    📦 Prompt Box
                  </button>

                </div>
              </div>

              <div className="bg-white dark:bg-gray-800 rounded-lg p-4 shadow-sm">
                <div className="font-semibold mb-3">Top Categories</div>
                <div className="space-y-2 text-sm text-gray-600 dark:text-gray-300">
                  {[...new Set(prompts.map((p) => p.category))].map((cat) => (
                    <div
                      key={cat}
                      className="flex items-center justify-between"
                    >
                      <div>{cat}</div>
                      <div>{prompts.filter((p) => p.category === cat).length}</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    // </div>
  );
};

export default Dashboard;