const orderData = require("../Model/userModel");
const OnlineOrder = require("../Model/onlineOrdermodel");
const Category = require("../Model/Categorymodel");
const expenseSchema = require("../Model/expensemodel");
const Customer = require("../Model/Customermodel");
const WebSocket = require("ws");
const moment = require("moment-timezone");
const ThermalPrinter = require('node-thermal-printer').printer;
const PrinterTypes = require("node-thermal-printer").types;
const customerOnline = require('../Model/OnlineCustomer')
const path = require('path');
const excelSheetDatas = require('../Model/ItemsModal')
const XLSX = require('xlsx');
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
submitOrder:async (req, res) => {
    try {
      // Validate incoming order data
      validateOrderData(req.body);
  
      // Create and save the new order
      const newOrder = new orderData(req.body);
      await newOrder.save();
  
      // // Call the print function with the new order data
      // await printOrderReceipt(newOrder);
  
      // Respond with a success message
      return res.status(201).json({
        status: "success",
        message: "Order created successfully",
        newOrder,
      });
    } catch (error) {
      console.error("Error creating order:", error.message);
  
      // Handle specific validation errors
      if (
        error.message.startsWith("Invalid") ||
        error.message.includes("required") ||
        error.message.includes("incomplete")
      ) {
        return res.status(400).json({ message: error.message });
      }
  
      // Handle general errors
      res.status(500).json({ message: "Internal server error" });
    }
  },
  
  // sales printe
   printOrderReceipt:async (req, res) => {
    try {
      const {
        status,
        orderDetails,
        location,
        itemDetails,
        method,
        total,
        discount,
        qrCodeData,
      } = req.body;
  
      let printer = new ThermalPrinter({
        type: PrinterTypes.ROCKET,
        interface: "tcp://192.168.1.100:9100", // Use the correct port
      });
      
  
      printer.alignCenter();
      printer.println("Restaurant Name");
      printer.drawLine();
  
      printer.alignLeft();
      printer.println(`Order Number: ${orderDetails.orderNumber}`);
      printer.println(`Invoice Number: ${orderDetails.invoiceNumber}`);
      printer.println(`Customer: ${orderDetails.customerName}`);
      printer.println(`Location: ${location}`);
      printer.drawLine();
  
      itemDetails.itemName.forEach((item, index) => {
        printer.println(`${index + 1}. ${item} x ${itemDetails.quantity[index]}`);
      });
  
      printer.drawLine();
      printer.println(`Payment Method: ${method}`);
      printer.println(`Total: ${total}`);
      printer.println(`Discount: ${discount.value || "None"}`);
      printer.drawLine();
      printer.println("Thank you for dining with us!");
  
      // Print a QR code at the bottom of the receipt
      if (qrCodeData) {
        printer.println("Scan to View Details:");
        printer.printQR(qrCodeData, {
          cellSize: 8,
          correction: 'M'
        });
      }
  
      // Ensure the printer is connected before printing
      const isConnected = await new Promise((resolve, reject) => {
        printer.isPrinterConnected((err, connected) => {
          if (err) return reject(err);
          resolve(connected);
        });
      });
  
      if (isConnected) {
        await printer.execute(); 
        console.log("Receipt printed successfully.");
        res.send('Receipt printed successfully');
      } else {
        console.error("Printer is not connected.");
        res.status(500).send('Printer is not connected');
      }
    } catch (printError) {
      console.error("Error printing receipt:", printError);
      res.status(500).send("Error printing receipt");
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
      const orderDetails = item_lines.map((item) => ({
        product_name: item.product_name,
        product_quantity: item.product_quantity,
        product_currency: item.product_currency,
        unit_price: item.unit_price,
      }));

      // Convert current date and time to IST
      const orderDate = moment().tz("Asia/Kolkata").format();
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
      const wss = req.app.get("wss"); // Ensure WebSocket server is available
      wss.clients.forEach((client) => {
        if (client.readyState === WebSocket.OPEN) {
          client.send(JSON.stringify(orderData));
        }
      });

      res.status(200).send("Order received");
    } catch (error) {
      console.error("Error processing order:", error);
      res.status(500).send("Internal Server Error");
    }
  },


   // Online Customer

   onlineCustomer:async (req, res) => {
    try {
      const { customerName, phoneNumber, Location } = req.body;
  
      // Save the customer data to the database
      const newCustomer = new customerOnline({
        customerDetails: {
          customerName,
          phoneNumber,
          Location,
        },
      });
  
      const savedCustomer = await newCustomer.save();
  
       console.log(savedCustomer,"savedCustomer");
       
       
      // (Optional) Send acknowledgment back to XpressBot if needed
      // await axios.post('XpressBot API URL', { ...response });
  
      // Broadcast the new order to all WebSocket clients
      const wss = req.app.get("wss"); 
      if (wss) {
        wss.clients.forEach((client) => {
          if (client.readyState === WebSocket.OPEN) {
            client.send(JSON.stringify(savedCustomer));
          }
        });
      }
  
      res.status(200).json({ message: "Customer data processed successfully", savedCustomer });
    } catch (error) {
      console.error("Error processing customer data:", error);
      res.status(500).json({ message: "Internal Server Error" });
    }
  },



  
 // node thermal printer



 handleReciptprinter:async(req,res)=>{
  console.log(orderData,"orderData");
  
    try {
      const { order_id, catalog_id, payment_method, cart_total, customer_name, customer_phone_number, payment_status, item_lines } = req.body;

  
    // Map item_lines to orderDetails structure
    const orderDetails = item_lines ? item_lines.map((item) => ({
      product_name: item.product_name,
      product_quantity: item.product_quantity,
      product_currency: item.product_currency,
      unit_price: item.unit_price,
    })) : [];

    const orderDate = moment().tz("Asia/Kolkata").format();

    // Construct order data
    const orderData = {
      orderDetails: orderDetails,
      orderMeta: {
        posOrderId: order_id,
        orderType: catalog_id,
        paymentMethod: payment_method,
        paymentTendered: cart_total,
        orderDate: orderDate,
        paymentStatus: payment_status,
      },
      customer: {
        name: customer_name,
        phone: customer_phone_number,
      },
    };

       // Initialize printer
       const printer = new ThermalPrinter({
        type: PrinterTypes.ROCKET, // Assuming ROCKET is a valid type
        interface: 'tcp://192.168.1.100:9100', // IP address and port for the printer
      });

    // Print Company Logo
    const logoPath = path.join(__dirname, "../../tyem-pos/src/assets/Logo.png");
    printer.alignCenter();
    printer.printImage(logoPath, function(done) {
      console.log("Logo printed");
    });
    printer.newLine();

    printer.bold(true);
    printer.println(`Order ID: ${order_id}`);
    printer.println(`Date: ${orderDate}`);
    printer.println(`Customer: ${customer_name}`);
    printer.newLine();

    // Ensure orderDetails has at least one item before accessing [0]
    if (orderDetails.length > 0) {
      orderDetails.forEach((item) => {
        printer.println(`${item.product_name} x${item.product_quantity}`);
        printer.println(`${item.product_currency}${item.unit_price}`);
        printer.drawLine();
      });
      
      printer.newLine();
      printer.bold(true);
      printer.println(`Total: ${orderDetails[0].product_currency}${orderData.orderMeta.paymentTendered}`);
      printer.bold(false);
      printer.println(`Payment Method: ${orderData.orderMeta.paymentMethod}`);
      printer.println(`Payment Status: ${orderData.orderMeta.paymentStatus}`);
      printer.newLine();

      // Print QR Code
      const qrCodeData = `Order ID: ${order_id}\nDate: ${orderDate}\nTotal: ${orderDetails[0].product_currency}${orderData.orderMeta.paymentTendered}`;
      printer.alignCenter();
      printer.printQR(qrCodeData, {cellSize: 6});
      printer.newLine();
      printer.cut();
    } else {
      printer.println("No order details available.");
    }

    // Check if the printer is connected
    const isConnected = await printer.isPrinterConnected();      
    // console.log(isConnected);
       
    if (isConnected) {
      await printer.execute(); 
      console.log("Receipt printed successfully.");
    } else {
      console.error("Printer is not connected.");
    }

    res.send('Receipt printed successfully');
  } catch (printError) {
    console.error("Error printing receipt:", printError);
    res.status(500).send("Error printing receipt");
  }
},

  // Fetch Orders Endpoint

  fetchOnlineOrder: async (req, res) => {
    try {
      const orders = await OnlineOrder.find();
      res.json(orders);
      console.log(orders);
    } catch (error) {
      console.error("Error fetching orders:", error);
      res.status(500).json({ message: "Error fetching orders", error });
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

  addCustomer: async (req, res) => {
    const { fullName, Email, phoneNo, TaxNo, Address, language } = req.body;

    try {
      const newCustomer = new Customer({
        fullName,
        Email,
        phoneNo,
        TaxNo,
        Address,
        language,
      });

      await newCustomer.save();
      try {
        // await sendWhatsAppMessage(phoneNo, 'Thank you for visiting.');
        // newCustomer.messageSent = true;
        await newCustomer.save();
        res
          .status(201)
          .json({ message: "Customer added and message sent successfully" });
      } catch (error) {
        console.log(error);
        res
          .status(500)
          .json({
            error: "Customer added but failed to send WhatsApp message",
          });
      }
    } catch (error) {
      console.error("Error adding customer:", error.message);
      res.status(500).json({ error: error.message });
    }
  },

  // payment status
  statusUpdate: async (req, res) => {
    const { status } = req.body;

    try {
      const order = await OnlineOrder.findByIdAndUpdate(
        req.params.id,
        { paymentStatus: status },
        { new: true } // Return the updated order
      );

      if (!order) {
        return res.status(404).send("Order not found");
      }

      res.send(order); // Send back the updated order
    } catch (error) {
      console.error(error);
      res.status(500).send("Server error");
    }
  },

 // google sheet data update


  ItemsUpdate:async (req, res) => {
  try {
    // Extract `id` and `description` from the request body
    const { id } = req.body;

    // console.log(req.body);
    
    // Construct the URL with the dynamic `id`
    const url = `https://script.google.com/macros/s/AKfycbygNbw5aqZvf7t59UUX275UaiszFRz_Grcp3yYYEvkRgiEBs_aBvvyX1nKTdqfVM_b-mg/exec?gid=1028792536&id=${id}`;

    // Use `fetch` to send a PATCH request
    const response = await fetch(url, {
      method: 'PATCH', // Set the method to PATCH
      headers: {
        'Content-Type': 'application/json',     
      },
      body: JSON.stringify({ description,id }), // Send description in the body
    });
    
    if (!response.ok) {    
      throw new Error('Network response was not ok');
    }
    
    const data = await response.json(); // Assuming the data is in JSON format
    
    console.log(data); // Process the data here
    
    // Send a response to the client with the fetched data
    res.status(200).json(data);
  } catch (error) {
    console.error('There was a problem with the fetch operation:', error);
    
    // Send an error response to the client
    res.status(500).json({ error: 'Failed to fetch data' });
  }
},


// paymentStatus update

paymentStatus:async(req,res)=>{
  const { id } = req.params;
  const { status } = req.body;
  try {
    // Validate the status if necessary
    const validStatuses = ['Pending', 'Accepted', 'Ready', 'Assigned', 'Completed', 'Rejected', 'Cancelled'];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({ message: 'Invalid status' });
    }

    // Update the payment status in the database
    const updatedOrder = await OnlineOrder.findByIdAndUpdate(
      id,
      { 'orderMeta.paymentStatus': status },
      { new: true }
    );

    if (!updatedOrder) {
      return res.status(404).json({ message: 'Order not found' });
    }

    res.status(200).json(updatedOrder);
    console.log(updatedOrder,"updatedOrder");
    
  } catch (error) {
    console.log(error);
    
    res.status(500).json({ message: 'Internal Server Error' });
  }
},


// ExcelSheet datas


ImportExcel:async(req,res)=>{

  try {
    if (!req.file) return res.status(400).send('No file uploaded.');

    // Read the uploaded file
    const workbook = XLSX.readFile(req.file.path);
    const worksheet = workbook.Sheets[workbook.SheetNames[0]];
    const data = XLSX.utils.sheet_to_json(worksheet);

    // Save data to database
    for (const item of data) {
      await excelSheetDatas.create(item);
    }

    res.status(200).send('File processed and data saved.');
  } catch (error) {
    console.error(error);
    res.status(500).send('Error processing file.');
  }
},


// getExcelSheet datas

SheetDataGet:async(req,res)=>{
  try {
    const items = await excelSheetDatas.find();
    res.status(200).json(items);
  } catch (error) {
    console.error(error);
    res.status(500).send('Error retrieving items.');
  }

}

}