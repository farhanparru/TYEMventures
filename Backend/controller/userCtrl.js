const orderData = require("../Model/userModel");
const Onlinorder = require('../Model/onlineOrdermodel')

const validateOrderData = (data) => {
  const { status, orderDetails, location, itemDetails, method, total, discount, type }=data;


  const validStatuses = ["pending", "paid", "cancelled"];
  const validMethods = ["cash", "card","Split","Talabat","other"];
  const validTypes = ["SALE", "PURCHASE"];
  const validDiscountTypes = ["fixed", "percentage"];
         
  if (!validStatuses.includes(status)) {  
    throw new Error("Invalid status value");    
  }    
  if (
    !orderDetails ||
    !orderDetails.orderNumber ||
    !orderDetails.invoiceNumber ||
    !orderDetails.customerName
  ) {
    throw new Error("Order details are incomplete");
  }

  if (!location) {
    throw new Error("Location is required");
  }

  if (
    !itemDetails ||
    typeof itemDetails.items !== "number" ||
    typeof itemDetails.quantity !== "number"
  ) {
    throw new Error("Item details are incomplete or invalid");
  }

  if (!validMethods.includes(method)) {
    throw new Error("Invalid payment method");
  }

  if (typeof total !== "number") {
    throw new Error("Total must be a number");
  }

  if (!validTypes.includes(type)) {
    throw new Error("Invalid order type");
  }
};

module.exports = {
  submitOrder: async (req, res) => {
    try {
      validateOrderData(req.body);

      const newOrder = new orderData(req.body);
      await newOrder.save();

      return res.status(201).json({
        status: "success",
        message: "Order created successfully",
        newOrder,
      });
    } catch (error) {
      console.error("Error creating order:", error.message);

      if (
        error.message.startsWith("Invalid") ||
        error.message.includes("required") ||
        error.message.includes("incomplete")
      ) {
        return res.status(400).json({ message: error.message });
      }
      res.status(500).json({ message: "Internal server error" });
    }
  },



 onlineOrder:async(req,res)=>{
   
   try {
    const orderData = {
      orderDetails: {
        posOrderId: req.body.order_id,
        orderType: req.body.catalog_id, 
        paymentMethod: req.body.payment_method,
        paymentTendered: req.body.cart_total,
        orderDate: new Date(req.body.ordered_at)
      },
      customer: {
        name: req.body.customer_name,
        email: "", 
        phone: req.body.customer_phone_number
      }
    } 

    const order = new Onlinorder(orderData)
    await order.save()
    res.status(201).send('Order saved successfully');
   } catch (error) {
    console.error('Error saving order:', error);
    res.status(400).send('Error saving order');
   }

 }

};