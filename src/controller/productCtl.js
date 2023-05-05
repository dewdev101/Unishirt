import Product from "../model/Product.js";

export const createProduct = async (req, res) => {
  try {
    const product = {
      name: req.body.name,
      price: req.body.price,
      category: req.body.category,
      pictureUrl: req.body.pictureUrl,
    };

    const insertProduct = new Product(product);
    await insertProduct
      .save()
      .then((response) =>
        res.status(200).json({ status: "success", databaseInfo: insertProduct })
      );
  } catch (err) {
    res.status(500).json({ status: "Fail to create product" });
  }
};

export const findProductAndDisplayNamePriceCategory = async (req, res) => {
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
    return res.status(500).json({ message: "Product not found" });
  }
};

export const fetchProduct = async (req, res) => {
  try {
    const productInfo = await Product.find({});
    res.status(200).json({
      status: "success",
      itemsCount: productInfo.length,
      productInfo: productInfo,
    });
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
    res.status(500).json({ status: "Product not found", err: err });
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
    res.status(500).json({ status: "Product not found", err: err });
  }
};

export const updateProductPriceDiscount = async (req, res) => {
  try {
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
  } catch (err) {
    res.status(500).json({ status: "Product not found" });
  }
};

export const deleteFieldProduct = async (req, res) => {
  try {
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
  } catch (err) {
    res.status(500).json({ status: "Product not found" });
  }
};

export const addCategoryProductField = async (req, res) => {
  try {
    const condition = { _id: req.body.productId };
    const update = { $push: { category: req.body.category } };
    const options = { upsert: true };

    const productInfo = await Product.updateOne(condition, update, options);
    if (productInfo) {
      const r = {
        status: "success",
        productId: productInfo,
      };
      return res.status(200).json(r);
    } else {
      return res.status(500).json({ status: "Fail to add category" });
    }
  } catch (err) {
    res.status(500).json({ status: "Product not found", err: err });
  }
};

export const filterProductPrice = async (req, res) => {
  try {
    const name = req.body.name;
    const field = req.body.field;
    const greaterThan = req.body.greaterThan;

    const condition = { name: name };

    // console.log("name", name);
    const productInfo = await Product.find(condition)
      .where(field)
      .gt(greaterThan);

    if (productInfo) {
      return res.status(200).json( {itemCount:productInfo.length,result:productInfo.length >0 ? productInfo : "No product"});
    } else {
      return res.status(500).json({ status: "Fail to filter product" });
    }
  } catch (err) {
    res.status(500).json({ status: "Product not found", message: err });
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
  try {
    const condition = { _id: req.body.productId };
    if (condition) {
      const productInfo = await Product.deleteOne(condition);
      // console.log("productInfo",productInfo);
      if (productInfo) {
        return res.status(200).json({
          status:
            productInfo.deletedCount !== 0
              ? "The product is deleted successfully"
              : "No product to delete",
        });
      } else {
        return res.status(500).json({ status: "error to delete product" });
      }
    } else {
      res.status(500).json({ status: "Please enter correct product ID" });
    }
  } catch (err) {
    res.status(500).json({ status: "Product not found", err: err });
  }
};

export const findOneUpdateName = async (req, res) => {
  try {
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
  } catch (err) {
    res.status(500).json({ status: "Product not found" });
  }
};

export const findOneUpdatePrice = async (req, res) => {
  try {
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
  } catch (err) {
    res.status(500).json({ status: "Product not found" });
  }
};

export const findOneUpdateAddCategory = async (req, res) => {
  try {
    const condition = { _id: req.body.productId };
    const update = { $push: { category: req.body.category } };
    const options = { lean: "update success", returnDocument: "after" };
    try {
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
        return res.status(502).json({ status: "error to update category" });
      }
    } catch (err) {
      res.status(501).json({ status: "error to update category" });
    }
  } catch (err) {
    res.status(500).json({ status: "Fail to get request" });
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

export const filterProductByCategoryByPriceBetweenBytime = async (req, res) => {
  try {
    const greaterThan = req.body.greater;
    const lessThan = req.body.less;
    const ranking = req.body.ranking;
    const timefilter = req.body.timefilter;
    const category = req.body.category;

    //check input
    if (
      category.length !== 0 &&
      greaterThan > 0 &&
      lessThan > 0 &&
      ranking.length !== 0 &&
      timefilter.length !== 0
    ) {
      const productInfo = await Product.find({});

      const filterProductArr = productInfo.filter((product) =>
        category.every((r) => product.category.includes(r))
      );

      const _result = filterProductArr.filter(
        (product) =>
          product.price <= Number(lessThan) &&
          product.price >= Number(greaterThan)
      );

      // sort price
      const result =
        ranking === "asc"
          ? _result.sort((a, b) => a.price - b.price)
          : _result.sort((a, b) => b.price - a.price);

      // sort time
      const finalResult =
        timefilter === "lastest"
          ? result.sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt))
          : result.sort(
              (a, b) => new Date(a.updatedAt) - new Date(b.updatedAt)
            );

      return finalResult.length > 0
        ? res.status(200).json({
            status: `Product found ${result.length} items`,
            result: finalResult,
          })
        : res.status(200).json({ status: "Product not found" });
    } else {
      res.status(501).json({ status: "Input are incorrect" });
    }
  } catch (err) {
    res.status(500).json({ status: "Fail to get request", err: err });
  }
};

export const createManyProducts = async (req, res) => {
  try {
    const body = req?.body;
    if (body.length > 0) {
      const databaseInfo = await Product.insertMany(body);
      res.status(200).json({
        status: "Create many products completely",
        itemsCount: databaseInfo.length,
        databaseInfo: databaseInfo,
      });
    } else {
      res.status(501).json({ status: "Please add product" });
    }
  } catch (err) {
    res.status(500).json({ status: "Fail to get request", err: err });
  }
};
