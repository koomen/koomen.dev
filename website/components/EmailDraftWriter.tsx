import React, { useState, useEffect } from 'react';

type SystemPromptOption = {
  label: string;
  text: string;
};

type SystemPromptMap = {
  [key: string]: string;
};

interface EmailDraftWriterProps {
  defaultSystemPrompt?: string | SystemPromptMap;
  defaultUserPrompt?: string | SystemPromptMap;
  showSystemPrompt?: boolean;
  caption?: string;
}

const EmailDraftWriter: React.FC<EmailDraftWriterProps> = ({
  defaultSystemPrompt = 'You are an expert email writer. Write a professional, concise, and effective email based on the user\'s request.',
  defaultUserPrompt = '',
  showSystemPrompt = true,
  caption
}) => {
  // Process system prompts
  const [systemPromptOptions, setSystemPromptOptions] = useState<SystemPromptOption[]>([]);
  const [selectedSystemPromptKey, setSelectedSystemPromptKey] = useState<string>('default');
  const [systemPrompt, setSystemPrompt] = useState('');
  
  // Process user prompts
  const [userPromptOptions, setUserPromptOptions] = useState<SystemPromptOption[]>([]);
  const [selectedUserPromptKey, setSelectedUserPromptKey] = useState<string>('default');
  const [userPrompt, setUserPrompt] = useState('');
  
  const [emailDraft, setEmailDraft] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  // Initialize system prompts
  useEffect(() => {
    if (typeof defaultSystemPrompt === 'string') {
      setSystemPrompt(defaultSystemPrompt);
      setSystemPromptOptions([{ label: 'Default', text: defaultSystemPrompt }]);
    } else {
      const options: SystemPromptOption[] = [];
      for (const [key, value] of Object.entries(defaultSystemPrompt)) {
        options.push({
          label: key.charAt(0).toUpperCase() + key.slice(1), // Capitalize first letter
          text: value
        });
      }
      
      if (options.length > 0) {
        setSystemPromptOptions(options);
        
        // Check if "Original" exists in the options and select it by default
        const originalOption = options.find(opt => opt.label === 'Original');
        if (originalOption) {
          setSelectedSystemPromptKey('original');
          setSystemPrompt(originalOption.text);
        } else {
          setSelectedSystemPromptKey(Object.keys(defaultSystemPrompt)[0].toLowerCase());
          setSystemPrompt(options[0].text);
        }
      } else {
        const defaultText = 'You are an expert email writer. Write a professional, concise, and effective email based on the user\'s request.';
        setSystemPromptOptions([{ label: 'Default', text: defaultText }]);
        setSystemPrompt(defaultText);
      }
    }
  }, [defaultSystemPrompt]);
  
  // Initialize user prompts
  useEffect(() => {
    if (typeof defaultUserPrompt === 'string') {
      setUserPrompt(defaultUserPrompt);
      setUserPromptOptions([{ label: 'Default', text: defaultUserPrompt }]);
    } else {
      const options: SystemPromptOption[] = [];
      for (const [key, value] of Object.entries(defaultUserPrompt)) {
        options.push({
          label: key.charAt(0).toUpperCase() + key.slice(1), // Capitalize first letter
          text: value
        });
      }
      
      if (options.length > 0) {
        setUserPromptOptions(options);
        
        // Check if "Original" exists in the options and select it by default
        const originalOption = options.find(opt => opt.label === 'Original');
        if (originalOption) {
          setSelectedUserPromptKey('original');
          setUserPrompt(originalOption.text);
        } else {
          setSelectedUserPromptKey(Object.keys(defaultUserPrompt)[0].toLowerCase());
          setUserPrompt(options[0].text);
        }
      } else {
        setUserPromptOptions([{ label: 'Default', text: '' }]);
        setUserPrompt('');
      }
    }
  }, [defaultUserPrompt]);
  
  // Handle system prompt selection
  const selectSystemPrompt = (optionLabel: string) => {
    const option = systemPromptOptions.find(opt => opt.label === optionLabel);
    if (option) {
      setSelectedSystemPromptKey(optionLabel.toLowerCase());
      setSystemPrompt(option.text);
    }
  };
  
  // Handle user prompt selection
  const selectUserPrompt = (optionLabel: string) => {
    const option = userPromptOptions.find(opt => opt.label === optionLabel);
    if (option) {
      setSelectedUserPromptKey(optionLabel.toLowerCase());
      setUserPrompt(option.text);
    }
  };

  const generateDraft = async () => {
    if (!userPrompt.trim()) {
      setError('Please enter a user prompt.');
      return;
    }

    setError(null);
    setIsGenerating(true);
    setEmailDraft('');

    try {
      const response = await fetch('https://llm.koomen.dev/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: 'gpt-4o-mini',
          messages: [
            { role: 'system', content: systemPrompt },
            { role: 'user', content: userPrompt }
          ],
          stream: true,
        }),
      });

      if (!response.ok) {
        throw new Error(`API request failed with status ${response.status}`);
      }

      const reader = response.body?.getReader();
      if (!reader) {
        throw new Error('Response body is not readable');
      }

      const decoder = new TextDecoder();
      let draftText = '';

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
              draftText += content;
              setEmailDraft(draftText);
            }
          } catch (e) {
            // Skip json parse errors for non-data lines
            console.error("JSON parse error:", e);
          }
        }
      }
      
      setIsGenerating(false);
    } catch (err) {
      console.error('Error generating draft:', err);
      setError(err instanceof Error ? err.message : 'An unknown error occurred');
      setIsGenerating(false);
    }
  };

  return (
    <figure className="mx-auto max-w-6xl p-4">
      <div className="border rounded-lg p-6 shadow-sm bg-white">
        {showSystemPrompt ? (
          /* Two-column layout with system prompt */
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Left Column: System Prompt, User Prompt, and Generate Button */}
            <div className="flex flex-col h-full">
              {/* System Prompt */}
              <div className="mb-4 flex-grow">
                <div className="mb-2">
                  <label className="font-semibold text-sm text-gray-700 block mb-1">System Prompt</label>
                  {systemPromptOptions.length > 1 && (
                    <div className="flex flex-wrap gap-1 text-xs mb-2">
                      {systemPromptOptions.map((option) => (
                        <button
                          key={option.label}
                          onClick={() => selectSystemPrompt(option.label)}
                          className={`px-2 py-0.5 rounded transition-colors ${
                            selectedSystemPromptKey === option.label.toLowerCase() ||
                            (option.label === 'Original' && selectedSystemPromptKey === 'default')
                              ? 'bg-blue-600 text-white shadow-sm'
                              : 'bg-gray-100 hover:bg-gray-200 text-gray-700'
                          }`}
                        >
                          {option.label}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
                <textarea
                  value={systemPrompt}
                  onChange={(e) => setSystemPrompt(e.target.value)}
                  className="w-full h-80 p-3 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                  placeholder="Enter your system prompt here..."
                />
              </div>
              
              {/* User Prompt */}
              <div className="mb-4">
                <div className="mb-2">
                  <label className="font-semibold text-sm text-gray-700 block mb-1">User Prompt</label>
                  {userPromptOptions.length > 1 && (
                    <div className="flex flex-wrap gap-1 text-xs mb-2">
                      {userPromptOptions.map((option) => (
                        <button
                          key={option.label}
                          onClick={() => selectUserPrompt(option.label)}
                          className={`px-2 py-0.5 rounded transition-colors ${
                            selectedUserPromptKey === option.label.toLowerCase() || 
                            (option.label === 'Original' && selectedUserPromptKey === 'default')
                              ? 'bg-blue-600 text-white shadow-sm'
                              : 'bg-gray-100 hover:bg-gray-200 text-gray-700'
                          }`}
                        >
                          {option.label}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
                <textarea
                  value={userPrompt}
                  onChange={(e) => setUserPrompt(e.target.value)}
                  className="w-full p-3 border border-gray-300 rounded-lg mb-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                  placeholder="Example: Write an email to my boss asking for time off next Friday"
                  rows={5}
                />
              </div>
              
              {/* Generate Button */}
              <div className="mb-2">
                <button
                  onClick={generateDraft}
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
                  ) : 'Generate Draft'}
                </button>
                
                {error && <p className="text-red-500 text-xs mt-2">{error}</p>}
              </div>
            </div>

            {/* Right Column: Email Draft */}
            <div className="flex flex-col h-full">
              <label className="block font-semibold text-sm text-gray-700 mb-2">Email Draft</label>
              
              {/* Draft Output Area */}
              <div 
                className="flex-grow min-h-[28rem] p-4 border border-gray-300 rounded-lg whitespace-pre-wrap text-sm shadow-inner bg-gray-50"
              >
                {emailDraft || <span className="text-gray-400 italic">Your generated email will appear here...</span>}
              </div>
            </div>
          </div>
        ) : (
          /* Single-column layout without system prompt */
          <div className="flex flex-col w-full max-w-3xl mx-auto">
            <div className="mb-5">
              {/* User Prompt Header */}
              <div className="mb-2">
                <label className="font-semibold text-sm text-gray-700 block mb-1">Your Request</label>
                {userPromptOptions.length > 1 && (
                  <div className="flex flex-wrap gap-1 text-xs mb-2">
                    {userPromptOptions.map((option) => (
                      <button
                        key={option.label}
                        onClick={() => selectUserPrompt(option.label)}
                        className={`px-2 py-0.5 rounded transition-colors ${
                          selectedUserPromptKey === option.label.toLowerCase() ||
                          (option.label === 'Original' && selectedUserPromptKey === 'default')
                            ? 'bg-blue-600 text-white shadow-sm'
                            : 'bg-gray-100 hover:bg-gray-200 text-gray-700'
                        }`}
                      >
                        {option.label}
                      </button>
                    ))}
                  </div>
                )}
              </div>
              
              {/* User Prompt */}
              <div className="mb-3">
                <textarea
                  value={userPrompt}
                  onChange={(e) => setUserPrompt(e.target.value)}
                  className="w-full p-3 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all shadow-sm"
                  placeholder="Example: Write an email to my boss asking for time off next Friday"
                  rows={3}
                />
              </div>
              
              {/* Generate Button */}
              <div>
                <button
                  onClick={generateDraft}
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
                  ) : 'Generate Draft'}
                </button>
                
                {error && <p className="text-red-500 text-xs mt-2">{error}</p>}
              </div>
            </div>
            
            {/* Email Draft */}
            <div className="mb-4">
              <label className="block font-semibold text-sm text-gray-700 mb-2">Email Draft</label>
              <div 
                className="w-full min-h-[24rem] p-4 border border-gray-300 rounded-lg whitespace-pre-wrap text-sm shadow-inner bg-gray-50"
              >
                {emailDraft || <span className="text-gray-400 italic">Your generated email will appear here...</span>}
              </div>
            </div>
          </div>
        )}
      </div>
      {caption && (
        <figcaption className="text-center text-sm text-gray-500 mt-2">
          {caption}
        </figcaption>
      )}
    </figure>
  );
};

export default EmailDraftWriter;
