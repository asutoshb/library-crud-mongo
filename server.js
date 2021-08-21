const express = require('express');
const mongoose = require('mongoose');

const app = express();

app.use(express.json());

const connect = () => {
    return mongoose.connect("mongodb://127.0.0.1:27017/library",{
        useNewUrlParser: true,
        useCreateIndex: true,
        useUnifiedTopology: true,
        useFindAndModify: false
    })
}

const authorSchema = new mongoose.Schema({
    first_name: String,
    last_name: String,
},{
    versionKey: false,
    timestamps: true
});

const Author = mongoose.model("author", authorSchema);

const sectionSchema = new mongoose.Schema({
    sec_name: String
},{
    versionKey: false,
    timestamps: true
});

const Section = mongoose.model("section", sectionSchema);

const checkoutSchema = new mongoose.Schema({
    check: String
},{
    versionKey: false,
    timestamps: true
});

const Checkout = mongoose.model("checkout", checkoutSchema);

const bookSchema = new mongoose.Schema({
    name: String,
    body: String,
    secId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "section",
        required: true,
    },
    authorId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "author",
        required: true,
    },
    checkId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "checkout",
        required: true,
    },
},{
    versionKey: false,
    timestamps: true
});

const Book = mongoose.model("book", bookSchema);


app.post("/authors", async function (req, res) {
        
    try{
            const author = await Author.create(req.body);
             return res.status(201).send(author);
    }
    catch(err){
        return res.status(400).send(err.message);

    }
})

app.get("/authors", async function (req, res) {
        
    try{
            const authors = await Author.find();
             return res.status(200).send(authors);
    }
    catch(err){
        return res.status(400).send(err.message);

    }
})

app.patch("/authors/:id", async function (req, res) {
        
    try{
            const author = await Author.findByIdAndUpdate(req.params.id, req.body, {new: true});
             return res.status(205).send(author);
    }
    catch(err){
        return res.status(400).send(err.message);

    }
})

app.delete("/authors/:id", async function (req, res) {
        
    try{
            const author = await Author.findByIdAndDelete(req.params.id);
             return res.status(200).send(author);
    }
    catch(err){
        return res.status(400).send(err.message);

    }
})

app.get("/authors/:id/books", async function (req, res) {
        
    try{
            const Books = await Book.find({authorId: req.params.id}).lean().exec();
            const author = await Author.findById(req.params.id);
             return res.status(200).send({Books: Books, Author: author});
    }
    catch(err){
        return res.status(400).send(err.message);

    }
})

//CRUD for books ---------------------------
app.post("/books", async function (req, res) {
        
    try{
            const book = await Book.create(req.body);
             return res.status(201).send(book);
    }
    catch(err){
        return res.status(400).send(err.message);

    }
})

app.get("/books", async function (req, res) {
        
    try{
            const books = await Book.find().populate("authorId").populate("secId").populate("checkId").lean().exec();
             return res.status(200).send(books);
    }
    catch(err){
        return res.status(400).send(err.message);

    }
})

app.patch("/books/:id", async function (req, res) {
        
    try{
            const book = await Book.findByIdAndUpdate(req.params.id, req.body, {new: true});
             return res.status(205).send(book);
    }
    catch(err){
        return res.status(400).send(err.message);

    }
})

app.delete("/books/:id", async function (req, res) {
        
    try{
            const book = await Book.findByIdAndDelete(req.params.id);
             return res.status(200).send(book);
    }
    catch(err){
        return res.status(400).send(err.message);

    }
})


//CRUD for section -------

app.post("/sections", async function (req, res) {
        
    try{
            const section = await Section.create(req.body);
             return res.status(201).send(section);
    }
    catch(err){
        return res.status(400).send(err.message);

    }
})

app.get("/sections", async function (req, res) {
        
    try{
            const sections = await Section.find();
             return res.status(200).send(sections);
    }
    catch(err){
        return res.status(400).send(err.message);

    }
})

app.patch("/sections/:id", async function (req, res) {
        
    try{
            const section = await Section.findByIdAndUpdate(req.params.id, req.body, {new: true});
             return res.status(205).send(section);
    }
    catch(err){
        return res.status(400).send(err.message);

    }
})

app.delete("/sections/:id", async function (req, res) {
        
    try{
            const section = await Section.findByIdAndDelete(req.params.id);
             return res.status(200).send(section);
    }
    catch(err){
        return res.status(400).send(err.message);

    }
})


app.get("/sections/:id/books", async function (req, res) {
        
    try{
            const Books = await Book.find({secId: req.params.id}).lean().exec();
            const section = await Section.findById(req.params.id);
             return res.status(200).send({Books: Books, section: section});
    }
    catch(err){
        return res.status(400).send(err.message);

    }
})

app.get("/sections/:id/books/:id1", async function (req, res) {
        
    try{
            const Books = await Book.find({authorId: req.params.id1}).lean().exec();
            const section = await Section.findById(req.params.id);
            const author = await Author.findById({_id: req.params.id1}).lean().exec();
             return res.status(200).send({Books: Books, section: section, author: author});
    }
    catch(err){
        return res.status(400).send(err.message);

    }
})

//CRUD for checkout -------

app.post("/checkouts", async function (req, res) {
        
    try{
            const checkout = await Checkout.create(req.body);
             return res.status(201).send(checkout);
    }
    catch(err){
        return res.status(400).send(err.message);

    }
})

app.get("/checkouts", async function (req, res) {
        
    try{
            const checkouts = await Checkout.find();
             return res.status(200).send(checkouts);
    }
    catch(err){
        return res.status(400).send(err.message);

    }
})

app.get("/checkouts/:id/books", async function (req, res) {
        
    try{
            const checkBooks = await Book.find({checkId: req.params.id}).lean().exec();
            const checkout = await Checkout.findById(req.params.id);
             return res.status(200).send({Books: checkBooks, check: checkout});
    }
    catch(err){
        return res.status(400).send(err.message);

    }
})

app.patch("/checkouts/:id", async function (req, res) {
        
    try{
            const checkout = await Checkout.findByIdAndUpdate(req.params.id, req.body, {new: true});
             return res.status(205).send(checkout);
    }
    catch(err){
        return res.status(400).send(err.message);

    }
})

app.delete("/checkouts/:id", async function (req, res) {
        
    try{
            const checkout = await Checkout.findByIdAndDelete(req.params.id);
             return res.status(200).send(checkout);
    }
    catch(err){
        return res.status(400).send(err.message);

    }
})





app.listen(2200, async () => {
    await connect();
    console.log("listening on port 2200");
})