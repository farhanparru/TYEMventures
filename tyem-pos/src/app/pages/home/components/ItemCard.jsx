import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { addToCart } from "../store/cartSlice";
import axios from "axios";
import { getStoreUserData } from "../../../store/storeUser/storeUserSlice";

const ItemCard = () => {
  const dispatch = useDispatch();
  const store_user = useSelector(getStoreUserData);
  const [items, setItems] = useState([]);

  useEffect(() => {
    const fetchItems = async () => {
      try {
        const response = await axios.get('https://tyem.invenro.site/api/user/ExcelItems'); // Adjust your API endpoint
        setItems(response.data);
      } catch (error) {
        console.error('There was an error fetching the items!', error);
      }
    };
    fetchItems();
  }, []);

  const onItemClick = (item) => {
    dispatch(addToCart(item));
  };

  // Split the items into three columns
  const col1 = items.filter((_, index) => index % 3 === 0);
  const col2 = items.filter((_, index) => index % 3 === 1);
  const col3 = items.filter((_, index) => index % 3 === 2);

  return (
    <div className="flex justify-between gap-x-2 p-2"> {/* Adjusted the gap-x and padding */}
      <div className="flex flex-col space-y-2"> {/* Adjusted space-y */}
        {col1.map((item, index) => (
          <div
            key={index}
            onClick={() => onItemClick(item)}
            className="bg-teal-600 text-white p-4 rounded-md flex flex-col justify-between hover:bg-teal-700 cursor-pointer"
            style={{ width: '180px', height: '120px' }} 
          >
            <h3 className="text-sm font-bold capitalize truncate">{item.ItemName}</h3>
            <h3 className="text-md font-medium mt-2">{parseFloat(item.Price).toFixed(2)}</h3>
          </div>
        ))}
      </div>

      <div className="flex flex-col space-y-2 p-2">
        {col2.map((item, index) => (
          <div
            key={index}
            onClick={() => onItemClick(item)}
            className="bg-teal-600 text-white p-4 rounded-md flex flex-col justify-between hover:bg-teal-700 cursor-pointer"
            style={{ width: '180px', height: '120px' }}
          >
            <h3 className="text-sm font-bold capitalize truncate">{item.ItemName}</h3>
            <h3 className="text-md font-medium mt-2">{parseFloat(item.Price).toFixed(2)}</h3>
          </div>
        ))}
      </div>

      <div className="flex flex-col space-y-2 p-2">
        {col3.map((item, index) => (
          <div
            key={index}
            onClick={() => onItemClick(item)}
            className="bg-teal-600 text-white p-4 rounded-md flex flex-col justify-between hover:bg-teal-700 cursor-pointer"
            style={{ width: '180px', height: '120px' }}
          >
            <h3 className="text-sm font-bold capitalize truncate">{item.ItemName}</h3>
            <h3 className="text-md font-medium mt-2">{parseFloat(item.Price).toFixed(2)}</h3>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ItemCard;
