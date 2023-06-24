const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const events = new Schema({
  orgName: String,
  eventType: String,
  eventDate: String,
  Link: String,
  Description: String,
});

module.exports = mongoose.model("Events", events);
