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
    axios.get('https://tyem.invenro.site/api/user/ExcelItems') // Adjust your API endpoint
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

  if (loading) return <div className="text-center text-lg">Loading...</div>;
  if (error) return <div className="text-center text-lg text-red-600">{error}</div>;

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 p-6">
      {items.map((item) => (
        <div
          key={item._id}
          onClick={() => onItemClick(item)}
          className="flex flex-col bg-white text-gray-900 p-4 rounded-lg shadow-lg cursor-pointer transition-transform transform hover:scale-105 hover:shadow-2xl"
          style={{ height: '250px', maxWidth: '300px' }} // Adjust height and maxWidth if needed
        >
          <div className="flex-1 flex flex-col justify-between">
            <h3 className="text-lg font-semibold mb-2 truncate">{item.ItemName}</h3>
            <p className="text-xl font-bold text-green-600">₹ {item.Price.toFixed(2)}</p>
          </div>
        </div>
      ))}
    </div>
  );
};

export default ItemCard;
