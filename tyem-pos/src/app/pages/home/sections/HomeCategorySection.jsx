import React, { useEffect, useState } from 'react';

const HomeCategorySection = ({ onCategorySelect }) => {
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('All');

  useEffect(() => {
    // Fetch data from the API
    const fetchCategories = async () => {
      try {
        const response = await fetch('https://tyem.invenro.site/api/user/ExcelItems');
        const data = await response.json();

        // Extract unique categories
        const uniqueCategories = [...new Set(data.map(item => item.category))];
        setCategories(uniqueCategories);
      } catch (error) {
        console.error('Error fetching categories:', error);
      }
    };

    fetchCategories();
  }, []);

  const handleCategoryClick = (category) => {
    setSelectedCategory(category);
    onCategorySelect(category);
  };

  return (
    <div className="w-64 bg-white shadow-lg rounded-lg overflow-hidden">
      <div
        className={`bg-teal-600 text-white text-center py-2 font-semibold text-lg cursor-pointer ${selectedCategory === 'All' ? 'bg-teal-700' : ''}`}
        onClick={() => handleCategoryClick('All')}
      >
        All
      </div>
      <div className="flex flex-col max-h-96 overflow-y-auto">
        {categories.map((category, index) => (
          <div
            key={index}
            className={`text-teal-600 border-t border-teal-600 text-center py-2 cursor-pointer hover:bg-teal-100 ${selectedCategory === category ? 'bg-teal-100' : ''}`}
            onClick={() => handleCategoryClick(category)}
          >
            {category}
          </div>
        ))}
      </div>
    </div>
  );
};

export default HomeCategorySection;
