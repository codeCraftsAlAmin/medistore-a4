"use client";

import React from "react";
import Link from "next/link";
import {
  Pill,
  Menu,
  ShoppingBag,
  Users,
  ClipboardList,
  LogOut,
  LayoutDashboard,
  Store,
  Star,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useAuth } from "@/app/store/useAuth";

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
} from "@/components/ui/navigation-menu";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { ModeToggle } from "./model-toggle";
import { ProfileDropdown } from "./ProfileDropdown";

interface MenuItem {
  title: string;
  url: string;
  description?: string;
  icon?: React.ReactNode;
  items?: MenuItem[];
}

const Navbar = () => {
  const { user, isAuthenticated, logout } = useAuth();

  // 1. Define Pharmacy Titles based on Roles
  const menu: MenuItem[] = [
    { title: "Home", url: "/" },
    {
      title: "Medicines",
      url: "/medicine",
      icon: <Store className="size-5" />,
    },
  ];

  if (user?.role === "CUSTOMER") {
    menu.push({
      title: "My Portal",
      url: "#",
      items: [
        {
          title: "My Orders",
          url: "/customer/orders",
          description: "Track or cancel your medicine orders.",
          icon: <ShoppingBag className="size-5" />,
        },
        {
          title: "Shop",
          url: "/customer/shop",
          description: "Buy your products.",
          icon: <ClipboardList className="size-5" />,
        },
        {
          title: "My Reviews",
          url: "/customer/reviews",
          description: "Manage your ratings and feedback.",
          icon: <Star className="size-5" />,
        },
      ],
    });
  }

  if (user?.role === "SELLER") {
    menu.push({
      title: "Inventory",
      url: "#",
      items: [
        {
          title: "Manage Stock",
          url: "/seller/inventory",
          description: "Add or update medicine stock.",
          icon: <Pill className="size-5" />,
        },
        {
          title: "Sales Orders",
          url: "/seller/orders",
          description: "Process customer medicine requests.",
          icon: <LayoutDashboard className="size-5" />,
        },
      ],
    });
  }

  if (user?.role === "ADMIN") {
    menu.push({
      title: "Admin",
      url: "#",
      items: [
        {
          title: "User Management",
          url: "/admin/users",
          description: "Ban or unban platform users.",
          icon: <Users className="size-5" />,
        },
        {
          title: "Categories",
          url: "/admin/categories",
          description: "Manage medicine classifications.",
          icon: <ClipboardList className="size-5" />,
        },
        {
          title: "Review Logs",
          url: "/admin/reviews",
          description: "Monitor platform feedback and ratings.",
          icon: <Star className="size-5" />,
        },
        {
          title: "Global Orders",
          url: "/admin/orders",
          description: "View all platform transactions.",
          icon: <ShoppingBag className="size-5" />,
        },
        {
          title: "Global Inventory",
          url: "/admin/inventory",
          description: "Centralized medicine oversight.",
          icon: <LayoutDashboard className="size-5" />,
        },
      ],
    });
  }

  return (
    <section className="py-4 border-b bg-background">
      <div className="container mx-auto px-4">
        {/* Desktop Menu */}
        <nav className="hidden items-center justify-between lg:flex">
          <div className="flex items-center gap-6">
            <Link href="/" className="flex items-center gap-2">
              <Pill className="size-8 text-primary" />
              <span className="text-xl font-bold tracking-tighter">
                mediStore
              </span>
            </Link>
            <NavigationMenu>
              <NavigationMenuList>
                {menu.map((item) => renderMenuItem(item))}
              </NavigationMenuList>
            </NavigationMenu>
          </div>

          <div className="flex gap-2">
            <ModeToggle />

            {!isAuthenticated ? (
              <>
                <Button asChild variant="ghost" size="sm">
                  <Link href="/login">Login</Link>
                </Button>
                <Button asChild size="sm">
                  <Link href="/register">Sign up</Link>
                </Button>
              </>
            ) : (
              <div className="flex items-center gap-4">
                <ProfileDropdown />
              </div>
            )}
          </div>
        </nav>

        {/* Mobile & Tablet Menu */}
        <div className="flex items-center justify-between lg:hidden">
          <Link href="/" className="flex items-center gap-2 group">
            <div className="p-1.5 rounded-lg bg-primary/10 border border-primary/20 group-hover:bg-primary/20 transition-all">
              <Pill className="size-6 text-primary" />
            </div>
            <span className="text-xl font-bold tracking-tighter text-white">
              mediStore
            </span>
          </Link>

          <div className="flex items-center gap-3">
            <ModeToggle />
            <Sheet>
              <SheetTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="rounded-xl border border-white/5 hover:bg-white/5"
                >
                  <Menu className="size-6 text-white" />
                </Button>
              </SheetTrigger>
              <SheetContent
                side="right"
                className="w-[300px] sm:w-[400px] bg-zinc-950 border-white/5 p-0"
              >
                <div className="flex flex-col h-full">
                  <SheetHeader className="p-6 border-b border-white/5">
                    <SheetTitle className="flex items-center gap-2 text-white">
                      <div className="p-1.5 rounded-lg bg-primary/10 border border-primary/20">
                        <Pill className="size-5 text-primary" />
                      </div>
                      <span className="font-bold tracking-tight text-xl">
                        mediStore
                      </span>
                    </SheetTitle>
                  </SheetHeader>

                  <div className="flex-1 overflow-y-auto p-6 space-y-8">
                    {/* User Profile Section in Mobile Menu */}
                    {isAuthenticated && user && (
                      <div className="p-4 rounded-2xl bg-white/5 border border-white/10 space-y-4">
                        <div className="flex items-center gap-3">
                          <div className="h-12 w-12 rounded-full bg-primary/20 border border-primary/30 flex items-center justify-center text-primary">
                            <Users className="size-6" />
                          </div>
                          <div>
                            <p className="font-bold text-white text-base leading-tight">
                              {user.name}
                            </p>
                            <p className="text-[10px] font-mono uppercase tracking-widest text-primary/70 mt-1">
                              {user.role}
                            </p>
                          </div>
                        </div>
                      </div>
                    )}

                    <div className="space-y-4">
                      <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-muted-foreground/50 px-2 lg:px-4">
                        Navigation
                      </p>
                      <Accordion type="single" collapsible className="w-full">
                        {menu.map((item) => renderMobileMenuItem(item))}
                      </Accordion>
                    </div>
                  </div>

                  <div className="p-6 border-t border-white/5 bg-zinc-900/50">
                    {!isAuthenticated ? (
                      <div className="grid grid-cols-2 gap-3">
                        <Button
                          asChild
                          variant="outline"
                          className="rounded-xl border-white/10 hover:bg-white/5"
                        >
                          <Link href="/login">Login</Link>
                        </Button>
                        <Button asChild className="rounded-xl shadow-glow">
                          <Link href="/register">Sign up</Link>
                        </Button>
                      </div>
                    ) : (
                      <Button
                        onClick={logout}
                        variant="ghost"
                        className="w-full justify-start gap-3 h-12 rounded-xl text-rose-500 hover:text-rose-400 hover:bg-rose-500/10 font-bold transition-all"
                      >
                        <LogOut className="size-5" />
                        Logout Session
                      </Button>
                    )}
                  </div>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </section>
  );
};

// --- Helper Components ---

const renderMenuItem = (item: MenuItem) => {
  if (item.items) {
    return (
      <NavigationMenuItem key={item.title}>
        <NavigationMenuTrigger>{item.title}</NavigationMenuTrigger>
        <NavigationMenuContent>
          <ul className="grid w-100 gap-3 p-4 md:w-125 md:grid-cols-2 lg:w-150">
            {item.items.map((subItem) => (
              <li key={subItem.title}>
                {/* Changed: Using Link as the primary component without nested <a> */}
                <Link
                  href={subItem.url}
                  className="block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground"
                >
                  <div className="flex items-center gap-2 text-sm font-medium leading-none">
                    {subItem.icon} {subItem.title}
                  </div>
                  <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">
                    {subItem.description}
                  </p>
                </Link>
              </li>
            ))}
          </ul>
        </NavigationMenuContent>
      </NavigationMenuItem>
    );
  }

  return (
    <NavigationMenuItem key={item.title}>
      {/* Changed: Removed legacyBehavior and NavigationMenuLink wrapper */}
      <Link
        href={item.url}
        className="group inline-flex h-10 w-max items-center justify-center rounded-md bg-background px-4 py-2 text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground focus:outline-none"
      >
        {item.title}
      </Link>
    </NavigationMenuItem>
  );
};

const renderMobileMenuItem = (item: MenuItem) => {
  if (item.items) {
    return (
      <AccordionItem
        key={item.title}
        value={item.title}
        className="border-none"
      >
        <AccordionTrigger className="text-base font-bold py-4 px-2 hover:no-underline hover:text-primary transition-colors">
          <div className="flex items-center gap-3">{item.title}</div>
        </AccordionTrigger>
        <AccordionContent>
          <div className="flex flex-col gap-1 pl-4 pb-2">
            {item.items.map((subItem) => (
              <Link
                key={subItem.title}
                href={subItem.url}
                className="flex items-center gap-3 text-sm py-3 px-3 rounded-lg text-muted-foreground hover:text-white hover:bg-white/5 transition-all"
              >
                <div className="p-1.5 rounded-md bg-white/5 text-muted-foreground group-hover:text-primary">
                  {subItem.icon}
                </div>
                <div>
                  <div className="font-bold text-sm tracking-tight">
                    {subItem.title}
                  </div>
                  <p className="text-[10px] text-muted-foreground/60 line-clamp-1 mt-0.5">
                    {subItem.description}
                  </p>
                </div>
              </Link>
            ))}
          </div>
        </AccordionContent>
      </AccordionItem>
    );
  }
  return (
    <Link
      key={item.title}
      href={item.url}
      className="flex items-center gap-3 text-base font-bold py-4 px-2 hover:text-primary transition-colors"
    >
      {item.title}
    </Link>
  );
};

export { Navbar };
