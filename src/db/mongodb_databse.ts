import { MongoClient } from "mongodb";
// import { parentPort, workerData } from "worker_threads";
const uri: string | undefined = process.env.MONGO_CLIENT_URI;

const client = new MongoClient(uri!);

async function establishConnection() {
  try {
    if (uri) {
      await client.connect();
      console.log("connection established with mongodb");
    } else {
      throw new Error("uri is not defined");
    }
  } catch (error) {
    throw new Error("error in connecting to database");
  }
}
async function insertIntoMongoDbDatabase(data) {
  let responseForInsertion: any;
  responseForInsertion = await client
    .db("weatherDB")
    .collection("weather_collection")
    .insertOne(data);
  if (responseForInsertion.hasOwnProperty("insertedId") == false) {
    console.log("Error in adding data to database");
  } else {
    console.log("data inserted to mongodb database");
  }
}
async function getDataFromDataBase() {
  let responseForGetData: any;
  responseForGetData = await client
    .db("weatherDB")
    .collection("weather_collection")
    .find({})
    .toArray();
  return responseForGetData;
}
export default {
  establishConnection,
  insertIntoMongoDbDatabase,
  getDataFromDataBase,
};
