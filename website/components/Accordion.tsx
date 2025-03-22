import React, { useState } from "react";

interface AccordionItem {
  title: string;
  content: string;
}

interface AccordionProps {
  items: AccordionItem[];
}

export default function Accordion({ items }: AccordionProps) {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const toggleItem = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <div className="my-4 border border-gray-200 rounded-md divide-y">
      {items.map((item, index) => (
        <div key={index} className="overflow-hidden">
          <button
            onClick={() => toggleItem(index)}
            className="flex justify-between items-center w-full p-4 text-left font-medium hover:bg-gray-50"
          >
            <span>{item.title}</span>
            <span className="ml-6">{openIndex === index ? "−" : "+"}</span>
          </button>

          {openIndex === index && (
            <div className="p-4 pt-0 bg-gray-50">
              <p>{item.content}</p>
            </div>
          )}
        </div>
      ))}
    </div>
  );
}
