import React from 'react';

const SearchBar = () => {
  return (
    <div>
      <label
        className="relative bg-white flex items-center border py-2 px-2 rounded-2xl shadow-md focus-within:border-gray-300"
        htmlFor="search-bar"
      >
        <input
          id="search-bar"
          placeholder="Search customer by name / phone / code"
          className="px-4 py-2 w-full rounded-md flex-1 outline-none bg-white h-10" // Consistent height
        />
        <button
          className="px-4 py-2 bg-black border-black text-white rounded-md"
        >
          Search
        </button>
      </label>
    </div>
  );
};

export default SearchBar;
