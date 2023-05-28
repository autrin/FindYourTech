const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const app = express();
const Product = require("./dataSchema.js");

app.use(express.json());
app.use(cors());

app.use(express.static("public"));
app.use("/images", express.static("images"));

mongoose.connect("mongodb://127.0.0.1:27017/reactdata", {
  dbName: "reactdata",
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const port = process.env.PORT || 4000;
const host = "localhost";
app.listen(port, () => {
  console.log(`App listening at http://%s:%s`, host, port);
});

app.get("/", async (req, resp) => {
  const query = {};
  const allProducts = await Product.find(query);
  console.log(allProducts);
  resp.send(allProducts);
});

app.get("/name/:name", async (req, resp) => {
  const name = req.params.name;
  let query = {};
  if (name) {
    query = { productName: { $regex: new RegExp(name, "i") } };
  }
  const allProducts = await Product.find(query);
  console.log(allProducts);
  resp.send(allProducts);
}); 

app.get("/id/:id", async (req, resp) => {
  const id = req.params.id;
  const query = { _id: id };
  const oneProduct = await Product.find(query);
  console.log(oneProduct);
  resp.send(oneProduct);
});

app.post("/insert", async (req, res) => {
  console.log(req.body);
  const p_id = req.body._id;
  const pname = req.body.productName;
  const pprice = req.body.price;
  const psize = req.body.productDescription.size;
  const pres = req.body.productDescription.resolution;
  const pproc = req.body.productDescription.processor;
  const pram = req.body.productDescription.ram;
  const pstorage = req.body.productDescription.storage;
  const poper = req.body.productDescription.operatingSystem;
  const pimage = req.body.image_url;

  const formData = new Product({
    _id: p_id,
    productName: pname,
    productDescription: {
      size: psize,
      resolution: pres,
      processor: pproc,
      ram: pram,
      storage: pstorage,
      operatingSystem: poper
    },
    price: pprice,
    image_url: pimage
  });
  try {
    // await formData.save();
    await Product.create(formData);
    const messageResponse = { message: `Product ${p_id} added correctly` };
    res.send(JSON.stringify(messageResponse));
  } catch (err) {
    console.log("Error while adding a new product:" + err);
  }
});

app.put("/update/:id", async (req, resp) => {
  const id = req.params.id;
  const query = { _id: id };
  const updatedProduct = await Product.findOneAndUpdate(
    query,
    { price: req.body.price },
    { new: true }
  );
  console.log(updatedProduct);
  resp.send(updatedProduct);
});

app.delete("/delete", async (req, res) => {
  console.log("Delete :", req.body);
  try {
    const query = { _id: req.body._id };
    await Product.deleteOne(query);
    const messageResponse = {
      message: `Product ${req.body._id} deleted correctly`,
    };
    res.send(JSON.stringify(messageResponse));
  } catch (err) {
    console.log("Error while deleting :" + p_id + " " + err);
  }
});
