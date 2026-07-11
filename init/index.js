import mongoose from "mongoose";
import { data } from "./data.js";
import Listing from "../models/listing.js";

const MONGO_URL = "mongodb://127.0.0.1:27017/wanderlust";

async function main() {
  await mongoose.connect(MONGO_URL);
  console.log("connected to DB");
}

main().catch((err) => console.log(err));

const initDB = async () => {
  await Listing.deleteMany({});

  const listings = data.map((obj) => ({
    ...obj,
    owner: "69e9f931a417b77412c07eb2",
  }));

  await Listing.insertMany(listings);

  console.log("Data was initialized");
};
initDB();