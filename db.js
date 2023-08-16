const mongoose = require("mongoose");

const mongoUri = "mongodb://0.0.0.0:27017/inotebook";
// const mongoUri = "mongodb://localhost:27017/";

// const connectToMongo = () => {
//   mongoose.connect(mongoUri, () => {
//     console.log("Connected to mongoose successfully");
//   });
// };

const connectToMongo = () => {
  try {
    mongoose.connect(mongoUri);
    console.log("Mongo connected");
  } catch (error) {
    console.log("Error is:: ", error);
  }
};

module.exports = connectToMongo;
