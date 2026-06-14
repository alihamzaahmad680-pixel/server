import express from "express";
import { upload } from "../configs/multer.js";
import authSeller from "../middlewares/authSeller.js";
import {
  addProduct,
  productList,
  changeStock,
} from "../controllers/productController.js";

const router = express.Router();

router.post("/add", upload.array("images"), authSeller, addProduct);
router.get("/list", productList);
router.post("/stock", authSeller, changeStock);

export default router;
