const orderData = require("../Model/userModel");
const OnlineOrder = require("../Model/onlineOrdermodel");
const Category = require("../Model/Categorymodel");

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

  onlineOrder: async (req, res) => {
    try {
      // Validate request body
      const {
        order_id,
        catalog_id,
        payment_method,
        cart_total,
        ordered_at,
        customer_name,
        customer_phone_number,
      } = req.body;

      if (
        !order_id ||
        !catalog_id ||
        !payment_method ||
        !cart_total ||
        !ordered_at ||
        !customer_name ||
        !customer_phone_number
      ) {
        return res.status(400).send("Missing required order details");
      }

      // Construct order data
      const orderData = {
        orderDetails: {
          posOrderId: order_id,
          orderType: catalog_id,
          paymentMethod: payment_method,
          paymentTendered: cart_total,
          orderDate: new Date(ordered_at),
        },
        customer: {
          name: customer_name,
          email: "", // Update this if email is available in req.body
          phone: customer_phone_number,
        },
      };

      // Save order to database
      const order = new OnlineOrder(orderData);
      await order.save();

      // Broadcast the new order to all WebSocket clients
      const wss = req.app.get("wss");
      wss.clients.forEach((client) => {
        if (client.readyState === WebSocket.OPEN) {
          client.send(JSON.stringify(orderData));
        }
      });

      // Respond to client
      res
        .status(201)
        .json({ message: "Order saved successfully", orderId: order._id });
    } catch (error) {
      console.error("Error saving order:", error);
      res.status(500).send("Error saving order");
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

  getCategory:async(req,res)=>{
    try {
      const categories = await Category.find();
      res.status(200).json({categories})
    } catch (error) {
      res.status(500).json({ error: 'Failed to fetch categories' });
    }
  }

};
