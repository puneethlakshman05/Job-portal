import mongoose from "mongoose";

//FUnction to connect to the mongoDB database




const connectDB = async() =>{
    mongoose.connection.on('connected',()=> console.log('Database connected'));

    await mongoose.connect(`${process.env.MONGODB_URI}/users`)
}

export default connectDB