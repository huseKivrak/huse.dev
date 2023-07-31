"use client";
import { NAV_LINKS } from "@/lib/content";
import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuList,
} from "@/components/ui/navigation-menu";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";

import Link from "next/link";
import { SlMenu } from "react-icons/sl";
export default function Nav() {
  return (
    <div className="bg-transparent p-0 font-light tracking-widest max-w-xl sticky ">
      <NavigationMenu>
        <NavigationMenuList className="md:flex hidden justify-start">
          <NavigationMenuItem className="mr-4 font-normal">
            <Link className="hover:text-stone-500" href="/">
              home
            </Link>
          </NavigationMenuItem>
          <div className="gap-4 hidden md:flex">
            {NAV_LINKS.map((link, index) => (
              <NavigationMenuItem key={index} className="mx-4">
                <Link
                  className="hover:text-stone-500"
                  color="foreground"
                  href={link.url}
                >
                  {link.name}
                </Link>
              </NavigationMenuItem>
            ))}
          </div>
        </NavigationMenuList>
      </NavigationMenu>
      <HamburgerMenu />
    </div>
  );
}

const HamburgerMenu = () => {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button
          className="md:hidden p-0 -ml-3 inline-flex items-center rounded-md bg-transparent hover:text-stone-100 hover:bg-stone-700"
          aria-label="Open menu"
        >
          <SlMenu />
          <span className="sr-only">Open menu</span>
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        className="space-x-0 justify-start bg-transparent border-transparent inline-flex"
        side="right"
      >
        <DropdownMenuItem key={"home-link"} asChild>
          <Link
            href="/"
            className="text-stone-200 bg-transparent hover:text-stone-600"
          >
            home
          </Link>
        </DropdownMenuItem>

        {NAV_LINKS.map((link, index) => (
          <DropdownMenuItem key={`${link.name}-${index}-${link.name}`} asChild>
            <Link
              href={link.url}
              className=" text-stone-200 bg-transparent hover:text-stone-600 "
              key={`${link.name}-${index}`}
            >
              {link.name}
            </Link>
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
