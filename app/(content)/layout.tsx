import Link from "next/link";

export default function ContentLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="w-full max-w-2xl mx-auto py-8">
      <nav className="mb-8 font-light tracking-widest">
        <Link
          href="/"
          className="text-stone-400 hover:text-stone-200 transition-colors duration-300 text-sm"
        >
          &larr; home
        </Link>
      </nav>
      {children}
    </div>
  );
}
