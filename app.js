const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const mongoose = require('mongoose');
const fetch = require('node-fetch');

const app = express();

app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({ extended: false }));

app.use(express.static(__dirname + '/public'));

let api = "http://private-32dcc-products72.apiary-mock.com/product";

mongoose.connect("mongodb+srv://admin-nour:admin@cluster0.nhj1z.mongodb.net/Products?retryWrites=true&w=majority");

const productSchema = new mongoose.Schema({
    _id: Number,
    name: String,
    price: Number,
    description: String,
    addedToCart: Boolean
});

const Product = mongoose.model('product', productSchema);

Product.find({}, (err, data) => {
    if (data.length == 0) {
        fetch(api, { method: "Get" })
            .then(res => res.json())
            .then((json) => {
                json.forEach(async p => {
                    let product = new Product({
                        _id: p.id,
                        name: p.name,
                        price: p.price,
                        description: p.description,
                        addedToCart: false
                    });
                    await product.save();
                });
            });
    }
});

// var currency = "eur";

app.get("/", (req, res) => {
    // currency = req.params.currency;
    Product.find({ addedToCart: false }, (err, products) => {
        if (err) {
            console.log(err)
        } else {
            Product.find({ addedToCart: true }, (err, cartProd) => err ? console.log(err) : res.render("home", { products: products, cartProducts: cartProd })).sort({ _id: 1 });
        }
    }).sort({ _id: 1 });
});

// app.get("/:currency?/getSelected", (req, res) => {
//     res.send(currency);
// })

app.post("/addProdToCart", (req, res) => {
    Product.updateOne({ _id: req.body.cartProd }, { addedToCart: true }, (err) => err ? console.log(err) : res.redirect("/"));
});

app.post("/delete", (req, res) => {
    Product.updateOne({ _id: req.body.removeProd }, { addedToCart: false }, (err) => err ? console.log(err) : res.redirect("/"))
});

app.post("/reset", (req, res) => {
    Product.updateMany({ addedToCart: true }, { addedToCart: false }, (err) => err ? console.log(err) : res.redirect("/"));
});

app.listen(process.env.PORT || 3000, function() {
    console.log("Server started");
});