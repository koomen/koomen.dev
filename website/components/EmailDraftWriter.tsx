import React, { useState, useRef, useEffect } from 'react';
import OpenAI from 'openai';
import { getOpenAIKey } from './OpenAIKeyInput';

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
}

const EmailDraftWriter: React.FC<EmailDraftWriterProps> = ({
  defaultSystemPrompt = 'You are an expert email writer. Write a professional, concise, and effective email based on the user\'s request.',
  defaultUserPrompt = '',
  showSystemPrompt = true
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
        setSelectedSystemPromptKey(Object.keys(defaultSystemPrompt)[0]);
        setSystemPrompt(options[0].text);
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
        setSelectedUserPromptKey(Object.keys(defaultUserPrompt)[0]);
        setUserPrompt(options[0].text);
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
  
  const openaiClient = useRef<OpenAI | null>(null);

  const generateDraft = async () => {

    if (!openaiClient.current) {
      openaiClient.current = new OpenAI({
        apiKey: "NOTUSED",
        baseURL: "https://llm.koomen.dev",
        dangerouslyAllowBrowser: true
      });
    }

    if (!userPrompt.trim()) {
      setError('Please enter a user prompt.');
      return;
    }

    setError(null);
    setIsGenerating(true);
    setEmailDraft('');

    try {
      const stream = await openaiClient.current.chat.completions.create({
        model: 'gpt-4o-mini',
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: userPrompt }
        ],
        stream: true,
      });

      for await (const chunk of stream) {
        const content = chunk.choices[0]?.delta?.content || '';
        setEmailDraft((prev) => prev + content);
      }
    } catch (err) {
      console.error('Error generating email draft:', err);
      setError('Error generating email draft. Please check your API key and try again.');
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="mx-auto max-w-6xl p-4">
      <div className="border rounded-lg p-6">
        {showSystemPrompt ? (
          /* Two-column layout with system prompt */
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Left Column: System Prompt, User Prompt, and Generate Button */}
            <div className="flex flex-col h-full">
              {/* System Prompt */}
              <div className="mb-2 flex-grow">
                <div className="flex items-center mb-1">
                  <label className="font-medium text-sm mr-2">System Prompt</label>
                  {systemPromptOptions.length > 1 && (
                    <div className="flex gap-1 text-xs">
                      {systemPromptOptions.map((option) => (
                        <button
                          key={option.label}
                          onClick={() => selectSystemPrompt(option.label)}
                          className={`px-2 py-0.5 rounded ${
                            selectedSystemPromptKey === option.label.toLowerCase()
                              ? 'bg-blue-600 text-white'
                              : 'bg-gray-200 hover:bg-gray-300'
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
                  className="w-full h-80 p-2 border rounded-lg text-sm"
                  placeholder="Enter your system prompt here..."
                />
              </div>
              
              {/* User Prompt */}
              <div className="mb-2">
                <div className="flex items-center mb-1">
                  <label className="font-medium text-sm mr-2">User Prompt</label>
                  {userPromptOptions.length > 1 && (
                    <div className="flex gap-1 text-xs">
                      {userPromptOptions.map((option) => (
                        <button
                          key={option.label}
                          onClick={() => selectUserPrompt(option.label)}
                          className={`px-2 py-0.5 rounded ${
                            selectedUserPromptKey === option.label.toLowerCase()
                              ? 'bg-blue-600 text-white'
                              : 'bg-gray-200 hover:bg-gray-300'
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
                  className="w-full h-20 p-2 border rounded-lg mb-1 text-sm"
                  placeholder="Example: Write an email to my boss asking for time off next Friday"
                  rows={5}
                />
              </div>
              
              {/* Generate Button */}
              <div className="mb-1">
                <button
                  onClick={generateDraft}
                  disabled={isGenerating}
                  className="px-3 py-1.5 bg-blue-600 text-white rounded-lg disabled:bg-blue-300 text-sm"
                >
                  {isGenerating ? 'Generating...' : 'Generate Draft'}
                </button>
                
                {error && <p className="text-red-500 text-xs mt-1">{error}</p>}
              </div>
            </div>

            {/* Right Column: Email Draft */}
            <div className="flex flex-col h-full">
              <label className="block font-medium text-sm mb-1">Email Draft</label>
              
              {/* Draft Output Area */}
              <div 
                className="flex-grow min-h-[28rem] p-2 border rounded-lg whitespace-pre-wrap text-sm"
                style={{ backgroundColor: '#f9f9f9' }}
              >
                {emailDraft || <span className="text-gray-400">Your generated email will appear here...</span>}
              </div>
            </div>
          </div>
        ) : (
          /* Single-column layout without system prompt */
          <div className="flex flex-col w-full max-w-3xl mx-auto">
            {/* Email Draft */}
            <div className="mb-4">
              <label className="block font-medium text-sm mb-1">Email Draft</label>
              <div 
                className="w-full min-h-[24rem] p-2 border rounded-lg whitespace-pre-wrap text-sm"
                style={{ backgroundColor: '#f9f9f9' }}
              >
                {emailDraft || <span className="text-gray-400">Your generated email will appear here...</span>}
              </div>
            </div>
            
            {/* User Prompt */}
            <div className="mb-3">
              <div className="flex items-center mb-1">
                <label className="font-medium text-sm mr-2">Your Request</label>
                {userPromptOptions.length > 1 && (
                  <div className="flex gap-1 text-xs">
                    {userPromptOptions.map((option) => (
                      <button
                        key={option.label}
                        onClick={() => selectUserPrompt(option.label)}
                        className={`px-2 py-0.5 rounded ${
                          selectedUserPromptKey === option.label.toLowerCase()
                            ? 'bg-blue-600 text-white'
                            : 'bg-gray-200 hover:bg-gray-300'
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
                className="w-full p-2 border rounded-lg mb-1 text-sm"
                placeholder="Example: Write an email to my boss asking for time off next Friday"
                rows={3}
              />
            </div>
            
            {/* Generate Button */}
            <div>
              <button
                onClick={generateDraft}
                disabled={isGenerating}
                className="px-3 py-1.5 bg-blue-600 text-white rounded-lg disabled:bg-blue-300 text-sm"
              >
                {isGenerating ? 'Generating...' : 'Generate Draft'}
              </button>
              
              {error && <p className="text-red-500 text-xs mt-1">{error}</p>}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default EmailDraftWriter;
