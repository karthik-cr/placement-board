const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const passportLocalMongoose = require("passport-local-mongoose");

const markSchema = new Schema({
  testName: String,
  testType: String,
  totalMark: Number,
  obtainedMark: Number,
});

const studentSchema = new Schema({
  email: {
    type: String,
    required: true,
  },
  admin: {
    type: Boolean,
    default: false,
  },
  recuiter:{
    type:Boolean,
    require:true,
    default:false
  }
  ,
  collegeName: {
    type: String,
    require: true,
  },
  registerNumber: {
    type: String,
    require: true,
  },
  attended: [
    {
      type: String,
    },
  ],
  marks: [markSchema],
});

studentSchema.plugin(passportLocalMongoose);

module.exports = mongoose.model("Student", studentSchema);
