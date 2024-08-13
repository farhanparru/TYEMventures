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
    <div
      onClick={onItemClick}
        className="home__item flex flex-col gap-2 justify-around bg-ch-headers-500 text-white p-3 rounded-md shadow-xl cursor-pointer transition-all ease-in-out hover:bg-slate-300 hover:scale-95 hover:shadow-sm"
      style={{ height: '300px', overflowY: 'auto' }} // Set the height and enable vertical scroll
    >
      {items.map((item) => (
        <div key={item._id} >
          <h3 className="text-sm font-bold capitalize">{item.ItemName}</h3>
          <p className="text-md font-semibold">₹ {item.Price.toFixed(2)}</p>
        </div>
      ))
    </div>
  );
};


export default ItemCard;