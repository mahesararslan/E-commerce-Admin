// Outline.tsx
'use client'

import { Navbar } from "@/components/Navbar"
import { Sidebar } from "@/components/Sidebar"
import { useSession, signIn, signOut } from "next-auth/react"
import { Providers } from "../app/providers"
import { useState } from "react"

export default function Outline({ userDetails, children }: {
  userDetails: any
  children: React.ReactNode
}) {
  const { data: session } = useSession()
  const [sidebarOpen, setSidebarOpen] = useState(false)
  console.log(session)

  // Use userDetails from props if available, otherwise fallback to session
  const currentUserDetails = userDetails?.user || session?.user;

  if (currentUserDetails) {
    console.log("In Outline: ", currentUserDetails); // should log user details
    return (
      <div className="flex h-screen bg-blue-50">
        <Sidebar className={sidebarOpen ? "translate-x-0" : ""} />
        <div className="flex flex-1 flex-col overflow-hidden">
          <Navbar userDetails={currentUserDetails} onMenuClick={() => setSidebarOpen(!sidebarOpen)} />
          <main className="flex-1 overflow-x-hidden overflow-y-auto p-6 md:ml-64 mt-16 bg-zinc-100">
            <Providers>{children}</Providers>
          </main>
        </div>
      </div>
    )
  }

  return (
    <>
      <div>Not signed in</div>
      <br />
      <button onClick={() => {
        signIn("google");
        console.log("sign in with google")
      }}>Sign in with Google</button>
    </>
  )
}
