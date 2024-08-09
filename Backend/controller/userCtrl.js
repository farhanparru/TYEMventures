const orderData = require("../Model/userModel");
const OnlineOrder = require("../Model/onlineOrdermodel");
const Category = require("../Model/Categorymodel");
const expenseSchema = require("../Model/expensemodel");
const Customer = require("../Model/Customermodel");
const WebSocket = require("ws");
const axios = require('axios');
const moment = require('moment-timezone');
const {sendWhatsAppMessage} = require("../utlis/xpressBotService");
require("dotenv").config();

const validateOrderData = (data) => {
  const {
    status,
    orderDetails,
    location,
    itemDetails,
    method,
    total,
    discount,
    type,
  } = data;

  const validStatuses = ["PENDING", "COMPLETED"];
  const validMethods = ["cash", "card", "Split", "Talabat", "other"];
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

  // if (!validTypes.includes(type)) {
  //   throw new Error("Invalid order type");
  // }
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

  // sles report data get

  getOrders: async (req, res) => {
    try {
      const orders = await orderData.find({});
      return res.status(200).json(orders);
    } catch (error) {
      console.error("Error retrieving orders:", error.message);
      res.status(500).json({ message: "Internal server error" });
    }
  },

// Webhook endpoint to handle incoming orders
onlineOrder: async (req, res) => {
  try {
    const {
      order_id,
      catalog_id,
      payment_method,
      cart_total,
      customer_name,
      customer_phone_number,
      payment_status,
      item_lines, // Extract item_lines from the request body
    } = req.body;

    // Map item_lines to orderDetails structure
    const orderDetails = item_lines.map(item => ({
      product_name: item.product_name,
      product_quantity: item.product_quantity,
      product_currency: item.product_currency,
      product_amount: item.unit_price
    }));

    console.log(orderDetails,"kk");
    

       // Convert current date and time to IST
       const orderDate = moment().tz('Asia/Kolkata').format();
    // Construct order data
    const orderData = {
      orderDetails: orderDetails, // Store all products
      orderMeta: {
        posOrderId: order_id,
        orderType: catalog_id,
        paymentMethod: payment_method,
        paymentTendered: cart_total,
        orderDate: orderDate, // Save in IST
        paymentStatus: payment_status,
      },
      
      customer: {
        name: customer_name,
        phone: customer_phone_number,
      },
    
    };

    // console.log(orderData);
    // Save order to database
    const order = new OnlineOrder(orderData);
    await order.save();
    // Broadcast the new order to all WebSocket clients
    const wss = req.app.get('wss'); // Ensure WebSocket server is available
    wss.clients.forEach((client) => {
      if (client.readyState === WebSocket.OPEN) {
        client.send(JSON.stringify(orderData));
      }
    });

    res.status(200).send('Order received');
  } catch (error) {
    console.error("Error processing order:", error);
    res.status(500).send("Internal Server Error");
  }
},

  // Fetch Orders Endpoint

   fetchOnlineOrder:async(req,res)=>{  
    try {
      const orders = await OnlineOrder.find()
      res.json(orders);
      console.log(orders);
    } catch (error) {
      console.error('Error fetching orders:', error);
      res.status(500).json({ message: 'Error fetching orders', error });
    }
   },



  // Add category

  category: async (req, res) => {
    const {
      categoryName,
      arabicName,
      description,
      arabicDescription,
      enterPosition,
    } = req.body;
    try {
      // Create a new category instance

      const newCategory = new Category({
        categoryName,
        arabicName,
        description,
        arabicDescription,
        enterPosition,
      });

      const savedCategory = await newCategory.save();

      res.status(201).json({
        success: true,
        data: savedCategory,
        message: "Category created successfully",
      });
    } catch (error) {
      res.status(400).json({
        success: false,
        message: error.message,
      });
    }
  },

  // get Category

  getCategory: async (req, res) => {
    try {
      const categories = await Category.find();
      res.status(200).json({ categories });
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch categories" });
    }
  },

  // Whatsapp Through expense
  expense: async (req, res) => {
    const { Amount, Description } = req.body;

    try {
      const newExpense = new expenseSchema({
        Amount,
        Description,
      });

      // Emit new expense to all connected WebSocket clients
      wss.clients.forEach((client) => {
        if (client.readyState === 1) {
          // 1 indicates the connection is open
          client.send(JSON.stringify(newExpense));
        }
      });

      await newExpense.save();
      res.status(200).json({ message: "Expense data saved successfully." });
    } catch (error) {
      res.status(500).json({ message: "Error saving expense data.", error });
    }
  },

  // Add Customer

  addCustomer:async (req, res) => {
    const { fullName, Email, phoneNo, TaxNo, Address, language } = req.body;
  
    try {
      const newCustomer = new Customer({
        fullName,
        Email,
        phoneNo,
        TaxNo,
        Address,
        language
      });
  
      await newCustomer.save();
  


      try {
        // await sendWhatsAppMessage(phoneNo, 'Thank you for visiting.');
        // newCustomer.messageSent = true;
        await newCustomer.save();
        res.status(201).json({ message: 'Customer added and message sent successfully' });
      } catch (error) {
       console.log(error);
        res.status(500).json({ error: 'Customer added but failed to send WhatsApp message' });
      }
  
    } catch (error) {
      console.error('Error adding customer:', error.message);
      res.status(500).json({ error: error.message });
    }
  },


  statusUpdate:async(req,res)=>{
    const { id } = req.params;
    const { status } = req.body;

    try {
      const updateOrder = await OnlineOrder.findByIdAndUpdate(
        id,

      )
    } catch (error) {
      
    }
  },

  // Customer Mobile Number message
  
  }



  
 
