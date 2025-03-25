import React, { useState, useRef, useEffect } from 'react';
import OpenAI from 'openai';
import { getOpenAIKey } from './OpenAIKeyInput';

interface EmailDraftWriterProps {
  defaultSystemPrompt?: string;
  defaultUserPrompt?: string;
}

const EmailDraftWriter: React.FC<EmailDraftWriterProps> = ({
  defaultSystemPrompt = 'You are an expert email writer. Write a professional, concise, and effective email based on the user\'s request.',
  defaultUserPrompt = ''
}) => {
  const [systemPrompt, setSystemPrompt] = useState(defaultSystemPrompt);
  const [userPrompt, setUserPrompt] = useState(defaultUserPrompt);
  const [emailDraft, setEmailDraft] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const openaiClient = useRef<OpenAI | null>(null);
  
  useEffect(() => {
    const apiKey = getOpenAIKey();
    if (apiKey) {
      openaiClient.current = new OpenAI({
        apiKey: apiKey,
        dangerouslyAllowBrowser: true // Needed for client-side usage
      });
    }
  }, []);

  const generateDraft = async () => {
    const apiKey = getOpenAIKey();
    if (!apiKey) {
      setError('OpenAI API key not found. Please add your API key first.');
      return;
    }

    if (!openaiClient.current) {
      openaiClient.current = new OpenAI({
        apiKey,
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
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* System Prompt Column */}
          <div>
            <label className="block font-medium text-sm mb-1">System Prompt</label>
            <textarea
              value={systemPrompt}
              onChange={(e) => setSystemPrompt(e.target.value)}
              className="w-full h-64 p-2 border rounded-lg text-sm"
              placeholder="Enter your system prompt here..."
            />
          </div>

          {/* Email Draft Column */}
          <div className="flex flex-col">
            <label className="block font-medium text-sm mb-1">Email Draft</label>
            
            {/* Draft Output Area */}
            <div 
              className="flex-grow min-h-[16rem] p-2 border rounded-lg mb-3 whitespace-pre-wrap text-sm"
              style={{ backgroundColor: '#f9f9f9' }}
            >
              {emailDraft || <span className="text-gray-400">Your generated email will appear here...</span>}
            </div>
            
            {/* User Prompt and Generate Button */}
            <div>
              <label className="block font-medium text-sm mb-1">User Prompt</label>
              <textarea
                value={userPrompt}
                onChange={(e) => setUserPrompt(e.target.value)}
                className="w-full p-2 border rounded-lg mb-2 text-sm"
                placeholder="Example: Write an email to my boss asking for time off next Friday"
                rows={3}
              />
              
              <div className="flex justify-between items-center">
                <button
                  onClick={generateDraft}
                  disabled={isGenerating}
                  className="px-3 py-1.5 bg-blue-600 text-white rounded-lg disabled:bg-blue-300 text-sm"
                >
                  {isGenerating ? 'Generating...' : 'Generate Draft'}
                </button>
                
                {error && <p className="text-red-500 text-xs">{error}</p>}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EmailDraftWriter;
