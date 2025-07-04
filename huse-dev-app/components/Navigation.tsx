'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

export default function Navigation() {
  const pathname = usePathname();

  const isActive = (path: string) => pathname === path;

  return (
    <nav className="fixed top-0 w-full glass z-50 px-6 py-4">
      <div className="max-w-6xl mx-auto flex items-center justify-between">
        <Link href="/" className="text-xl font-bold text-gradient">
          huse.dev
        </Link>
        <div className="flex items-center space-x-8">
          <Link
            href="/projects"
            className={`${isActive('/projects') ? 'text-stone-100' : 'text-stone-400 hover:text-stone-100'} link-underline transition-colors`}
          >
            projects
          </Link>
          <Link
            href="/about"
            className={`${isActive('/about') ? 'text-stone-100' : 'text-stone-400 hover:text-stone-100'} link-underline transition-colors`}
          >
            about
          </Link>
          <Link
            href="/butler"
            className={`${isActive('/butler') ? 'text-stone-100' : 'text-stone-400 hover:text-stone-100'} link-underline transition-colors`}
          >
            butler
          </Link>
        </div>
      </div>
    </nav>
  );
}