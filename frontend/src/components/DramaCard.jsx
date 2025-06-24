import React, { useState } from 'react';
import { Star, Play, Calendar, Eye, TrendingUp } from 'lucide-react';

function DramaCard({ drama, onClick }) {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <div 
      className="group relative overflow-hidden rounded-2xl bg-gradient-to-br from-white/90 to-white/70 backdrop-blur-xl border border-white/20 shadow-xl hover:shadow-2xl transition-all duration-500 hover:scale-[1.02] cursor-pointer"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={onClick}
    >
      <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 via-purple-500/5 to-pink-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
      <div className="relative p-6 z-10">
        <div className="flex items-start justify-between mb-4">
          <h3 className="text-xl font-bold text-gray-900 group-hover:text-blue-600 transition-colors duration-300 line-clamp-2">
            {drama.title}
          </h3>
          <div className="flex items-center gap-1 bg-gradient-to-r from-yellow-400 to-orange-400 text-white px-2 py-1 rounded-full text-sm font-medium shadow-lg">
            <Star className="w-3 h-3 fill-current" />
            <span>{drama.rating ?? 'N/A'}</span>
          </div>
        </div>
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2 text-gray-600">
            <Calendar className="w-4 h-4" />
            <span className="text-sm font-medium">{drama.year}</span>
          </div>
          <div className={`p-2 rounded-full bg-gradient-to-r from-blue-500 to-purple-600 text-white shadow-lg transition-all duration-300 ${isHovered ? 'scale-110 shadow-xl' : 'scale-100'}`}>
            <Play className="w-4 h-4 fill-current" />
          </div>
        </div>
        <div className="flex flex-wrap gap-2 mb-4">
          {drama.genres.slice(0, 3).map((genre) => (
            <span 
              key={genre} 
              className="px-3 py-1 bg-gradient-to-r from-blue-100 to-purple-100 text-blue-700 text-xs font-medium rounded-full border border-blue-200/50"
            >
              {genre}
            </span>
          ))}
          {drama.genres.length > 3 && (
            <span className="px-3 py-1 bg-gray-100 text-gray-600 text-xs font-medium rounded-full">
              +{drama.genres.length - 3}
            </span>
          )}
        </div>
        <p className="text-gray-600 text-sm line-clamp-2 leading-relaxed">
          {drama.synopsis}
        </p>
        <div className={`absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent flex items-end justify-between p-6 transition-opacity duration-300 ${isHovered ? 'opacity-100' : 'opacity-0'}`}>
          <div className="flex items-center gap-4 text-white text-sm">
            <div className="flex items-center gap-1">
              <Eye className="w-4 h-4" />
              <span>{drama.statistics.watchers ? (drama.statistics.watchers / 1000).toFixed(0) + 'K' : 'N/A'}</span>
            </div>
            <div className="flex items-center gap-1">
              <TrendingUp className="w-4 h-4" />
              <span>#{drama.statistics.ranked || 'N/A'}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default DramaCard;