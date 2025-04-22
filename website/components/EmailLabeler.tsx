import React, { useState } from 'react';

const DEFAULT_SYSTEM_PROMPT = `You are an email labeling assistant. For each email, analyze it and take the appropriate action.

If the email is:
from family: 
  label: Personal, red, 0
from my boss Garry: 
  label: YC, orange, 1
from anyone else with an @yc.com addr: 
  label: YC, orange, 2
from a founder (NOT @yc.com): 
  label: Founders, blue, 2
tech-related, e.g. a forum digest: 
  label: Tech, gray, 3
trying to sell me something:
  label: Spam, black, 5
  archive
`;

const DEFAULT_TOOLS = `You have access to the following tools:

labelEmail: Use this tool to label an email with a specific category, color, and priority level.
Arguments: { "label": string, "color": string, "priority": number }

archiveEmail: Use this tool to archive an email that doesn't need to be labeled.
Arguments: None

draftReply: Use this tool to draft a reply to the email.
Arguments: { "body": string }

You MUST respond using only these tools. Do not respond with plain text or explanations.
You can use any combination of these tools in your response.

Example usage for a single tool:
<tool>labelEmail({"label": "Personal", "color": "red", "priority": 0})</tool>
OR
<tool>archiveEmail()</tool>
OR
<tool>draftReply({"body": "Thanks for letting me know. I'll be there on Wednesday."})</tool>

Example usage for multiple tools:
<tool>labelEmail({"label": "YC", "color": "orange", "priority": 1})</tool>
<tool>draftReply({"body": "Hi Garry, Wednesday works for me. Looking forward to our walk."})</tool>
`;

interface Label {
  label: string;
  color: string;
  priority: number;
}

interface Email {
  id: number;
  sender: string;
  senderEmail: string;
  subject: string;
  receiver: string;
  body: string;
  type: 'newsletter' | 'sales' | 'boss' | 'colleague' | 'personal';
  label?: Label;
  archived?: boolean;
  draftReply?: string;
}

const generateEmails = (): Email[] => {
  const emails: Email[] = [];
  
  // Tech newsletters
  for (let i = 0; i < 3; i++) {
    emails.push({
      id: emails.length,
      sender: ['TechCrunch Weekly', 'HackerNews Digest', 'The Verge Updates'][i],
      senderEmail: ['newsletter@techcrunch.com', 'digest@hackernews.com', 'updates@theverge.com'][i],
      subject: [
        'This Week in Tech: AI Developments and Market Trends',
        'Top Stories: New Programming Languages on the Rise',
        'Latest Product Launches and Industry News'
      ][i],
      receiver: 'pete@yc.com',
      body: [
        'In this week\'s roundup, we cover the latest AI research breakthroughs, funding rounds for tech startups, and upcoming developer conferences. Plus, our analysis of changing market trends in cloud computing.',
        'This digest features discussions on emerging programming languages, open-source project highlights, and technical deep dives. Our featured story explores scalability challenges in distributed systems.',
        'Explore the newest gadgets hitting the market, in-depth product reviews, and exclusive interviews with industry leaders on the future of technology.'
      ][i],
      type: 'newsletter'
    });
  }
  
  // Sales emails
  for (let i = 0; i < 4; i++) {
    emails.push({
      id: emails.length,
      sender: [
        'Sarah from SaaS Solutions',
        'Mark at Enterprise Tools',
        'DevOps Pro Team',
        'DataAnalytics Plus'
      ][i],
      senderEmail: [
        'sarah@saassolutions.com',
        'mark@enterprisetools.com',
        'team@devopspro.io',
        'sales@dataanalytics.com'
      ][i],
      subject: [
        'Exclusive Offer for New Customers',
        'Transform Your Workflow with Our Platform',
        'Security Solutions for Growing Companies',
        'Special Pricing on Data Analytics Tools'
      ][i],
      receiver: 'pete@yc.com',
      body: [
        'Hope this email finds you well! I noticed your company has been growing rapidly, and I wanted to share how our platform can help streamline your operations. Our clients typically see a 40% increase in productivity within just 3 months. Would you be available for a quick demo next week?',
        'I\'m reaching out because our solution specifically addresses the challenges companies like yours face. We\'ve worked with similar organizations who have seen significant ROI after implementing our tools. I\'d love to schedule a brief call to discuss how we can help.',
        'With increasing security threats targeting businesses, we\'ve developed a comprehensive solution that provides real-time monitoring and threat detection. Based on your company profile, I believe our enterprise package would be a perfect fit. Can we connect for 15 minutes this Thursday?',
        'Our analytics platform has helped companies like yours extract meaningful insights from their data, leading to better decision-making and strategic planning. We\'re offering a limited-time discount for new clients. Let me know if you\'d like to see a personalized demo!'
      ][i],
      type: 'sales'
    });
  }
  
  // Boss email
  emails.push({
    id: emails.length,
    sender: 'Garry Tan',
    senderEmail: 'garry@yc.com',
    subject: 'reschedule',
    receiver: 'pete@yc.com',
    body: 'Pete, let\'s move our 1on1 to wednesday next week. Maybe we can use the time to go for a walk?',
    type: 'boss'
  });
  
  // Colleague email
  emails.push({
    id: emails.length,
    sender: 'Gustaf Alströmer',
    senderEmail: 'gustaf@yc.com',
    subject: 'founder intro?',
    receiver: 'pete@yc.com',
    body: "Hey Pete, I\'m working with a couple founders this batch that I think you\'d enjoy meeting. Can I make an intro?",
    type: 'colleague'
  });
  
  // Personal email
  emails.push({
    id: emails.length,
    sender: 'Sumana',
    senderEmail: 'sumana@gmail.com',
    subject: 'dinner tonight',
    receiver: 'pete@yc.com',
    body: 'Hi love, just checking if we\'re still on for dinner at that new place tonight? Also, my parents confirmed they can visit next weekend. We should plan some activities - maybe that hiking trail we talked about? Let me know when you\'ll be home today. Love you!',
    type: 'personal'
  });
  
  // Founder emails
  emails.push({
    id: emails.length,
    sender: 'Alex Chen',
    senderEmail: 'alex@neuralstack.ai',
    subject: 'advice on fundraising',
    receiver: 'pete@yc.com',
    body: 'Hi Pete, Hope you\'re doing well! We\'re preparing for our Series A, and I wanted to get your thoughts on our fundraising strategy. Our AI platform for code generation has strong traction with 140% MoM growth, but we\'re debating whether to focus on scaling enterprise customers or expanding our developer tools first. Could we chat briefly this week? Thanks, Alex',
    type: 'colleague'
  });

  emails.push({
    id: emails.length,
    sender: 'Maya Rodriguez',
    senderEmail: 'maya@carbo.earth',
    subject: 'Technical co-founder?',
    receiver: 'pete@yc.com',
    body: 'Hey Pete, I\'m struggling to find the right technical co-founder for my climate tech startup. We\'re building carbon capture technology that\'s showing promising early results in our lab tests. Gustaf mentioned you might know some engineers with hardware experience who could be interested. Would you be open to making some introductions? I can share more details about what we\'re looking for. Thanks! Maya',
    type: 'colleague'
  });

  // Shuffle the emails
  return emails.sort(() => Math.random() - 0.5);
};

const EmailLabeler: React.FC = () => {
  const [systemPrompt, setSystemPrompt] = useState<string>(DEFAULT_SYSTEM_PROMPT);
  const [tools, setTools] = useState<string>(DEFAULT_TOOLS);
  const [emails, setEmails] = useState<Email[]>(generateEmails());
  const [expandedEmailId, setExpandedEmailId] = useState<number | null>(null);
  const [isLabeling, setIsLabeling] = useState<boolean>(false);
  const [labelingProgress, setLabelingProgress] = useState<number>(0);
  
  const handleEmailClick = (id: number) => {
    setExpandedEmailId(expandedEmailId === id ? null : id);
  };
  
  const truncateText = (text: string, maxLength: number = 40) => {
    return text.length > maxLength ? text.substring(0, maxLength) + '...' : text;
  };
  
  const labelEmails = async () => {
    if (!systemPrompt.trim()) {
      alert('Please enter a system prompt for the email reading agent.');
      return;
    }
    
    setIsLabeling(true);
    setLabelingProgress(0);
    // Clear existing labels from inbox view when reading starts
    setEmails(currentEmails => currentEmails.map(email => ({ ...email, label: undefined })));
    
    // Process emails one by one and update the UI immediately when each receives its label
    for (let i = 0; i < emails.length; i++) {
      const email = emails[i];
      
      try {
        // Construct the email content
        const emailContent = `
From: ${email.sender} <${email.senderEmail}>
To: ${email.receiver}
Subject: ${email.subject}

${email.body}
        `;
        
        // Make a call to the llm.koomen.dev API using ChatGPT format
        const response = await fetch('https://llm.koomen.dev/v1/chat/completions', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            model: 'gpt-4o-mini',
            messages: [
              { 
                role: 'system', 
                content: `${systemPrompt}\n\n${tools}`
              },
              { 
                role: 'user', 
                content: emailContent 
              }
            ],
            stream: false,
          }),
        });
        
        if (response.ok) {
          const result = await response.json();
          // Extract the content from the response
          const content = result.choices[0]?.message?.content;
          
          if (content) {
            try {
              // Find all tool calls in the response
              const labelEmailRegex = /<tool>labelEmail\((.*?)\)<\/tool>/g;
              const archiveEmailRegex = /<tool>archiveEmail\(\)<\/tool>/g;
              const draftReplyRegex = /<tool>draftReply\((.*?)\)<\/tool>/g;
              
              // Extract all tool calls
              const labelMatches = [...content.matchAll(labelEmailRegex)];
              const archiveMatch = content.match(archiveEmailRegex);
              const draftReplyMatches = [...content.matchAll(draftReplyRegex)];
              
              // Handle multiple tool calls
              if (labelMatches.length > 0 || archiveMatch || draftReplyMatches.length > 0) {
                // Start with the email as is
                let updatedEmail = { ...emails[i] };
                
                // Apply label if present (use the first label if multiple are provided)
                if (labelMatches.length > 0 && labelMatches[0][1]) {
                  try {
                    const labelData: Label = JSON.parse(labelMatches[0][1]);
                    updatedEmail = { ...updatedEmail, label: labelData };
                  } catch (labelError) {
                    console.error('Error parsing label data:', labelError);
                  }
                }
                
                // Apply archive if present
                if (archiveMatch) {
                  updatedEmail = { ...updatedEmail, archived: true };
                }
                
                // Apply draft reply if present (use the first draft if multiple are provided)
                if (draftReplyMatches.length > 0 && draftReplyMatches[0][1]) {
                  try {
                    const draftData = JSON.parse(draftReplyMatches[0][1]);
                    if (draftData && draftData.body) {
                      updatedEmail = { ...updatedEmail, draftReply: draftData.body };
                    }
                  } catch (draftError) {
                    console.error('Error parsing draft reply data:', draftError);
                  }
                }
                
                // Update the email with all changes
                setEmails(currentEmails => {
                  const updatedEmails = [...currentEmails];
                  updatedEmails[i] = updatedEmail;
                  return updatedEmails;
                });
              } else {
                console.error('No valid tool calls found in response:', content);
              }
            } catch (parseError) {
              console.error('Error parsing tool response:', parseError);
            }
          }
        }
      } catch (error) {
        console.error('Error labeling email:', error);
      }
      
      // Update progress after each email
      setLabelingProgress(((i + 1) / emails.length) * 100);
    }
    
    setIsLabeling(false);
  };
  
  // Filter out archived emails and sort by priority
  const sortedEmails = [...emails]
    .filter(email => !email.archived) // Filter out archived emails
    .sort((a, b) => {
      // Put labeled emails above unlabeled emails
      if (a.label && !b.label) return -1;
      if (!a.label && b.label) return 1;
      
      // If both emails have labels, sort by priority (highest first)
      if (a.label && b.label) {
        return a.label.priority - b.label.priority;
      }
      
      // If neither have labels, maintain original order
      return 0;
    });

  return (
    <div className="mx-auto max-w-6xl p-4">
      <div className="border rounded-lg p-6 shadow-sm bg-white">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:items-start">
          {/* Left Side: Email Reading Agent, Tools, and Button */}
          <div className="flex flex-col h-full">
            {/* System Prompt */}
            <div className="mb-4 flex-grow">
              <label className="block font-semibold text-sm text-gray-700 mb-2">Email Reading Agent System Prompt</label>
              <textarea
                className="w-full p-3 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all font-mono mb-2"
                value={systemPrompt}
                onChange={(e) => setSystemPrompt(e.target.value)}
                placeholder="Enter your system prompt for the email reading agent..."
                disabled={isLabeling}
                style={{ height: '400px' }}
                autoComplete="off"
              />
            </div>
            
            {/* Tools Display */}
            <div className="mb-4">
              <label className="block font-semibold text-sm text-gray-700 mb-2">Available Tools</label>
              <div className="space-y-2">
                <div className="p-3 border border-gray-200 rounded-lg bg-gray-50">
                  <code className="text-sm text-gray-800 font-mono">labelEmail(label, color, priority)</code>
                </div>
                <div className="p-3 border border-gray-200 rounded-lg bg-gray-50">
                  <code className="text-sm text-gray-800 font-mono">archiveEmail()</code>
                </div>
                <div className="p-3 border border-gray-200 rounded-lg bg-gray-50">
                  <code className="text-sm text-gray-800 font-mono">draftReply(body)</code>
                </div>
              </div>
              {/* Hidden Tools Configuration */}
              <div className="hidden">
                <textarea
                  value={tools}
                  onChange={(e) => setTools(e.target.value)}
                  disabled={isLabeling}
                />
              </div>
            </div>
            
            {/* Read Emails Button */}
            <div>
              <button
                className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg disabled:bg-blue-300 text-sm font-medium hover:bg-blue-700 transition-colors shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 h-12"
                onClick={labelEmails}
                disabled={isLabeling}
              >
                {isLabeling ? (
                  <span className="flex items-center justify-center">
                    <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Reading Emails...
                  </span>
                ) : 'Read Emails'}
              </button>
              
              {isLabeling && (
                <div className="mt-2">
                  <div className="w-full bg-gray-200 rounded-full h-2.5">
                    <div 
                      className="bg-blue-600 h-2.5 rounded-full" 
                      style={{ width: `${labelingProgress}%` }}
                    ></div>
                  </div>
                  <p className="text-sm text-gray-600 mt-1">
                    {Math.round(labelingProgress)}% complete
                  </p>
                </div>
              )}
            </div>
          </div>
          
          {/* Right Side: Email Inbox */}
          <div className="flex flex-col">
            <label className="block font-semibold text-sm text-gray-700 mb-2">
              Email Inbox ({sortedEmails.length})
            </label>
            <div className="border border-gray-300 rounded-lg shadow-inner bg-gray-50" style={{ height: 'auto', minHeight: sortedEmails.length === 0 ? '100px' : 'auto' }}>
              {sortedEmails.map((email) => (
                <div key={email.id} className="border-b last:border-b-0">
                  <div 
                    className="py-1.5 px-3 cursor-pointer hover:bg-white flex justify-between items-center transition-colors"
                    onClick={() => handleEmailClick(email.id)}
                  >
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-0.5">
                        <div>
                          <span className="font-medium text-sm">{email.sender}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          {email.label && (
                            <>
                              <span 
                                className="px-1.5 py-0.5 text-xs rounded-full text-xs shadow-sm" 
                                style={{ 
                                  backgroundColor: email.label.color,
                                  color: ['white', 'yellow', 'lime', 'cyan'].includes(email.label.color) ? 'black' : 'white'
                                }}
                              >
                                {email.label.label}
                              </span>
                              <span className="text-xs text-gray-500">
                                P{email.label.priority}
                              </span>
                            </>
                          )}
                          {email.draftReply && (
                            <span className="text-xs font-medium text-red-500 ml-1">
                              draft
                            </span>
                          )}
                        </div>
                      </div>
                      <p className="text-xs text-gray-600">{truncateText(email.subject)}</p>
                    </div>
                    <div className="text-gray-400 ml-2 text-xs">
                      {expandedEmailId === email.id ? '▼' : '▶'}
                    </div>
                  </div>
                  
                  {expandedEmailId === email.id && (
                    <div className="py-2 px-3 bg-white border-t text-sm">
                      <div className="mb-1">
                        <p><strong>From:</strong> {email.sender} &lt;{email.senderEmail}&gt;</p>
                        <p><strong>To:</strong> {email.receiver}</p>
                        <p><strong>Subject:</strong> {email.subject}</p>
                      </div>
                      <div className="border-t pt-1 mt-1">
                        <p className="whitespace-pre-line">{email.body}</p>
                      </div>
                      
                      {email.draftReply && (
                        <div className="mt-3 pt-3 border-t border-dashed border-gray-300">
                          <div className="flex items-center mb-1">
                            <span className="text-xs font-medium bg-red-100 text-red-600 px-2 py-0.5 rounded-sm">DRAFT REPLY</span>
                          </div>
                          <div className="bg-gray-50 p-2 rounded-md border border-gray-200">
                            <p className="whitespace-pre-line text-gray-700">{email.draftReply}</p>
                          </div>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              ))}
            </div>
            
            {/* Archived Emails Section - Only shown when there are archived emails */}
            {emails.filter(email => email.archived).length > 0 && (
              <div className="mt-4">
                <label className="block font-semibold text-sm text-gray-700 mb-2">
                  Archived Emails ({emails.filter(email => email.archived).length})
                </label>
                <div className="border border-gray-300 rounded-lg shadow-inner bg-gray-100" style={{ height: 'auto' }}>
                  {emails
                    .filter(email => email.archived)
                    .map((email) => (
                      <div key={email.id} className="border-b last:border-b-0 bg-gray-50/50">
                        <div 
                          className="py-1.5 px-3 cursor-pointer hover:bg-white/70 flex justify-between items-center transition-colors"
                          onClick={() => handleEmailClick(email.id)}
                        >
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-0.5">
                              <div>
                                <span className="font-medium text-sm text-gray-600">{email.sender}</span>
                              </div>
                              <div className="flex items-center gap-1">
                                <span className="text-xs px-1.5 py-0.5 bg-gray-200 text-gray-600 rounded-full">Archived</span>
                                {email.draftReply && (
                                  <span className="text-xs font-medium text-red-500">
                                    draft
                                  </span>
                                )}
                              </div>
                            </div>
                            <p className="text-xs text-gray-500">{truncateText(email.subject)}</p>
                          </div>
                          <div className="text-gray-400 ml-2 text-xs">
                            {expandedEmailId === email.id ? '▼' : '▶'}
                          </div>
                        </div>
                        
                        {expandedEmailId === email.id && (
                          <div className="py-2 px-3 bg-white border-t text-sm">
                            <div className="mb-1">
                              <p><strong>From:</strong> {email.sender} &lt;{email.senderEmail}&gt;</p>
                              <p><strong>To:</strong> {email.receiver}</p>
                              <p><strong>Subject:</strong> {email.subject}</p>
                            </div>
                            <div className="border-t pt-1 mt-1">
                              <p className="whitespace-pre-line">{email.body}</p>
                            </div>
                            
                            {email.draftReply && (
                              <div className="mt-3 pt-3 border-t border-dashed border-gray-300">
                                <div className="flex items-center mb-1">
                                  <span className="text-xs font-medium bg-red-100 text-red-600 px-2 py-0.5 rounded-sm">DRAFT REPLY</span>
                                </div>
                                <div className="bg-gray-50 p-2 rounded-md border border-gray-200">
                                  <p className="whitespace-pre-line text-gray-700">{email.draftReply}</p>
                                </div>
                              </div>
                            )}
                          </div>
                        )}
                      </div>
                    ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default EmailLabeler;