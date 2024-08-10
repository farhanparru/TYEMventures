import React from 'react'

const OrderItem = () => {





  return (
    <div
      className={`p-3 mb-3 rounded-lg shadow-md flex justify-between items-center border cursor-pointer 
       `}
      
    >
      <div>
        <h3 className="text-lg font-semibold">
     98888888
        </h3>
        <p className="text-sm">
        10
        20
        INR
        </p>

        <div className="flex items-center mt-2">
          <span className={`px-2 py-1 text-xs font-semibold rounded `}>
         
          </span>


      
            <span className="ml-2 px-2 py-1 text-xs font-semibold text-red-800 bg-red-100 rounded">
              New
            </span>
         
        </div>
      </div>
      <div className="text-right">
  <h1 className="text-md  text-black">
   <h1>Date</h1>
  </h1>
  <h2 className="text-sm  text-black">
   <h1>tIME</h1>
  </h2>
</div>

    </div>
  );
};


const OrderDetails = () => {

  return (
    <div className="p-6 bg-white rounded-lg shadow-lg border border-gray-200 max-w-3xl mx-auto">
      <div className="mb-8">
        <h3 className="text-2xl font-bold mb-4 border-b pb-2">Order Details</h3>

        <div className="grid grid-cols-2 gap-4 mb-4">
          <div>
            <h4 className="font-semibold">Order ID</h4>
            <p>#39</p>
          </div>
          <div>
            <h4 className="font-semibold">Invoice Number</h4>
            <p>28</p>
          </div>
          <div>
            <h4 className="font-semibold">Order Type</h4>
            <p>WhatsAppOrder</p>{" "}
            {/* Ensure orderType is available in the order object */}
          </div>
          <div>
            <h4 className="font-semibold">Total Items</h4>
            <p>100</p>
          </div>
          <div>
            <h4 className="font-semibold">Subtotal</h4>
            <p>
              INR
            </p>
          </div>
          <div>
            <h4 className="font-semibold flex items-center">
              <FaTruck className="mr-2 text-gray-500" /> Delivery Charge
            </h4>
            <p>
             98
            </p>
          </div>
          <div>
            <h4 className="font-semibold">Total Amount</h4>
            <p>
             inr
            </p>
          </div>
          <div>
            <h4 className="font-semibold">Payment Method</h4>
            <p>Null</p>{" "}
          
          </div>
        </div>
      </div>

      <div className="mb-8">
        <h3 className="text-2xl font-bold mb-4 border-b pb-2">
          Customer Details
        </h3>

        <div className="grid grid-cols-2 gap-4 mb-4">
          <div>
            <h4 className="font-semibold">Name</h4>
            <p>KK</p>
          </div>
          <div>
            <h4 className="font-semibold">Phone Number</h4>
            <p>9072937703</p>
          </div>
          <div>
            <h4 className="font-semibold">Place</h4>
            <p>Kasaragod</p>{" "}
            {/* Ensure place is available in the order object */}
          </div>
          <div>
            <h4 className="font-semibold">Latitude & Longitude</h4>
            <p>Null</p>{" "}
          
          </div>
        </div>
      </div>

 
    </div>
  );
};

const CartSection = () => {



  // if (!order) {
  //   return (
  //     <div className="p-6 bg-gray-100 text-gray-500 rounded-lg">
  //       Select an order to view cart items.
  //     </div>
  //   );
  // }
  return (
    <div className="flex flex-col h-full p-4 bg-gray-800 text-white">
      {/* Cart Items */}
      <div className="flex-grow overflow-auto max-h-96">
      
          <div
            
            className="flex items-center justify-between p-4 bg-white rounded-md text-black mb-4"
          >
            <span className="font-semibold">FARHAN</span>
            <span>88</span>
            <span>pp</span>
            <span>INR</span>
          </div>
       
      </div>
  
      {/* Summary and Actions */}
      <div className="mt-auto p-4 bg-gray-700 text-white rounded-lg" style={{marginBottom:"42px"}}>
        {/* Subtotal */}
        <div className="flex justify-between mb-4">
          <span className="font-semibold">Subtotal</span>
          <span>
          <h1>helo</h1>
          </span>
        </div>
  
        {/* Total */}
        <div className="flex justify-between items-center mb-4">
          <span className="font-semibold">Total</span>
          <span>
         <h1>hh</h1>
          </span>
        </div>
  
        {/* Action Buttons */}
        <div className="flex justify-between items-center gap-4 mt-6">
        
      
      
              <button
                className="flex-1 bg-green-600 text-white py-2 px-4 rounded-lg hover:bg-green-700"
              
              >
                Accept
              </button>
  
              <button
                className="flex-1 bg-red-600 text-white py-2 px-4 rounded-lg hover:bg-red-700"
              
              >
                Reject
              </button>
         
        </div>
      </div>
    </div>
  );
};


const Salesssection = () => {
 






  return (
    <div className=" flex h-screen">
      <OrderNotification  />
      <div
        id="order-list"
        className="w-1/3 h-full p-4 border-r border-gray-300 bg-white overflow-y-auto"
      >
     
          <OrderItem />
     
      </div>
      <div className="w-1/3 h-full p-4 bg-white overflow-auto">
      
        
            <OrderDetails  />
        
          <p className="text-gray-500">Select an order to view details.</p>
       
      </div>
      <div className="w-1/3 h-full p-4 border-l border-gray-300 bg-white">

          <CartSection />
        
          <p className="text-gray-500">Select an order to view the cart.</p>
       
        <ToastContainer />
      </div>
    </div>
  );
};

export default Salesssection


