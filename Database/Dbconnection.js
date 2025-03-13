import mongoose  from "mongoose";

export const Dbconnection = async() => {
  try {
    const insantConnection = await mongoose.connect(process.env.MONG0DB_URI)
    console.log(`Database is connected: ${insantConnection.connection.host}`);
} catch (error) {
    console.log(`Error connecting database: ${error}`);
    process.exit(1);
}
}
