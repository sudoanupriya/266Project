const mongoose = require("mongoose");
const { eventsSchema } = require("../models/event_model");
// Connection URL
const url =
  "mongodb+srv://tejaramisetty:cmpe2022211@cluster0.sz9jt.mongodb.net/Historic_Events?retryWrites=true&w=majority";

// Define the model for the collection
const MyModel = mongoose.model("events", eventsSchema);

// Connect to the MongoDB server
mongoose.connect(url, { useNewUrlParser: true, useUnifiedTopology: true });

// Create a text index on the description field
MyModel.collection.createIndex({ description: "text" }, {default_language: "english"},
function (err, result) {
  if (err) throw err;

  console.log("Text index created on description field");
  mongoose.connection.close();
});
