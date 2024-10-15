'use client'

import { Navbar } from "@/components/Navbar"
import { Sidebar } from "@/components/Sidebar"
import { useSession, signIn } from "next-auth/react"
import { Providers } from "../app/providers"
import { useState, useRef, useEffect } from "react"

export default function Outline({ userDetails, children }: { userDetails: any; children: React.ReactNode }) {
  const { data: session } = useSession()
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const sidebarRef = useRef<HTMLDivElement | null>(null) // Define ref for Sidebar

  // Close sidebar on outside click
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (sidebarRef.current && !sidebarRef.current.contains(event.target as Node)) {
        setSidebarOpen(false)
      }
    }

    // Attach event listener
    document.addEventListener("mousedown", handleClickOutside)

    return () => {
      // Cleanup event listener
      document.removeEventListener("mousedown", handleClickOutside)
    }
  }, [sidebarRef])

  // Use userDetails from props if available, otherwise fallback to session
  const currentUserDetails = userDetails?.user || session?.user

  if (currentUserDetails) {
    return (
      <div className="flex h-screen bg-blue-50">
        <Sidebar ref={sidebarRef} className={sidebarOpen ? "translate-x-0" : ""} />
        <div className="flex flex-1 flex-col overflow-hidden">
          <Navbar userDetails={currentUserDetails} onMenuClick={() => setSidebarOpen(!sidebarOpen)} />
          <main className="flex-1 overflow-x-hidden overflow-y-auto p-6 md:ml-64 mt-16 bg-gray-100">
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
      <button onClick={() => signIn("google")}>Sign in with Google</button>
    </>
  )
}
