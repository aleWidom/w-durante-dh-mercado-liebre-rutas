const fs = require("fs");
const path = require("path");

const productsFilePath = path.join(__dirname, "../data/productsDataBase.json");

let products = JSON.parse(fs.readFileSync(productsFilePath, "utf-8"));

const toThousand = (n) => n.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");

const controller = {
  // Root - Show all products
  index: (req, res) => {
    let vistaProducts = [];

    products.forEach(function (originalProduct) {
      let vistaProduct = {
        name: originalProduct.name,
        id: originalProduct.id,
        price: originalProduct.price,
        image: originalProduct.image,
      };

      vistaProducts.push(vistaProduct);

      if (originalProduct.discount > 0) {
        vistaProduct.discount = originalProduct.discount + "% OFF";
      } else {
        vistaProduct.discount = "";
      }
    });
    res.render("products", { products: vistaProducts });
  },

  // Detail - Detail from one product
  detail: (req, res) => {
    let productsDetail = products.find(function (product) {
      return product.id == req.params.id;
    });

    let formulaDescuento = productsDetail.price - (productsDetail.price * productsDetail.discount) / 100;

    res.render("detail", { productsDetail, formulaDescuento });
  },

  // Create - Form to create
  create: (req, res) => {
    res.render("product-create-form");
  },

  // Create -  Method to store
  store: (req, res) => {
    res.send(req.body);
    products.push({
      id: Date.now(),
      name: req.body.name,
      price: req.body.price,
      discount: req.body.discount,
      category: req.body.category,
      description: req.body.description,
    });

    products = JSON.stringify(products);

    fs.writeFileSync(productsFilePath, products);
  },

  // Update - Form to edit
  edit: (req, res) => {
    console.log(req.query);

    let productsDetail = products.find(function (product) {
      return product.id == req.params.id;
    });

    res.render("product-edit-form", {
      productsDetail,
    });
  },

  // Update - Method to update
  update: (req, res) => {
    products.forEach(function (product) {
      if (product.id == req.params.id) {
        (product.name = req.body.name),
          (product.price = req.body.price),
          (product.discount = req.body.discount),
          (product.category = req.body.category),
          (product.description = req.body.description);
      }
    });

    products = JSON.stringify(products);

    fs.writeFileSync(productsFilePath, products);

    res.send(products);
  },

  // Delete - Delete one product from DB
  destroy: (req, res) => {
    products = products.filter(function (product) {
      return product.id != req.params.id;
    });

    products = JSON.stringify(products);
    fs.writeFileSync(productsFilePath, products);

    res.send(products);
  },
};

module.exports = controller;
