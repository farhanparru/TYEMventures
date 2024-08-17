import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { addToCart } from "../store/cartSlice";
import axios from "axios";
import { getStoreUserData } from "../../../store/storeUser/storeUserSlice";

const ItemCard = React.memo(() => {
  const dispatch = useDispatch();
  const store_user = useSelector(getStoreUserData);
  const [items, setItems] = useState({ firstColumn: [], secondColumn: [], thirdColumn: [] });

  useEffect(() => {
    const fetchItems = async () => {
      try {
        const response = await axios.get('https://tyem.invenro.site/api/user/ExcelItems'); 
        const fetchedItems = response.data;

        // Split items into three columns
        const firstColumn = fetchedItems.slice(0, Math.ceil(fetchedItems.length / 3));
        const secondColumn = fetchedItems.slice(Math.ceil(fetchedItems.length / 3), Math.ceil(2 * fetchedItems.length / 3));
        const thirdColumn = fetchedItems.slice(Math.ceil(2 * fetchedItems.length / 3));

        setItems({ firstColumn, secondColumn, thirdColumn });
      } catch (error) {
        console.error('There was an error fetching the items!', error);
      }
    };
    fetchItems();
  }, []);

  const onItemClick = (item) => {
    const cartItem = {
      name: item.ItemName,
      price: item.Price,
      quantity: 1,
    };
    dispatch(addToCart(cartItem));
  };

  return (
    <div className="flex justify-between gap-x-10 p-6">
      <div className="flex flex-col space-y-9">
        {items.firstColumn.map((item, index) => (
          <div
            key={item.id || index} // Use a unique identifier if available
            onClick={() => onItemClick(item)}
            className="bg-teal-600 text-white p-6 rounded-md flex flex-col justify-between hover:bg-teal-700 cursor-pointer"
            style={{ width: '180px', height: '120px' }} 
          >
            <h3 className="text-sm font-bold capitalize truncate">{item.ItemName}</h3>
            <h3 className="text-md font-medium mt-1">₹{parseFloat(item.Price).toFixed(2)}</h3>
          </div>
        ))}
      </div>

      <div className="flex flex-col space-y-9">
        {items.secondColumn.map((item, index) => (
          <div
            key={item.id || index} 
            onClick={() => onItemClick(item)}
            className="bg-teal-600 text-white p-6 rounded-md flex flex-col justify-between hover:bg-teal-700 cursor-pointer"
            style={{ width: '180px', height: '120px' }} 
          >
            <h3 className="text-sm font-bold capitalize truncate">{item.ItemName}</h3>
            <h3 className="text-md font-medium mt-1">₹{parseFloat(item.Price).toFixed(2)}</h3>
          </div>
        ))}
      </div>

      <div className="flex flex-col space-y-9">
        {items.thirdColumn.map((item, index) => (
          <div
            key={item.id || index} 
            onClick={() => onItemClick(item)}
            className="bg-teal-600 text-white p-6 rounded-md flex flex-col justify-between hover:bg-teal-700 cursor-pointer"
            style={{ width: '180px', height: '120px' }} 
          >
            <h3 className="text-sm font-bold capitalize truncate">{item.ItemName}</h3>
            <h3 className="text-md font-medium mt-1">₹{parseFloat(item.Price).toFixed(2)}</h3>
          </div>
        ))}
      </div>
    </div>
  );
});

export default ItemCard;
