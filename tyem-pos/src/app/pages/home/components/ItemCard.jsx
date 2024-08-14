import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { addToCart } from "../store/cartSlice";
import { Switch } from "antd";
import axios from "axios";
import { getStoreUserData } from "../../../store/storeUser/storeUserSlice";

const ItemCard = ({ show_toggle }) => {
  const dispatch = useDispatch();
  const store_user = useSelector(getStoreUserData);
  const [items, setItems] = useState([]);
  const [active, setActive] = useState(false);

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

  const onChange = (checked, item) => {
    console.log(`Switch to ${checked}`);
    setActive(checked);

    // Update the active status of the item if necessary
    // You can perform an API call here to update the status on the server
  };

  return (
    <div className="grid grid-cols-3 gap-4 p-4">
      {items.map((item, index) => (
        <div
          key={index}
          onClick={() => onItemClick(item)}
          className="flex flex-col bg-teal-600 text-white p-4 rounded-md shadow-md cursor-pointer transition-all ease-in-out hover:bg-teal-500 hover:scale-105 hover:shadow-lg"
        >
          <h3 className="text-lg font-bold capitalize">{item.ItemName}</h3>
          {item.Id && <p className="text-sm font-medium">SKU: {item.Id}</p>}
          <h3 className="text-xl font-bold">₹ {parseFloat(item.Price).toFixed(2)}</h3>
          <p className="text-sm font-medium">{item.category} Prices</p>
          {show_toggle && (
            <div className="mt-2">
              <Switch
                checked={active}
                onChange={(checked) => onChange(checked, item)}
                className={`w-10 ${!active ? 'bg-red-500' : 'bg-green-500'}`}
              />
            </div>
          )}
        </div>
      ))}
    </div>
  );
};

export default ItemCard;
