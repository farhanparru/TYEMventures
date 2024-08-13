import React, { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import axios from "axios";
import { addToCart } from "../store/cartSlice";

const ItemCard = () => {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const dispatch = useDispatch();

  useEffect(() => {
    axios.get('https://tyem.invenro.site/api/user/ExcelItems')
      .then((response) => {
        if (response.data && Array.isArray(response.data)) {
          setItems(response.data);
        } else {
          setItems([]);
        }
        setLoading(false);
      })
      .catch((error) => {
        console.error('There was an error fetching the items!', error);
        setError('Error fetching items');
        setLoading(false);
      });
  }, []);

  const onItemClick = (item) => {
    dispatch(addToCart(item));
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div>{error}</div>;

  return (
    <div className="flex">
      <div className="w-1/4 p-4">
        
      </div>

      <div className="grid grid-cols-3 gap-4 w-3/4 p-4">
        {items.map((item) => (
          <div
            key={item._id}
            onClick={() => onItemClick(item)}
            className="flex flex-col justify-between bg-teal-600 text-white p-4 rounded-lg shadow-lg cursor-pointer transition-transform duration-200 hover:bg-teal-700 hover:scale-105"
            style={{ height: '120px' }}
          >
            <div>
              <h3 className="text-sm font-bold capitalize">{item.ItemName}</h3>
            </div>
            <div className="mt-2">
              {item.Price ? (
                <p className="text-md font-semibold">
                  ₹ {item.Price.toFixed(2)}
                </p>
              ) : (
                <p className="text-md font-semibold">Price not available</p>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ItemCard;
