'use client'

import { useState } from 'react'
import { 
  LayoutDashboard, 
  FileText, 
  Brain, 
  MessageSquare, 
  LogOut, 
  Menu, 
  X,
  PanelLeftOpen,
  PanelLeftClose,
  Search,
  Bell,
  User,
  Shield,
  BarChart3,
  Settings
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Separator } from '@/components/ui/separator'
import Link from 'next/link'
import { usePathname } from 'next/navigation'

const navigation = [
  { name: 'Dashboard', href: '/police', icon: LayoutDashboard },
  { name: 'Register FIR', href: '/police/register-fir', icon: FileText },
  { name: 'AI Suggestions', href: '/police/ai-suggestions', icon: Brain },
  { name: 'Feedback', href: '/police/feedback', icon: MessageSquare },
]

interface PoliceLayoutProps {
  children: React.ReactNode
}

export default function PoliceLayout({ children }: PoliceLayoutProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false)
  const pathname = usePathname()
  const [searchQuery, setSearchQuery] = useState('')

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Mobile sidebar backdrop */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 z-40 bg-black bg-opacity-25 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar - Fixed positioning */}
      <div className={`
        fixed top-0 left-0 h-screen z-50 bg-gradient-to-b from-blue-600 to-blue-700 text-white
        transform transition-all duration-300 ease-in-out
        ${sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
        ${sidebarCollapsed ? 'lg:w-16' : 'lg:w-64'}
        ${sidebarCollapsed ? 'w-16' : 'w-64'}
      `}>
        <div className="flex h-full flex-col">
          {/* Logo */}
          <div className="flex h-16 items-center justify-between px-6 border-b border-white/20 shrink-0">
            <div className={`flex items-center space-x-3 transition-all duration-300 ${sidebarCollapsed ? 'lg:justify-center' : ''}`}>
              <Shield className="h-8 w-8 flex-shrink-0" />
              <div className={`transition-all duration-300 ${sidebarCollapsed ? 'lg:hidden' : ''}`}>
                <h1 className="text-lg font-bold">Nyaya AI</h1>
                <p className="text-xs text-white/80 leading-tight">
                  Intelligent FIR Assistance System
                </p>

              </div>
            </div>
            {/* Only show mobile close button */}
            <Button
              variant="ghost"
              size="sm"
              className="lg:hidden text-white hover:bg-white/20"
              onClick={() => setSidebarOpen(false)}
            >
              <X className="h-5 w-5" />
            </Button>
          </div>

          {/* Navigation */}
          <nav className="flex-1 space-y-1 px-3 py-4 overflow-y-auto">
            {navigation.map((item) => {
              const isActive = pathname === item.href
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  className={`
                    flex items-center ${sidebarCollapsed ? 'lg:justify-center' : ''} space-x-3 rounded-lg px-3 py-2 text-sm font-medium transition-all duration-300 group relative
                    ${isActive 
                      ? 'bg-white text-blue-600' 
                      : 'text-white/90 hover:bg-white/10 hover:text-white'
                    }
                  `}
                >
                  <item.icon className="h-5 w-5 flex-shrink-0" />
                  <span className={`transition-all duration-300 ${sidebarCollapsed ? 'lg:hidden' : ''}`}>
                    {item.name}
                  </span>
                  {/* Tooltip for collapsed state */}
                  {sidebarCollapsed && (
                    <div className="absolute left-full ml-2 px-2 py-1 bg-gray-900 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none whitespace-nowrap z-50 lg:block hidden">
                      {item.name}
                    </div>
                  )}
                </Link>
              )
            })}
          </nav>

          {/* User section with logout */}
          <div className="border-t border-white/20 p-4 shrink-0">
            <div className={`flex items-center space-x-3 ${sidebarCollapsed ? 'lg:justify-center' : ''}`}>
              <Avatar className="h-8 w-8 flex-shrink-0">
                <AvatarImage src="/avatars/police.png" />
                <AvatarFallback>OP</AvatarFallback>
              </Avatar>
              <div className={`flex-1 min-w-0 transition-all duration-300 ${sidebarCollapsed ? 'lg:hidden' : ''}`}>
                <p className="text-sm font-medium text-white truncate">Officer Smith</p>
                <p className="text-xs text-white/70 truncate">Police Department</p>
              </div>
            </div>
            <Button
              variant="ghost"
              className={`w-full mt-3 text-white/80 hover:bg-white/10 hover:text-white transition-all duration-300 group relative ${sidebarCollapsed ? 'lg:px-2' : 'justify-start'}`}
              onClick={() => window.location.href = '/police/login'}
            >
              <LogOut className="h-4 w-4 flex-shrink-0" />
              <span className={`ml-2 transition-all duration-300 ${sidebarCollapsed ? 'lg:hidden' : ''}`}>
                Logout
              </span>
              {/* Tooltip for collapsed state */}
              {sidebarCollapsed && (
                <div className="absolute left-full ml-2 px-2 py-1 bg-gray-900 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none whitespace-nowrap z-50 lg:block hidden">
                  Logout
                </div>
              )}
            </Button>
          </div>
        </div>
      </div>

      {/* Main content - Proper spacing for fixed sidebar */}
      <div className={`flex-1 flex flex-col min-h-screen transition-all duration-300 ${sidebarCollapsed ? 'lg:ml-16' : 'lg:ml-64'}`}>
        {/* Top bar */}
        <header className="sticky top-0 z-20 bg-white shadow-sm border-b shrink-0">
          <div className="flex h-16 items-center justify-between px-4 sm:px-6 lg:px-8">
            <div className="flex items-center space-x-4">
              {/* Mobile menu toggle */}
              <Button
                variant="ghost"
                size="sm"
                className="lg:hidden"
                onClick={() => setSidebarOpen(true)}
              >
                <Menu className="h-5 w-5" />
              </Button>
              
              {/* Desktop sidebar toggle button - Only one toggle */}
              <Button
                variant="ghost"
                size="sm"
                className="hidden lg:flex items-center space-x-2"
                onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
              >
                {sidebarCollapsed ? (
                  <>
                    <Menu className="h-5 w-5" />
                    <span className="text-sm">Expand</span>
                  </>
                ) : (
                  <>
                    <X className="h-5 w-5" />
                    <span className="text-sm">Collapse</span>
                  </>
                )}
              </Button>


              
              {/* Search */}
              <div className="relative max-w-md flex-1">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                <Input
                  placeholder="Search FIR by ID, case details..."
                  className="pl-10 w-full sm:w-80"
                />
              </div>
            </div>

            <div className="flex items-center space-x-4">
              {/* Notifications */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    className="relative text-gray-700 hover:text-gray-900 hover:bg-gray-100"
                  >
                    <Bell className="h-5 w-5" />
                    <Badge className="absolute -top-1 -right-1 h-5 w-5 rounded-full p-0 text-xs pointer-events-none">
                      3
                    </Badge>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-80 z-[9999] bg-white border border-gray-200 shadow-lg" align="end">
                  <DropdownMenuLabel>
                    <div className="flex flex-col space-y-1">
                      <p className="text-sm font-medium">Notifications</p>
                      <p className="text-xs text-muted-foreground">You have 3 new notifications</p>
                    </div>
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  
                  {/* Notification Items */}
                  <div className="max-h-96 overflow-y-auto">
                    <DropdownMenuItem className="flex flex-col items-start p-3 cursor-pointer" onClick={() => window.location.href = '/police'}>
                      <div className="flex items-start space-x-3 w-full">
                        <div className="flex-shrink-0">
                          <div className="w-2 h-2 bg-blue-600 rounded-full mt-2"></div>
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium">New FIR Assigned</p>
                          <p className="text-xs text-muted-foreground mt-1">FIR #2024-001 has been assigned to you for investigation</p>
                          <p className="text-xs text-muted-foreground mt-1">2 minutes ago</p>
                        </div>
                      </div>
                    </DropdownMenuItem>
                    
                    <DropdownMenuItem className="flex flex-col items-start p-3 cursor-pointer" onClick={() => window.location.href = '/police'}>
                      <div className="flex items-start space-x-3 w-full">
                        <div className="flex-shrink-0">
                          <div className="w-2 h-2 bg-green-600 rounded-full mt-2"></div>
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium">Case Status Update</p>
                          <p className="text-xs text-muted-foreground mt-1">FIR #2023-987 investigation completed successfully</p>
                          <p className="text-xs text-muted-foreground mt-1">1 hour ago</p>
                        </div>
                      </div>
                    </DropdownMenuItem>
                    
                    <DropdownMenuItem className="flex flex-col items-start p-3 cursor-pointer" onClick={() => window.location.href = '/police/ai-suggestions'}>
                      <div className="flex items-start space-x-3 w-full">
                        <div className="flex-shrink-0">
                          <div className="w-2 h-2 bg-orange-600 rounded-full mt-2"></div>
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium">AI Analysis Complete</p>
                          <p className="text-xs text-muted-foreground mt-1">AI suggestions for FIR #2024-002 are ready for review</p>
                          <p className="text-xs text-muted-foreground mt-1">3 hours ago</p>
                        </div>
                      </div>
                    </DropdownMenuItem>
                  </div>
                  
                  <DropdownMenuSeparator />
                  <DropdownMenuItem className="cursor-pointer" onClick={() => window.location.href = '/police'}>
                    <div className="flex items-center justify-between w-full">
                      <span className="text-sm">View all notifications</span>
                      <span className="text-xs text-blue-600">→</span>
                    </div>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>

              {/* Profile dropdown */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="relative h-8 w-8 rounded-full text-gray-700 hover:text-gray-900 hover:bg-gray-100">
                    <Avatar className="h-8 w-8">
                      <AvatarImage src="/avatars/police.png" alt="Profile" />
                      <AvatarFallback>OP</AvatarFallback>
                    </Avatar>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-56 bg-white border-gray-200 text-gray-900" align="end" forceMount>
                  <DropdownMenuLabel className="font-normal">
                    <div className="flex flex-col space-y-1">
                      <p className="text-sm font-medium leading-none">Officer Smith</p>
                      <p className="text-xs leading-none text-muted-foreground">
                        officer.smith@police.gov
                      </p>
                    </div>
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem className="text-gray-700 hover:text-gray-900 hover:bg-gray-100">
                    <User className="mr-2 h-4 w-4" />
                    <span>Profile</span>
                  </DropdownMenuItem>
                  <DropdownMenuItem className="text-gray-700 hover:text-gray-900 hover:bg-gray-100">
                    <Shield className="mr-2 h-4 w-4" />
                    <span>Settings</span>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem className="text-gray-700 hover:text-gray-900 hover:bg-gray-100">
                    <LogOut className="mr-2 h-4 w-4" />
                    <span>Log out</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </header>

        {/* Page content */}
        <main className="flex-1 animate-fade-in">
          {children}
        </main>
      </div>
    </div>
  )
}