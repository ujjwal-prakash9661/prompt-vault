import React, { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import MobileSidebar from "../components/MobileSidebar";

import api from '../services/api'

const Favourites = () => {
  const [favourites, setFavourites] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchFavourites = async () => {
      try {
        const res = await fetch("https://prompt-vault-wnpk.onrender.com/api/user/favourites", {
          credentials: "include", 
        });
        const data = await res.json();

        if (res.ok) {
          const items = Array.isArray(data.favourites) ? data.favourites : [];
    
          const sorted = [...items].sort(
            (a, b) => new Date(b.createdAt || 0) - new Date(a.createdAt || 0)
          );
          setFavourites(sorted);
        } else {
          console.error("Error fetching favourites:", data.message);
        }
      } catch (err) {
        console.error("Failed to fetch favourites:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchFavourites();
  }, []);

  const clearAllFavourites = async () => {
    if (!window.confirm('Clear ALL favourites? Prompts will remain, only favourites list is cleared.')) return;
    try {
      const res = await api.delete('/user/favourites');
      if (res.status === 200) {
        setFavourites([]);
        alert('All favourites cleared');
      }
    } catch (err) {
      console.error('Failed to clear favourites', err);
      alert('Failed to clear favourites');
    }
  };

  return (
    <div className="min-h-screen app-bg app-container">
      <Navbar />
      <MobileSidebar />

      <div className="w-full p-2 md:p-3">
          <div className="w-full flex flex-col md:flex-row md:items-center md:justify-between items-center gap-3">
            <h2 className="text-2xl md:text-3xl font-bold tracking-wide text-purple-600 dark:text-purple-400">
              FAVOURITES
            </h2>
            <button
              className="cursor-pointer px-3 md:px-4 py-2 rounded-lg bg-red-600 hover:bg-red-700 text-white text-sm md:text-base transition"
              onClick={clearAllFavourites}
            >
              Clear all favourites
            </button>
          </div>

          {loading ? (
            <p className="text-center text-gray-600 dark:text-gray-400">Loading...</p>
          ) : favourites.length === 0 ? (
            <p className="text-center text-gray-600 dark:text-gray-400">No favourites yet</p>
          ) : (
            favourites.map((fav) => (
              <div
                key={fav._id}
                className="bg-white dark:bg-gray-900 rounded-2xl shadow-lg overflow-hidden border border-gray-200 dark:border-gray-800 hover:border-purple-500 transition-all duration-300 mb-4"
              >
                <div className="p-4 md:p-6 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors duration-300">
                  <h1 className="text-lg md:text-xl font-medium text-gray-900 dark:text-purple-400">
                    {fav.content}

                    <div className="flex justify-end gap-4">
                      <button
                        className="cursor-pointer hover:scale-95"
                        onClick={async() => {
                          const res = await api.delete(`/user/favourites/${fav._id}`)

                          if(res.status !== 200)
                          {
                            alert('Something went wrong')
                          }

                          console.log(res.data + "Deleted")
                        }}
                      >
                        🗑️
                      </button>

                      <button
                        className="cursor-pointer hover:scale-95"

                        onClick={ async() => {

                          const Prompt = prompt("Enter a new Prompt")
                          
                          const updatedPrompt = await api.put(`/prompts/${fav._id}`, {
                            content : Prompt
                          })

                          console.log("prompt changed successfully", updatedPrompt)
                        }}  
                      >
                        ✏️
                      </button>
                    </div>
                  </h1>
                  <p className="text-gray-600 dark:text-gray-400 text-sm mt-2">
                    {fav.title} · {new Date(fav.createdAt).toLocaleString()}
                  </p>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    // </div>
  );
};

export default Favourites;
