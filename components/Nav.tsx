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
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";

import Link from "next/link";
import { SlMenu } from "react-icons/sl";
export default function Nav() {
  return (
    <div className="bg-transparent font-light tracking-widest max-w-xl sticky">
      <NavigationMenu>
        <NavigationMenuList className="md:flex hidden justify-start">
          <NavigationMenuItem className="gap-3 max-w-fit sm:flex hidden">
            <Link className="flex justify-start items-center gap-1" href="/">
              <p className="font-semibold text-lg  hover:text-stone-300">
                huse
              </p>
            </Link>
          </NavigationMenuItem>
          <div className="gap-4 hidden sm:flex">
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
        <Button
          className="md:hidden p-2 inline-flex items-center rounded-md bg-transparent hover:text-stone-100 hover:bg-stone-700"
          variant="default"
          size="icon"
        >
          <SlMenu />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="px-2 pt-2 pb-3 space-y-1 justify-start bg-transparent border-transparent">
        {NAV_LINKS.map((link, index) => (
          <Link
            key={index}
            href={link.url}
            className="p-2 text-stone-200 bg-transparent hover:text-stone-600 "
          >
            {link.name}
          </Link>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
