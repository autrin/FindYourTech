const mongoose = require("mongoose");

const ReactFormDataSchema = new mongoose.Schema(
  {
    _id: {type: Number},
    productName: {type: String},
    productDescription: {
      size: {type: String},
      resolution: {type: String},
      processor: {type: String},
      ram: {type: String},
      storage: {type: String},
      operatingSystem: {type: String}
    },
    price: {type: Number},
    image_url: {type: String}
  },
  { collection: "final_project" }
);

const Product = mongoose.model("Product", ReactFormDataSchema);
module.exports = Product;
