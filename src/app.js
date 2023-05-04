import express from "express";
import mongoose from "mongoose";
import config from "./config/environment.js";

const app = express();
app.use(express.json());

mongoose
  .connect(config.mongodb.uri, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then((res) => {
    console.log("MongoDB connected");
  })
  .catch((err) => {
    console.log("MongoDB connection Failed: " + err);
  });

import * as useProductCtl from "./controller/productCtl.js";
import * as useClientCtl from "./controller/clientCtl.js";

//Product routes
app.post(config.server.baseUrl + "/createProduct", useProductCtl.createProduct);
app.post(config.server.baseUrl + "/createManyProduct", useProductCtl.createManyProducts);
app.post(config.server.baseUrl + "/findProduct", useProductCtl.findProduct);
app.post(config.server.baseUrl + "/fetchProduct", useProductCtl.fetchProduct);
app.post(config.server.baseUrl + "/updateProduct", useProductCtl.updateProduct);
app.post(config.server.baseUrl + "/updateManyProduct",useProductCtl.updateManyProduct);
app.post(config.server.baseUrl + "/updatePrice",useProductCtl.updateProductPriceDiscount);
app.post(config.server.baseUrl + "/deleteFieldProduct",useProductCtl.deleteFieldProduct);
app.post(config.server.baseUrl + "/addCategoryProduct",useProductCtl.addCategoryProductField);
app.post(config.server.baseUrl + "/filterProduct",useProductCtl.filterProductPrice);
app.post(config.server.baseUrl + "/filterProductName",useProductCtl.filterProductName)
app.post(config.server.baseUrl + "/deleteProduct",useProductCtl.deleteProduct)
app.post(config.server.baseUrl + "/findOneUpdate",useProductCtl.findOneUpdateName);
app.post(config.server.baseUrl + "/findOneUpdatePrice",useProductCtl.findOneUpdatePrice);
app.post(config.server.baseUrl + "/findOneUpdateAddCategory",useProductCtl.findOneUpdateAddCategory);
app.post(config.server.baseUrl + "/insertNewProduct",useProductCtl.insertNewProduct);
app.post(config.server.baseUrl + "/filterProductByCategoryByPriceBetweenBytime",useProductCtl.filterProductByCategoryByPriceBetweenBytime);



//Client routes
app.post(config.server.baseUrl + "/createClient", useClientCtl.createClient);
export default app;
