import GoogleProvider from "next-auth/providers/google"
import { MongoDBAdapter } from "@next-auth/mongodb-adapter"
import client from "@/app/lib/db"
import { NextAuthOptions } from "next-auth"

const authOptions: NextAuthOptions = { // @ts-ignore
    adapter: MongoDBAdapter(client),
    providers: [
      GoogleProvider({
        clientId: process.env.GOOGLE_ID || "",
        clientSecret: process.env.GOOGLE_SECRET || "",
      }),
    ],
  }

export default authOptions;