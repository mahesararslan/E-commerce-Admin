"use client"

import { signOut } from "next-auth/react"
import { useState, useEffect, forwardRef } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import {
  LayoutDashboard,
  Package,
  ListTree,
  ClipboardList,
  Users,
  Settings,
  LogOut,
} from "lucide-react"

// Sidebar items array
const sidebarItems = [
  { name: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
  { name: "Products", href: "/products", icon: Package },
  { name: "Categories", href: "/categories", icon: ListTree },
  { name: "Orders", href: "/orders", icon: ClipboardList },
  { name: "Settings", href: "/settings", icon: Settings },
]

// Forwarding ref to Sidebar component
export const Sidebar = forwardRef<HTMLDivElement, { className?: string }>(
  function Sidebar({ className }, ref) {
    const pathname = usePathname()
    const [isOpen, setIsOpen] = useState(false)

    // Handle responsive sidebar open/close behavior
    useEffect(() => {
      const handleResize = () => {
        if (window.innerWidth >= 768) {
          setIsOpen(true)
        } else {
          setIsOpen(false)
        }
      }

      window.addEventListener("resize", handleResize)
      handleResize()

      return () => window.removeEventListener("resize", handleResize)
    }, [])

    return (
      <div
        ref={ref}  // Attach ref here
        className={cn(
          "fixed left-0 top-0 z-40 h-screen w-64 -translate-x-full transform bg-gray-900 transition-transform duration-200 ease-in-out md:translate-x-0",
          isOpen && "translate-x-0",
          className
        )}
      >
        <div className="flex h-full flex-col overflow-y-auto py-5 px-3">
          <div className="mb-6 flex items-center justify-center">
            <Link href="/">
              <span className="text-2xl font-bold text-white">DeviceHaven</span>
            </Link>
          </div>
          <nav className="flex-1 space-y-1 px-2">
            {sidebarItems.map((item) => {
              const isActive =
                pathname === item.href ||
                (pathname.startsWith(item.href) && pathname !== "/" && item.href !== "/")

              return (
                <Link
                  key={item.name}
                  href={item.href}
                  className={cn(
                    "group flex items-center rounded-md px-2 py-2 text-sm font-medium",
                    isActive
                      ? "bg-gray-800 text-white"
                      : "text-gray-100 hover:bg-gray-800 hover:text-white"
                  )}
                >
                  <item.icon
                    className={cn(
                      "mr-3 h-6 w-6 flex-shrink-0",
                      isActive ? "text-white" : "text-gray-300 group-hover:text-white"
                    )}
                    aria-hidden="true"
                  />
                  {item.name}
                </Link>
              )
            })}
          </nav>
          <div className="mt-auto px-2">
            <Button
              variant="outline"
              className="w-full justify-start bg-gray-800 hover:bg-gray-800 text-white hover:text-white hover:font-bold"
              onClick={() => signOut({ callbackUrl: "/" })}
            >
              <LogOut className="mr-3 h-6 w-6" />
              Logout
            </Button>
          </div>
        </div>
      </div>
    )
  }
)
