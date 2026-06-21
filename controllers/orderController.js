// import Address from "../models/Address.js"; // 👈 Yeh line top par paste kar dein
// import Order from "../models/Order.js";
// import Product from "../models/Product.js";

// import stripe from "stripe";

// export const placeOrderCOD = async (req, res) => {
//   try {
//     const userId = req.userId;
//     const { items, address } = req.body;

//     if (!address || !items || items.length === 0) {
//       return res.json({ success: false, message: "Invalid data" });
//     }

//     let amount = 0;
//     for (const item of items) {
//       const productData = await Product.findById(item.product);
//       if (productData) {
//         amount += productData.offerPrice * item.quantity;
//       }
//     }

//     amount += Math.floor(amount * 0.02);

//     await Order.create({
//       userId,
//       items,
//       amount,
//       address,
//       paymentType: "COD",
//     });

//     return res.json({ success: true, message: "Order placed Successfully 🎉" });
//   } catch (error) {
//     return res.json({ success: false, message: error.message });
//   }
// };

// export const getUserOrders = async (req, res) => {
//   try {
//     const userId = req.userId;

//     const orders = await Order.find({
//       userId,
//       $or: [{ paymentType: "COD" }, { isPaid: true }],
//     })
//       .populate("items.product address")
//       .sort({ createdAt: -1 });

//     res.json({ success: true, orders });
//   } catch (error) {
//     res.json({ success: false, message: error.message });
//   }
// };

// export const getAllOrders = async (req, res) => {
//   try {
//     const orders = await Order.find({
//       $or: [{ paymentType: "COD" }, { isPaid: true }],
//     })
//       .populate("items.product address")
//       .sort({ createdAt: -1 });

//     res.json({ success: true, orders });
//   } catch (error) {
//     res.json({ success: false, message: error.message });
//   }
// };

// export const placeOrderStripe = async (req, res) => {
//   try {
//     const userId = req.userId;
//     const { items, address } = req.body;
//     const { origin } = req.headers;

//     if (!address || !items || items.length === 0) {
//       return res.json({ success: false, message: "Invalid data" });
//     }
//     let productData = [];

//     let amount = 0;
//     for (const item of items) {
//       const productData = await Product.findById(item.product);
//       productData.push({
//         name: product.name,
//         price: product.offerPrice,
//         quantity: item.quantity,
//       });
//       if (productData) {
//         amount += productData.offerPrice * item.quantity;
//       }
//     }

//     amount += Math.floor(amount * 0.02);

//     const order = await Order.create({
//       userId,
//       items,
//       amount,
//       address,
//       paymentType: "Online",
//     });

//     const stripeInstance = new stripe(
//       PromiseRejectionEvent.env.STRIPE_SECRET_KEY,
//     );

//     const line_items = productData.map((item) => {
//       return {
//         price_data: {
//           currency: "usd",
//           product_data: {
//             name: item.name,
//           },
//           unit_amount: (item.price + item.price * 0.02) * 100,
//         },
//         quantity: item.quantity,
//       };
//     });

//     const session = await stripeInstance.checkout.sessions.create({
//       line_items,
//       mode: "payment",
//       success_url: `${origin}/loader?next=my-orders`,
//       cancel_url: `${origin}/cart`,
//       metadata: {
//         orderId: order._id.toString(),
//         userId,
//       },
//     });

//     return res.json({ success: true, url: session.url });
//   } catch (error) {
//     return res.json({ success: false, message: error.message });
//   }
// };
export const placeOrderStripe = async (req, res) => {
  try {
    const userId = req.userId;
    const { items, address } = req.body;
    const { origin } = req.headers;

    if (!address || !items || items.length === 0) {
      return res.json({ success: false, message: "Invalid data" });
    }

    let lineItemsData = []; // نام تبدیل کر دیا تاکہ کنفیوژن نہ ہو
    let amount = 0;

    for (const item of items) {
      const product = await Product.findById(item.product);
      if (product) {
        // Stripe کے لیے ڈیٹا تیار کریں
        lineItemsData.push({
          name: product.name,
          price: product.offerPrice,
          quantity: item.quantity,
        });
        amount += product.offerPrice * item.quantity;
      }
    }

    amount += Math.floor(amount * 0.02);

    // آرڈر ڈیٹا بیس میں سیو کریں (isPaid: false رکھیں)
    const order = await Order.create({
      userId,
      items,
      amount,
      address,
      paymentType: "Online",
      isPaid: false,
    });

    // Stripe انیشلائزیشن درست کریں
    const stripeInstance = new stripe(process.env.STRIPE_SECRET_KEY);

    const line_items = lineItemsData.map((item) => ({
      price_data: {
        currency: "usd",
        product_data: {
          name: item.name,
        },
        unit_amount: Math.round((item.price + item.price * 0.02) * 100),
      },
      quantity: item.quantity,
    }));

    const session = await stripeInstance.checkout.sessions.create({
      line_items,
      mode: "payment",
      success_url: `${origin}/loader?next=my-orders`,
      cancel_url: `${origin}/cart`,
      metadata: {
        orderId: order._id.toString(),
        userId,
      },
    });

    return res.json({ success: true, url: session.url });
  } catch (error) {
    console.log("Stripe Order Error:", error);
    return res.json({ success: false, message: error.message });
  }
};
