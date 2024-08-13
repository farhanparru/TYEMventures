import React, { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import axios from "axios";
import { addToCart } from "../store/cartSlice";

// ItemCard Component
const ItemList = ({ item, onItemClick }) => {
  return (
    <div
      key={item._id}
      onClick={() => onItemClick(item)}
      className="flex flex-col gap-2 justify-between bg-ch-headers-500 text-white p-4 rounded-md shadow-xl cursor-pointer transition-transform ease-in-out duration-200 hover:bg-slate-300 hover:scale-95 hover:shadow-sm"
      style={{ height: '120px' }}
    >
      <h3 className="text-sm font-bold capitalize">{item.ItemName}</h3>
      {item.Price ? (
        <p className="text-md font-semibold">₹ {item.Price.toFixed(2)}</p>
      ) : (
        <p className="text-md font-semibold">Multiple Prices</p>
      )}
    </div>
  );
};

// ItemGrid Component
const ItemGrid = ({ items, onItemClick }) => {
  return (
    <div className="grid grid-cols-3 gap-4">
      {items.map((item) => (
        <ItemList key={item._id} item={item} onItemClick={onItemClick} />
      ))}
    </div>
  );
};

// Main Component
const ItemCard = () => {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const dispatch = useDispatch();

  useEffect(() => {
    axios
      .get("https://tyem.invenro.site/api/user/ExcelItems") // Adjust your API endpoint
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
        console.error("There was an error fetching the items!", error);
        setError("Error fetching items");
        setLoading(false);
      });
  }, []);

  const onItemClick = (item) => {
    dispatch(addToCart(item));
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div>{error}</div>;

  return (
    <div className="container mx-auto p-4">
      <ItemGrid items={items} onItemClick={onItemClick} />
    </div>
  );
};

export default ItemCard;
