const express = require("express");
const router = express.Router();
const Book = require("../models/book.js");
const multer = require("multer");
const fs = require("fs");
const { title } = require("process");

//multer config

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "./uploads");
  },
  filename: function (req, file, cb) {
    cb(null, file.fieldname + "_" + Date.now() + "_" + file.originalname);
  },
});
const upload = multer({
  storage: storage,
});

//add a new book
router.post(
  "/addbook",
  upload.fields([
    { name: "Image", maxCount: 1 },
    { name: "pdf", maxCount: 1 },
  ]),
  (req, res) => {
    console.log(req.files, "files");
    const book = new Book({
      BookTitle: req.body.BookTitle,
      AuthorName: req.body.AuthorName,
      Image: req.files["Image"][0].filename,
      BookPdf: req.files["pdf"][0].filename,
    });
    book
      .save()
      .then(() => {
        req.session.message = {
          type: "success",
          message: "Book added successfully",
        };
        res.redirect("/");
      })
      .catch((err) => {
        res.json({ message: err.message, type: "danger" });
      });
  }
);

router.get("/addbook", (req, res) => {
  res.render("addBook", { title: "addbook" });
});

//Get all books routes
router.get("/", (req, res) => {
  Book.find()
    .then((books) => {
      res.render("index", {
        title: "Home page",
        books: books,
      });
    })
    .catch((err) => {
      res.json({ message: err.message });
    });
});

//Edit a book route
router.get("/edit/:id", async (req, res) => {
  try {
    const id = req.params.id;
    const book = await Book.findById(id);

    if (!book) {
      res.redirect("/");
      return;
    }
    res.render("editBook", { title: "EditBook", book: book });
  } catch (err) {
    console.error(err);
    res.redirect("/");
  }
});

//Update  a book route
router.post(
  "/update",
  upload.fields([
    { name: "Image", maxCount: 1 },
    { name: "pdf", maxCount: 1 },
  ]),
  async (req, res) => {
    try {
      let id = req.body.id; // Assuming the id is sent via the request body
      let new_image = "";

      if (req.file) {
        new_image = req.file.filename;
        try {
          await fs.unlink("./uploads/" + req.body.old_image); // Using promisified version of fs.unlink
        } catch (err) {
          console.log(err);
        }
      } else {
        new_image = req.body.old_image;
      }

      const updatedBook = await Book.findByIdAndUpdate(id, {
        BookTitle: req.body.BookTitle,
        AuthorName: req.body.AuthorName,
        Image: new_image,
      });

      if (!updatedBook) {
        throw new Error("Book not found");
      }

      req.session.message = {
        type: "success",
        message: "Book updated successfully",
      };

      res.redirect("/");
    } catch (err) {
      console.error(err);
      res.json({ message: err.message, type: "danger" });
    }
  }
);

//delete user routes
router.get("/delete/:id", async (req, res) => {
  try {
    let id = req.params.id;
    const result = await Book.findByIdAndDelete(id);
    if (result.Image !== "") {
      try {
        fs.unlinkSync("./uploada/" + result.Image);
      } catch (error) {
        console.log(error);
      }
    }
    req.session.message = {
      type: "success",
      message: "Book deleted",
    };
    res.redirect("/");
  } catch (err) {
    res.json({ message: err.message });
  }
});

//About
router.get("/about", async (req, res) => {
  try {
    res.render("about", { title: "about" });
  } catch (error) {
    console.log(error);
  }
});

module.exports = router;
