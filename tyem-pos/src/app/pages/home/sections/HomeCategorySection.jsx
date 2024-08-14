import React,{useEffect} from "react";
import { useDispatch, useSelector } from "react-redux";
import { categoriesList } from "../constants";
import { getCategoryList, selectCategory } from "../store/homeSlice";

const CategoryItem = ({ item, active }) => {
  const dispatch = useDispatch();
  const allCategories = useSelector(getCategoryList);

  const filterItems = (slug) => {
    dispatch(selectCategory(item.id));
  };

    useEffect(() => {
    const fetchItems = async () => {
      try {
        const response = await axios.get('https://tyem.invenro.site/api/user/ExcelItems'); // Adjust your API endpoint
        setItems(response.data);
      } catch (error) {
        console.error('There was an error fetching the items!', error);
      }
    };
    fetchItems();
  }, []);

  return (
    <>
      <h3
        className={`
        
       font-bold w-full text-center text-sm p-2 cursor-pointer mb-1 mt-1 rounded-md
       
       ${
         active
           ? "bg-ch-headers-500 text-white"
           : "hover:bg-ch-headers-50 text-black"
       }
    `}
        onClick={filterItems}
      >
        {/* {item.name} */}
      </h3>
      <hr/>
    </>
  );
};

const HomeCategorySection = ({ selectedCategory }) => {
  const allCategories = useSelector(getCategoryList);
  const dispatch = useDispatch();
  

  const filterAll = () => {
    dispatch(selectCategory(0));
  };
  let isAll = selectedCategory === 0;


  return (
    <div className="flex flex-col mt-3 h-full w-[15%] rounded-lg bg-white border-2 border-gray-100 items-center shadow-xl px-3 py-2">
      {/* <h3 className="text-white font-black w-full text-center text-sm p-2 border-b-white ">
        Categories
      </h3> */}
      <div className="home__categories w-full">
        <h3
          className={`
       
        w-full font-bold capitalize text-center text-sm p-2 cursor-pointer mb-1 rounded-md
       
       ${
         isAll
           ? "bg-ch-headers-500   rounded-tr text-white "
           : "hover:bg-ch-headers-50  rounded-tr text-black"
       }
    `}
          onClick={filterAll}
        >
          All
        </h3>
        <hr/>
        {allCategories?.map((item, index) => {
          let isActive = selectedCategory === item.id;
          return (
            <div key={item?.id}>
              <CategoryItem active={isActive} item={item} key={item.id} />
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default HomeCategorySection;
