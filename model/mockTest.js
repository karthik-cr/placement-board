const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const mockTestSchema = new Schema({
    testName:{
        type:String,
        require:true
    },
    type:{
        type:String,
        require:true
    },
    status:{
        type:String,
        require:true
    },
    link:{
        type:String,
        require:true
    }
})

module.exports = mongoose.model("mockTest",mockTestSchema)