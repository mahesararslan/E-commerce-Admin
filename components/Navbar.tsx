"use client"

import logo from "@/public/logo.png"
import Image from "next/image";
import Link from "next/link"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Menu } from "lucide-react"
import { signOut, useSession } from "next-auth/react";
import { useEffect } from "react";

export function Navbar({ onMenuClick }: { 
    onMenuClick: () => void 
}) {
  const { data: session, status } = useSession();
  

  useEffect(() => {
    if (status === "authenticated") {
      console.log("User details:", session)
    }
    console.log("Session from navbar:", session);
  }, [status, session])

  useEffect(() => {
    console.log("User image URL:", session?.user?.image);
  }, [session]);
  

    return (
        <nav className="fixed top-0 left-0 right-0 z-50 border-b border-gray-700 bg-gray-800">
          <div className="mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex h-16 justify-between">
              <div className="flex">
                <div className="flex flex-shrink-0 items-center">
                  <Button variant="ghost" size="icon" className="md:hidden text-white" onClick={onMenuClick}>
                    <Menu className="h-6 w-6" />
                    <span className="sr-only">Open sidebar</span>
                  </Button>
                  <Link href="/dashboard" className="flex items-center">
                   {/* Logo Image */}
                    <Image src={logo} alt="DeviceHaven" height={250} width={250} />
                  </Link>
                </div>
              </div>
              <div className="flex items-center">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                    {status === "authenticated" ? (
                      <Avatar className="h-8 w-8 cursor-pointer">
                        <AvatarImage src={session?.user?.image?.toString() || ""} alt={session?.user?.name || ""} />
                        <AvatarFallback> 
                          {session?.user?.name ? session.user.name.charAt(0).toUpperCase() : null}
                        </AvatarFallback>
                      </Avatar>
                    ): null }
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent className="w-56" align="end" forceMount>
                    <DropdownMenuLabel className="font-normal">
                      <div className="flex flex-col space-y-1">
                        <p className="text-sm font-medium leading-none">{session?.user?.name}</p>
                        <p className="text-xs leading-none text-muted-foreground">{session?.user?.email}</p>
                      </div>
                    </DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={() => {signOut({ callbackUrl: "/" })}} >
                      Log out
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </div>
          </div>
        </nav>
      )
}