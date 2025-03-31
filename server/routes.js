const express = require("express");
const router = express.Router();
const { getCollection } = require('./database');
const { ObjectId } = require("mongodb");

router.get('/test', (req, res) => {
    console.log("GET /test route hit.");
    res.send('Server test successful');
});

// GET /todos
router.get("/todos", async (req, res) => {
    console.log("GET /todos route hit.");
    try {
        const collection = await getCollection('todos'); // Specify the collection name
        const todos = await collection.find({}).toArray();
        console.log("Todos retrieved:", todos);
        res.status(200).json(todos);
    } catch (error) {
        console.error("Error in GET /todos:", error);
        res.status(500).json({ error: "Internal server error" });
    }
});

// POST /todos
router.post("/todos", async (req, res) => {
    console.log("POST /todos route hit.");
    try {
        const collection = await getCollection('todos'); // Specify the collection name
        let { todo } = req.body;
        todo = JSON.stringify(todo);
        const newTodo = await collection.insertOne({ todo, status: false });
        res.status(201).json({ todo, status: false, _id: newTodo.insertedId });
    } catch (error) {
        console.error("Error in POST /todos:", error);
        res.status(500).json({ error: "Internal server error" });
    }
});

// DELETE /todos/:id
router.delete("/todos/:id", async (req, res) => {
    console.log("DELETE /todos/:id route hit.");
    try {
        const collection = await getCollection('todos'); // Specify the collection name
        const _id = new ObjectId(req.params.id);
        const deletedTodo = await collection.deleteOne({ _id });
        res.status(200).json(deletedTodo);
    } catch (error) {
        console.error("Error in DELETE /todos/:id:", error);
        res.status(500).json({ error: "Internal server error" });
    }
});

// PUT /todos/:id
router.put("/todos/:id", async (req, res) => {
    console.log("PUT /todos/:id route hit.");
    try {
        const collection = await getCollection('todos'); // Specify the collection name
        const _id = new ObjectId(req.params.id);
        const { status } = req.body;
        if (typeof status !== "boolean") {
            return res.status(400).json({ mssg: "invalid status" });
        }
        const updatedTodo = await collection.updateOne({ _id }, { $set: { status: !status } });
        res.status(200).json(updatedTodo);
    } catch (error) {
        console.error("Error in PUT /todos/:id:", error);
        res.status(500).json({ error: "Internal server error" });
    }
});

module.exports = router;