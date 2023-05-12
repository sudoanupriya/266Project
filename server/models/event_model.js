const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const eventsSchema = new Schema({
  date: { type: String },
  description: { type: String },
  lang: { type: String },
  category1: { type: String },
  category2: { type: String },
  granularity: { type: String },
});

const Event = mongoose.model("Event", eventsSchema);
module.exports = { Event, eventsSchema };
