import React, { useState, useEffect } from 'react';
import { Search, Filter, ChevronRight } from 'lucide-react';

function SearchFilters({ onSearch }) {
  const [query, setQuery] = useState('');
  const [selectedGenres, setSelectedGenres] = useState([]);
  const [year, setYear] = useState('');
  const [rating, setRating] = useState('');
  const [isExpanded, setIsExpanded] = useState(false);
  const [genres, setGenres] = useState([]);

  useEffect(() => {
    const fetchGenres = async () => {
      try {
        const response = await fetch('http://localhost:8000/api/genres');
        const data = await response.json();
        setGenres(data);
      } catch (error) {
        console.error('Error fetching genres:', error);
      }
    };
    fetchGenres();
  }, []);

  const handleSearch = () => {
    onSearch({ query, genres: selectedGenres, year, rating: rating ? parseFloat(rating) : null });
  };

  const toggleGenre = (genre) => {
    setSelectedGenres((prev) =>
      prev.includes(genre) ? prev.filter((g) => g !== genre) : [...prev, genre]
    );
  };

  return (
    <div className="bg-white/70 backdrop-blur-xl rounded-2xl p-6 border border-white/20 shadow-xl mb-8">
      <div className="relative mb-6">
        <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
        <input
          type="text"
          placeholder="Search for your next K-drama adventure..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="w-full pl-12 pr-4 py-4 bg-gradient-to-r from-gray-50 to-blue-50/50 border-0 rounded-xl text-gray-900 placeholder-gray-500 focus:ring-2 focus:ring-blue-500 focus:outline-none transition-all duration-300"
        />
      </div>
      <div className="flex items-center justify-between mb-4">
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="flex items-center gap-2 text-gray-600 hover:text-blue-600 transition-colors"
        >
          <Filter className="w-5 h-5" />
          <span className="font-medium">Advanced Filters</span>
          <ChevronRight className={`w-4 h-4 transition-transform ${isExpanded ? 'rotate-90' : ''}`} />
        </button>
        <button 
          onClick={handleSearch}
          className="px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-xl font-medium shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-300"
        >
          Search
        </button>
      </div>
      <div className={`overflow-hidden transition-all duration-500 ${isExpanded ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'}`}>
        <div className="pt-4 border-t border-gray-200/50">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Year</label>
              <input
                type="number"
                placeholder="e.g., 2021"
                value={year}
                onChange={(e) => setYear(e.target.value)}
                className="w-full px-4 py-3 bg-gray-50 border-0 rounded-xl focus:ring-2 focus:ring-blue-500 focus:outline-none transition-all"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Minimum Rating</label>
              <input
                type="number"
                placeholder="e.g., 8.0"
                value={rating}
                onChange={(e) => setRating(e.target.value)}
                step="0.1"
                min="0"
                max="10"
                className="w-full px-4 py-3 bg-gray-50 border-0 rounded-xl focus:ring-2 focus:ring-blue-500 focus:outline-none transition-all"
              />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-3">Genres</label>
            <div className="flex flex-wrap gap-2">
              {genres.map((genre) => (
                <button
                  key={genre}
                  onClick={() => toggleGenre(genre)}
                  className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-300 ${
                    selectedGenres.includes(genre)
                      ? 'bg-gradient-to-r from-blue-500 to-purple-600 text-white shadow-lg scale-105'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  {genre}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default SearchFilters;