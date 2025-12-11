"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Menu, X } from "lucide-react";

export function FeedbackNav() {
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const closeMobileMenu = () => setIsMobileMenuOpen(false);

    return (
        <nav className="w-full sticky top-0 z-50 px-3 sm:px-4 py-1.5 sm:py-3">
            <div className="mx-auto max-w-[45rem]">
                <div className="glass-nav nav-glow px-3 sm:px-4 py-1.5 sm:py-2 flex items-center justify-between gap-3 rounded-full">
                    <Link href="/" className="flex items-center gap-3 no-underline">
                        <Image
                            src="/levante-logo.svg"
                            alt="Logo"
                            width={32}
                            height={32}
                        />
                        <span className="text-slate-900 text-lg font-medium">Levante</span>
                    </Link>

                    <div className="hidden md:flex items-center gap-5">
                        <Link href="/#features" className="text-slate-700 text-sm hover:text-slate-900 transition-colors">
                            Features
                        </Link>
                        <Link href="/#team" className="text-slate-700 text-sm hover:text-slate-900 transition-colors">
                            Team
                        </Link>
                        <Link href="/#about" className="text-slate-700 text-sm hover:text-slate-900 transition-colors">
                            About
                        </Link>
                        <Link href="/feedback" className="text-slate-900 text-sm font-medium">
                            Feedback
                        </Link>
                    </div>

                    <a
                        href="https://github.com/levante-hub/levante/releases"
                        className="hidden md:flex bg-black text-white px-6 py-2 rounded-full text-sm font-medium items-center gap-2 cursor-pointer hover:bg-black/90 transition-colors"
                    >
                        Download
                        <span>↓</span>
                    </a>

                    <button
                        onClick={() => setIsMobileMenuOpen((prev) => !prev)}
                        className="md:hidden text-black p-2 bg-transparent border-none cursor-pointer"
                        aria-label="Toggle menu"
                    >
                        {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
                    </button>
                </div>
            </div>

            {isMobileMenuOpen && (
                <div
                    className="fixed inset-0 bg-black/60 z-40 md:hidden"
                    onClick={closeMobileMenu}
                />
            )}

            <div
                className={`fixed top-0 right-0 h-full w-[280px] bg-[#1a1a1a] z-50 transform transition-transform duration-300 ease-in-out md:hidden ${
                    isMobileMenuOpen ? "translate-x-0" : "translate-x-full"
                }`}
            >
                <div className="flex flex-col h-full">
                    <div className="flex items-center justify-between px-6 py-5 border-b border-white/10">
                        <Link href="/" className="flex items-center gap-3 no-underline" onClick={closeMobileMenu}>
                            <Image
                                src="/levante-logo.svg"
                                alt="Logo"
                                width={28}
                                height={28}
                            />
                            <span className="text-white text-base font-normal">Levante</span>
                        </Link>
                        <button
                            onClick={closeMobileMenu}
                            className="text-white p-1 bg-transparent border-none cursor-pointer"
                            aria-label="Close menu"
                        >
                            <X size={22} />
                        </button>
                    </div>

                    <div className="flex flex-col py-4">
                        <Link
                            href="/#features"
                            onClick={closeMobileMenu}
                            className="text-white text-base py-4 px-6 text-left hover:bg-white/5 transition-colors no-underline"
                        >
                            Features
                        </Link>
                        <Link
                            href="/#team"
                            onClick={closeMobileMenu}
                            className="text-white text-base py-4 px-6 text-left hover:bg-white/5 transition-colors no-underline"
                        >
                            Team
                        </Link>
                        <Link
                            href="/#about"
                            onClick={closeMobileMenu}
                            className="text-white text-base py-4 px-6 text-left hover:bg-white/5 transition-colors no-underline"
                        >
                            About
                        </Link>
                        <Link
                            href="/feedback"
                            onClick={closeMobileMenu}
                            className="text-white text-base py-4 px-6 text-left hover:bg-white/5 transition-colors no-underline"
                        >
                            Feedback
                        </Link>
                    </div>

                    <div className="mt-auto p-6 border-t border-white/10">
                        <a
                            href="https://github.com/levante-hub/levante/releases"
                            className="w-full bg-white text-black px-6 py-3 rounded-full text-sm font-medium flex items-center justify-center gap-2 cursor-pointer hover:bg-white/90 transition-colors"
                            onClick={closeMobileMenu}
                        >
                            Download
                            <span>↓</span>
                        </a>
                    </div>
                </div>
            </div>
        </nav>
    );
}
