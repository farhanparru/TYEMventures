import React, { useEffect, useState } from 'react';

const HomeCategorySection = () => {
  const [categories, setCategories] = useState([]);
  const [items, setItems] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(null);

  useEffect(() => {
    // Fetch data from the API
    const fetchCategoriesAndItems = async () => {
      try {
        const response = await fetch('https://tyem.invenro.site/api/user/ExcelItems');
        const data = await response.json();

        // Extract unique categories
        const uniqueCategories = [...new Set(data.map(item => item.category))];
        setCategories(uniqueCategories);
        setItems(data);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchCategoriesAndItems();
  }, []);

  // Filter items based on the selected category
  const filteredItems = items.filter(item => item.category === selectedCategory);

  return (
    <div className="flex">
      {/* Category List */}
      <div className="w-64 bg-white shadow-lg rounded-lg overflow-hidden">
        <div className="bg-teal-600 text-white text-center py-2 font-semibold text-lg">
          Categories
        </div>
        <div className="flex flex-col max-h-96 overflow-y-auto">
          {categories.map((category, index) => (
            <div
              key={index}
              className={`text-teal-600 border-t border-teal-600 text-center py-2 cursor-pointer hover:bg-teal-100 ${selectedCategory === category ? 'bg-teal-100' : ''}`}
              onClick={() => setSelectedCategory(category)}
            >
              {category}
            </div>
          ))}
        </div>
      </div>

      {/* Items List */}
      <div className="flex-1 bg-white shadow-lg rounded-lg ml-4 p-4 max-h-96 overflow-y-auto">
        <h2 className="text-xl font-semibold text-teal-600">
          {selectedCategory ? selectedCategory : 'Please select a category'}
        </h2>
        {selectedCategory && (
          <ul className="mt-4">
            {filteredItems.map(item => (
              <li key={item._id} className="py-2 border-b">
                <span className="font-semibold">{item.ItemName}</span> - ₹{item.Price}
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

export default HomeCategorySection;
