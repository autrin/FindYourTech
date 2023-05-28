import { useState, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faMugHot } from "@fortawesome/free-solid-svg-icons";

function App() {
  const [searchQuery, setSearchQuery] = useState("");
  const [cart, setCart] = useState([]);
  const [oneProduct, setOneProduct] = useState([]);
  const [cartTotal, setCartTotal] = useState(0);
  const [product, setProduct] = useState([]);
  const [viewer1, setViewer1] = useState(false);
  const [viewerAddItem, setViewerAddItem] = useState(false);
  const [productUpdateId, setProductUpdateId] = useState();
  const [newPrice, setNewPrice] = useState();

  const [addNewProduct, setAddNewProduct] = useState({
    _id: 0,
    productName: "",
    productDescription: {
      size: "",
      resolution: "",
      processor: "",
      ram: "",
      storage: "",
      operatingSystem: "",
    },
    price: 0.0,
    image_url: "",
  });

  const addToCart = (el) => {
    const existingItem = cart.find((item) => item._id === el._id);
    if (existingItem) {
      const updatedCart = cart.map((item) => {
        if (item._id === existingItem._id) {
          return { ...item, quantity: item.quantity + 1 };
        } else {
          return item;
        }
      });
      setCart(updatedCart);
    } else {
      const updatedCart = [...cart, { ...el, quantity: 1 }];
      setCart(updatedCart);
    }
  };

  function handleAddItemEvent(e) {
    e.preventDefault();
    console.log(e.target.value);
    fetch("http://localhost:4000/insert", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(addNewProduct),
    })
      .then((response) => response.json())
      .then((data) => {
        console.log("Post a new product completed");
        console.log(data);
        if (data) {
          //const keys = Object.keys(data);
          const value = Object.values(data);
          alert(value);
        }
      });
    setViewerAddItem(!viewerAddItem);
  }

  function handlePriceSubmit(event) {
    event.preventDefault();
    updateProductPrice(newPrice, productUpdateId);
    setNewPrice("");
  }

  function handlePriceChange(event) {
    setNewPrice(event.target.value);
  }

  function handleChange(evt) {
    const name = evt.target.name;
    const value = evt.target.value;

    if (name === "_id") {
      setAddNewProduct({ ...addNewProduct, _id: value });
    } else if (name === "productName") {
      setAddNewProduct({ ...addNewProduct, productName: value });
    } else if (name === "price") {
      setAddNewProduct({ ...addNewProduct, price: value });
    } else if (name === "size") {
      setAddNewProduct({
        ...addNewProduct,
        productDescription: {
          ...addNewProduct.productDescription,
          size: value,
        },
      });
    } else if (name === "resolution") {
      setAddNewProduct({
        ...addNewProduct,
        productDescription: {
          ...addNewProduct.productDescription,
          resolution: value,
        },
      });
    } else if (name === "processor") {
      setAddNewProduct({
        ...addNewProduct,
        productDescription: {
          ...addNewProduct.productDescription,
          processor: value,
        },
      });
    } else if (name === "ram") {
      setAddNewProduct({
        ...addNewProduct,
        productDescription: { ...addNewProduct.productDescription, ram: value },
      });
    } else if (name === "storage") {
      setAddNewProduct({
        ...addNewProduct,
        productDescription: {
          ...addNewProduct.productDescription,
          storage: value,
        },
      });
    } else if (name === "operatingSystem") {
      setAddNewProduct({
        ...addNewProduct,
        productDescription: {
          ...addNewProduct.productDescription,
          operatingSystem: value,
        },
      });
    } else if (name === "image_url") {
      setAddNewProduct({ ...addNewProduct, image_url: value });
    }
  }

  useEffect(() => {
    getAllProducts();
  }, []);

  useEffect(() => {
    total();
  }, [cart]);

  const total = () => {
    let totalVal = 0;
    for (let i = 0; i < cart.length; i++) {
      totalVal += cart[i].price * cart[i].quantity;
    }
    setCartTotal(totalVal);
  };

  const removeFromCart = (el) => {
    const existingItem = cart.find((item) => item._id === el._id);
    if (existingItem.quantity > 1) {
      const updatedCart = cart.map((item) => {
        if (item._id === existingItem._id) {
          return { ...item, quantity: item.quantity - 1 };
        } else {
          return item;
        }
      });
      setCart(updatedCart);
    } else {
      const updatedCart = cart.filter((item) => item._id !== el._id);
      setCart(updatedCart);
    }
  };
  

  function getAllProducts() {
    fetch("http://localhost:4000/")
      .then((response) => response.json())
      .then((data) => {
        console.log("Show Catalog of Products :");
        console.log(data);
        setProduct(data);
      });
    setViewer1(!viewer1);
  }

  function getOneProduct(id) {
    setProductUpdateId(id);
    console.log(id);
    if (id >= 1 && id <= 20) {
      fetch("http://localhost:4000/id/" + id)
        .then((response) => response.json())
        .then((data) => {
          console.log("Show one product :", id);
          console.log(data);
          // const dataArr = [];
          // dataArr.push(data);
          setOneProduct(data);
        });
    } else {
      console.log("Wrong number of Product id.");
    }
  }

  function searchProducts(productName) {
    console.log(productName);
    if (productName == "") {
      getAllProducts();
      return;
    }
    fetch("http://localhost:4000/name/" + productName)
      .then((response) => response.json())
      .then((data) => {
        console.log("Show Catalog of Products :");
        console.log(data);
        setProduct(data);
      });
  }

  function updateProductPrice(updatePrice, updateId) {
    console.log("Product to update: ", updateId);
    fetch("http://localhost:4000/update/" + updateId, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ price: updatePrice }),
    })
      .then((response) => response.json())
      .then((data) => {
        console.log("Product updated: ", data);
        // Perform any additional actions after updating the product
      })
      .catch((error) => console.error(error));
  }

  function deleteOneProduct(deleteid) {
    console.log("Product to delete :", deleteid);
    fetch("http://localhost:4000/delete/", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ _id: deleteid }),
    })
      .then((response) => response.json())
      .then((data) => {
        console.log("Delete a product completed : ", deleteid);
        console.log(data);
        if (data) {
          //const keys = Object.keys(data);
          const value = Object.values(data);
          alert(value);
        }
      });
  }

  const listItems = product.map((el) => (
    // PRODUCT
    <div class="card shadow-sm">
      <img src={el.image_url} alt={el.productName} hspace="30" vspace="30" />
      <div class="card-header">
        <p class="card-text">{el.productName}</p>
      </div>
      <div class="card-body">
        <p class="card-text">
          <ul>
            <li>Price: ${el.price}</li>
            <li>Size: {el.productDescription.size}</li>
            <li>Resolution: {el.productDescription.resolution}</li>
            <li>Processor: {el.productDescription.processor}</li>
            <li>RAM: {el.productDescription.ram}</li>
            <li>Storage: {el.productDescription.storage}</li>
            <li>Operating System: {el.productDescription.operatingSystem}</li>
          </ul>
        </p>
        <div class="d-flex justify-content-between align-items-center">
          <div class="btn-group">
            <button
              type="button"
              class="btn btn-sm btn-outline-secondary"
              onClick={() => addToCart(el)}
            >
              Add to Cart
            </button>
          </div>
        </div>
      </div>
    </div>
  ));

  const listOneItem = oneProduct.map((el) => (
    // PRODUCT
    <div class="card shadow-sm mx-auto w-50">
      <img src={el.image_url} alt={el.productName} hspace="30" vspace="30" />
      <div class="card-header">
        <p class="card-text">{el.productName}</p>
      </div>
      <div class="card-body">
        <p class="card-text">
          <ul>
            <li>Price: ${el.price}</li>
            <li>Size: {el.productDescription.size}</li>
            <li>Resolution: {el.productDescription.resolution}</li>
            <li>Processor: {el.productDescription.processor}</li>
            <li>RAM: {el.productDescription.ram}</li>
            <li>Storage: {el.productDescription.storage}</li>
            <li>Operating System: {el.productDescription.operatingSystem}</li>
          </ul>
        </p>
        <div class="d-flex justify-content-center align-items-center">
          <div class="btn-group-vertical">
            <form action="" class="my-2">
              <input
                type="text"
                class="form-control"
                id="newPrice"
                name="newPrice"
                placeholder="New Price"
                value={newPrice}
                onChange={handlePriceChange}
              />
              <button
                type="button"
                class="btn btn-dark"
                onClick={handlePriceSubmit}
              >
                Update Price
              </button>
              <button
                type="button"
                class="btn btn-dark ms-2"
                onClick={() => deleteOneProduct(productUpdateId)}
              >
                Delete Item
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  ));

  const listCart = cart.map((el) => (
    // PRODUCT
    <div class="row border-top border-bottom mx-auto" key={el._id}>
      <div class="row main align-items-center">
        <div class="col-2">
          <img class="img-fluid" src={el.image_url} />
        </div>
        <div class="col">
          <div class="row text-muted">{el.productName}</div>
        </div>
        <div class="col">
          <button
            type="button"
            variant="light"
            onClick={() => removeFromCart(el)}
          >
            {" "}
            -{" "}
          </button>{" "}
          <button type="button" variant="light" onClick={() => addToCart(el)}>
            {" "}
            +{" "}
          </button>
        </div>
        <div class="col">
          ${el.price} <span class="close">&#10005;</span>
          {howManyofThis(el._id)}
        </div>
      </div>
    </div>
  ));

  function howManyofThis(id) {
    const item = cart.find((item) => item._id === id);
    return item ? item.quantity : 0;
  }

  return (
    <body>
      <header>
        <nav class="navbar navbar-expand-md navbar-dark fixed-top bg-dark">
          <div class="container-fluid">
            <button
              class="navbar-toggler"
              type="button"
              data-bs-toggle="collapse"
              data-bs-target="#navbarCollapse"
              aria-controls="navbarCollapse"
              aria-expanded="false"
              aria-label="Toggle navigation"
            >
              <span class="navbar-toggler-icon"></span>
            </button>
            <div class="collapse navbar-collapse" id="navbarCollapse">
              <ul class="navbar-nav me-auto mb-2 mb-md-0">
                <li class="nav-item">
                  <a class="nav-link" href="./index.html">
                    Home
                  </a>
                </li>
                <li class="nav-item">
                  <a
                    class="nav-link active"
                    aria-current="page"
                    href="#"
                    onClick={() => {
                      document.getElementById("browseView").classList.remove("collapse");
                      document.getElementById("updateItem").classList.add("collapse");
                      document.getElementById("addItem").classList.add("collapse");
                      document.getElementById("cart").classList.add("collapse");

                    }}
                  >
                    Laptops
                  </a>
                </li>
                <li class="nav-item">
                  <a
                    class="nav-link"
                    href="#"
                    onClick={() => {
                      document
                        .getElementById("addItem")
                        .classList.remove("collapse");
                      document
                        .getElementById("browseView")
                        .classList.add("collapse");
                      document
                        .getElementById("updateItem")
                        .classList.add("collapse");
                    }}
                  >
                    Add Item
                  </a>
                </li>
                <li class="nav-item">
                  <a
                    class="nav-link"
                    href="#"
                    onClick={() => {
                      document
                        .getElementById("updateItem")
                        .classList.remove("collapse");
                      document
                        .getElementById("browseView")
                        .classList.add("collapse");
                      document
                        .getElementById("addItem")
                        .classList.add("collapse");
                    }}
                  >
                    Update Item
                  </a>
                </li>
                <li class="nav-item">
                  <a class="nav-link" href="#" onClick={() => {
                    document.getElementById("aboutus").classList.remove("collapse");
                    document.getElementById("updateItem").classList.add("collapse");
                    document.getElementById("addItem").classList.add("collapse");
                    document.getElementById("browseView").classList.add("collapse");
                  }}>
                    About us
                  </a>
                </li>
              </ul>
              <form class="form-inline my-2 my-lg-0">
                <input
                  class="form-control mr-sm-2"
                  type="search"
                  placeholder="Search"
                  aria-label="Search"
                  value={searchQuery}
                  onChange={(e) => {
                    setSearchQuery(e.target.value);
                    searchProducts(e.target.value);
                  }}
                />
              </form>
              <button
                type="button"
                className="btn btn-dark"
                onClick={() => {
                  document
                    .getElementById("browseView")
                    .classList.add("collapse");
                  document.getElementById("footer").classList.add("collapse");
                  document.getElementById("cart").classList.remove("collapse");
                }}
              >
                <i className="fa fa-shopping-cart"></i>
              </button>
            </div>
          </div>
        </nav>
      </header>

      {
        <section class="py-5 text-center container">
          <div class="mb-3 card collapse" id="addItem">
            <form action="" onSubmit={handleAddItemEvent}>
              <div class="form-group row">
                <label for="_id" class="col-sm-2 col-form-label">
                  ID
                </label>
                <div class="col-sm-10">
                  <input
                    type="number"
                    class="form-control"
                    id="_id"
                    name="_id"
                    value={addNewProduct._id}
                    onChange={handleChange}
                  />
                </div>
              </div>
              <div class="form-group row">
                <label for="productName" class="col-sm-2 col-form-label">
                  Product Name
                </label>
                <div class="col-sm-10">
                  <input
                    type="text"
                    class="form-control"
                    id="productName"
                    name="productName"
                    value={addNewProduct.productName}
                    onChange={handleChange}
                  />
                </div>
              </div>
              <div class="form-group row">
                <label for="price" class="col-sm-2 col-form-label">
                  Price
                </label>
                <div class="col-sm-10">
                  <input
                    type="number"
                    class="form-control"
                    id="price"
                    name="price"
                    value={addNewProduct.price}
                    onChange={handleChange}
                  />
                </div>
              </div>
              <div class="form-group row">
                <label class="col-sm-2 col-form-label">
                  Product Description
                </label>
                <div class="col-sm-10">
                  <div class="form-group row">
                    <label for="size" class="col-sm-3 col-form-label">
                      Screen Size
                    </label>
                    <div class="col-sm-9">
                      <input
                        type="text"
                        class="form-control"
                        id="size"
                        name="size"
                        value={addNewProduct.productDescription.size}
                        onChange={handleChange}
                      />
                    </div>
                  </div>
                  <div class="form-group row">
                    <label for="resolution" class="col-sm-3 col-form-label">
                      Resolution
                    </label>
                    <div class="col-sm-9">
                      <input
                        type="text"
                        class="form-control"
                        id="resolution"
                        name="resolution"
                        value={addNewProduct.productDescription.resolution}
                        onChange={handleChange}
                      />
                    </div>
                  </div>
                  <div class="form-group row">
                    <label for="processor" class="col-sm-3 col-form-label">
                      Processor
                    </label>
                    <div class="col-sm-9">
                      <input
                        type="text"
                        class="form-control"
                        id="processor"
                        name="processor"
                        value={addNewProduct.productDescription.processor}
                        onChange={handleChange}
                      />
                    </div>
                  </div>
                  <div class="form-group row">
                    <label for="ram" class="col-sm-3 col-form-label">
                      RAM
                    </label>
                    <div class="col-sm-9">
                      <input
                        type="text"
                        class="form-control"
                        id="ram"
                        name="ram"
                        value={addNewProduct.productDescription.ram}
                        onChange={handleChange}
                      />
                    </div>
                  </div>
                  <div class="form-group row">
                    <label for="storage" class="col-sm-3 col-form-label">
                      Storage
                    </label>
                    <div class="col-sm-9">
                      <input
                        type="text"
                        class="form-control"
                        id="storage"
                        name="storage"
                        value={addNewProduct.productDescription.storage}
                        onChange={handleChange}
                      />
                    </div>
                  </div>
                  <div class="form-group row">
                    <label
                      for="operatingSystem"
                      class="col-sm-3 col-form-label"
                    >
                      Operating System
                    </label>
                    <div class="col-sm-9">
                      <input
                        type="text"
                        class="form-control"
                        id="operatingSystem"
                        name="operatingSystem"
                        value={addNewProduct.productDescription.operatingSystem}
                        onChange={handleChange}
                      />
                    </div>
                  </div>
                </div>
              </div>
              <div class="form-group row">
                <label for="image_url" class="col-sm-2 col-form-label">
                  Image URL
                </label>
                <div class="col-sm-10">
                  <input
                    type="text"
                    class="form-control"
                    id="image_url"
                    name="image_url"
                    placeholder="http://127.0.0.1:4000/images/"
                    value={addNewProduct.image_url}
                    onChange={handleChange}
                  />
                </div>
              </div>
              <button type="submit" class="btn btn-dark">
                Submit
              </button>
            </form>
          </div>
        </section>
      }
      {
        <section class="py-5 text-center container">
          <div class="card collapse" id="updateItem">
            <input
              class="form-control"
              value={productUpdateId}
              type="number"
              placeholder="Search Product by ID"
              name="_idSearch"
              onChange={(e) => {
                getOneProduct(e.target.value);
              }}
            />
          </div>
          <div class="row row-cols-1 row-cols-sm-1 row-cols-md-1 g-3">
            {listOneItem}
          </div>
        </section>
      }
      {
        <main id="browseView">
          <section class="py-5 text-center container">
            <div class="row py-lg-5">
              <div class="col-lg-6 col-md-8 mx-auto">
                <p className="font-weight: bold; font-size: xx-large">
                  ✅ Find Your Laptop Here!
                </p>

                <h6 class="lead text-muted" color="aliceblue;">
                  A collection of Laptops tailored to a wide variety of users.
                  From developers, to students, to regular household use.
                  <br />
                </h6>
              </div>
            </div>
          </section>
          <div class="album py-5 bg-light">
            <div class="container">
              <div
                id="laptops"
                class="row row-cols-1 row-cols-sm-2 row-cols-md-3 g-3"
              >
                {listItems}
              </div>
            </div>
          </div>
        </main>
      }

      {
        <section class="py-5 text-center container">
          <div class="card collapse" id="cart">
            <div class="col-md-8 cart">
              <div class="title">
                <div class="row py-lg-5">
                  <div class="col-lg-6 col-md-8 mx-auto">
                    <h4>
                      <b>Cart</b>
                    </h4>
                  </div>
                  <div class="col align-self-center text-right text-muted">
                    Products selected {cart.length}
                  </div>
                </div>
              </div>
              <div>{listCart}</div>
            </div>
            <div class="float-end">
              <p class="mb-0 me-5 d-flex align-items-center">
                <button
                  type="button"
                  className="btn btn-dark"
                  onClick={() => {
                    document
                      .getElementById("validation")
                      .classList.remove("collapse");
                    document.getElementById("cart").classList.add("collapse");
                  }}
                >
                  Checkout
                </button>
                <span class="small text-muted me-2">Order total:</span>
                <span class="lead fw-normal" id="cartTotal">
                  ${cartTotal}
                </span>
              </p>
            </div>
          </div>
        </section>
      }

      {
        <div class="container">
          <div class="row">
            <div class="col-2"></div>

            <div class="col-8 card collapse" id="validation">
              <h1>Checkout</h1>

              <div id="liveAlertPlaceholder"></div>

              <form class="row g-3" id="checkout-form">
                <div class="col-md-6">
                  <label for="inputName" class="form-label">
                    Full Name
                  </label>
                  <input type="text" class="form-control" id="inputName" />
                  <div class="valid-feedback">Looks good!</div>
                  <div class="invalid-feedback">Must be like, "John Doe"</div>
                </div>

                <div class="col-md-6">
                  <label for="inputEmail4" class="form-label">
                    Email
                  </label>
                  <input type="email" class="form-control" id="inputEmail4" />
                  <div class="valid-feedback">Looks good!</div>
                  <div class="invalid-feedback">
                    Must be like, "abc@xyz.efg"
                  </div>
                </div>

                <div class="col-12">
                  <label for="inputCard" class="form-label">
                    Card
                  </label>
                  <div class="input-group mb-3">
                    <span class="input-group-text" id="basic-addon1">
                      <i class="bi-credit-card-fill"></i>
                    </span>
                    <input
                      type="text"
                      id="inputCard"
                      class="form-control"
                      placeholder="XXXX-XXXX-XXXX-XXXX"
                      aria-label="Username"
                      aria-describedby="basic-addon1"
                    />
                    <div class="valid-feedback">Looks good!</div>
                    <div class="invalid-feedback">
                      Must be like, "7777-7777-7777-7777"
                    </div>
                  </div>
                </div>

                <div class="col-12">
                  <label for="inputAddress" class="form-label">
                    Address
                  </label>
                  <input
                    type="text"
                    class="form-control"
                    id="inputAddress"
                    placeholder="1234 Main St"
                  />
                </div>
                <div class="col-12">
                  <label for="inputAddress2" class="form-label">
                    Address 2
                  </label>
                  <input
                    type="text"
                    class="form-control"
                    id="inputAddress2"
                    placeholder="Apartment, studio, or floor"
                  />
                </div>
                <div class="col-md-6">
                  <label for="inputCity" class="form-label">
                    City
                  </label>
                  <input type="text" class="form-control" id="inputCity" />
                </div>
                <div class="col-md-4">
                  <label for="inputState" class="form-label">
                    State
                  </label>
                  <select id="inputState" class="form-select">
                    <option selected>Choose...</option>
                    <option value="AL">Alabama</option>
                    <option value="AK">Alaska</option>
                    <option value="AZ">Arizona</option>
                    <option value="AR">Arkansas</option>
                    <option value="CA">California</option>
                    <option value="CO">Colorado</option>
                    <option value="CT">Connecticut</option>
                    <option value="DE">Delaware</option>
                    <option value="DC">District Of Columbia</option>
                    <option value="FL">Florida</option>
                    <option value="GA">Georgia</option>
                    <option value="HI">Hawaii</option>
                    <option value="ID">Idaho</option>
                    <option value="IL">Illinois</option>
                    <option value="IN">Indiana</option>
                    <option value="IA">Iowa</option>
                    <option value="KS">Kansas</option>
                    <option value="KY">Kentucky</option>
                    <option value="LA">Louisiana</option>
                    <option value="ME">Maine</option>
                    <option value="MD">Maryland</option>
                    <option value="MA">Massachusetts</option>
                    <option value="MI">Michigan</option>
                    <option value="MN">Minnesota</option>
                    <option value="MS">Mississippi</option>
                    <option value="MO">Missouri</option>
                    <option value="MT">Montana</option>
                    <option value="NE">Nebraska</option>
                    <option value="NV">Nevada</option>
                    <option value="NH">New Hampshire</option>
                    <option value="NJ">New Jersey</option>
                    <option value="NM">New Mexico</option>
                    <option value="NY">New York</option>
                    <option value="NC">North Carolina</option>
                    <option value="ND">North Dakota</option>
                    <option value="OH">Ohio</option>
                    <option value="OK">Oklahoma</option>
                    <option value="OR">Oregon</option>
                    <option value="PA">Pennsylvania</option>
                    <option value="RI">Rhode Island</option>
                    <option value="SC">South Carolina</option>
                    <option value="SD">South Dakota</option>
                    <option value="TN">Tennessee</option>
                    <option value="TX">Texas</option>
                    <option value="UT">Utah</option>
                    <option value="VT">Vermont</option>
                    <option value="VA">Virginia</option>
                    <option value="WA">Washington</option>
                    <option value="WV">West Virginia</option>
                    <option value="WI">Wisconsin</option>
                    <option value="WY">Wyoming</option>
                  </select>
                </div>
                <div class="col-md-2">
                  <label for="inputZip" class="form-label">
                    Zip
                  </label>
                  <input type="text" class="form-control" id="inputZip" />
                </div>
                <div class="col-12">
                  <div class="form-check">
                    <input
                      class="form-check-input"
                      type="checkbox"
                      id="gridCheck"
                    />
                    <label class="form-check-label" for="gridCheck">
                      Check me out
                    </label>
                  </div>
                </div>
                <div class="col-12">
                  <button
                    type="button"
                    class="btn btn-dark"
                    onClick={() => {
                      const alertPlaceholder = document.getElementById(
                        "liveAlertPlaceholder"
                      );
                      const form = document.getElementById("checkout-form");
                      const inputCard = document.querySelector("#inputCard");
                      const alertTrigger =
                        document.getElementById("submit-btn");
                      const summaryCard = document.getElementById("summary");
                      const summaryList = document.querySelector(".card > ul");

                      var order = { name: "", email: "", card: "", total: "" };

                      let validate = function () {
                        var val = true;
                        let email = document.getElementById("inputEmail4");
                        let name = document.getElementById("inputName");
                        let card = document.getElementById("inputCard");
                        let items = document.getElementById("cartTotal");

                        if (
                          !email.value.match(
                            /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
                          )
                        ) {
                          email.setAttribute(
                            "class",
                            "form-control is-invalid"
                          );
                          val = false;
                        } else {
                          email.setAttribute("class", "form-control is-valid");
                          order.email = email.value;
                        }

                        if (name.value.length === 0) {
                          name.setAttribute("class", "form-control is-invalid");
                          val = false;
                        } else {
                          name.setAttribute("class", "form-control is-valid");
                          order.name = name.value;
                        }

                        if (
                          !card.value.match(
                            /^[0-9]{4}\-[0-9]{4}\-[0-9]{4}\-[0-9]{4}$/
                          )
                        ) {
                          card.setAttribute("class", "form-control is-invalid");
                          val = false;
                        } else {
                          card.setAttribute("class", "form-control is-valid");
                          order.card = card.value;
                        }

                        order.total = "$" + cartTotal;

                        if (val) {
                          form.classList.add("collapse");
                          for (const [key, value] of Object.entries(order)) {
                            summaryList.innerHTML +=
                              '<li class="list-group-item"> <b>' +
                              `${key}` +
                              ": </b>" +
                              `${value}` +
                              "</li>";
                          }
                          summaryCard.classList.remove("collapse");
                          alertPlaceholder.innerHTML = "";
                          alert(
                            '<i class="bi-cart-check-fill"></i> You have made an order!',
                            "success"
                          );
                        }
                        return val;
                      };

                      if (!validate()) {
                        alertPlaceholder.innerHTML = "";
                        alert(
                          '<i class="bi-exclamation-circle"></i> Something went wrong!',
                          "danger"
                        );
                      }
                    }}
                  >
                    {" "}
                    <i class="bi-bag-check"></i> Order
                  </button>
                </div>
              </form>

              <div class="card collapse" width="18rem" id="summary">
                <div class="card-body">
                  <h5 class="card-title">Order summary</h5>
                  <p class="card-text">Here is a summary of your order.</p>
                </div>
                <ul class="list-group list-group-flush"></ul>
                <a
                  href=""
                  onClick="location.reload()"
                  class="btn btn-secondary"
                >
                  {" "}
                  <i class="bi-arrow-left-circle"></i>
                  Return
                </a>
              </div>
            </div>

            <div class="col-2"></div>
          </div>
        </div>
      }
      <div class="card collapse" id="aboutus">
        <section class="py-4 text-center container">
          <div class="row py-lg-4">
            <div class="col-lg-6 col-md-8 mx-auto">
              <h1 class="fw-light">About us</h1>
            </div>
          </div>

        <div class="album py-5 bg-light">
          <div class="container">
            <div class="row row-cols-1 row-cols-sm-2 ">
              <div class="col">
                <div class="card shadow-sm">
                  <p>
                    <h1 class="display-6">Rangsimun Bargmann</h1>
                  </p>
                  <div class="text-body-emphasis">
                    <img
                      src="http://127.0.0.1:4000/images/MeRB.JPG"
                      alt="Picture of Rangsimun"
                      width="500"
                      class="center"
                    />
                    <p class="center">
                      I am currently a Junior in Software Engineering, with
                      previous studies as a Chemical Engineer. This webpage was
                      created as part of Assignment 1 for COM S 319 and includes
                      a catalog of a variety of laptops constumers can purchase.
                    </p>
                    <p class="center">
                      <strong>Contact Info:</strong>
                      <br />
                      Email: rgbrgmnn@iastate.edu
                      <br />
                      Phone: 605-553-8966
                    </p>
                  </div>
                </div>
              </div>

              <div class="col">
                <div class="card shadow-sm">
                  <p>
                    <h1 class="display-6">Autrin Hakimi</h1>
                  </p>
                  <div class="text-body-emphasis">
                    <img
                      src="http://127.0.0.1:4000/images/IMG_4781.jpg"
                      alt="Picture of Autrin"
                      class="center"
                      width="75%" height="75%"
                    />
                    <p class="center">
                      Autrin Hakimi is a computer science major at Iowa State
                      University. He is a programmer in Java, Python, C++ HTML,
                      CSS, and JavaScript.
                    </p>
                    <p class="center">
                      <strong>Contact Info:</strong>
                      <br />
                      Email: autrinhakimi@gmail.com
                      <br />
                      Phone: 515-815-1016
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        </section>
      </div>

      {
        <footer
          class="text-muted py-5"
          background-color="rgb(224, 213, 213)"
          id="footer"
        >
          <div class="container">
            <p class="float-end mb-1">
              <a href="#">Back to top</a>
            </p>
            <p class="mb-1">FindYourTech by Autrin and Rangsimun</p>
            <p class="mb-0">
              Have a question?<a href="./aboutus.html"> Contact Us</a>
              <a class="nav-link" href="./aboutus.html"></a>
            </p>
          </div>
        </footer>
      }
    </body>

  );
}

export default App;
