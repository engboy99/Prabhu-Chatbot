import { connect, disconnect } from "mongoose";
export const connectToDatabase = async () => {
    try {
        const mongoUrl = process.env.MONGODB_URL;
        if (!mongoUrl)
            throw new Error("MONGODB_URL is not defined in .env");
        await connect(mongoUrl);
        console.log("MongoDB Connected");
    }
    catch (error) {
        console.error(error.message);
        throw new Error("Couldn't Connect To MongoDB: " + error.message);
    }
};
export const disconnectFromDatabase = async () => {
    try {
        await disconnect();
        console.log("MongoDB Disconnected");
    }
    catch (error) {
        console.error(error.message);
        throw new Error("Couldn't Disconnect from MongoDB: " + error.message);
    }
};
//# sourceMappingURL=connection.js.map