import Product from "../model/Product.js";

export const createProduct = async (req, res) => {
  const product = {
    name: req.body.name,
    price: req.body.price,
    category: req.body.category,
    pictureUrl: req.body.pictureUrl,
  };

  const insertProduct = new Product(product);
  await insertProduct.save().then((res) => console.log("result", res));
};

export const findProduct = async (req, res) => {
  try {
    const productId = req.body.productId;
    if (productId.length > 0) {
      const conditions = { _id: productId };
      const projection = { name: 1, price: 1, category: 1 }; //0 No show 1 = show

      const productInfo = await Product.findOne(conditions, projection);
      if (productInfo) {
        console.log("productInfo", productInfo);
        return res
          .status(200)
          .json({ status: "success", productInfo: productInfo });
      } else {
        return res.status(500).json({ status: "error" });
      }
    } else {
      return res
        .status(500)
        .json({ message: "please enter correct product id" });
    }
  } catch (err) {
    return res.status(500).json({ message: "Sorry, can't get request" });
  }
};

export const fetchProduct = async (req, res) => {
  try {
    const productInfo = await Product.find({});
    res.status(200).json({ status: "success", productInfo: productInfo });
  } catch (err) {
    res.status(500).json({ status: "Error to fetch product", err: err });
  }
};

export const updateProduct = async (req, res) => {
  try {
    const productId = req.body.productId;
    const name = req.body.name;
    const price = req.body.price;

    if (productId && name && price) {
      const condition = { _id: productId };
      const update = { $set: { name: name, price: price } };
      // const update = { ...req.body };
      const productInfo = await Product.updateOne(condition, update);

      if (!productInfo) {
        // console.log("no Product")
        return res.status(404).json({ status: "Product not found" });
      } else {
        const r = {
          status: "success",
          productInfo: productInfo,
        };
        console.log("Product updated->", r.productId);
        res.send(r);
      }
    } else {
      res.status(500).json({ status: "Fail to update product" });
    }
  } catch (err) {
    res.status(500).json({ status: "Fail to get request", err: err });
  }
};

export const updateManyProduct = async (req, res) => {
  try {
    const category = req.body.category;
    const price = req.body.price;
    if (price > 0 && category.length > 0) {
      const condition = { category: category };
      const update = { $set: { price: price } };

      const productInfo = await Product.updateMany(condition, update);
      if (productInfo) {
        const r = {
          status: "success",
          productId: productInfo,
        };
        // console.log("Product updated->", r.productId);
        return res.send(r);
      } else {
        return res.status(404).json({ status: "Fail to update product" });
      }
    } else {
      res.status(500).json({ status: "Input in not correct" });
    }
  } catch (err) {
    res.status(500).json({ status: "Fail to get request", err: err });
  }
};

export const updateProductPriceDiscount = async (req, res) => {
  const productId = req.body.productId;
  const price = req.body.price;
  const productInfo = await Product.updateOne({
    _id: productId,
    $inc: { price: price },
  });

  if (productInfo) {
    const r = {
      status: "success",
      productId: productInfo,
    };
    return res.status(200).json(r);
  } else {
    return res.status(500).json({ status: "Fail to update price" });
  }
};

export const deleteFieldProduct = async (req, res) => {
  const condition = { _id: req.body.productId };
  const update = { $pull: { category: req.body.category } };
  const productInfo = await Product.updateOne(condition, update);

  if (productInfo) {
    const r = {
      status: "success",
      productId: productInfo,
    };
    return res.status(200).json(r);
  } else {
    return res.status(500).json({ status: "Fail to delete category" });
  }
};

export const addCategoryProduct = async (req, res) => {
  const condition = { _id: req.body.productId };
  const update = { $push: { category: req.body.category } };

  const productInfo = await Product.updateOne(condition, update);
  if (productInfo) {
    const r = {
      status: "success",
      productId: productInfo,
    };
    return res.status(200).json(r);
  } else {
    return res.status(500).json({ status: "Fail to add category" });
  }
};

export const filterProductPrice = async (req, res) => {
  try {
    const condition = { name: name };
    const name = req.body.name;
    const field = req.body.field;
    const greaterThan = req.body.greaterThan;
    // console.log("name", name);
    const productInfo = await Product.find(condition)
      .where(field)
      .gt(greaterThan);
    if (productInfo) {
      return res.status(200).json(productInfo);
    } else {
      return res.status(500).json({ status: "Fail to filter product" });
    }
  } catch (err) {
    res.status(500).json({ message: err });
  }
};

export const filterProductName = async (req, res) => {
  const name = req.body.name;
  const productInfo = await Product.find({ name: { $in: `[/^${name}/]` } });
  if (productInfo) {
    return res
      .status(200)
      .json({ status: "success", productInfo: productInfo });
  } else {
    return res.status(500).json({ status: "error to filter product name" });
  }
};

export const deleteProduct = async (req, res) => {
  const condition = { _id: req.body.productId };

  const productInfo = await Product.deleteOne(condition);
  if (productInfo) {
    return res.status(200).json({ status: "success" });
  } else {
    return res.status(500).json({ status: "error to delete product" });
  }
};

export const findOneUpdate = async (req, res) => {
  const condition = { _id: req.body.productId };
  const update = { name: req.body.name };
  const options = { new: true };

  const productInfo = await Product.findByIdAndUpdate(
    condition,
    update,
    options
  );
  if (productInfo) {
    return res
      .status(200)
      .json({ status: "success", productInfo: productInfo });
  } else {
    return res.status(500).json({ status: "error to update product" });
  }
};

export const findOneUpdatePrice = async (req, res) => {
  const condition = { _id: req.body.productId };
  const update = { price: req.body.price };
  const options = { returnDocument: "after" };

  const productInfo = await Product.findByIdAndUpdate(
    condition,
    update,
    options
  );
  if (productInfo) {
    return res
      .status(200)
      .json({ status: "success", productInfo: productInfo });
  } else {
    return res.status(500).json({ status: "error to update product" });
  }
};

export const findOneUpdateCategory = async (req, res) => {
  const condition = { _id: req.body.productId };
  const update = { category: req.body.category };
  const options = { lean: "update success", returnDocument: "after" };

  const productInfo = await Product.findByIdAndUpdate(
    condition,
    update,
    options
  );
  if (productInfo) {
    return res
      .status(200)
      .json({ status: "success", productInfo: productInfo });
  } else {
    return res.status(500).json({ status: "error to update product" });
  }
};

export const insertNewProduct = async (req, res) => {
  const filter = { _id: [] };
  const newProduct = {
    name: req.body.name,
    price: req.body.price,
    category: req.body.category,
    pictureUrl: req.body.pictureUrl,
  };
  const options = { upsert: true };

  if (newProduct) {
    const productInfo = await Product.updateOne(filter, newProduct, options);
    return res
      .status(200)
      .json({ status: "Insert successfully", productInfo: productInfo });
  } else {
    return res.status(500).json({ message: "Insert failed" });
  }
};
