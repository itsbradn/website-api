import { connect } from "mongoose"

export const databaseInit = async () => {
  await connect(process.env.MONGO_URI!);
  console.log('Connected to database'); // TODO Implement custom logger
}