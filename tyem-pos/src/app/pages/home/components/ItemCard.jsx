import React, { useEffect, useState, useCallback, useMemo } from "react";
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

        // Filter items based on the selected category
        const filteredItems = selectedCategory === 'All'
          ? fetchedItems
          : fetchedItems.filter(item => item.category === selectedCategory);

        // Split items into three columns
        const totalItems = filteredItems.length;
        const itemsPerColumn = Math.ceil(totalItems / 3);

        const firstColumn = filteredItems.slice(0, itemsPerColumn);
        const secondColumn = filteredItems.slice(itemsPerColumn, 2 * itemsPerColumn);
        const thirdColumn = filteredItems.slice(2 * itemsPerColumn);

        // Update state only if there's a change
        setItems(prevItems => {
          const isSame = (
            JSON.stringify(prevItems.firstColumn) === JSON.stringify(firstColumn) &&
            JSON.stringify(prevItems.secondColumn) === JSON.stringify(secondColumn) &&
            JSON.stringify(prevItems.thirdColumn) === JSON.stringify(thirdColumn)
          );
          return isSame ? prevItems : { firstColumn, secondColumn, thirdColumn };
        });
      } catch (error) {
        console.error('There was an error fetching the items!', error);
      } finally {
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

  // Memoize column data to prevent unnecessary recalculations
  const firstColumnItems = useMemo(() => items.firstColumn, [items.firstColumn]);
  const secondColumnItems = useMemo(() => items.secondColumn, [items.secondColumn]);
  const thirdColumnItems = useMemo(() => items.thirdColumn, [items.thirdColumn]);

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="flex justify-between gap-x-10 p-6">
      <div className="flex flex-col space-y-9">
        {firstColumnItems.map((item) => (
          <div
            key={item.Id} // Ensure unique key
            onClick={() => onItemClick(item)}
            className="bg-teal-600 text-white p-6 rounded-md flex flex-col justify-between hover:bg-teal-700 cursor-pointer"
            style={{ width: '180px', height: '120px' }}
          >
            <h3 className="text-sm font-bold capitalize truncate">{item.ItemName}</h3>
            <h3 className="text-md font-medium mt-1">₹{parseFloat(item.Price).toFixed(2)}</h3>
          </div>
        ))}
      </div>
      <div className="flex flex-col space-y-9">
        {secondColumnItems.map((item) => (
          <div
            key={item.Id} // Ensure unique key
            onClick={() => onItemClick(item)}
            className="bg-teal-600 text-white p-6 rounded-md flex flex-col justify-between hover:bg-teal-700 cursor-pointer"
            style={{ width: '180px', height: '120px' }}
          >
            <h3 className="text-sm font-bold capitalize truncate">{item.ItemName}</h3>
            <h3 className="text-md font-medium mt-1">₹{parseFloat(item.Price).toFixed(2)}</h3>
          </div>
        ))}
      </div>
      <div className="flex flex-col space-y-9">
        {thirdColumnItems.map((item) => (
          <div
            key={item.Id} // Ensure unique key
            onClick={() => onItemClick(item)}
            className="bg-teal-600 text-white p-6 rounded-md flex flex-col justify-between hover:bg-teal-700 cursor-pointer"
            style={{ width: '180px', height: '120px' }}
          >
            <h3 className="text-sm font-bold capitalize truncate">{item.ItemName}</h3>
            <h3 className="text-md font-medium mt-1">₹{parseFloat(item.Price).toFixed(2)}</h3>
          </div>
        ))}
      </div>
    </div>
  );
});

export default ItemCard;
