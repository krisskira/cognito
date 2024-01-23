import Image from "next/image";
import Link from "next/link";

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      <nav className="flex items-center justify-between w-full max-w-5xl">
        <Link href="/" className="flex items-center gap-2">
          <Image src="/next.svg" alt="Next.js Logo" width={180} height={37} />
        </Link>
        <div className="flex gap-4">
          <Link href="/login" className="text-sm font-semibold">
            Login
          </Link>
          <Link href="/signup" className="text-sm font-semibold">
            Signup
          </Link>
        </div>
      </nav>
      {children}
      <footer className="flex items-center justify-center w-full max-w-5xl h-24">
        <Link
          href="https://vercel.com?utm_source=create-next-app&utm_medium=appdir-template&utm_campaign=create-next-app"
          target="_blank"
          rel="noopener noreferrer"
        >
          Crhistian Vergara
        </Link>
      </footer>
    </main>
  );
}
