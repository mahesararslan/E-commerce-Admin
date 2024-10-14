'use client'

import Nav from "@/components/Nav"
import { useSession, signIn, signOut } from "next-auth/react"

export default function Outline({children}: {children: React.ReactNode}) {
  const { data: session } = useSession()
  if (session) {
    return (
      <div className="min-h-screen bg-blue-900 flex">
        <Nav />
        <div className="bg-white flex-grow text-black mt-2 mr-2 mb-2 rounded-lg p-4"> {/* @ts-ignore */}
          {children}
        </div>
      </div>
    )
  }
  return (
    <>
      <div>Not signed in</div> <br />
      <button onClick={() => {
        signIn("google");
        console.log("sign in with google")
      }}>Sign in with Google</button>
    </>
  )
}