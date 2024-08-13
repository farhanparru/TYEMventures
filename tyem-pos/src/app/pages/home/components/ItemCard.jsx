import React, { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import axios from "axios";
import { addToCart } from "../store/cartSlice";

const ItemCard = ({ Id }) => {
  const [item, setItem] = useState(null);
  const dispatch = useDispatch();

  useEffect(() => {
    axios.get(`https://tyem.invenro.site/api/user/ExcelItems/${Id}`)
      .then((response) => {
        setItem(response.data.item); // Adjust based on your API response structure
      })
      .catch((error) => {
        console.error('There was an error fetching the item!', error);
      });
  }, [itemId]);

  const onItemClick = () => {
    if (item) {
      dispatch(addToCart(item));
    }
  };

  if (!item) return <div>Loading...</div>; // Or some loading spinner

  return (
    <div
      onClick={onItemClick}
      className="home__item flex flex-col gap-2 justify-around bg-ch-headers-500 text-white p-3 rounded-md shadow-xl cursor-pointer transition-all ease-in-out hover:bg-slate-300 hover:scale-95 hover:shadow-sm"
    >
      <h3 className="text-sm font-bold capitalize">
        {item.ItemName}
      </h3>
      <h3 className="text-xs font-medium">
        ₹ {parseFloat(item.product_variations[0].variations[0].sell_price_inc_tax || 0).toFixed(2)}
      </h3>
    </div>
  );
};

export default ItemCard;
