"use client"

import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { Menu } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useState, ReactElement } from "react"
import { useTheme } from "next-themes"
import Image from "next/image"
import Link from "next/link"
import { ThemeSwitcher } from "../theme-switcher"
import { ProfileMenu } from "./profile-menu"

type NavItem = {
  href: string
  label: string | ReactElement
  children?: ReactElement
  position?: 'left' | 'center' | 'right'
}

const navItems: NavItem[] = [
  { href: '/', label: 'Home', position: 'left' },
  { href: '/pricing', label: 'Pricing', position: 'left' }
]

export const ResponsiveNavbarComponent = (): ReactElement => {
  const [isOpen, setIsOpen] = useState(false);
  const { theme } = useTheme();

  const renderNavItem = (item: NavItem) => (
    <Link key={item.href} href={item.href} className="text-sm font-medium text-muted-foreground hover:text-primary mx-2" onClick={() => setIsOpen(false)}>
      {item.children || item.label}
    </Link>
  )

  const leftItems = navItems.filter(item => item.position === 'left');
  const centerItems = navItems.filter(item => item.position === 'center');
  const rightItems = navItems.filter(item => item.position === 'right');

  return (
    <header className="fixed top-0 left-0 right-0 z-50">
      <nav className="bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-16">
            {/* Left section */}
            <div className="flex items-center">
              <Link href="/" className="text-xl font-bold mr-4">
                {theme == "dark" ? (
                  <Image src="logo/light/simplist-icon-text.svg" alt="Logo (light)" width={95} height={50} />
                ) : theme == "light" ? (
                  <Image src="logo/dark/simplist-icon-text.svg" alt="Logo (dark)" width={95} height={50} />
                ) : (
                  <Image src="logo/light/simplist-icon-text.svg" alt="Logo (dark)" width={95} height={50} />
                )}
              </Link>
              <div className="hidden md:flex">
                {leftItems.map(renderNavItem)}
              </div>
            </div>

            {/* Center section */}
            <div className="hidden md:flex md:items-center md:justify-center flex-1">
              {centerItems.map(renderNavItem)}
            </div>

            {/* Right section */}
            <div className="flex items-center">
              <div className="hidden md:flex">
                {rightItems.map(renderNavItem)}
                <div className="flex gap-2">
                  <ThemeSwitcher />
                  <ProfileMenu />
                </div>
              </div>

              {/* Mobile menu button */}
              <div className="md:hidden">
                <Sheet open={isOpen} onOpenChange={setIsOpen}>
                  <SheetTrigger asChild>
                    <Button variant="ghost" size="icon">
                      <Menu className="h-6 w-6" />
                      <span className="sr-only">Open menu</span>
                    </Button>
                  </SheetTrigger>
                  <SheetContent side="right">
                    <div className="flex flex-col space-y-4 mt-4">
                      {navItems.map(renderNavItem)}

                      <div className="flex flex-row justify-between">
                        <ThemeSwitcher />
                        <ProfileMenu />
                      </div>
                    </div>
                  </SheetContent>
                </Sheet>
              </div>
            </div>
          </div>
        </div>
      </nav>
    </header>
  )
}