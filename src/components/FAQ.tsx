"use client";

import { FAQS } from "@/lib/constants";
import { ChevronDown } from "lucide-react";
import { useState } from "react";

export default function FAQ() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  return (
    <section id="faq" className="py-14 lg:py-24 bg-white">
      <div className="mx-auto max-w-3xl px-4 sm:px-6">
        <div className="text-center mb-12 lg:mb-16">
          <h2 className="text-3xl font-bold tracking-tight text-text-main sm:text-4xl">
            Dúvidas frequentes
          </h2>
        </div>

        <div className="space-y-4">
          {FAQS.map((faq, index) => {
            const isOpen = openIndex === index;
            return (
              <div 
                key={index} 
                className={`rounded-2xl border transition-colors ${
                  isOpen ? "border-blue-light/30 bg-blue-light/5" : "border-sand-light/50 bg-white"
                }`}
              >
                <button
                  type="button"
                  className="flex w-full items-center justify-between p-6 text-left"
                  onClick={() => {
                    setOpenIndex(isOpen ? null : index);
                    if (!isOpen) console.log('abertura_faq', faq.question);
                  }}
                >
                  <span className="font-semibold text-text-main pr-4">{faq.question}</span>
                  <ChevronDown 
                    className={`h-5 w-5 shrink-0 text-text-secondary transition-transform ${
                      isOpen ? "rotate-180" : ""
                    }`} 
                  />
                </button>
                <div 
                  className={`overflow-hidden transition-all duration-300 ${
                    isOpen ? "max-h-96 opacity-100" : "max-h-0 opacity-0"
                  }`}
                >
                  <div className="px-6 pb-6 text-text-secondary">
                    {faq.answer}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
