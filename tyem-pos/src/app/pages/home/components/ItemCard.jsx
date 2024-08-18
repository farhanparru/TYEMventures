import React, { useEffect, useState,useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import { addToCart } from "../store/cartSlice";
import axios from "axios";
import { getStoreUserData } from "../../../store/storeUser/storeUserSlice";



// Use React.memo to prevent unnecessary re-renders
const ItemCard = React.memo(({ selectedCategory }) => {
  // console.log('Recat Rendring');
  
  const dispatch = useDispatch();
  const store_user = useSelector(getStoreUserData);
  const [items, setItems] = useState({ firstColumn: [], secondColumn: [], thirdColumn: [] });
  // console.log(items,"Rendring");
  
  const [loading, setLoading] = useState(true); // Loading state

  useEffect(() => {
    const fetchItems = async () => {
      setLoading(true); // Start loading
      try {
        // console.log("Fetching items...");
        const response = await axios.get('https://tyem.invenro.site/api/user/ExcelItems'); 
        const fetchedItems = response.data;

        // Filter items based on the selected category
        const filteredItems = selectedCategory === 'All' 
          ? fetchedItems 
          : fetchedItems.filter(item => item.category === selectedCategory);

        // Split items into three columns
        const columnLength = Math.ceil(filteredItems.length / 3);
        const firstColumn = filteredItems.slice(0, columnLength);
        // const secondColumn = filteredItems.slice(columnLength, 1 * columnLength);
        // const thirdColumn = filteredItems.slice(2 * columnLength);

        setItems({ firstColumn });
        setLoading(false); // End loading
      } catch (error) {
        console.error('There was an error fetching the items!', error);
        setLoading(false); // End loading on error
      }
    };
    fetchItems();
  }, [selectedCategory]);

  // Memoize item click handler
  const onItemClick = useCallback((item) => {
    console.log("Item clicked:", item);
    const cartItem = {
      Id: item.Id,  // Ensure this matches with cartSlice reducer
      name: item.ItemName,
      price: item.Price,
    };
  
    dispatch(addToCart(cartItem)); 
  }, [dispatch]);

  useEffect(() => {
    console.log("Component rendered:", { items });
  });


  return (
    <div className="flex justify-between gap-x-10 p-6">
     
        <>
          <div className="flex flex-col space-y-9">
            {items.firstColumn.map((item) => (
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
          <div className="flex flex-col space-y-9">
            {/* {items.secondColumn.map((item) => (
              <div
                key={item.Id}
                onClick={() => onItemClick(item)}
                className="bg-teal-600 text-white p-6 rounded-md flex flex-col justify-between hover:bg-teal-700 cursor-pointer"
                style={{ width: '180px', height: '120px' }} 
              >
                <h3 className="text-sm font-bold capitalize truncate">{item.ItemName}</h3>
                <h3 className="text-md font-medium mt-1">₹{parseFloat(item.Price).toFixed(2)}</h3>
              </div>
            ))} */}
          </div>
          <div className="flex flex-col space-y-9">
            {/* {items.thirdColumn.map((item) => (
              <div
                key={item.Id}
                onClick={() => onItemClick(item)}
                className="bg-teal-600 text-white p-6 rounded-md flex flex-col justify-between hover:bg-teal-700 cursor-pointer"
                style={{ width: '180px', height: '120px' }} 
              >
                <h3 className="text-sm font-bold capitalize truncate">{item.ItemName}</h3>
                <h3 className="text-md font-medium mt-1">₹{parseFloat(item.Price).toFixed(2)}</h3>
              </div>
            ))} */}
          </div>
        </>
    
    </div>
  );
});

export default ItemCard;
