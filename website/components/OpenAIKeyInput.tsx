import React, { useState, useEffect } from 'react';

// Local storage key
const STORAGE_KEY = 'openai-api-key';

// Utility function to get the OpenAI key from local storage
export const getOpenAIKey = (): string | null => {
  if (typeof window !== 'undefined') {
    return localStorage.getItem(STORAGE_KEY);
  }
  return null;
};

const OpenAIKeyInput: React.FC = () => {
  const [apiKey, setApiKey] = useState('');
  const [isSaved, setIsSaved] = useState(false);

  // Initialize from local storage
  useEffect(() => {
    const savedKey = getOpenAIKey();
    if (savedKey) {
      setApiKey(savedKey);
      setIsSaved(true);
    }
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setApiKey(e.target.value);
    setIsSaved(false);
  };

  const saveKey = () => {
    if (apiKey.trim()) {
      localStorage.setItem(STORAGE_KEY, apiKey);
      setIsSaved(true);
    }
  };

  const clearKey = () => {
    localStorage.removeItem(STORAGE_KEY);
    setApiKey('');
    setIsSaved(false);
  };

  return (
    <div className="my-4 p-4 border rounded-lg">
      <label className="block mb-2 font-medium">
        OpenAI API Key
      </label>
      <div className="flex gap-2">
        <input
          type="password"
          value={apiKey}
          onChange={handleChange}
          placeholder="Enter your OpenAI API key"
          className="flex-grow px-3 py-2 border rounded"
        />
        <button
          onClick={saveKey}
          disabled={!apiKey.trim() || isSaved}
          className="px-4 py-2 bg-blue-600 text-white rounded disabled:bg-blue-300"
        >
          {isSaved ? 'Saved' : 'Save'}
        </button>
        {isSaved && (
          <button
            onClick={clearKey}
            className="px-4 py-2 bg-gray-200 rounded"
          >
            Clear
          </button>
        )}
      </div>
      {isSaved && (
        <p className="mt-2 text-sm text-green-600">API key saved to local storage</p>
      )}
    </div>
  );
};

export default OpenAIKeyInput;