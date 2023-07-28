"use client";
import clsx from "clsx";
import { NAV_LINKS } from "@/lib/content";
import {
  Navbar,
  NavbarBrand,
  NavbarContent,
  NavbarItem,
} from "@nextui-org/navbar";
import Link from "next/link";
import { Disclosure } from "@headlessui/react";
import { SlMenu } from "react-icons/sl";

export default function Nav() {
  return (
    <Navbar isBordered maxWidth="xl" position="sticky" className="bg-stone-500">
      <NavbarContent
        className="flex flex-col sm:flex-row justify-between w-full"
        justify="start"
      >
        <NavbarBrand as="li" className="hidden sm:flex gap-3 max-w-fit">
          <Link className="flex justify-start items-center gap-1" href="/">
            <p className="font-bold text-stone-800 hover:text-stone-300">
              huse
            </p>
          </Link>
        </NavbarBrand>
        <div className="hidden sm:flex gap-4">
          {NAV_LINKS.map((item) => (
            <NavbarItem key={item.url} className="mx-4">
              <Link
                className="text-stone-800 hover:text-stone-300"
                color="foreground"
                href={item.url}
              >
                {item.name}
              </Link>
            </NavbarItem>
          ))}
        </div>
        <Disclosure as="nav" className="sm:hidden w-full">
          {({ open }) => (
            <>
              <Disclosure.Button className="inline-flex items-center p-2 rounded-md text-gray-400 hover:text-stone-600 hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white">
                <SlMenu
                  className={clsx("block h-6 w-6", {
                    "transform rotate-90": open,
                  })}
                  aria-hidden="true"
                />
              </Disclosure.Button>
              <Disclosure.Panel className="px-2 pt-2 pb-3 space-y-1 justify-start">
                {NAV_LINKS.map((item) => (
                  <Link key={item.url} href={item.url}>
                    <span className="text-gray-300 hover:bg-gray-700 hover:text-stone-700 block px-3 py-2 rounded-md text-base font-medium">
                      {item.name}
                    </span>
                  </Link>
                ))}
              </Disclosure.Panel>
            </>
          )}
        </Disclosure>
      </NavbarContent>
    </Navbar>
  );
}
