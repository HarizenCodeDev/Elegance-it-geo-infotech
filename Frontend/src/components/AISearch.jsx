import { useState, useEffect, useRef } from "react";
import { Search, X, Loader2, User, Calendar, Bell, FileText } from "lucide-react";
import axios from "axios";
import API_BASE from "../config/api.js";

const AISearch = ({ isOpen, onClose }) => {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [recentSearches, setRecentSearches] = useState([]);
  const inputRef = useRef(null);

  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isOpen]);

  useEffect(() => {
    const saved = localStorage.getItem("aiSearchHistory");
    if (saved) {
      setRecentSearches(JSON.parse(saved));
    }
  }, []);

  useEffect(() => {
    const delayDebounceFn = setTimeout(async () => {
      if (query.trim().length >= 2) {
        setLoading(true);
        try {
          const token = localStorage.getItem("token");
          const response = await axios.get(
            `${API_BASE}/api/ai/search?q=${encodeURIComponent(query)}`,
            { headers: { Authorization: `Bearer ${token}` } }
          );
          if (response.data.success) {
            setResults(response.data.results || []);
          }
        } catch (error) {
          console.error("Search error:", error);
        } finally {
          setLoading(false);
        }
      } else {
        setResults([]);
      }
    }, 300);

    return () => clearTimeout(delayDebounceFn);
  }, [query]);

  const saveSearch = (searchQuery) => {
    const updated = [searchQuery, ...recentSearches.filter((s) => s !== searchQuery)].slice(0, 5);
    setRecentSearches(updated);
    localStorage.setItem("aiSearchHistory", JSON.stringify(updated));
  };

  const handleSearch = (searchQuery) => {
    if (searchQuery.trim()) {
      saveSearch(searchQuery);
      setQuery(searchQuery);
    }
  };

  const getIcon = (type) => {
    switch (type) {
      case "employee":
        return <User size={16} />;
      case "leave":
        return <Calendar size={16} />;
      case "announcement":
        return <Bell size={16} />;
      default:
        return <FileText size={16} />;
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-20">
      <div className="absolute inset-0 bg-black/60" onClick={onClose} />
      <div
        className="relative w-full max-w-2xl mx-4 rounded-2xl shadow-2xl"
        style={{ backgroundColor: "var(--color-bg-secondary)", border: "1px solid var(--color-border)" }}
      >
        <div className="p-4 border-b" style={{ borderColor: "var(--color-border)" }}>
          <div className="flex items-center gap-3">
            <Search size={20} style={{ color: "var(--color-primary)" }} />
            <input
              ref={inputRef}
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search employees, leaves, announcements..."
              className="flex-1 bg-transparent outline-none text-lg"
              style={{ color: "var(--color-text-primary)" }}
            />
            {loading && <Loader2 size={20} className="animate-spin" style={{ color: "var(--color-primary)" }} />}
            <button onClick={onClose} className="p-1 hover:bg-gray-700 rounded">
              <X size={20} />
            </button>
          </div>
        </div>

        <div className="max-h-96 overflow-y-auto">
          {results.length > 0 && (
            <div className="p-2">
              <div className="text-xs px-3 py-2 uppercase" style={{ color: "var(--color-text-muted)" }}>
                Search Results
              </div>
              {results.map((result, index) => (
                <button
                  key={index}
                  className="w-full flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-gray-700 transition text-left"
                  onClick={() => {
                    onClose(result);
                  }}
                >
                  <div
                    className="w-8 h-8 rounded-lg flex items-center justify-center"
                    style={{ backgroundColor: "var(--color-primary)", color: "white" }}
                  >
                    {getIcon(result.type)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="font-medium truncate" style={{ color: "var(--color-text-primary)" }}>
                      {result.title || result.name}
                    </div>
                    {result.subtitle && (
                      <div className="text-xs truncate" style={{ color: "var(--color-text-muted)" }}>
                        {result.subtitle}
                      </div>
                    )}
                  </div>
                  <span
                    className="text-xs px-2 py-0.5 rounded-full"
                    style={{ backgroundColor: "var(--color-bg-hover)", color: "var(--color-text-muted)" }}
                  >
                    {result.type}
                  </span>
                </button>
              ))}
            </div>
          )}

          {query.length < 2 && recentSearches.length > 0 && (
            <div className="p-2">
              <div className="text-xs px-3 py-2 uppercase" style={{ color: "var(--color-text-muted)" }}>
                Recent Searches
              </div>
              {recentSearches.map((search, index) => (
                <button
                  key={index}
                  onClick={() => handleSearch(search)}
                  className="w-full flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-gray-700 transition text-left"
                >
                  <Search size={16} style={{ color: "var(--color-text-muted)" }} />
                  <span style={{ color: "var(--color-text-secondary)" }}>{search}</span>
                </button>
              ))}
            </div>
          )}

          {query.length < 2 && recentSearches.length === 0 && (
            <div className="p-8 text-center" style={{ color: "var(--color-text-muted)" }}>
              <Search size={40} className="mx-auto mb-3 opacity-50" />
              <p>Start typing to search across the system</p>
              <p className="text-xs mt-2">Search employees, leave requests, and announcements</p>
            </div>
          )}

          {!loading && query.length >= 2 && results.length === 0 && (
            <div className="p-8 text-center" style={{ color: "var(--color-text-muted)" }}>
              <p>No results found for "{query}"</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AISearch;
