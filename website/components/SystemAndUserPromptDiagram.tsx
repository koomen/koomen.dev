import React from 'react';

const SystemAndUserPromptDiagram: React.FC = () => {
  return (
    <div className="my-8 p-6 border border-gray-200 rounded-lg bg-white dark:bg-gray-800 dark:border-gray-700">
      <div className="flex flex-col space-y-4">
        
        {/* Combined Prompt Box */}
        <div className="border border-purple-200 bg-purple-50 dark:bg-purple-900/20 dark:border-purple-800 p-4 rounded-lg">
          <div className="text-sm font-semibold text-purple-700 dark:text-purple-300 mb-2">Combined Prompt</div>
          <div className="p-3 border border-blue-100 bg-blue-50/50 dark:bg-blue-900/10 dark:border-blue-900 rounded mb-2">
            <div className="text-xs font-mono text-blue-700 dark:text-blue-300">System Prompt: Instructions that define the assistant's behavior...</div>
          </div>
          <div className="p-3 border border-green-100 bg-green-50/50 dark:bg-green-900/10 dark:border-green-900 rounded">
            <div className="text-xs font-mono text-green-700 dark:text-green-300">User Prompt: Specific query or instruction from the user...</div>
          </div>
        </div>
        
        {/* Arrow Down */}
        <div className="flex justify-center">
          <svg className="w-6 h-6 text-gray-500 dark:text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
          </svg>
        </div>
        
        {/* LLM Box */}
        <div className="border border-yellow-200 bg-yellow-50 dark:bg-yellow-900/20 dark:border-yellow-800 p-4 rounded-lg">
          <div className="text-sm font-semibold text-yellow-700 dark:text-yellow-300 mb-2">Large Language Model</div>
          <div className="text-sm text-gray-700 dark:text-gray-300">Processes the combined prompt and generates a response</div>
        </div>
      </div>
    </div>
  );
};

export default SystemAndUserPromptDiagram;
