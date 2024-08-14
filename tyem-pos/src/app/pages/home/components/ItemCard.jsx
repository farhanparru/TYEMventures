import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { addToCart } from "../store/cartSlice";
import axios from "axios";
import { getStoreUserData } from "../../../store/storeUser/storeUserSlice";

const ItemCard = () => {
  const dispatch = useDispatch();
  const store_user = useSelector(getStoreUserData);
  const [items, setItems] = useState([[], [], []]);

  useEffect(() => {
    const fetchItems = async () => {
      try {
        const response = await axios.get('https://tyem.invenro.site/api/user/ExcelItems'); // Adjust your API endpoint
        const allItems = response.data;

        // Split items into three separate arrays
        const col1 = allItems.filter((_, index) => index % 3 === 0);
        const col2 = allItems.filter((_, index) => index % 3 === 1);
        const col3 = allItems.filter((_, index) => index % 3 === 2);

        setItems([col1, col2, col3]);
      } catch (error) {
        console.error('There was an error fetching the items!', error);
      }
    };
    fetchItems();
  }, []);

  const onItemClick = (item) => {
    dispatch(addToCart(item));
  };

  return (
    <div className="grid grid-cols-3 p-4 gap-4">
      {items.map((columnItems, columnIndex) => (
        <div key={columnIndex} className="flex flex-col space-y-4">
          {columnItems.map((item, index) => (
            <div
              key={index}
              onClick={() => onItemClick(item)}
              className="bg-teal-600 text-black p-4 rounded-md shadow-md flex flex-col justify-between"
              style={{ width: '200px', height: '120px' }}
            >
              <h3 className="text-sm not-italic capitalize">{item.ItemName}</h3>
              <h3 className="text-md font-medium">{parseFloat(item.Price).toFixed(2)}</h3>
            </div>
          ))}
        </div>
      ))}
    </div>
  );
};

export default ItemCard;
