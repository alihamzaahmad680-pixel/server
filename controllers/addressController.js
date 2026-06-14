import Address from "../models/Address.js";

// ADD ADDRESS: /api/address/add
export const addAddress = async (req, res) => {
  try {
    const userId = req.userId;
    const { address } = req.body;

    if (!userId) {
      return res.json({
        success: false,
        message: "User ID nahi mili! Token missing hai.",
      });
    }

    await Address.create({
      ...address,
      userId,
    });

    res.json({ success: true, message: "Address added successfully 🎉" });
  } catch (error) {
    console.log(error.message);
    res.json({ success: false, message: error.message });
  }
};

export const getAddress = async (req, res) => {
  try {
    const userId = req.userId;

    if (!userId) {
      return res.json({ success: false, message: "User ID nahi mili!" });
    }

    const addresses = await Address.find({ userId });
    res.json({ success: true, addresses });
  } catch (error) {
    console.log(error.message);
    res.json({ success: false, message: error.message });
  }
};
