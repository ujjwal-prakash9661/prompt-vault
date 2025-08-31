import React, { useState, useEffect } from "react";
import Navbar from "../components/Navbar";
import MobileSidebar from "../components/MobileSidebar";

import api from "../services/api";

const Categories = () => {
  const [expanded, setExpanded] = useState(null); // category toggle
  const [expandedItem, setExpandedItem] = useState({}); // item toggle
  const [search, setSearch] = useState("");
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        const { data } = await api.get("/prompts/categories");
        if (mounted) {
          setCategories(data.categories || []);
        }
      } catch (err) {
        console.error("Failed to load categories", err?.response?.data || err);
        if (mounted) {
          setCategories([]);
        }
      }
    })();
    return () => {
      mounted = false;
    };
  }, []);

  const toggleCategory = (index) => {
    setExpanded(expanded === index ? null : index);
  };

  const toggleItem = (catIndex, itemIndex) => {
    setExpandedItem((prev) => {
      const key = `${catIndex}-${itemIndex}`;
      return {
        ...prev,
        [key]: !prev[key],
      };
    });
  };

  const filteredCategories = categories.map((cat) => ({
    ...cat,
    items: (cat.items || []).filter((item) =>
      String(item.title).toLowerCase().includes(search.toLowerCase())
    ),
  }));

  return (
    <div className="min-h-screen app-bg app-container">
      <Navbar />
      <MobileSidebar />

      <div className="w-full p-2 md:p-3">
          <input
            type="text"
            placeholder="Search prompts..."
            className="w-full p-3 rounded-lg bg-gray-800 outline-none mb-6"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />

          {filteredCategories.map((cat, index) => (
            <div
              key={index}
              className="mb-4 bg-white dark:bg-gray-900 rounded-lg overflow-hidden border border-gray-200 dark:border-gray-800"
            >
              <button
                className="w-full flex justify-between items-center p-4 text-lg font-semibold hover:bg-gray-800"
                onClick={() => toggleCategory(index)}
              >
                <span>{cat.name}</span>
                <span>{expanded === index ? "▲" : "▼"}</span>
              </button>

              {expanded === index && (
                <div className="pl-6 pb-3">
                  {cat.items.length > 0 ? (
                    cat.items.map((item, i) => {
                      const key = `${index}-${i}`;
                      const isOpen = expandedItem[key];
                      return (
                        <div
                          key={i}
                          className="p-2 hover:bg-gray-50 dark:hover:bg-gray-800 rounded-md cursor-pointer"
                        >
                          <div
                            className="flex justify-between items-center font-medium"
                            onClick={() => toggleItem(index, i)}
                          >
                            {item.title}
                            <span>{isOpen ? "▲" : "▼"}</span>
                          </div>
                          {isOpen && (
                            <div className="mt-2 text-sm text-gray-300 whitespace-pre-wrap">
                              {item.content}
                            </div>
                          )}
                        </div>
                      );
                    })
                  ) : (
                    <div className="p-2 text-gray-500">No results</div>
                  )}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    // </div>
  );
};

export default Categories;
