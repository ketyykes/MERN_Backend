const { Todo } = require("../models/todo");
const express = require("express");
const auth = require("../middleware/auth");
const router = express.Router();
const Joi = require("joi");

//read endpoint
router.get("/", auth, async (req, res) => {
  try {
    const todos = await Todo.find()
      .sort({ date: -1 })
      .select({ name: 1, isComplete: 1, date: 1 });
    res.send(todos);
  } catch (error) {
    res.status(500).send(error.message);
    console.log(error.message);
  }
});

router.post("/", auth, async (req, res) => {
  const schema = Joi.object({
    name: Joi.string().min(3).max(100).required(),
    author: Joi.string().min(3).max(30),
    uid: Joi.string(),
    isComplete: Joi.boolean(),
    date: Joi.date(),
  });
  //.options({abortEarly:false})可以僅回傳第一個錯誤，否則預設是false而且會回傳全部錯誤
  const { value, error } = schema.validate(req.body);
  if (error) {
    return res.status(400).send(error.details[0].message);
  }
  const { name, author, isComplete, date, uid } = req.body;
  let todo = new Todo({
    name,
    author,
    isComplete,
    date,
    uid,
  });
  try {
    todo = await todo.save();
    res.send(todo);
  } catch (error) {
    res.status(500).send(error.message);
    console.log(error.message);
  }
});
router.put("/:id", auth, async (req, res) => {
  const schema = Joi.object({
    name: Joi.string().min(3).max(100).required(),
    author: Joi.string().min(3).max(30),
    uid: Joi.string(),
    isComplete: Joi.boolean(),
    date: Joi.date(),
  });
  const { value, error } = schema.validate(req.body);
  if (error) {
    return res.status(400).send(error.details[0].message);
  }

  try {
    const todo = await Todo.findById(req.params.id);
    if (!todo) return res.status(404).send("Todo not found...");
    const { name, author, isComplete, date, uid } = req.body;

    const updateTodo = await Todo.findByIdAndUpdate(
      req.params.id,
      {
        name,
        author,
        isComplete,
        date,
        uid,
      },
      { new: true }
    );
    res.send(updateTodo);
  } catch (error) {
    res.status(500).send(error.message);
    console.log(error.message);
  }
});

router.patch("/:id", auth, async (req, res) => {
  const todo = await Todo.findById(req.params.id);
  if (!todo) return res.status(404).send("Todo not found...");

  try {
    const updatedTodo = await Todo.findByIdAndUpdate(req.params.id, {
      isComplete: !todo.isComplete,
    });
    res.send(updatedTodo);
  } catch (error) {
    res.status(500).send(error.message);
    console.log(error.message);
  }
});

router.delete("/:id", auth, async (req, res) => {
  //deleteOne刪除一筆
  //deleteMany刪除多筆
  //findByIdAndDelete()找到某個id而且刪除
  const deleteTodo = await Todo.findByIdAndDelete(req.params.id);
  res.send(deleteTodo);
});
module.exports = router;
