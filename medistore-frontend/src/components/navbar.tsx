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
                <span className="text-sm font-medium text-muted-foreground">
                  {user?.name} ({user?.role})
                </span>
                <Button
                  onClick={logout}
                  variant="destructive"
                  size="sm"
                  className="gap-2"
                >
                  <LogOut className="size-4" /> Logout
                </Button>
              </div>
            )}
          </div>
        </nav>

        {/* Mobile Menu */}
        <div className="flex items-center justify-between lg:hidden">
          <Link href="/" className="flex items-center gap-2">
            <Pill className="size-6 text-primary" />
            <span className="text-lg font-bold">mediStore</span>
          </Link>
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="outline" size="icon">
                <Menu className="size-4" />
              </Button>
            </SheetTrigger>
            <SheetContent>
              <SheetHeader>
                <SheetTitle className="flex items-center gap-2">
                  <Pill className="size-5 text-primary" /> mediStore
                </SheetTitle>
              </SheetHeader>
              <div className="flex flex-col gap-6 py-6">
                <Accordion type="single" collapsible className="w-full">
                  {menu.map((item) => renderMobileMenuItem(item))}
                </Accordion>
                <div className="flex flex-col gap-3">
                  {!isAuthenticated ? (
                    <>
                      <Button asChild variant="outline">
                        <Link href="/login">Login</Link>
                      </Button>
                      <Button asChild>
                        <Link href="/register">Sign up</Link>
                      </Button>
                    </>
                  ) : (
                    <Button
                      onClick={logout}
                      variant="destructive"
                      className="w-full"
                    >
                      Logout
                    </Button>
                  )}
                </div>
              </div>
            </SheetContent>
          </Sheet>
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
        <AccordionTrigger className="text-base font-semibold py-2">
          {item.title}
        </AccordionTrigger>
        <AccordionContent>
          <div className="flex flex-col gap-2 pl-4">
            {item.items.map((subItem) => (
              <Link
                key={subItem.title}
                href={subItem.url}
                className="text-sm py-2 text-muted-foreground hover:text-primary"
              >
                {subItem.title}
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
      className="block text-base font-semibold py-2"
    >
      {item.title}
    </Link>
  );
};

export { Navbar };
