import GoogleProvider from "next-auth/providers/google"
import { MongoDBAdapter } from "@next-auth/mongodb-adapter"
import { NextAuthOptions } from "next-auth"
import clientPromise from "./db";

const adminEmails = process.env.ADMIN_EMAILS?.split(",") || []
console.log(adminEmails)

const authOptions: NextAuthOptions = { // @ts-ignore
  
    providers: [
      GoogleProvider({
        clientId: process.env.GOOGLE_ID || "",
        clientSecret: process.env.GOOGLE_SECRET || "",
      }),
    ], // @ts-ignore
    adapter: MongoDBAdapter(clientPromise),
    callbacks: { // @ts-ignore
      session: async (session: any, user: any) => {
        if(adminEmails.includes(session?.user?.email)) {
          return session
        } else {
          return null
        }
      },
    }
  }

export default authOptions;