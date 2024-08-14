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

  return (
    <div className="grid grid-cols-3 gap-6 p-4">
      {items.map((item, index) => (
        <div
          key={index}
          onClick={() => onItemClick(item)}
          className="bg-teal-600 text-black p-4 rounded-md shadow-md flex flex-col justify-between"
          style={{ width: '100%', height: '200px' }} // Ensures the card takes full width of its grid cell
        >
          {/* <img 
            src={item.imageUrl} // Assuming your API provides an 'imageUrl' field
            alt={item.ItemName}
            className="w-full h-24 object-cover rounded-md mb-2"
          /> */}
          <h3 className="text-lg font-bold capitalize">{item.ItemName}</h3>
          {/* {SKU && <p className="text-xs">SKU:</p>} */}
          <h3 className="text-xl font-semibold">
            ₹{parseFloat(item.Price).toFixed(2)}
          </h3>
        </div>
      ))}
    </div>
  );
};

export default ItemCard;
