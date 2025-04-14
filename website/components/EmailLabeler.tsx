import React, { useState } from 'react';

interface Label {
  label: string;
  color: string;
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
    subject: 'Quarterly Review Meeting',
    receiver: 'pete@yc.com',
    body: 'Pete, let\'s schedule the quarterly review for next week. I\'d like to go over our progress on the new initiatives and discuss resource allocation for the upcoming projects. Please come prepared with the latest metrics and team performance reports. Looking forward to seeing where we stand.',
    type: 'boss'
  });
  
  // Colleague email
  emails.push({
    id: emails.length,
    sender: 'Gustaf Alströmer',
    subject: 'Feedback on the product roadmap',
    receiver: 'pete@yc.com',
    body: 'Hey Pete, I\'ve reviewed the product roadmap and have a few thoughts on the prioritization. I think we should consider moving up the API improvements given the feedback from our enterprise customers. Could we discuss this before the team meeting on Thursday? I\'ve also added some comments directly to the document.',
    type: 'colleague'
  });
  
  // Personal email
  emails.push({
    id: emails.length,
    sender: 'Sumana',
    subject: 'Weekend plans and dinner tonight',
    receiver: 'pete@yc.com',
    body: 'Hi love, just checking if we\'re still on for dinner at that new place tonight? Also, my parents confirmed they can visit next weekend. We should plan some activities - maybe that hiking trail we talked about? Let me know when you\'ll be home today. Love you!',
    type: 'personal'
  });
  
  // Shuffle the emails
  return emails.sort(() => Math.random() - 0.5);
};

const EmailLabeler: React.FC = () => {
  const [prompt, setPrompt] = useState<string>('');
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
    
    const updatedEmails = [...emails];
    
    for (let i = 0; i < updatedEmails.length; i++) {
      const email = updatedEmails[i];
      
      try {
        // Construct the prompt with email content
        const emailContent = `
From: ${email.sender}
To: ${email.receiver}
Subject: ${email.subject}

${email.body}
        `;
        
        const fullPrompt = `${prompt}\n\n${emailContent}`;
        
        // Make a call to the llm.koomen.dev API
        const response = await fetch('https://llm.koomen.dev', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            prompt: fullPrompt,
          }),
        });
        
        if (response.ok) {
          const result: Label = await response.json();
          updatedEmails[i] = { ...email, label: result };
        }
      } catch (error) {
        console.error('Error labeling email:', error);
      }
      
      // Update progress
      setLabelingProgress((i + 1) / updatedEmails.length * 100);
    }
    
    setEmails(updatedEmails);
    setIsLabeling(false);
  };
  
  return (
    <div className="flex flex-col md:flex-row gap-6 my-6 border rounded-lg p-4">
      <div className="md:w-1/2">
        <label className="block text-sm font-medium mb-2">
          Email Reading Agent Prompt
        </label>
        <textarea
          className="w-full p-2 border rounded-md h-64 font-mono text-sm"
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          placeholder="Enter your prompt for the email reading agent..."
          disabled={isLabeling}
        />
        
        <div className="mt-4">
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
          {emails.map((email) => (
            <div key={email.id} className="border-b last:border-b-0">
              <div 
                className="p-3 cursor-pointer hover:bg-gray-50 flex justify-between items-center"
                onClick={() => handleEmailClick(email.id)}
              >
                <div className="flex-1">
                  <span className="font-medium">{email.sender}</span>
                  <div className="flex items-center">
                    <p className="text-sm text-gray-600 mr-2">{truncateText(email.subject)}</p>
                    {email.label && (
                      <span 
                        className="px-2 py-1 text-xs rounded-full" 
                        style={{ 
                          backgroundColor: email.label.color,
                          color: ['white', 'yellow', 'lime', 'cyan'].includes(email.label.color) ? 'black' : 'white'
                        }}
                      >
                        {email.label.label}
                      </span>
                    )}
                  </div>
                </div>
                <div className="text-gray-400 ml-2">
                  {expandedEmailId === email.id ? '▼' : '▶'}
                </div>
              </div>
              
              {expandedEmailId === email.id && (
                <div className="p-3 bg-gray-50 border-t">
                  <div className="mb-2">
                    <p><strong>From:</strong> {email.sender}</p>
                    <p><strong>To:</strong> {email.receiver}</p>
                    <p><strong>Subject:</strong> {email.subject}</p>
                  </div>
                  <div className="border-t pt-2 mt-2">
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