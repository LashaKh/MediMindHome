import React, { useState } from 'react';

const SimpleTest: React.FC = () => {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSearch = async () => {
    const BRAVE_API_KEY = 'BSACH1LOne7f_ejIG29RJvcT06mFcm0';
    
    if (!query.trim()) return;
    
    setLoading(true);
    setError('');
    setResults([]);
    
    try {
      console.log('Starting API search...');
      const response = await fetch(`/api/brave/res/v1/web/search?q=${encodeURIComponent(query + ' medical')}&count=5`, {
        headers: {
          'X-Subscription-Token': BRAVE_API_KEY
        }
      });
      
      console.log('API response status:', response.status);
      
      if (!response.ok) {
        throw new Error(`API error: ${response.status} ${response.statusText}`);
      }
      
      const data = await response.json();
      console.log('API response data:', data);
      
      if (data.web?.results) {
        setResults(data.web.results);
      } else {
        setError('No results found');
      }
    } catch (error) {
      console.error('Search error:', error);
      setError(error instanceof Error ? error.message : 'Unknown error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-4 max-w-3xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">Simple API Test</h1>
      
      <div className="flex mb-4">
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search medical literature..."
          className="flex-1 p-2 border rounded-l"
        />
        <button
          onClick={handleSearch}
          disabled={loading}
          className="bg-blue-600 text-white px-4 py-2 rounded-r"
        >
          {loading ? 'Searching...' : 'Search'}
        </button>
      </div>
      
      <div className="grid grid-cols-1 gap-4">
        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
            {error}
          </div>
        )}
        
        {results.map((result, index) => (
          <div key={index} className="border p-4 rounded bg-white">
            <h2 className="text-xl font-semibold mb-2">{result.title}</h2>
            <p className="text-gray-600 mb-2">{result.description}</p>
            <a 
              href={result.url} 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-blue-600 hover:underline"
            >
              {result.url}
            </a>
          </div>
        ))}
      </div>
    </div>
  );
};

export default SimpleTest; 