const mongoose = require("mongoose");

exports.connect = () => {
    mongoose.connect("mongodb+srv://chat:conecta123@cluster0.r7ti2.mongodb.net/chat", )
        .then(() => {
            console.log("Successfully connected to database");
        })
        .catch((error) => {
            console.log("database connection failed. exiting now...");
            console.error(error);
            process.exit(1);
        });
}
