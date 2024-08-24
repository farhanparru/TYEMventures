import React, { useEffect, useState } from "react";

import { useDispatch, useSelector } from "react-redux";
import {
  filterItems,
  getItemCategories,
  getSelectedBodySection,
  getSelectedTab,
} from "../../../store/homeSlice";
import ItemCard from "../../../components/ItemCard";
import SearchInput from "../../../../../components/SearchInput";
import AddItemModal from "./addItem/AddItemModal";
import { getStoreUserData } from "../../../../../store/storeUser/storeUserSlice";
import HomeCategorySection from "../../HomeCategorySection";
import HomeTopBar from "../../HomeTopBar";
import AddCategoryModal from "./addcategory/AddCategoryModal";

const style = {
  background: "#0092ff",
  padding: "8px 0",
};

const HomeItemsSection = (props) => {
  const [selectedCategory, setSelectedCategory] = useState('All');


  const items = useSelector((state) => state.home.filteredItems);
  // const selectedCategory = useSelector((state) => state.home.selectedCategory);
  const selectedBodySection = useSelector(getSelectedBodySection);
  const selectedTab = useSelector(getSelectedBodySection);

  const dispatch = useDispatch();
  const [open, setOpen] = useState(false);
  const store_user = useSelector(getStoreUserData);
  const [openCat, setOpenCat] = useState(false);

  const [searchValue, setSearchValue] = React.useState("");

  const onSearch = (value) => {
    setSearchValue(value);
    dispatch(filterItems(value));
  };

  useEffect(() => {
    dispatch(filterItems(searchValue));
  }, [selectedCategory]);
  const showModal = () => {
    setOpen(true);
  };

  useEffect(() => {
    if (open == false) {
      dispatch(getItemCategories(store_user?.accessToken));
    }
  }, [open]);


  
  const showCatModal = () => {
    setOpenCat(true);
  };
  return (
    <>
      {!props.items_only &&

        <HomeTopBar selectedTab={selectedTab} />
      }

      <div className="search__section w-full flex gap-4 items-center mb-2 p-3">
        <SearchInput
          onInputChange={(e) => onSearch(e.target.value)}
          trailingTitle="⌘ k"
        />
        {/* <button
          onClick={showModal}
          className="px-7 py-3 w-1/2 bg-gray-200 rounded-md text-xs border border-gray-500 shadow-2xl cursor-pointer transition-all ease-in hover:shadow-sm hover:bg-blue-500 hover:text-white hover:scale-95"
        >
          + Add Item
        </button>  */}

        <div className="flex items-center justify-end mr-[25px] text-blue-500 w-[40%] font-semibold">
         {/* <div
            className="ml-[10px] px-7 py-3 bg-gray-200 rounded-md text-xs border  w-[250px]  shadow-2xl cursor-pointer transition-all ease-in hover:shadow-sm hover:bg-blue-500 hover:text-white hover:scale-95 flex items-center justify-center"
            onClick={showCatModal}
          >
            <h6>+ Add Category</h6>
          </div>  */}
        </div>
      </div>
      <div className="flex p-2 w-full h-full overflow-auto flex-row ">
        {selectedBodySection == "home" && (
          <HomeCategorySection onCategorySelect={setSelectedCategory} />
        )}
        <AddItemModal isOpen={open} setOpen={setOpen} />
        <AddCategoryModal isOpen={openCat} setOpen={setOpenCat} />

        <div
          className={`
  w-full items__section overflow-y-scroll 
  grid grid-cols-1 gap-5
  p-3
  md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 2xl:grid-cols-5
  sm:gap-4 lg:gap-6 xl:gap-4
  `}
  style={{ alignContent: "start" }}
>
  {items.map((item, index) => (
    <ItemCard key={index} selectedCategory={selectedCategory} />
  ))}
        </div>
      </div>
    </>
  );
};

export default HomeItemsSection;
