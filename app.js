//jshint esversion:6
//require
const express = require('express');
const bodyParser = require('body-parser');
const date = require(__dirname + "/date.js");
const mongoose = require('mongoose');
const app = new express();
// let items = [];
let workItems = [];

mongoose.connect("mongodb+srv://Tengisbold-admin:test123@cluster0-xlvtx.mongodb.net/todolistDB", {
    useNewUrlParser: true
});

const itemsSchema = new mongoose.Schema({
    name: {
        type: String,
        require: true
    }
});

const itemsModel = new mongoose.model('items', itemsSchema);

const list1 = new itemsModel({
    name: "Read book"
});

const list2 = new itemsModel({
    name: "Exercise"
});

const list3 = new itemsModel({
    name: "Work"
});

const defaultItems = [list1, list2, list3];

const listScehma = {
    name:String,
    items: [itemsSchema]
};

const listModel = mongoose.model('List', listScehma); 


app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({
    extended: true
}));
app.use(express.static("public"));

app.get("/", function (req, res) {
    let day = date.getDate();
    itemsModel.find({}, (err, docs) => {
        //at default, create and add items to do list
        if (docs.length == 0) {
            itemsModel.insertMany(defaultItems, (err)=>{
                if(err){
                    console.log(err);
                }else{
                    console.log("Success!!!"); 
                }
            });
            res.redirect('/'); 
        } else {
            res.render("list", {
                listTitle: day,
                newListItems: docs
            });
        }
    });
});

app.post('/', function (req, res) {
   const itemName = req.body.newItem;
   const listName = req.body.button;
   const tempItem = new itemsModel({
       name:itemName
   });
   
   if(listName ===date.getDate()){
        tempItem.save();
       res.redirect('/');
   }else{
       listModel.findOne({name:listName}, function(err, foundList){
        foundList.items.push(tempItem); 
        foundList.save(); 
        res.redirect('/'+ listName);
       });
   }
   
});

app.post('/delete', function(req, res){
    const reqId = req.body.checkbox;
    const listN = req.body.listName; 
    if(listN == date.getDate()){
        itemsModel.findByIdAndRemove(reqId, (err)=>{
            if(err){
                console.log(err);
            }else{
                console.log("Successfully deleted"); 
                res.redirect('/');
            }
        });
    }else{
        console.log(reqId); 
        listModel.findOneAndUpdate({name:listN}, {$pull:{items:{_id:reqId}}}, (err, foundList)=>{
            if(!err){
                res.redirect('/' +listN); 
            }
        }); 
    }
  
});

app.get("/:customListName", function(req, res){
    const customListName = (req.params.customListName); 
    listModel.findOne({name:customListName}, (err, result)=>{
        if(err){
            console.log(err);
        }else{
            if(!result){
                const list = new listModel ({
                    name:customListName,
                    items: defaultItems
                });
                list.save(); 
                res.redirect('/'+customListName);
            }else{
                res.render('list', {listTitle:customListName, newListItems:result.items}); 
            }
        }
    });
});

app.post("/work", function (req, res) {
    let item = req.body.newItem;
    if (item === "work") {
        workItems.push(item);
        res.redirect("/work");
    } else {
        items.push(item);
        res.redirect("/");
    }
});

app.get("/about", function (req, res) {
    res.render("about");
});

app.listen(process.env.PORT || 3000, () => {
    console.log("Your server is running on port 3000");
});