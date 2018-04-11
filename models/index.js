const mongoose = require("mongoose");

mongoose.set("debug", true);
// mongoose.connect("mongodb://localhost/todo-api");
mongoose.connect("mongodb://dchen21:750322@ds241869.mlab.com:41869/todo-api");


mongoose.Promise = Promise;

module.exports.Todo = require("./todos");