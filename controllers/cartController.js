export const updateCart = async (req, res) => {
  try {
    const userId = req.userId;

    const { cartItems } = req.body;

    if (!userId) {
      return res.json({
        success: false,
        message: "User ID nahi mili! Token missing hai.",
      });
    }

    await User.findByIdAndUpdate(userId, { cartItems });

    res.json({ success: true, message: "Cart Updated successfully" });
  } catch (error) {
    console.log(error.message);
    res.json({ success: false, message: error.message });
  }
};
