const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const app = express();
const PORT = process.env.PORT || 3000;

// Gantilah <username> dan <password> dengan informasi yang Anda buat di MongoDB Atlas
const mongoUri =
  "mongodb+srv://mirzafahlefi:nahlo0910@cluster0.qvourro.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0";

mongoose
  .connect(mongoUri, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log("Connected to MongoDB"))
  .catch((err) => console.error("Failed to connect to MongoDB:", err));

const commentSchema = new mongoose.Schema({
  author: String,
  text: String,
});

const Comment = mongoose.model("Comment", commentSchema);

app.use(bodyParser.json());
app.use(express.static("public"));

// Endpoint Health Check
app.get("/health", (req, res) => {
  res.status(200).send("Server is healthy");
});

// Memuat komentar dari database
app.get("/comments", async (req, res) => {
  try {
    const comments = await Comment.find();
    res.json(comments);
  } catch (err) {
    console.error("Error fetching comments:", err);
    res.status(500).send("Error fetching comments");
  }
});

// Menambahkan komentar baru ke database
app.post("/comments", async (req, res) => {
  const newComment = new Comment(req.body);
  try {
    await newComment.save();
    res.status(201).send("Comment added");
  } catch (err) {
    console.error("Error saving comment:", err);
    res.status(500).send("Error saving comment");
  }
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
