import React, { useEffect, useState } from 'react';

const HomeCategorySection = () => {
  const [categories, setCategories] = useState([]);

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
