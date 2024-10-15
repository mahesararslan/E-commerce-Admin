"use client"

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

export function Navbar({ userDetails, onMenuClick }: { 
    userDetails: any,
    onMenuClick: () => void 
}) {

  if(userDetails){
    console.log("userDetails: ", userDetails)
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
                    <span className="text-2xl font-bold text-white md:hidden">DH</span>
                    <span className="hidden text-2xl font-bold text-white md:block">DeviceHaven</span>
                  </Link>
                </div>
              </div>
              <div className="flex items-center">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                      <Avatar className="h-8 w-8">
                        <AvatarImage src={userDetails?.image} alt={userDetails?.name} />
                        <AvatarFallback><img src={userDetails?.image} alt="" /></AvatarFallback>
                      </Avatar>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent className="w-56" align="end" forceMount>
                    <DropdownMenuLabel className="font-normal">
                      <div className="flex flex-col space-y-1">
                        <p className="text-sm font-medium leading-none">{userDetails?.name}</p>
                        <p className="text-xs leading-none text-muted-foreground">{userDetails?.email}</p>
                      </div>
                    </DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem>
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
  else {
    return <div></div>
  }
  
}