import React, { useEffect, useState, useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import { addToCart } from "../store/cartSlice";
import axios from "axios";
import { getStoreUserData } from "../../../store/storeUser/storeUserSlice";

const ItemCard = React.memo(({ selectedCategory }) => {
  const dispatch = useDispatch();
  const store_user = useSelector(getStoreUserData);
  const [items, setItems] = useState({ firstColumn: [], secondColumn: [], thirdColumn: [] });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchItems = async () => {
      setLoading(true);
      try {
        const response = await axios.get('https://tyem.invenro.site/api/user/ExcelItems'); 
        const fetchedItems = response.data;

        const filteredItems = selectedCategory === 'All' 
          ? fetchedItems 
          : fetchedItems.filter(item => item.category === selectedCategory);

        const columnLength = Math.ceil(filteredItems.length / 3);
        const firstColumn = filteredItems.slice(0, columnLength);
        const secondColumn = filteredItems.slice(columnLength, 2 * columnLength);
        const thirdColumn = filteredItems.slice(2 * columnLength);

        setItems({ firstColumn, secondColumn, thirdColumn });
        setLoading(false);
      } catch (error) {
        console.error('There was an error fetching the items!', error);
        setLoading(false);
      }
    };
    fetchItems();
  }, [selectedCategory]);

  const onItemClick = useCallback((item) => {
    const cartItem = {
      Id: item.Id,
      name: item.ItemName,
      price: item.Price,
    };
    dispatch(addToCart(cartItem));
  }, [dispatch]);

  return (
    <div className="flex justify-between gap-x-10 p-6">
      {['firstColumn', 'secondColumn', 'thirdColumn'].map((col, index) => (
        <div key={index} className="flex flex-col space-y-9">
          {items[col].map((item) => (
            <div
              key={item.Id}
              onClick={() => onItemClick(item)}
              className="bg-teal-600 text-white p-6 rounded-md flex flex-col justify-between hover:bg-teal-700 cursor-pointer"
              style={{ width: '180px', height: '120px' }} 
            >
              <h3 className="text-sm font-bold capitalize truncate">{item.ItemName}</h3>
              <h3 className="text-md font-medium mt-1">₹{parseFloat(item.Price).toFixed(2)}</h3>
            </div>
          ))}
        </div>
      ))}
    </div>
  );
});

export default ItemCard;
