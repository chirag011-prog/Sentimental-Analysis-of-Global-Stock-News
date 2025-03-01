import React, { useEffect, useState } from "react";

const NewsDashboard = () => {
  const [news, setNews] = useState({ positive: [], negative: [], neutral: [] });

  const fetchNews = () => {
    fetch("http://3.110.43.150:5000/get-news")
      .then((res) => res.json())
      .then((data) => {
        setNews({
          positive: data.positive.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp)),
          negative: data.negative.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp)),
          neutral: data.neutral.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp)),
        });
      })
      .catch((error) => console.error("Error fetching news:", error));
  };

  useEffect(() => {
    fetchNews(); // Fetch news when component loads

    // Refresh news every 3 hours
    const interval = setInterval(fetchNews, 10800000); // 3 hours = 10800000 ms

    return () => clearInterval(interval); // Cleanup on unmount
  }, []);

  return (
    <div className="container mx-auto px-4">
      <h1 className="text-4xl font-bold text-center my-4">MarketIntel Dashboard</h1>
      
    

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-4">
        {/* Positive News */}
        <div className="bg-green-100 p-4 rounded-lg shadow-md">
          <h2 className="text-green-800 font-bold text-xl mb-3">📈 Positive News</h2>
          {news.positive.length > 0 ? (
            news.positive.map((article, index) => (
              <div key={index} className="p-2 border-b border-green-300">
                <p className="text-gray-700 font-bold">{article.title}</p>
                <small className="text-gray-500">{article.source} - {new Date(article.timestamp).toLocaleString()}</small>
              </div>
            ))
          ) : (
            <p className="text-gray-600">No positive news available.</p>
          )}
        </div>

        {/* Neutral News */}
        <div className="bg-blue-100 p-4 rounded-lg shadow-md">
          <h2 className="text-blue-800 font-bold text-xl mb-3">🔍 Neutral News</h2>
          {news.neutral.length > 0 ? (
            news.neutral.map((article, index) => (
              <div key={index} className="p-2 border-b border-blue-300">
                <p className="text-gray-700 font-bold">{article.title}</p>
                <small className="text-gray-500">{article.source} - {new Date(article.timestamp).toLocaleString()}</small>
              </div>
            ))
          ) : (
            <p className="text-gray-600">No neutral news available.</p>
          )}
        </div>

        {/* Negative News */}
        <div className="bg-red-100 p-4 rounded-lg shadow-md">
          <h2 className="text-red-800 font-bold text-xl mb-3">📉 Negative News</h2>
          {news.negative.length > 0 ? (
            news.negative.map((article, index) => (
              <div key={index} className="p-2 border-b border-red-300">
                <p className="text-gray-700 font-bold">{article.title}</p>
                <small className="text-gray-500">{article.source} - {new Date(article.timestamp).toLocaleString()}</small>
              </div>
            ))
          ) : (
            <p className="text-gray-600">No negative news available.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default NewsDashboard;
