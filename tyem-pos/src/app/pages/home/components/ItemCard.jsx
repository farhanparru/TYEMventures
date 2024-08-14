import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { addToCart } from "../store/cartSlice";
import { Switch } from "antd";
import axios from "axios";
import { getStoreUserData } from "../../../store/storeUser/storeUserSlice";


const ItemCard = ({ item, show_toggle }) => {
  const dispatch = useDispatch();
  const store_user = useSelector(getStoreUserData);
  const [items,setItems]=useState([])
  const [active, setActive] = useState(item?.is_inactive)

  const onItemClick = () => {
    dispatch(addToCart(item));
  };

  
  function onChange(checked) {
    console.log(`switch to ${checked}`);
    setActive(checked)

    const headers = {
      "Authorization": `Bearer ${store_user?.accessToken}`,
      "Content-Type": "application/json",
      "Accept": "application/json",
    };


    useEffect(() => {
      axios.get('https://tyem.invenro.site/api/user/ExcelItems') // Adjust your API endpoint
        .then((response) => {
          setItems(response.data);
        })
        .catch((error) => {
          console.error('There was an error fetching the items!', error);
        });
    }, []);
  

    // Cash Register Does Not Exist.
   
  }     
  return (
    <div
      onClick={onItemClick}
      className="home__item  flex flex-col   gap-2 justify-around bg-ch-headers-500 text-white p-3 rounded-md shadow-xl cursor-pointer transition-all ease-in-out hover:bg-slate-300 hover:scale-95 hover:shadow-sm"
    >
     {items.map((item,index)=>{
      <><h3  key={index} className="text-sm font-bold text-transform: capitalize">
         {item.ItemName}
       </h3><h3 className="text-xs font-medium">₹ {parseFloat(item.Price).toFixed(3)}</h3></>
      {show_toggle == true &&
        <Switch checked={active} onChange={onChange} className={`w-10 ${!active ? 'bg-red-500' : 'bg-green-500'}`} />
      }
     })}
     
   
    </div>
  );
};

export default ItemCard;
