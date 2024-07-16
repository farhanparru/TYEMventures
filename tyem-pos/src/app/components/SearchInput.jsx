import React from 'react'
import { useSelector } from 'react-redux';
import { getSelectedCustomer } from '../pages/home/store/customerSlice';

const SearchInput = ({placeholder,trailingTitle,onInputChange,defaultValue}) => {
  const selectedCustomer = useSelector(getSelectedCustomer);

  return (
    <form className="w-full ">
            <div className="relative">
                <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="absolute top-0 bottom-0 w-6 h-6 my-auto text-gray-600 left-3"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                >
                    <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                    />
                </svg>
                <input
                    type="text"
                    placeholder={placeholder??"Search"}
                    onChange={onInputChange}
                    defaultValue={defaultValue}
                    className="w-full py-3 pl-12 pr-4 text-gray-800 border rounded-md outline-none bg-gray-50 focus:bg-white focus:border-indigo-600"
                />
                 <h2 className=' absolute right-2 top-3 text-sm text-gray-400'>{defaultValue??''}</h2>
            </div>
        </form>
  )
}

export default SearchInput
