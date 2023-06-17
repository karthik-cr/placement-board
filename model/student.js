const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const passportLocalMongoose = require('passport-local-mongoose');

const studentSchema = new Schema({
    email: {
        type: String,
        required: true
    },
    admin:{
        type:Boolean,
        default:false
    },
    collegeName:{
        type:String,
        require:true
    },
    registerNumber:{
        type:String,
        require:true
    },
    attended:
    [
    {
        type:String
    }
]
});


studentSchema.plugin(passportLocalMongoose);

module.exports = mongoose.model('Student', studentSchema);
