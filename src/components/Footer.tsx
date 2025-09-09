import Link from "next/link";
import Separator from "./Separator";

export default function Footer() {
  return (
    <footer className="text-white h-fit mt-20">
      <Separator />
      <div className="max-w-7xl mx-auto px-6 py-8">
        <div className="flex flex-col gap-8">
          {/* Top row */}
          <div className="flex items-center justify-between">
            {/* Left side - Logo */}
            <Link href="/" className="flex items-center gap-3">
              <div className="flex flex-col gap-1">
                <div className="w-6 h-1 bg-white rounded-sm" />
                <div className="w-6 h-1 bg-white rounded-sm ml-1" />
                <div className="w-6 h-1 bg-white rounded-sm ml-2" />
                <div className="w-6 h-1 bg-white rounded-sm ml-3" />
              </div>
              <span className="text-white font-semibold text-lg">Elixir</span>
            </Link>

            {/* Right side - Links */}
            <div className="flex items-center gap-6">
              <Link
                href="/events"
                className="text-white/50 text-sm hover:text-white/70 transition-colors"
              >
                Events
              </Link>
              <Link
                href="/blogs"
                className="text-white/50 text-sm hover:text-white/70 transition-colors"
              >
                Blogs
              </Link>
              <Link
                href="/contact"
                className="text-white/50 text-sm hover:text-white/70 transition-colors"
              >
                Contact Us
              </Link>
            </div>
          </div>

          {/* Bottom row */}
          <div className="flex items-center justify-between">
            {/* Left side - Copyright */}
            <p className="text-white/50 text-sm">
              © {new Date().getFullYear()} Elixir. All rights reserved.
            </p>

            {/* Right side - Social icons */}
            <div className="flex items-center gap-6">
              <a
                href="https://x.com"
                target="_blank"
                rel="noreferrer noopener"
                className="text-white/50 hover:text-white/70 transition-colors"
                aria-label="X"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="22"
                  height="22"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                >
                  <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                </svg>
              </a>
              <a
                href="https://www.linkedin.com"
                target="_blank"
                rel="noreferrer noopener"
                className="text-white/50 hover:text-white/70 transition-colors"
                aria-label="LinkedIn"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="22"
                  height="22"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                >
                  <path d="M4.983 3.5c0 1.381-1.142 2.5-2.549 2.5C1.026 6 0 4.881 0 3.5 0 2.12 1.026 1 2.434 1s2.549 1.12 2.549 2.5zM.24 8h4.39v15.75H.24V8zM8.34 8h4.206v2.153h.06c.586-1.11 2.018-2.285 4.156-2.285 4.444 0 5.265 2.9 5.265 6.671v9.211h-4.39v-8.166c0-1.949-.035-4.457-2.716-4.457-2.72 0-3.137 2.127-3.137 4.325v8.298H8.34V8z" />
                </svg>
              </a>
              <a
                href="https://github.com"
                target="_blank"
                rel="noreferrer noopener"
                className="text-white/50 hover:text-white/70 transition-colors"
                aria-label="GitHub"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="22"
                  height="22"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                >
                  <path d="M12 0C5.372 0 0 5.373 0 12c0 5.303 3.438 9.8 8.207 11.387.6.111.793-.261.793-.578 0-.285-.01-1.041-.016-2.044-3.338.726-4.042-1.416-4.042-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.09-.745.083-.729.083-.729 1.205.084 1.84 1.237 1.84 1.237 1.07 1.834 2.807 1.304 3.492.997.108-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.536-1.524.117-3.176 0 0 1.009-.322 3.302 1.23.958-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.292-1.552 3.298-1.23 3.298-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.48 5.921.431.372.824 1.102.824 2.222 0 1.606-.014 2.901-.014 3.296 0 .319.192.694.801.576C20.565 21.8 24 17.303 24 12c0-6.627-5.373-12-12-12z" />
                </svg>
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
