import mongoose from "mongoose";

type connectionObject = {
    isConnected ?: Number;
}

const connection: connectionObject = {}

async function dbConnect(): Promise<void> {
    if (connection.isConnected) {
        console.log("Already connected to Database");
        return;
    }

    try {
        const db = await mongoose.connect(process.env.MONGO_URI || '', {})

        connection.isConnected = db.connections[0].readyState;
        console.log("Database connect Successfully");
    } catch (error) {
        console.log("Database connection failed");

        process.exit(1);
    }
}

export default dbConnect;