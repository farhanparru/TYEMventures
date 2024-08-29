import React, { useEffect, useState, useCallback, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { addToCart } from "../store/cartSlice";
import axios from "axios";
import { getStoreUserData } from "../../../store/storeUser/storeUserSlice";

const ItemCard = React.memo(({ selectedCategory }) => {
  const dispatch = useDispatch();
  const store_user = useSelector(getStoreUserData);
  const [items, setItems] = useState([]);
  console.log(items,"items");
  
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchItems = async () => {
      setLoading(true);
      try {
        const response = await axios.get(
          "http://localhost:8000/api/user/ExcelItems"
        );

        const fetchedItems = response.data;
    

        // Filter items based on the selected category
        const filteredItems =  selectedCategory === "All" ? fetchedItems   : fetchedItems.filter((item) => item.category === selectedCategory);
   
        // Ensure no duplicate items based on their unique Id and ItemName
        const uniqueItems = filteredItems.reduce((acc, item) => {
          if (!acc.find((i) => i.ItemName === item.ItemName)) {
            acc.push(item);
          }
          return acc;
        }, []);

        setItems(uniqueItems);
      } catch (error) {
        console.error("There was an error fetching the items!", error);
      } finally {
        setLoading(false);
      }
    };

    fetchItems();
  }, [selectedCategory]);

  const onItemClick = useCallback(
    (item) => {
      const cartItem = {
        id: item.Id, // Make sure the 'id' matches the one used in the reducer
        name: item.ItemName,
        price: item.Price,
        type: "increase", // Add this line to specify the type
      };
      dispatch(addToCart(cartItem));
    },
    [dispatch]
  );

  // // Memoize items data
  // const memoizedItems = useMemo(() => items, [items]);
  // console.log(memoizedItems, "memoizedItems");

  return (
    <div className="flex flex-wrap gap-x-10 p-6">
      {loading ? (
        <p>Loading...</p> // Add a loading indicator
      ) : (
        items.map((item) => (
          <div
            key={item.Id}
            onClick={() => onItemClick(item)}
            className="bg-teal-600 text-white p-6 rounded-md flex flex-col justify-between hover:bg-teal-700 cursor-pointer"
            style={{ width: "180px", height: "120px" }}
          >
            <h3 className="text-sm font-bold capitalize truncate">
              {item.ItemName}
            </h3>
            <h3 className="text-md font-medium mt-1">
              ₹{parseFloat(item.Price).toFixed(2)}
            </h3>
          </div>
        ))
      )}
    </div>
  );
});

export default ItemCard;
