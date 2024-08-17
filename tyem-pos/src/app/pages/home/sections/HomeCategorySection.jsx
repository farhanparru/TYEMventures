import React from 'react';

const categories = [
  "ARABIC",
  "BEVERAGES",
  "BREADS",
  "CHICKEN MAIN COURSE",
  "CHINESE MAIN COURSE",
  "CHINESE STARTER",
  "CHOCOLATE SUNDAYS",
  "COCKTAIL",
  "DRY FRUIT SHAKE",
  "FALOODA",
  // Add more categories here if needed
];

const HomeCategorySection = () => {
  return (
    <div className="w-64 bg-white shadow-lg rounded-lg overflow-hidden">
      <div className="bg-teal-600 text-white text-center py-2 font-semibold text-lg">
        All
      </div>
      <div className="flex flex-col max-h-96 overflow-y-auto">
        {categories.map((category, index) => (
          <div
            key={index}
            className="text-teal-600 border-t border-teal-600 text-center py-2 cursor-pointer hover:bg-teal-100"
          >
            {category}
          </div>
        ))}
      </div>
    </div>
  );
};

export default HomeCategorySection;
