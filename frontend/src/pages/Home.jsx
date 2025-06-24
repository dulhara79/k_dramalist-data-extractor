import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import SearchFilters from '../components/SearchFilters';
import DramaCard from '../components/DramaCard';
import Pagination from '../components/Pagination';
import Footer from '../components/Footer';
import { Search } from 'lucide-react';

function Home() {
  const [dramas, setDramas] = useState([]);
  const [filteredDramas, setFilteredDramas] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [stats, setStats] = useState({ total_dramas: 0, average_rating: 0, years_range: { min: '', max: '' } });
  const dramasPerPage = 6;
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [dramasResponse, statsResponse] = await Promise.all([
          fetch(`http://localhost:8000/api/dramas?page=${currentPage}&per_page=${dramasPerPage}`),
          fetch('http://localhost:8000/api/stats')
        ]);
        const dramasData = await dramasResponse.json();
        const statsData = await statsResponse.json();
        setDramas(dramasData.dramas);
        setFilteredDramas(dramasData.dramas);
        setTotalPages(Math.ceil(dramasData.total / dramasPerPage));
        setStats(statsData);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };
    fetchData();
  }, [currentPage]);

  const handleSearch = async (params) => {
    try {
      const queryParams = new URLSearchParams();
      if (params.query) queryParams.append('query', params.query);
      if (params.genres && params.genres.length) queryParams.append('genres', params.genres.join(','));
      if (params.year) queryParams.append('year', params.year);
      if (params.rating) queryParams.append('rating', params.rating);
      queryParams.append('page', 1);
      queryParams.append('per_page', dramasPerPage);

      const response = await fetch(`http://localhost:8000/api/search?${queryParams}`);
      const data = await response.json();
      setFilteredDramas(data.dramas);
      setTotalPages(Math.ceil(data.total / dramasPerPage));
      setCurrentPage(1);
    } catch (error) {
      console.error('Error searching dramas:', error);
    }
  };

  const handleDramaClick = (drama) => {
    navigate(`/drama/${encodeURIComponent(drama.title)}`);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-purple-50/20">
      <header className="relative overflow-hidden bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 text-white">
        <div className="absolute inset-0 bg-black/10" />
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPGcgZmlsbD0ibm9uZSIgZmlsbC1ydWxlPSJldmVub2RkIj4KPGcgZmlsbD0iIzAwMCIgZmlsbC1vcGFjaXR5PSIwLjAzIj4KPHBhdGggZD0ibTM2IDM0djItMmgtMnYyaC0ydi0yaDJ2LTJoMnYyaDJ6bS0xNiAwdjItMmgtMnYyaC0ydi0yaDJ2LTJoMnYyaDJ6Ii8+CjwvZz4KPC9nPgo8L3N2Zz4=')] opacity-30" />
        <div className="relative container mx-auto px-6 py-16">
          <div className="text-center">
            <h1 className="text-5xl md:text-7xl font-bold mb-4 bg-gradient-to-r from-white via-blue-100 to-purple-100 bg-clip-text text-transparent">
              K-Drama Universe
            </h1>
            <p className="text-xl md:text-2xl text-white/90 mb-8 max-w-2xl mx-auto">
              Discover your next obsession in our premium collection of Korean dramas
            </p>
            <div className="flex flex-wrap justify-center gap-8 text-center">
              <div className="bg-white/20 backdrop-blur-sm rounded-2xl px-6 py-4 min-w-[120px]">
                <div className="text-2xl font-bold">{stats.total_dramas}</div>
                <div className="text-sm text-white/80">Total Dramas</div>
              </div>
              <div className="bg-white/20 backdrop-blur-sm rounded-2xl px-6 py-4 min-w-[120px]">
                <div className="text-2xl font-bold">{stats.average_rating.toFixed(1)}</div>
                <div className="text-sm text-white/80">Avg Rating</div>
              </div>
              <div className="bg-white/20 backdrop-blur-sm rounded-2xl px-6 py-4 min-w-[120px]">
                <div className="text-2xl font-bold">{stats.years_range.max && stats.years_range.min ? stats.years_range.max - stats.years_range.min + 1 : 0}</div>
                <div className="text-sm text-white/80">Years Coverage</div>
              </div>
            </div>
          </div>
        </div>
      </header>
      <main className="container mx-auto px-6 py-12">
        <SearchFilters onSearch={handleSearch} />
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            {filteredDramas.length === dramas.length ? 'All Dramas' : 'Search Results'}
          </h2>
          <p className="text-gray-600">
            {filteredDramas.length} drama{filteredDramas.length !== 1 ? 's' : ''} found
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
          {filteredDramas.map((drama) => (
            <DramaCard 
              key={drama.title} 
              drama={drama} 
              onClick={() => handleDramaClick(drama)}
            />
          ))}
        </div>
        {filteredDramas.length === 0 && (
          <div className="text-center py-16">
            <div className="w-24 h-24 bg-gradient-to-br from-gray-200 to-gray-300 rounded-full flex items-center justify-center mx-auto mb-6">
              <Search className="w-12 h-12 text-gray-400" />
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-2">No dramas found</h3>
            <p className="text-gray-600 mb-6">Try adjusting your search criteria or browse all dramas</p>
            <button 
              onClick={() => {
                setFilteredDramas(dramas);
                setCurrentPage(1);
              }}
              className="px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-xl font-medium shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-300"
            >
              Show All Dramas
            </button>
          </div>
        )}
        {filteredDramas.length > 0 && totalPages > 1 && (
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={setCurrentPage}
          />
        )}
      </main>
      <Footer />
    </div>
  );
}

export default Home;