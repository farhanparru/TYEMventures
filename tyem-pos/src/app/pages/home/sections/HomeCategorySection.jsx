import React,{useState,useEffect} from "react";
import { useDispatch, useSelector } from "react-redux";
import { categoriesList } from "../constants";
import { getCategoryList, selectCategory } from "../store/homeSlice";


const CategoryItem = ({ item, active }) => {
  const dispatch = useDispatch();

  const filterItems = () => {
    dispatch(selectCategory(item.id));
  };

  return (
    <>
      <h3
        className={`font-bold w-full text-center text-sm p-2 cursor-pointer mb-1 mt-1 rounded-md ${active ? "bg-ch-headers-500 text-white" : "hover:bg-ch-headers-50 text-black"}`}
        onClick={filterItems}
      >
        {item.name}
      </h3>
      <hr />
    </>
  );
};


const HomeCategorySection = ({ selectedCategory }) => {
  const [categories, setCategories] = useState([]);
  const dispatch = useDispatch();

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await axios.get('https://tyem.invenro.site/api/user/ExcelItems');
        const uniqueCategories = [...new Set(response.data.map(item => item.category))];
        setCategories(uniqueCategories.map(category => ({ name: category, id: category })));
      } catch (error) {
        console.error('There was an error fetching the categories!', error);
      }
    };
    fetchCategories();
  }, []);

  const filterAll = () => {
    dispatch(selectCategory(0));
  };

  const isAll = selectedCategory === 0;

  return (
    <div className="flex flex-col mt-3 h-full w-[15%] rounded-lg bg-white border-2 border-gray-100 items-center shadow-xl px-3 py-2">
      <div className="home__categories w-full">
        <h3
          className={`w-full font-bold capitalize text-center text-sm p-2 cursor-pointer mb-1 rounded-md ${isAll ? "bg-ch-headers-500 rounded-tr text-white" : "hover:bg-ch-headers-50 rounded-tr text-black"}`}
          onClick={filterAll}
        >
          All
        </h3>
        <hr />
        {categories.map((item) => {
          const isActive = selectedCategory === item.id;
          return (
            <CategoryItem key={item.id} active={isActive} item={item} />
          );
        })}
      </div>
    </div>
  );
};

export default HomeCategorySection;
