import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { addToCart } from "../store/cartSlice";
import axios from "axios";
import { getStoreUserData } from "../../../store/storeUser/storeUserSlice";

const ItemCard = ({ show_toggle }) => {
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
    <div className="grid grid-cols-3 gap-2 p-4">  {/* Grid layout with 3 columns */}
      {items.map((item, index) => (
        <div
          key={index}
          onClick={() => onItemClick(item)}
          className="flex flex-col justify-center bg-teal-600 text-white p-4 rounded-md shadow-md cursor-pointer transition-all ease-in-out hover:bg-teal-500"
          style={{ width: '180px', height: '120px' }}  // Fixed width and height to match the provided image
        >
          <h3 className="text-sm font-bold capitalize">{item.ItemName}</h3>
          <div className="mt-2">
            {/* {item.sku && <p className="text-xs">SKU: {item.}</p>} */}
            <h3 className="text-md font-medium">₹ {parseFloat(item.Price).toFixed(2)}</h3>
          </div>
          {show_toggle && (
            <div className="flex justify-center mt-2">
              <Switch
                checked={item.is_active}
                onChange={(checked) => console.log(`Switch to ${checked}`)}
                className={`w-10 ${!item.is_active ? 'bg-red-500' : 'bg-green-500'}`}
              />
            </div>
          )}
        </div>
      ))}
    </div>
  );
};

export default ItemCard;
