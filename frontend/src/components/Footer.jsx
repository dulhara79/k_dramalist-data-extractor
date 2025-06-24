import React from 'react';

function Footer() {
  return (
    <footer className="bg-gradient-to-r from-gray-900 via-blue-900 to-purple-900 text-white py-12">
      <div className="container mx-auto px-6">
        <div className="text-center">
          <h3 className="text-2xl font-bold mb-4 bg-gradient-to-r from-white to-blue-200 bg-clip-text text-transparent">
            K-Drama Universe
          </h3>
          <p className="text-white/70 mb-6 max-w-2xl mx-auto">
            Your premium destination for discovering and exploring the best Korean dramas. 
            Immerse yourself in stories that will captivate your heart and soul.
          </p>
          <div className="flex justify-center gap-6 text-white/60">
            <span>© 2024 K-Drama Universe</span>
            <span>•</span>
            <span>Premium Collection</span>
            <span>•</span>
            <span>Curated with ❤️</span>
          </div>
        </div>
      </div>
    </footer>
  );
}

export default Footer;