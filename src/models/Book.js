const mongoose=require('mongoose');

const bookSchema=new mongoose.Schema({
    title:{type:String,required:true,trim:true},
    author:{type:String,required:true,trim:true},
    description:{type:String},
    genre:{type:String},
    year:{type:Number},
    addBy:{type:mongoose.Schema.Types.ObjectId,ref:'User',trim:true}
},{timestamps:true})

module.exports=mongoose.model("Book",bookSchema)