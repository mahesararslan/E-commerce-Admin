import GoogleProvider from "next-auth/providers/google"
import { MongoDBAdapter } from "@next-auth/mongodb-adapter"
import { NextAuthOptions } from "next-auth"
import clientPromise from "./db";

const authOptions: NextAuthOptions = { // @ts-ignore
  
    providers: [
      GoogleProvider({
        clientId: process.env.GOOGLE_ID || "",
        clientSecret: process.env.GOOGLE_SECRET || "",
      }),
    ], // @ts-ignore
    adapter: MongoDBAdapter(clientPromise),
  }

export default authOptions;