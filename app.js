const express = require("express")
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const { name } = require("ejs");

const date = require(__dirname + "/date.js");

const app = express();

app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("Public"));

// connecting to the database
mongoose.connect("mongodb://localhost:27017/todolistDB")
    .then(() => console.log("Database Connected!"))
    .catch((err) => console.error(err));

const itemsSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    }
});

const Item = mongoose.model("Item", itemsSchema);

const defaultItems = [
    new Item({
        name: "Welcome to your todoList"
    }),
    new Item({
        name: "Tap the + symbol to add new items"
    }),
    new Item({
        name: "<-- tap that to delete an item"
    })
];


app.get("/", async (req, res) => {

    const weekDay = date.getDate();

    await Item.find({})
        .then((items) => {
            if (items.length === 0) {
                Item.insertMany(defaultItems)
                    .then((insertedItems) => {
                        console.log("Default items inserted!: ", insertedItems);
                        res.redirect("/");
                    })
                    .catch((err) => console.error(err));
            } else {
                res.render("list",{listTitle: weekDay, newListItems: items});
            }
        })
        .catch ((err) => console.error(err));
    
});


app.post("/",  (req, res) => {

    const itemName = req.body.newItem;

    const newItem = new Item({
        name: itemName
    });
    
    newItem.save()
        .then(() => {
            console.log("Inserted newItem!")
            res.redirect("/");
        })
        .catch((err) => console.error(err));
});

app.post("/delete", async (req, res) => {
    const itemId = req.body.checkbox;
    
    await Item.findByIdAndDelete(itemId)
        .then((deletedItem) => console.log("Deleted: ", deletedItem))
        .catch((err) => console.error(err));

    res.redirect("/");
});


app.get("/:route", (req, res) => {

    
});



app.listen(3000, () => {
    console.log("server is running on port 3000");
});