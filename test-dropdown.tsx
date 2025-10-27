'use client'

import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Bell } from 'lucide-react'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'

export default function TestDropdown() {
  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-4">Test Dropdown</h1>
      
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <div className="relative">
            <Button variant="ghost" size="sm" className="text-gray-700 hover:text-gray-900 hover:bg-gray-100">
              <Bell className="h-5 w-5" />
            </Button>
            <Badge className="absolute -top-1 -right-1 h-5 w-5 rounded-full p-0 text-xs pointer-events-none">
              3
            </Badge>
          </div>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="w-80 z-[9999] bg-white border border-gray-200 shadow-lg" align="end">
          <DropdownMenuLabel>
            <div className="flex flex-col space-y-1">
              <p className="text-sm font-medium">Notifications</p>
              <p className="text-xs text-muted-foreground">You have 3 new notifications</p>
            </div>
          </DropdownMenuLabel>
          <DropdownMenuSeparator />
          
          <DropdownMenuItem className="cursor-pointer">
            Test notification 1
          </DropdownMenuItem>
          
          <DropdownMenuItem className="cursor-pointer">
            Test notification 2
          </DropdownMenuItem>
          
          <DropdownMenuSeparator />
          <DropdownMenuItem className="cursor-pointer">
            View all notifications
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  )
}