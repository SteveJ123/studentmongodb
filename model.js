const mongoose = require('mongoose');
// In Mongoose, a model is a wrapper around a MongoDB collection
//that provides an interface for interacting with the collection and
//performing database operations. It is created using a schema,
//which defines the structure and behavior of the documents within the collection.

const StudentSchema = mongoose.Schema({
    Name: String,
    Roll_No: String,
    WAD_Marks: { type: Number, min: 0, max: 100 },
    CC_Marks: { type: Number, min: 0, max: 100 },
    DSBDA_Marks: { type: Number, min: 0, max: 100 },
    CNS_Marks: { type: Number, min: 0, max: 100 },
    AI_Marks: { type: Number, min: 0, max: 100 },
},{
    timestamps: true,
    collection: "studentmarks"
});

module.exports = mongoose.model('Student',StudentSchema);