import React, { useRef } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

const ArtistCard = ({ image, name, subtitle }) => {
  return (
    <div className="flex-none w-[10%] min-w-[120px]">
      <div className="flex flex-col items-center gap-2">
        <div className="aspect-square w-full relative">
          <img
            src={image}
            alt={name}
            className="rounded-full w-full h-full object-cover"
          />
        </div>
        <div className="flex flex-col items-center text-center">
          <h3 className="font-semibold text-white text-sm">{name}</h3>
          <p className="text-gray-400 text-xs">{subtitle}</p>
        </div>
      </div>
    </div>
  );
};

const ArtistGrid = () => {
  const scrollContainerRef = useRef(null);

  const scroll = (direction) => {
    const container = scrollContainerRef.current;
    if (container) {
      const scrollAmount = direction === "left" ? -200 : 200;
      container.scrollBy({ left: scrollAmount, behavior: "smooth" });
    }
  };

  const artists = [
    {
      image: "/api/placeholder/200/200",
      name: "Dani Mocanu",
      subtitle: "Artist",
    },
    {
      image: "/api/placeholder/200/200",
      name: "Bogdan DLP",
      subtitle: "Artist",
    },
    {
      image: "/api/placeholder/200/200",
      name: "Tzanca Uraganu",
      subtitle: "Artist",
    },
    {
      image: "/api/placeholder/200/200",
      name: "Theo Rose",
      subtitle: "Artist",
    },
    {
      image: "/api/placeholder/200/200",
      name: "Iuly Neamtu",
      subtitle: "Artist",
    },
    { image: "/api/placeholder/200/200", name: "Babasha", subtitle: "Artist" },
    // Add more artists as needed
  ];

  return (
    <div className="w-full bg-black p-6">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-white text-2xl font-bold">Popular artists</h2>
        <button className="text-gray-400 hover:text-white">Show all</button>
      </div>
      <div className="relative group">
        <div
          ref={scrollContainerRef}
          className="flex gap-4 overflow-x-auto scroll-smooth scrollbar-hide"
        >
          {artists.map((artist, index) => (
            <ArtistCard
              key={index}
              image={artist.image}
              name={artist.name}
              subtitle={artist.subtitle}
            />
          ))}
        </div>
        <button
          onClick={() => scroll("left")}
          className="absolute left-0 top-1/2 -translate-y-1/2 bg-black/50 p-2 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
        >
          <ChevronLeft className="text-white" />
        </button>
        <button
          onClick={() => scroll("right")}
          className="absolute right-0 top-1/2 -translate-y-1/2 bg-black/50 p-2 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
        >
          <ChevronRight className="text-white" />
        </button>
      </div>
    </div>
  );
};

export default ArtistGrid;
