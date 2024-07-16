import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { homeBodySection, homeTopBarTabs } from "../constants";
import { selectBodySection, selectTab } from "../store/homeSlice";
import { Link } from "react-router-dom";
import { clearEditOrder } from "../store/orderSlice";

const HomeTopBar = ({ selectedTab }) => {
  const { ordersList } = useSelector((state) => state.order);

  const [allOrdersCount, setallOrdersCount] = useState(10)
  const [onlineOrdersCount, setonlineOrdersCount] = useState(0)
  const [scheduledOrdersCount, setscheduledOrdersCount] = useState(0)
  const dispatch = useDispatch();


  useEffect(() => {
    getOrdersCount()
  }, [ordersList])
  const getOrdersCount = () => {
    // Count total orders
    const totalOrdersCount = ordersList.length;
    // Filter and count online orders
    const onlineOrdersCount = ordersList.filter(order => order.selling_price_group.toLowerCase() === "online").length;

    // Filter and count scheduled orders
    const scheduledOrdersCount = ordersList.filter(order => order.is_scheduled == 1).length;
    setallOrdersCount(totalOrdersCount)
    setonlineOrdersCount(onlineOrdersCount)
    setscheduledOrdersCount(scheduledOrdersCount)
  };

  const TextTab = ({ item, active }) => {
    return (
      <Link to={item.link}>
        <div className={`
         font-bold  text-center
         text-base px-3 py-2   rounded-md cursor-pointer transition-all 
          
          ${active
            ? "bg-ch-headers-500 text-white"
            : "hover:bg-ch-headers-300 hover:scale-90 bg-ch-headers-100 hover:text-ch-headers-500 text-ch-headers-500"
          }
          `}>

          <h3

            onClick={() => {
              dispatch(selectBodySection(item.slug));
              dispatch(clearEditOrder())
            }}
          >
            {item.name}
            {item.slug == "orders" &&

              "(" + allOrdersCount + ")"
            }

            {item.slug == "online-orders" &&

              "(" + onlineOrdersCount + ")"
            }
            {item.slug == "scheduled-orders" &&

              "(" + scheduledOrdersCount + ")"
            }
          </h3>

        </div>
      </Link>
    );
  };

  return (
    <div className="w-full  gap-3  flex  m-3">

      {homeBodySection.map((item, index) => {
        let isActive = item.slug === selectedTab;
        return <TextTab key={item.slug} active={isActive} item={item} />;
      })}
    </div>
  );
};

export default HomeTopBar;
