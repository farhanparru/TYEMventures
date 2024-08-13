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
    <div className="grid grid-cols-3 gap-4">
      {items.map((item) => (
        <div
          key={item._id}
          onClick={() => onItemClick(item)}
          className="block rounded-lg bg-white p-6 text-surface shadow-secondary-1 dark:bg-surface-dark dark:text-white cursor-pointer transition-all ease-in-out hover:bg-slate-300 hover:scale-95 hover:shadow-sm"
          style={{ height: '120px' }}
        >
          <h5 className="mb-2 text-xl font-medium leading-tight capitalize">{item.ItemName}</h5>
          <p className="mb-4 text-base font-semibold">₹ {item.Price.toFixed(2)}</p>
          <button
            type="button"
            className="inline-block rounded bg-primary px-6 pb-2 pt-2.5 text-xs font-medium uppercase leading-normal text-white shadow-primary-3 transition duration-150 ease-in-out hover:bg-primary-accent-300 hover:shadow-primary-2 focus:bg-primary-accent-300 focus:shadow-primary-2 focus:outline-none focus:ring-0 active:bg-primary-600 active:shadow-primary-2 dark:shadow-black/30 dark:hover:shadow-dark-strong dark:focus:shadow-dark-strong dark:active:shadow-dark-strong"
            data-twe-ripple-init
            data-twe-ripple-color="light"
          >
            Button
          </button>
        </div>
      ))}
    </div>
  );
};

export default ItemCard;
