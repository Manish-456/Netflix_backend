const mongoose = require('mongoose')

const UserSchema = new mongoose.Schema({
 username : {
  type : String,
  required : true
 },
 email : {
  type : String,
  required : true,
  unique : true
 },
 password : {
  type : String,
  required : true
 },
 isAdmin : {
 type : Boolean,
 default : false
 },
 profileImg:{
  type : String,
  
 }
}, {
 timestamps : true
})

module.exports = mongoose.model('User', UserSchema)

//schema ---> defines the structure of the document, validators , default values etc.
// models provides an interface to the database for creating , updating , deleting , reading records
