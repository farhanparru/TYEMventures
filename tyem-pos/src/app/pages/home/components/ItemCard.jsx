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
          console.log(response.data);
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
    <div className="item-card-container overflow-y-auto max-h-[500px] p-4">
      {items.map((item) => (
        <div
          key={item._id} // Use _id as the key
          onClick={() => onItemClick(item)}
          className="home__item flex flex-col gap-2 justify-around bg-ch-headers-500 text-white p-3 rounded-md shadow-xl cursor-pointer transition-transform duration-300 hover:bg-slate-300 hover:scale-95 hover:shadow-sm mb-2"
        >
          <h3 className="text-sm font-bold capitalize">
            {item.ItemName}
          </h3>
          <p className="text-md">₹ {item.Price.toFixed(2)}</p>
        </div>
      ))}
    </div>
  );
};

export default ItemCard;
