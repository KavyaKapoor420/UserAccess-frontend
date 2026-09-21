import Link from "next/link";
import { ArrowUpRight, Linkedin, Mail, Twitter } from "lucide-react";

const socialLinks = [
  { label: "UserAccess on X", href: "https://x.com", icon: Twitter },
  { label: "UserAccess on LinkedIn", href: "https://www.linkedin.com/in/kavyakapoor420/", icon: Linkedin },
  { label: "Email UserAccess", href: "kavyakapoor413@gmail.com", icon: Mail },
];

export function Footer() {
  return (
    <footer className="relative mt-24 w-full overflow-hidden bg-gradient-to-b from-blue-600 to-blue-700 pb-5 pt-24 md:pb-10 md:pt-32">
      <div
        className="absolute inset-0 z-0 opacity-80"
        style={{
          backgroundImage: "linear-gradient(to right, rgba(255, 255, 255, 0.08) 1px, transparent 1px), linear-gradient(to bottom, rgba(255, 255, 255, 0.08) 1px, transparent 1px)",
          backgroundSize: "40px 40px",
        }}
      />

      <div className="relative z-10 mx-auto flex max-w-7xl flex-col items-center px-6">
        <h2 className="w-full select-none pb-2 text-center text-[76px] font-bold leading-[0.8] tracking-[-0.06em] text-transparent bg-gradient-to-b from-white/55 to-white/0 bg-clip-text sm:text-[100px] md:pb-12 md:text-[150px] lg:text-[230px]">
          UserAccess
        </h2>

        <div className="mt-12 flex w-full flex-col items-center justify-between border-t border-blue-400/50 pt-8 md:flex-row">
          <div className="mb-6 flex items-center gap-4 text-blue-200 md:mb-0">
            {socialLinks.map(({ label, href, icon: Icon }) => (
              <Link
                key={label}
                href={href}
                target={href.startsWith("http") ? "_blank" : undefined}
                rel={href.startsWith("http") ? "noreferrer" : undefined}
                aria-label={label}
                className="rounded-full border border-blue-400/20 bg-blue-500/50 p-2 transition-colors hover:bg-blue-400/30 hover:text-white"
              >
                <Icon className="h-4 w-4" />
              </Link>
            ))}
          </div>

          <div className="flex flex-wrap items-center justify-center gap-x-5 gap-y-2 text-xs text-blue-100">
            <Link href="/privacy" className="transition-colors hover:text-white">Privacy</Link>
            <Link href="/terms" className="transition-colors hover:text-white">Terms</Link>
            <Link href="/contact" className="transition-colors hover:text-white">Contact</Link>
            <br/>
            <span className="flex items-center gap-1 text-blue-200">
              Made By  Kavya Kapoor with ❤️ to support people with learning disabilities
              <ArrowUpRight className="h-4 w-4" aria-hidden="true" />
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
}
