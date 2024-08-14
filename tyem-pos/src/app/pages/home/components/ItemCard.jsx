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
    <div className="grid grid-cols-3 p-4" style={{ gap: '13rem' }}>
     {items.map((item, index) => (
        <div
          onClick={onItemClick}
           key={index}
          className="bg-teal-600 text-black p-4 rounded-md shadow-md flex flex-col justify-between"
          style={{ width: '200px', height: '120px' }}
        >
          <h3 className="text-sm font-bold capitalize">{item.ItemName}</h3>
          {/* {item.sku && <p className="text-xs">SKU: {item.sku}</p>} */}
          <h3 className="text-md font-medium">{parseFloat(item.Price).toFixed(2)}</h3>
        </div>
      ))}
    </div>
  );
};

export default ItemCard;
