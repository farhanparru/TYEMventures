import React, { useState, useEffect } from "react";
import { UilPlus } from "@iconscout/react-unicons";
import SearchInput from "../../../components/SearchInput";
import AddCustomerModal from "../components/AddCustomerModal";
import { useDispatch, useSelector } from "react-redux";
import {
  getIsCartOpen,
  getSeachedCustomerList,
  searchCustomer,
  setSelectedCustomer,
} from "../../home/store/customerSlice";
import { Drawer } from "antd";
import CustomerDetails from "./CustomerDetails";
import CustomerListTile from "./CustomerListTile";

const CustomerList = ({ selectedCustomer, isCart }) => {
  const dispatch = useDispatch();
  const [searchValue, setSearchValue] = useState("");
  const [open, setOpen] = useState(false);
  const [drawerVisible, setDrawerVisible] = useState(false);
  const isCartOpen = useSelector(getIsCartOpen);
  const customerList = useSelector(getSeachedCustomerList);
  const breakpoint = 900;
  const [isSmallDevice, setIsSmallDevice] = useState(window.innerWidth < breakpoint);

  useEffect(() => {
    window.addEventListener("resize", () => setIsSmallDevice(window.innerWidth < breakpoint));
  }, []);

  useEffect(() => {
    dispatch(searchCustomer(""));
  }, [dispatch]);

  const showModal = () => setOpen(true);

  const onSearch = (value) => {
    setSearchValue(value);
    dispatch(searchCustomer(value));
  };

  return (
    <div className="flex-1 flex flex-col gap-5 h-full">
      <div className="customer__header flex">
        <h2 className="text-2xl font-bold">Customers</h2>
        <div className="flex-1 flex justify-end">
          <button
            onClick={showModal}
            className="flex gap-2 items-center bg-blue-600 text-white px-5 py-2 rounded-md transition-all hover:scale-90"
          >
            <UilPlus />
            <h2 className="text-xs font-bold">Add Customer</h2>
          </button>
        </div>
      </div>
      <div className="flex-1 flex flex-col bg-white p-3 h-[90%] gap-4 rounded-lg">
        <SearchInput
          placeholder="Search by phone no.."
          onInputChange={(e) => onSearch(e.target.value)}
        />
        <h2 className="text-xl font-bold">Recent Customers</h2>
        <div className="flex-1 flex flex-col gap-5 overflow-y-scroll">
          {customerList?.map((customer, index) => {
            const isSelected = selectedCustomer?.id === customer.id;
            const bgClass = index % 2 === 0 ? "bg-gray-100" : "bg-transparent";
            return (
              <CustomerListTile
                isSelected={isSelected}
                bgClass={bgClass}
                customer={customer}
                key={index}
                setDrawerVisible={setDrawerVisible}
              />
            );
          })}
        </div>
      </div>
      <AddCustomerModal isOpen={open} setOpen={setOpen} />
      {selectedCustomer && !isCartOpen && drawerVisible ? (
        <Drawer
          width={isSmallDevice ? "70%" : "30%"}
          placement="right"
          closable
          onClose={() => setDrawerVisible(false)}
          open={drawerVisible}
        >
          <CustomerDetails selectedCustomer={selectedCustomer} />
        </Drawer>
      ) : null}
    </div>
  );
};

export default CustomerList;
