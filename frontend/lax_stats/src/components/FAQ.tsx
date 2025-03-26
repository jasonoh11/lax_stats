import React, { useState } from "react";

const FAQ: React.FC = () => {
  const [activeIndex, setActiveIndex] = useState<number | null>(null);

  const faqs = [
    {
      question: "How do you collect game results?",
      answer:
        "All team and game data is scraped from mcla.us meaning our data is dependent on the accuracy and recency of the official MCLA website.",
    },
    {
      question: "Team A beat Team B, why are they ranked behind them?",
      answer:
        "It is impossible to rank all teams entirely based on head-to-head results. The ranking reflects the entire network of games, not just individual matchups. A single win doesn't guarantee a higher ranking if the team's broader resume is less impressive.",
    },
    {
      question: "How do you evaluate home vs. away games?",
      answer:
        "All games are weighted equally, regardless of venue. The MCLA's unique game environments such as neutral sites, tournament play, and hosted games make standard home/away adjustments impractical. Our rankings focus on pure competitive data.",
    },
    {
      question: "Are teams rewarded for quality losses?",
      answer:
        "No. Our PageRank method only transfers ranking power from losing to winning teams, meaning teams are not directly rewarded for close losses against strong teams. Similarly, strong teams are not punished for small wins against weaker teams. This maintains a simple, transparent ranking system based on a clear principle - wins matter.",
    },
    {
      question: "Team X is undefeated, why are they rated so low?",
      answer:
        "Win-loss record is not directly considered. Instead, margin of victory and strength of opponents determine the rankings. If an undefeated team is ranked below teams with multiple losses, they may be playing significantly weaker opponents or winning by smaller margins against strong opponents.",
    },
  ];

  const toggleFaq = (index: number) => {
    setActiveIndex(activeIndex === index ? null : index);
  };

  return (
    <div className="max-w-lg sm:max-w-2xl md:max-w-4xl mx-auto p-4 sm:p-6">
      <div className="bg-white rounded-lg shadow-md p-6 sm:p-8 mt-6 sm:mt-8">
        <h2 className="text-2xl sm:text-3xl font-semibold mb-6 sm:mb-8">
          Frequently Asked Questions
        </h2>
        <div className="space-y-4">
          {faqs.map((faq, index) => (
            <div
              key={index}
              className="border-b border-gray-200 last:border-b-0"
            >
              <button
                onClick={() => toggleFaq(index)}
                className="w-full flex justify-between items-center py-3 sm:py-4 text-left cursor-pointer whitespace-normal"
              >
                <span className="text-base sm:text-lg font-medium pr-6 sm:pr-8">
                  {faq.question}
                </span>
                <i
                  className={`bi bi-chevron-down transform transition-transform duration-300 ${
                    activeIndex === index ? "rotate-180" : ""
                  }`}
                ></i>
              </button>
              <div
                className={`overflow-hidden transition-all duration-300 ${
                  activeIndex === index ? "max-h-48 pb-4" : "max-h-0"
                }`}
              >
                <p className="text-gray-600 leading-relaxed text-sm sm:text-base">
                  {faq.answer}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default FAQ;
