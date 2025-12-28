import React, { useState } from 'react';

const SystemPromptAsAFunction: React.FC = () => {
  const [systemPrompt, setSystemPrompt] = useState('quadruple this number:');
  // A tool for rendering the response. Didn't end up using this.
  const [tools, setTools] = useState(`
    You have access to the following tool. Use ONLY this tool to return your response.

    computeAnswer: { "answer" : "numerical answer to the question" }

    Example responses:
    { "answer" : "250" }
    { "answer" : "two hundred and fifty" }
  `);
  const [userPrompt, setUserPrompt] = useState('eighty-six');
  const [response, setResponse] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const generateResponse = async () => {
    if (!userPrompt.trim()) {
      setError('Please enter a user prompt.');
      return;
    }

    setError(null);
    setIsGenerating(true);
    setResponse('');

    try {
      const apiResponse = await fetch('https://llm.koomen.dev/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: 'gpt-4o-mini',
          type: 'function',
          messages: [
            /*{ role: 'system', content: `${systemPrompt}\n\n${tools}`},*/
            { role: 'system', content: `${systemPrompt}`},
            { role: 'user', content: userPrompt }
          ],
          stream: true,
        }),
      });

      if (!apiResponse.ok) {
        throw new Error(`API request failed with status ${apiResponse.status}`);
      }

      const reader = apiResponse.body?.getReader();
      if (!reader) {
        throw new Error('Response body is not readable');
      }

      const decoder = new TextDecoder();
      let responseText = '';

      // Process the stream
      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        const chunk = decoder.decode(value, { stream: true });
        const lines = chunk.split('\n').filter(line => line.trim() !== '');

        for (const line of lines) {
          // Skip the initial "data: [DONE]" message
          if (line === 'data: [DONE]') continue;

          // Remove the "data: " prefix
          const jsonData = line.replace(/^data: /, '');

          try {
            const data = JSON.parse(jsonData);
            const content = data.choices[0]?.delta?.content || '';
            if (content) {
              responseText += content;

              // Try to parse JSON from the response
              try {
                // Look for complete JSON objects in the response
                const jsonRegex = /\{.*"answer"\s*:\s*"([^"]+)".*\}/s;
                const match = responseText.match(jsonRegex);

                if (match && match[1]) {
                  // Show only the answer value from the JSON
                  setResponse(match[1]);
                } else {
                  // Show raw response if no valid JSON is detected yet
                  setResponse(responseText);
                }
              } catch (jsonParseError) {
                // If JSON parsing fails, just show the raw response
                setResponse(responseText);
              }
            }
          } catch (e) {
            // Skip json parse errors for non-data lines
            console.error("JSON parse error:", e);
          }
        }
      }

      setIsGenerating(false);
    } catch (err) {
      console.error('Error generating response:', err);
      setError(err instanceof Error ? err.message : 'An unknown error occurred');
      setIsGenerating(false);
    }
  };

  return (
    <figure className="mx-auto max-w-6xl p-4">
      <div className="border rounded-lg p-6 shadow-sm bg-white">
        {/* Responsive grid - 3 columns on desktop, 1 column on mobile */}
        {/* Hidden Tool Definition field - not shown in UI but still used */}
        <div className="hidden">
          <textarea
            value={tools}
            onChange={(e) => setTools(e.target.value)}
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {/* System Prompt (function) */}
          <div className="md:col-span-1">
            <label className="block font-semibold text-sm text-gray-700 mb-2">
              System Prompt (function)
            </label>
            <input
              type="text"
              value={systemPrompt}
              onChange={(e) => setSystemPrompt(e.target.value)}
              className="w-full p-3 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all shadow-sm"
              placeholder="Enter system prompt..."
            />
          </div>

          {/* User Prompt (input) */}
          <div className="md:col-span-1">
            <label className="block font-semibold text-sm text-gray-700 mb-2">
              User Prompt (input)
            </label>
            <input
              type="text"
              value={userPrompt}
              onChange={(e) => setUserPrompt(e.target.value)}
              className="w-full p-3 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all shadow-sm"
              placeholder="Enter user prompt..."
            />
          </div>

          {/* Response (output) */}
          <div className="md:col-span-2">
            <label className="block font-semibold text-sm text-gray-700 mb-2">
              Response (output)
            </label>
            <input
              type="text"
              value={response}
              readOnly
              className="w-full p-3 border border-gray-300 rounded-lg text-sm shadow-inner bg-gray-50"
              placeholder="Response will appear here..."
            />
          </div>
        </div>

        {/* Generate Button */}
        <div className="mt-4 flex justify-center">
          <button
            onClick={generateResponse}
            disabled={isGenerating}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg disabled:bg-blue-300 text-sm font-medium hover:bg-blue-700 transition-colors shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
          >
            {isGenerating ? (
              <span className="flex items-center">
                <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Generating...
              </span>
            ) : 'Generate Output'}
          </button>
        </div>

        {/* Error message */}
        {error && (
          <div className="mt-2 text-center">
            <p className="text-red-500 text-xs">{error}</p>
          </div>
        )}
      </div>
      <figcaption className="text-center text-sm text-gray-500 mt-2">
        A simple demonstration of the system/user prompt relationship using gpt-4o-mini
      </figcaption>
    </figure>
  );
};

export default SystemPromptAsAFunction;
