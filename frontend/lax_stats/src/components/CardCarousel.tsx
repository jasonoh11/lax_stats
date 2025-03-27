import { useRef } from 'react';

const cardData = [
  {
    icon: 'bi bi-graph-up-arrow',
    title: 'Algorithm Refinements',
    description: 'Leveraging historical data and other leagues to finetune the algorithm'
  },
  {
    icon: 'bi bi-trophy',
    title: 'Player Rankings',
    description: 'Considering player statistics and opponent strength to highlight top players'
  },
  {
    icon: 'bi bi-bullseye',
    title: 'Matchup Predictions',
    description: 'Spreads and lines for future games based on rankings'
  },
  {
    icon: 'bi bi-lightning',
    title: 'Live Updates',
    description: 'Instant automated rankings updates as game results come in'
  }
];

const CardCarousel = () => {
  const carouselRef = useRef<HTMLDivElement>(null);

  return (
    <div className="relative w-full max-w-6xl mx-auto">


      {/* Carousel Container */}
      <div 
        ref={carouselRef}
        className="flex overflow-x-auto space-x-4 pb-4 no-scrollbar scroll-smooth"
        style={{ 
          scrollSnapType: 'x mandatory',
          WebkitOverflowScrolling: 'touch'
        }}
      >
        {cardData.map((card, index) => (
          <div 
            key={index} 
            className="flex-shrink-0 w-72 bg-white rounded-xl shadow-sm p-6 transform transition-transform hover:-translate-y-2 hover:shadow-md"
            style={{ scrollSnapAlign: 'start' }}
          >
            <div className="flex items-center mb-4">
              <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center mr-3">
                <i className={`${card.icon} m-0 text-red-600`}></i>
              </div>
              <h5 className="text-lg font-semibold text-gray-900">
                {card.title}
              </h5>
            </div>
            <p className="text-gray-600">
              {card.description}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CardCarousel;