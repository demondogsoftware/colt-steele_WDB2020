const express = require('express');
const app = express();
const path = require('path');
const ejs = require('ejs');
const methodOverride = require('method-override');
const mongoose = require('mongoose');

const Product = require('./models/product');

mongoose.connect('mongodb://localhost:27017/farmStand', { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => {
        console.log("CONNECTED TO MONGO DB")
    })
    .catch(err => {
        console.log("ERROR CONNECTING TO MONGO DB")
        console.log(err)
    })

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(methodOverride('_method'));

app.get('/', (req, res) => {
    res.redirect('/products');
});

app.get('/products', async (req, res) => {
    const allProducts = await Product.find({});
    const categories = Product.schema.path('category').enumValues;
    res.render('products/index', {products: allProducts, categories});
});

app.get('/products/new', (req, res) => {
    const categories = Product.schema.path('category').enumValues;
    res.render('products/new', {categories});
});

app.get('/products/:id', async (req, res) => {
    const {id} = req.params;
    const product = await Product.findById(id);
    res.render('products/details', {product});
});

app.get('/products/:id/edit', async (req, res) => {
    const {id} = req.params;
    const categories = Product.schema.path('category').enumValues;
    const product = await Product.findById(id);
    res.render('products/edit', {product, categories});
});

app.post('/products', async (req, res) => {
    const {name, price, category} = req.body;
    const newProduct = new Product({name, price, category});
    await newProduct.save();
    res.redirect(`/products/${newProduct._id}`);
});

app.post('/products/filter', async (req, res) => {
    const {category} = req.body;
    if (category === 'all') {
       return res.redirect('/products');
    }
    const filteredProducts = await Product.find({category: category});
    const categories = Product.schema.path('category').enumValues;
    res.render('products/index', {products: filteredProducts, categories});
});

app.put('/products/:id', async (req, res) => {
    const {id} = req.params;
    const {name, price, category} = req.body;
    const update = {
        name,
        price,
        category
    };
    const product = await Product.findByIdAndUpdate(id, {update}, {new: true, runValidators: true});
    res.redirect(`/products/${product._id}`);
});

app.delete('/products/:id', async (req, res) => {
    const { id } = req.params;
    await Product.findByIdAndDelete(id);
    res.redirect('/products');
})

app.listen(3000, () => {
    console.log (`Server Running on Port 3000`);
});