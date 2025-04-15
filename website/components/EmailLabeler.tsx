import React, { useState } from 'react';

const DEFAULT_PROMPT = `You are an email labeling assistant. For each email, analyze it and respond ONLY with a JSON object containing:
1. "label": A concise 1-2 word category for the email (e.g., "urgent", "newsletter", "spam", "personal", etc.)
2. "color": A CSS color name or hex code that represents this category (e.g., "red", "green", "blue", "#FF5733")
3. "priority": A number from 1-10 indicating how important this email is (10 being highest priority)

Your response must be valid JSON and contain nothing else - no explanations, no additional text.
Example response: {"label": "urgent", "color": "red", "priority": 9}

Here are the labels I'd like you to use. Use ONLY these labels, don't invent your own:

If it's from my boss Garry: YC, orange, priority 8-9
If it's from anyone else @yc.com: YC, orange, priority 6-7
If it's from my wife Sumana: Personal, pink, priority 10
If it's a tech-related email, e.g. a forum digest: Tech, gray, priority 3-5
If it's someone trying to sell me something: Spam, black, priority 1-2

Assign priority based on:
- Sender relationship to me (boss, colleague, wife, etc.)
- Urgency of the content
- Time sensitivity of any action needed
- Value of the information to me
`;

interface Label {
  label: string;
  color: string;
  priority: number;
}

interface Email {
  id: number;
  sender: string;
  subject: string;
  receiver: string;
  body: string;
  type: 'newsletter' | 'sales' | 'boss' | 'colleague' | 'personal';
  label?: Label;
}

const generateEmails = (): Email[] => {
  const emails: Email[] = [];
  
  // Tech newsletters
  for (let i = 0; i < 3; i++) {
    emails.push({
      id: emails.length,
      sender: ['TechCrunch Weekly', 'HackerNews Digest', 'The Verge Updates'][i],
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
    subject: 'reschedule',
    receiver: 'pete@yc.com',
    body: 'Pete, let\'s move our 1on1 to wednesday next week. Maybe we can use the time to go for a walk?',
    type: 'boss'
  });
  
  // Colleague email
  emails.push({
    id: emails.length,
    sender: 'Gustaf Alströmer',
    subject: 'founder intro?',
    receiver: 'pete@yc.com',
    body: "Hey Pete, I\'m working with a couple founders this batch that I think you\'d enjoy meeting. Can I make an intro?",
    type: 'colleague'
  });
  
  // Personal email
  emails.push({
    id: emails.length,
    sender: 'Sumana',
    subject: 'dinner tonight',
    receiver: 'pete@yc.com',
    body: 'Hi love, just checking if we\'re still on for dinner at that new place tonight? Also, my parents confirmed they can visit next weekend. We should plan some activities - maybe that hiking trail we talked about? Let me know when you\'ll be home today. Love you!',
    type: 'personal'
  });
  
  // Shuffle the emails
  return emails.sort(() => Math.random() - 0.5);
};

const EmailLabeler: React.FC = () => {
  const [prompt, setPrompt] = useState<string>(DEFAULT_PROMPT);
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
    if (!prompt.trim()) {
      alert('Please enter a prompt for the email reading agent.');
      return;
    }
    
    setIsLabeling(true);
    setLabelingProgress(0);
    
    // Process emails one by one and update the UI immediately when each receives its label
    for (let i = 0; i < emails.length; i++) {
      const email = emails[i];
      
      try {
        // Construct the email content
        const emailContent = `
From: ${email.sender}
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
                content: prompt
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
              // Parse the content as JSON
              const labelData: Label = JSON.parse(content);
              
              // Update this specific email with its label immediately
              setEmails(currentEmails => {
                const updatedEmails = [...currentEmails];
                updatedEmails[i] = { ...updatedEmails[i], label: labelData };
                return updatedEmails;
              });
            } catch (jsonError) {
              console.error('Error parsing JSON response:', jsonError);
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
  
  // Sort emails by priority (labeled emails first, then by priority value)
  const sortedEmails = [...emails].sort((a, b) => {
    // Put labeled emails above unlabeled emails
    if (a.label && !b.label) return -1;
    if (!a.label && b.label) return 1;
    
    // If both emails have labels, sort by priority (highest first)
    if (a.label && b.label) {
      return b.label.priority - a.label.priority;
    }
    
    // If neither have labels, maintain original order
    return 0;
  });

  return (
    <div className="flex flex-col md:flex-row gap-6 my-6 border rounded-lg p-4">
      <div className="md:w-1/2 flex flex-col">
        <h3 className="text-lg font-medium mb-3">
          Email Reading Agent Prompt
        </h3>
        <textarea
          className="w-full p-2 border rounded-md flex-grow font-mono text-xs min-h-[350px]"
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          placeholder="Enter your prompt for the email reading agent..."
          disabled={isLabeling}
        />
        
        <div className="mt-auto pt-4">
          <button
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50"
            onClick={labelEmails}
            disabled={isLabeling}
          >
            {isLabeling ? 'Labeling Emails...' : 'Label Emails'}
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
      
      <div className="md:w-1/2">
        <h3 className="text-lg font-medium mb-3">Email Inbox (10)</h3>
        <div className="border rounded-md overflow-hidden">
          {sortedEmails.map((email) => (
            <div key={email.id} className="border-b last:border-b-0">
              <div 
                className="py-1.5 px-2 cursor-pointer hover:bg-gray-50 flex justify-between items-center"
                onClick={() => handleEmailClick(email.id)}
              >
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-0.5">
                    <span className="font-medium text-sm">{email.sender}</span>
                    {email.label && (
                      <div className="flex items-center gap-1">
                        <span 
                          className="px-1.5 py-0.5 text-xs rounded-full text-xs" 
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
                      </div>
                    )}
                  </div>
                  <p className="text-xs text-gray-600">{truncateText(email.subject)}</p>
                </div>
                <div className="text-gray-400 ml-2 text-xs">
                  {expandedEmailId === email.id ? '▼' : '▶'}
                </div>
              </div>
              
              {expandedEmailId === email.id && (
                <div className="py-2 px-3 bg-gray-50 border-t text-xs">
                  <div className="mb-1">
                    <p><strong>From:</strong> {email.sender}</p>
                    <p><strong>To:</strong> {email.receiver}</p>
                    <p><strong>Subject:</strong> {email.subject}</p>
                  </div>
                  <div className="border-t pt-1 mt-1">
                    <p className="whitespace-pre-line">{email.body}</p>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default EmailLabeler;