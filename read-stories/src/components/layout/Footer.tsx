import React from 'react';

const Footer: React.FC = () => {
  return (
    <footer className="bg-gray-900 text-gray-400 py-6 mt-1">
      <div className="max-w-7xl mx-auto px-4 text-center">
        <p className="text-sm">© {new Date().getFullYear()} TRUYENTRANHVIP. All rights reserved.</p>
      </div>
    </footer>
  );
};

export default Footer;

