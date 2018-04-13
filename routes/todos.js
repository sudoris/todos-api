var express = require("express");
var router = express.Router();
var db = require("../models");

router.get("/", function(req, res) {
	db.Todo.find()
	.then(function(todos) {
		res.status(200).json(todos); 
	})
	.catch(function(err) {
		res.send(err);
	})
});

router.post("/", function(req, res) {
	db.Todo.create(req.body)
	.then(function(newTodo) {
		res.status(201).json(newTodo);
	})
});

router.get("/:todoId", function(req, res) {
	db.Todo.findById(req.params.todoId)
	.then(function(foundTodo) {
		res.json(foundTodo);
	})
	.catch(function(err) {
		res.send(err);
	})
});

router.put("/:todoId", function(req, res) {
	console.log("in pute route" + req.body);

	// note: {returnNewDocument: true} not working, always returns original document in response
	db.Todo.findOneAndUpdate({_id: req.params.todoId}, req.body)
	.then(function(todo) {
		res.json(todo);
	})
	.catch(function(err) {
		res.send(err);
	})
});

router.delete("/:todoId", function(req, res) {
	db.Todo.remove({_id: req.params.todoId})
	.then(function() {
		res.status(200).json({message: "Item deleted"});
	})
	.catch(function(err) {
		res.send(err);
	})
});





module.exports = router;