import React, { useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { useAuth } from '@/context/AuthContext'
import { useRole } from '@/hooks/useRole'
import { useIsMobile } from '@/hooks/use-mobile'
import { Button } from '@/components/ui/button'
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar'
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet'
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuLabel, 
  DropdownMenuSeparator, 
  DropdownMenuTrigger 
} from '@/components/ui/dropdown-menu'
import { 
  BookOpen, 
  Users, 
  Settings, 
  LogOut, 
  User, 
  GraduationCap,
  BarChart3,
  Calendar,
  Library,
  Shield,
  Menu,
  X
} from 'lucide-react'

const MobileOptimizedNavbar = () => {
  const { user, signOut } = useAuth()
  const { role, isAdmin, isInstructor, isSuperAdmin } = useRole()
  const location = useLocation()
  const navigate = useNavigate()
  const isMobile = useIsMobile()
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  const handleSignOut = async () => {
    await signOut()
    navigate('/auth')
    setMobileMenuOpen(false)
  }

  const getInitials = (name?: string) => {
    if (!name) return 'U'
    return name.split(' ').map(n => n[0]).join('').toUpperCase()
  }

  const isActive = (path: string) => location.pathname === path

  const getRoleDisplayName = (role: string) => {
    switch (role) {
      case 'super_admin': return 'Super Admin'
      case 'admin': return 'Admin'
      case 'instructor': return 'Instructor'
      case 'student': return 'Student'
      default: return role
    }
  }

  const navItems = [
    { path: '/dashboard', label: 'Dashboard', icon: BarChart3, roles: ['student', 'instructor', 'admin', 'super_admin'] },
    { path: '/courses', label: 'Courses', icon: BookOpen, roles: ['student', 'instructor', 'admin', 'super_admin'] },
    { path: '/library', label: 'Library', icon: Library, roles: ['student', 'instructor', 'admin', 'super_admin'] },
    { path: '/live-sessions', label: 'Live Sessions', icon: Calendar, roles: ['student', 'instructor', 'admin', 'super_admin'] },
    { path: '/progress', label: 'Progress', icon: GraduationCap, roles: ['student'] },
    { path: '/admin', label: 'Admin Panel', icon: Settings, roles: ['admin', 'super_admin'] },
    { path: '/instructor', label: 'Instructor Panel', icon: Users, roles: ['instructor', 'admin', 'super_admin'] },
  ]

  const availableNavItems = navItems.filter(item => {
    if (!role) return false
    return item.roles.includes(role)
  })

  const handleNavClick = (path: string) => {
    navigate(path)
    setMobileMenuOpen(false)
  }

  if (isMobile) {
    return (
      <nav className="bg-background border-b border-border shadow-sm sticky top-0 z-50">
        <div className="flex justify-between items-center h-14 px-4">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
              <GraduationCap className="h-5 w-5 text-primary-foreground" />
            </div>
            <span className="text-lg font-bold text-foreground">EduPlatform</span>
          </Link>

          {/* Mobile Menu and User Avatar */}
          <div className="flex items-center space-x-2">
            {user && (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                    <Avatar className="h-8 w-8">
                      <AvatarImage src={user?.user_metadata?.avatar_url} />
                      <AvatarFallback>
                        {getInitials(user?.user_metadata?.full_name)}
                      </AvatarFallback>
                    </Avatar>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-56" align="end">
                  <DropdownMenuLabel className="font-normal">
                    <div className="flex flex-col space-y-1">
                      <p className="text-sm font-medium leading-none">
                        {user?.user_metadata?.full_name || 'User'}
                      </p>
                      <p className="text-xs leading-none text-muted-foreground">
                        {user?.email}
                      </p>
                      <p className="text-xs leading-none text-muted-foreground flex items-center">
                        {isSuperAdmin() && <Shield className="h-3 w-3 mr-1 text-purple-600" />}
                        {getRoleDisplayName(role || '')}
                      </p>
                    </div>
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={() => navigate('/profile')}>
                    <User className="mr-2 h-4 w-4" />
                    <span>Profile</span>
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => navigate('/settings')}>
                    <Settings className="mr-2 h-4 w-4" />
                    <span>Settings</span>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={handleSignOut}>
                    <LogOut className="mr-2 h-4 w-4" />
                    <span>Log out</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            )}

            <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
              <SheetTrigger asChild>
                <Button variant="ghost" size="sm" className="h-9 w-9 p-0">
                  <Menu className="h-5 w-5" />
                  <span className="sr-only">Toggle menu</span>
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-[300px] sm:w-[350px]">
                <div className="flex flex-col h-full">
                  <div className="flex items-center justify-between pb-4 border-b">
                    <div className="flex items-center space-x-2">
                      <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
                        <GraduationCap className="h-5 w-5 text-primary-foreground" />
                      </div>
                      <span className="text-lg font-bold">EduPlatform</span>
                    </div>
                  </div>

                  <nav className="flex-1 mt-6">
                    <div className="space-y-2">
                      {availableNavItems.map((item) => {
                        const Icon = item.icon
                        return (
                          <button
                            key={item.path}
                            onClick={() => handleNavClick(item.path)}
                            className={`w-full flex items-center space-x-3 px-3 py-3 rounded-lg text-sm font-medium transition-colors ${
                              isActive(item.path)
                                ? 'bg-primary text-primary-foreground'
                                : 'text-muted-foreground hover:text-foreground hover:bg-muted'
                            }`}
                          >
                            <Icon className="h-5 w-5" />
                            <span>{item.label}</span>
                          </button>
                        )
                      })}
                    </div>
                  </nav>

                  {!user && (
                    <div className="pt-4 border-t">
                      <Button 
                        onClick={() => handleNavClick('/auth')}
                        className="w-full"
                      >
                        Sign In
                      </Button>
                    </div>
                  )}
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </nav>
    )
  }

  // Desktop navbar (existing code)
  return (
    <nav className="bg-background border-b border-border shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
              <GraduationCap className="h-5 w-5 text-primary-foreground" />
            </div>
            <span className="text-xl font-bold text-foreground">EduPlatform</span>
          </Link>

          {/* Navigation Links */}
          <div className="hidden md:flex items-center space-x-1">
            {availableNavItems.map((item) => {
              const Icon = item.icon
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`px-3 py-2 rounded-md text-sm font-medium transition-colors flex items-center space-x-1 ${
                    isActive(item.path)
                      ? 'bg-primary text-primary-foreground'
                      : 'text-muted-foreground hover:text-foreground hover:bg-muted'
                  }`}
                >
                  <Icon className="h-4 w-4" />
                  <span>{item.label}</span>
                </Link>
              )
            })}
          </div>

          {/* User Menu */}
          <div className="flex items-center space-x-4">
            <div className="hidden md:flex items-center space-x-2">
              {isSuperAdmin() && (
                <Shield className="h-4 w-4 text-purple-600" />
              )}
              <span className="text-sm font-medium text-muted-foreground">
                {getRoleDisplayName(role || '')}
              </span>
            </div>
            
            {user ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                    <Avatar className="h-8 w-8">
                      <AvatarImage src={user?.user_metadata?.avatar_url} />
                      <AvatarFallback>
                        {getInitials(user?.user_metadata?.full_name)}
                      </AvatarFallback>
                    </Avatar>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-56" align="end" forceMount>
                  <DropdownMenuLabel className="font-normal">
                    <div className="flex flex-col space-y-1">
                      <p className="text-sm font-medium leading-none">
                        {user?.user_metadata?.full_name || 'User'}
                      </p>
                      <p className="text-xs leading-none text-muted-foreground">
                        {user?.email}
                      </p>
                      <p className="text-xs leading-none text-muted-foreground flex items-center">
                        {isSuperAdmin() && <Shield className="h-3 w-3 mr-1 text-purple-600" />}
                        {getRoleDisplayName(role || '')}
                      </p>
                    </div>
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={() => navigate('/profile')}>
                    <User className="mr-2 h-4 w-4" />
                    <span>Profile</span>
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => navigate('/settings')}>
                    <Settings className="mr-2 h-4 w-4" />
                    <span>Settings</span>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={handleSignOut}>
                    <LogOut className="mr-2 h-4 w-4" />
                    <span>Log out</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <Button onClick={() => navigate('/auth')}>
                Sign In
              </Button>
            )}
          </div>
        </div>
      </div>
    </nav>
  )
}

export default MobileOptimizedNavbar