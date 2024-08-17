import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { addToCart } from "../store/cartSlice";
import axios from "axios";
import { getStoreUserData } from "../../../store/storeUser/storeUserSlice";

// React.memo to optimize rendering
const ItemCard = React.memo(() => {
  console.log("Rendering ItemCard"); // Log to check rendering

  const dispatch = useDispatch();
  const store_user = useSelector(getStoreUserData);
  const [items, setItems] = useState({ firstColumn: [] });

  useEffect(() => {
    const fetchItems = async () => {
      try {
        const response = await axios.get('https://tyem.invenro.site/api/user/ExcelItems'); // Adjust your API endpoint
        const fetchedItems = response.data;

        const firstColumn = fetchedItems.slice(0, 130);  
        console.log(firstColumn, "fetchedItems");

        setItems({ firstColumn }); // Set the first column
      } catch (error) {
        console.error('Error fetching items!', error);
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
    <div className="flex justify-center p-6">
      <div className="flex flex-col space-y-9">
        {items.firstColumn.map((item, index) => (
          <div
            key={item.id || index} // Use unique identifier if available
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
