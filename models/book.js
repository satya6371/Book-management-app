const mongoose = require("mongoose");
const bookSchema = new mongoose.Schema({
  BookTitle: {
    type: String,
    required: true,
  },
  AuthorName: {
    type: String,
    required: true,
  },
  Image: {
    type: String,
    required: true,
  },
  BookPdf: {
    type: String,
    required: true,
  },
});

module.exports = mongoose . model ("Book", bookSchema)