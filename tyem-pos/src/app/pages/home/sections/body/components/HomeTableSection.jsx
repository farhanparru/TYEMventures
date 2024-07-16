import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  getBookedTableList,
  getGroupedTableList,
  getselectedTable,
  getTableList,
  groupTables,
  setselectedTable,
} from "../../../store/tableSlice";
import { TABLESTATES } from "../../../constants";
import { Tag } from "antd";
import HomeTopBar from "../../HomeTopBar";
import { getSelectedBodySection, selectBodySection } from "../../../store/homeSlice";
import { Toaster, toast } from 'sonner'
import moment from "moment";
import { addToCart, clearCart } from "../../../store/cartSlice";
import { setSelectedCustomer } from "../../../store/customerSlice";
import { setEditOrder } from "../../../store/orderSlice";

const HomeTableSection = () => {
  const dispatch = useDispatch();
  const tableList = useSelector(getTableList);
  const groupedTableList = useSelector(getGroupedTableList);
  const selectedTab = useSelector(getSelectedBodySection);

  useEffect(() => {
    dispatch(groupTables());
  }, [tableList]);

  const getTables = () => {
    return (
      <>
      {console.log(tableList)}
        {tableList && tableList?.floors &&  tableList?.floors.length > 0 ? (
          <>
            {tableList?.floors.map((floor, index) => {
              return (
                <div key={floor.id}>
                  {floor.active_tables && floor.active_tables.length > 0 && (
                    <>
                      <h4 className="font-semibold text-transform: capitalize text-md text-black">
                        {floor.name} Floor
                      </h4>
                      <div className="flex gap-4 flex-wrap">
                        {floor?.active_tables?.map((table, index) => {
                          return <TableTile table={table} key={table.id} />;
                        })}
                      </div>
                    </>
                  )}
                </div>
              );
            })}
          </>
        ) : (
          <h4 className="font-semibold text-md">No Floors or tables found</h4>
        )}
      </>
    );
  };

  return (
    <>

      <HomeTopBar selectedTab={selectedTab} />
      <div className="flex flex-col gap-5 p-3">

        <div className="flex justify-between">
          <h3 className="font-bold text-xl">Table View</h3>
          {/* <button className="p-2 bg-red-500 text-white font-medium  rounded-md cursor-pointer transition-all hover:scale-95 ">
          + Add Table
        </button> */}
        </div>
        {getTables()}
      </div>
    </>
  );
};

export default HomeTableSection;

const TableTile = ({ table }) => {
  const dispatch = useDispatch();

  const selectedTable = useSelector(getselectedTable);
  const bookedTableList = useSelector(getBookedTableList);
  const { ordersList } = useSelector((state) => state.order);
  const items = useSelector((state) => state.home.filteredItems);

  const isSelected = table.id === selectedTable?.id;

  const isBookedToday = bookedTableList?.some(bookedTable => bookedTable.res_table_id === table.id);

  // Calculate time ago for the booked table if it is booked today.
  let timeAgoMessage = '';
  let price = 0
  if (isBookedToday) {
    const bookingDetails = bookedTableList.find(bookedTable => bookedTable.res_table_id === table.id);
    const duration = moment.duration(moment().diff(moment(bookingDetails.created_at)));
    const hours = duration.asHours();
    if (hours < 1) {
      const minutes = duration.asMinutes();
      timeAgoMessage = `${Math.floor(minutes)} Min`;
    } else {
      // For durations beyond an hour, you might want to keep using fromNow() or another format
      timeAgoMessage = moment(bookingDetails.created_at).fromNow(true); // 'true' removes the suffix "ago"
    }
    price = bookingDetails ? bookingDetails.final_total : '';
  }


  // const pushToCart = (table) => {
   
  //   const matchingOrder = ordersList.find(order => order.selectedTable && order.selectedTable?.id === table?.id);
  //   if (matchingOrder) {
  //     dispatch(setEditOrder(matchingOrder))
  //   } else {
  //     // If no matching order is found, handle accordingly
  //     console.log("No matching order found for table_id:");
  //   }

  // }


  const pushToCart = (table) => {
    const bookedData = bookedTableList?.find(bookedTable => bookedTable.res_table_id === table.id);

    // const matchingOrderId = bookedTableList.find(bkT => bkT.id && bkT?.id === table?.id);
    
    let matchingOrder;
    if (isBookedToday) {
      matchingOrder = ordersList.find(order => order.selectedTable && order?.order_id === bookedData?.order_id);
     
    } else {

      matchingOrder = ordersList.find(order => order.selectedTable && order.selectedTable?.id === table?.id);
    }
    if (matchingOrder) {
      dispatch(setEditOrder(matchingOrder))
    } else {
      // If no matching order is found, handle accordingly
      console.log("No matching order found for table_id:",table);
    }

  }
  return (
    <div
      className={`relative py-5 px-10 border-2 mt-2 border-black rounded-md cursor-pointer flex flex-col items-center justify-center
        transition-all hover:scale-95 hover:border-gray-500
        ${isSelected ? "bg-blue-400 border-solid text-white" : " border-dashed"}
        ${isBookedToday ? "bg-red-500 text-white" : ""}
        `}
      onClick={() => {

        isBookedToday ? toast.error('Table is busy') : dispatch(setselectedTable(table));
        !isBookedToday && dispatch(selectBodySection('home'))
        isBookedToday && pushToCart(table)
      }}
      style={{ minHeight: '80px', maxHeight: '100px' }} // Ensure a minimum height for consistency
    >
      <h6 className="font-bold text-sm text-center">{table.name}</h6>
      {/* Adjustments for price and timeAgoMessage to ensure consistent height */}
      <div className="flex flex-col text-center">
        <h6 className={`font-bold text-sm ${price > 0 ? '' : 'invisible'}`}>
          {price > 0 ? `$${price}` : 'Placeholder'} {/* Use a placeholder or set invisible */}
        </h6>
        <h6 className={`font-bold text-sm ${timeAgoMessage ? '' : 'invisible'}`}>
          {timeAgoMessage || 'Placeholder'} {/* Use a placeholder or set invisible */}
        </h6>
      </div>

      {isSelected || isBookedToday ? (
        <Tag className="absolute bottom-[-0.5rem] right-1/2 translate-x-[60%] text-xs bg-gray-200 text-black">
          {isSelected && isBookedToday ? "Selected & Busy" : (
            <>
              {isSelected ? "Selected" : isBookedToday ? "Busy" : null}
            </>
          )}
        </Tag>
      ) : null}
    </div>
  );
};
