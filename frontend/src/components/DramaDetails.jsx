import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Star, Calendar, Clock, Users, ChevronLeft } from 'lucide-react';
import Footer from '../components/Footer';

function DramaDetails() {
  const [drama, setDrama] = useState(null);
  const { title } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchDrama = async () => {
      try {
        const response = await fetch(`http://localhost:8000/api/dramas/${encodeURIComponent(title)}`);
        const data = await response.json();
        if (data.error) {
          console.error('Drama not found');
          navigate('/');
        } else {
          setDrama(data);
        }
      } catch (error) {
        console.error('Error fetching drama:', error);
        navigate('/');
      }
    };
    fetchDrama();
  }, [title, navigate]);

  if (!drama) {
    return <div>Loading...</div>;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/50 to-purple-50/30">
      <div className="relative overflow-hidden bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 text-white">
        <div className="absolute inset-0 bg-black/20" />
        <div className="relative container mx-auto px-6 py-16">
          <button 
            onClick={() => navigate('/')}
            className="mb-8 flex items-center gap-2 text-white/80 hover:text-white transition-colors"
          >
            <ChevronLeft className="w-5 h-5" />
            <span>Back to Browse</span>
          </button>
          <div className="max-w-4xl">
            <h1 className="text-4xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-white to-blue-100 bg-clip-text text-transparent">
              {drama.title}
            </h1>
            <div className="flex flex-wrap items-center gap-6 mb-8">
              <div className="flex items-center gap-2 bg-white/20 backdrop-blur-sm px-4 py-2 rounded-full">
                <Star className="w-5 h-5 text-yellow-400 fill-current" />
                <span className="font-semibold">{drama.rating ?? 'N/A'}</span>
              </div>
              <div className="flex items-center gap-2">
                <Calendar className="w-5 h-5" />
                <span>{drama.year}</span>
              </div>
              <div className="flex items-center gap-2">
                <Clock className="w-5 h-5" />
                <span>{drama.duration ?? 'N/A'}</span>
              </div>
              <div className="flex items-center gap-2">
                <Users className="w-5 h-5" />
                <span>{drama.number_of_episodes ?? 'N/A'} episodes</span>
              </div>
            </div>
            <p className="text-lg leading-relaxed text-white/90 max-w-3xl">
              {drama.synopsis}
            </p>
          </div>
        </div>
      </div>
      <div className="container mx-auto px-6 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-8">
            <div className="bg-white/70 backdrop-blur-xl rounded-2xl p-6 border border-white/20 shadow-xl">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Genres</h2>
              <div className="flex flex-wrap gap-3">
                {drama.genres.map((genre) => (
                  <span 
                    key={genre}
                    className="px-4 py-2 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-full font-medium shadow-lg"
                  >
                    {genre}
                  </span>
                ))}
              </div>
            </div>
            <div className="bg-white/70 backdrop-blur-xl rounded-2xl p-6 border border-white/20 shadow-xl">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Main Cast</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {drama.main_actors.map((actor, index) => (
                  <div key={index} className="flex items-center ':'-4 p-4 bg-gradient-to-r from-gray-50 to-blue-50/50 rounded-xl border border-gray-100">
                    <div className="w-12 h-12 bg-gradient-to-br from-blue-400 to-purple-500 rounded-full flex items-center justify-center text-white font-bold">
                      {actor.name ? actor.name.char51515(0) : '?'}
                    </div>
                    <div>
                      <div className="font-semibold text-gray-900">{actor.name ?? 'Unknown'}</div>
                      <div className="text-sm text-gray-600">as {actor.character}</div>
                      {actor.role_type && (
                        <div className="text-xs text-blue-600 font-medium">({actor.role_type})</div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <div className="bg-white/70 backdrop-blur-xl rounded-2xl p-6 border border-white/20 shadow-xl">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Production Team</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h3 className="font-semibold text-gray-700 mb-2">Directors</h3>
                  <p className="text-gray-600">{drama.directors.join(', ')}</p>
                </div>
                <div>
                  <h3 className="font-semibold text-gray-700 mb-2">Screenwriters</h3>
                  <p className="text-gray-600">{drama.screenwriters.join(', ')}</p>
                </div>
              </div>
            </div>
          </div>
          <div className="space-y-6">
            <div className="bg-gradient-to-br from-blue-500 to-purple-600 text-white rounded-2xl p-6 shadow-xl">
              <h3 className="text-xl font-bold mb-4">Statistics</h3>
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span>Score</span>
                  <span className="font-bold">{drama.statistics.score || 'N/A'}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span>Ranked</span>
                  <span className="font-bold">#{drama.statistics.ranked || 'N/A'}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span>Popularity</span>
                  <span className="font-bold">#{drama.statistics.popularity || 'N/A'}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span>Watchers</span>
                  <span className="font-bold">{drama.statistics.watchers ? (drama.statistics.watchers / 1000).toFixed(0) + 'K' : 'N/A'}</span>
                </div>
              </div>
            </div>
            <div className="bg-white/70 backdrop-blur-xl rounded-2xl p-6 border border-white/20 shadow-xl">
              <h3 className="text-xl font-bold text-gray-900 mb-4">Details</h3>
              <div className="space-y-3 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">Network</span>
                  <span className="font-medium">{drama.original_network ?? 'N/A'}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Episodes</span>
                  <span className="font-medium">{drama.number_of_episodes ?? 'N/A'}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Duration</span>
                  <span className="font-medium">{drama.duration ?? 'N/A'}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Rating</span>
                  <span className="font-medium">{drama.content_rating ?? 'N/A'}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Start Date</span>
                  <span className="font-medium">{drama.start_date ?? 'N/A'}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">End Date</span>
                  <span className="font-medium">{drama.end_date ?? 'N/A'}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}

export default DramaDetails;