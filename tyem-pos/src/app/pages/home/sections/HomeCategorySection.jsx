import React, { useEffect, useState } from 'react';

const HomeCategorySection = ({ onCategorySelect }) => {
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('All');

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await fetch('https://tyem.invenro.site/api/user/ExcelItems');
        const data = await response.json();

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
    {/* All Category */}
    <div
      className={`text-center py-2 font-semibold text-lg cursor-pointer 
        ${selectedCategory === 'All' ? 'bg-teal-600 text-white' : 'bg-teal-500 text-teal-600 hover:bg-teal-600'}`}
      onClick={() => handleCategoryClick('All')}
    >
      All
    </div>
    
    {/* Other Categories */}
    <div className="flex flex-col max-h-96 overflow-y-auto">
      {categories.map((category, index) => (
        <div
          key={index}
          className={`text-center py-2 cursor-pointer 
            ${selectedCategory === category ? 'bg-teal-600 text-white hover:bg-teal-700' : 'text-teal-600 border-t border-teal-600 hover:bg-teal-100'}`}
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
