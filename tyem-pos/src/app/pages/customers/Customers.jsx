
import React, { useEffect, useState } from 'react'

import CustomerList from './sections/CustomerList'
import { useDispatch, useSelector } from 'react-redux'
import { getSelectedCustomer, setIsCartOpen } from '../home/store/customerSlice'

const Customers = ({isCart}) => {
  const selectedCustomer = useSelector(getSelectedCustomer)

  

  const dispatch = useDispatch()
  useEffect(() => {
    if(isCart === undefined || isCart){
      dispatch(setIsCartOpen(true))
    }else{
      dispatch(setIsCartOpen(false))
    }
  }, [selectedCustomer])

 


  return (
    <div className="flex w-full h-full gap-5 p-3 ">
      <CustomerList isCart selectedCustomer={selectedCustomer}  />
    </div>
  )
}

export default Customers
