import mongoose from'mongoose';

const userSchema = new mongoose.Schema({
    _id: {type:String, required:true},
    name: {type:String, required:true},
    emai:{type:String, required:true, unique:true},
    resume:{type:String},
    image:{type:String}
})

const User= mongoose.model('User',userSchema);


export default User;