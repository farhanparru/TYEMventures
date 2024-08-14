import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import axios from 'axios';
import { getCategoryList, selectCategory } from "../store/homeSlice";

const CategoryItem = ({ item, active, items }) => {
  const dispatch = useDispatch();

  const filterItems = () => {
    dispatch(selectCategory(item.id));
  };

  return (
    <>
      <h3
        className={`
          font-bold w-full text-center text-sm p-2 cursor-pointer mb-1 mt-1 rounded-md
          ${active ? "bg-ch-headers-500 text-white" : "hover:bg-ch-headers-50 text-black"}
        `}
        onClick={filterItems}
      >
        {item.category}
      </h3>
      <hr />
      {/* Render the items for the selected category */}
      {items
        .filter(itm => itm.category_id === item.id) // Assuming items have a category_id to match the item id
        .map(filteredItem => (
          <div key={filteredItem.id} className="item">
            {filteredItem.name} {/* Display item details */}
          </div>
        ))
      }
    </>
  );
};

const HomeCategorySection = ({ selectedCategory }) => {
  const allCategories = useSelector(getCategoryList);
  const [items, setItems] = useState([]);
  const dispatch = useDispatch();

  useEffect(() => {
    const fetchItems = async () => {
      try {
        const response = await axios.get('https://tyem.invenro.site/api/user/ExcelItems'); // Replace with your actual API endpoint
        setItems(response.data);
      } catch (error) {
        console.error('There was an error fetching the items!', error);
      }
    };
    fetchItems();
  }, []);

  const filterAll = () => {
    dispatch(selectCategory(0));
  };
  
  let isAll = selectedCategory === 0;

  return (
    <div className="flex flex-col mt-3 h-full w-[15%] rounded-lg bg-white border-2 border-gray-100 items-center shadow-xl px-3 py-2">
      <div className="home__categories w-full">
        <h3
          className={`
            w-full font-bold capitalize text-center text-sm p-2 cursor-pointer mb-1 rounded-md
            ${isAll ? "bg-ch-headers-500 rounded-tr text-white" : "hover:bg-ch-headers-50 rounded-tr text-black"}
          `}
          onClick={filterAll}
        >
          All
        </h3>
        <hr />
        {allCategories?.map((item) => {
          let isActive = selectedCategory === item.id;
          return (
            <div key={item?.id}>
              <CategoryItem active={isActive} item={item} items={items} />
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default HomeCategorySection;
