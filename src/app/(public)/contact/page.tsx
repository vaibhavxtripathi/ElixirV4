export const metadata = {
  title: "Contact | Elixir",
  description: "Connect with the Elixir Tech Community on social media.",
};

import Container from "@/components/container";
import PageHeader from "@/components/PageHeader";
import { FaGithub, FaLinkedin } from "react-icons/fa";
import { FaXTwitter } from "react-icons/fa6";

const socials = [
  {
    label: "X (Twitter)",
    href: "https://x.com/theelixirtech",
    icon: FaXTwitter,
  },
  {
    label: "LinkedIn",
    href: "https://www.linkedin.com/company/elixir-tech-community/",
    icon: FaLinkedin,
  },
  {
    label: "GitHub",
    href: "https://github.com/vaibhavxtripathi/ElixirV4",
    icon: FaGithub,
  },
];

export default function ContactPage() {
  return (
    <main className="pt-32 sm:pt-36 pb-12 sm:pb-18">
      <Container>
        <PageHeader title="Contact" className="mb-6 sm:mb-8 md:mb-10" />
        <div className="max-w-xl mx-auto sm:mx-0 rounded-2xl border border-white/10 bg-white/5 p-6 sm:p-8">
          <p className="text-sm sm:text-base text-white/70">
            Have a question or want to collaborate? Connect with us on social
            media.
          </p>
          <div className="mt-6 flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-4">
            {socials.map(({ label, href, icon: Icon }) => (
              <a
                key={href}
                href={href}
                target="_blank"
                rel="noreferrer noopener"
                aria-label={label}
                className="inline-flex items-center gap-2 text-white/50 hover:text-white/80 transition-colors px-2 py-1.5 rounded-md hover:bg-white/5"
              >
                <Icon className="h-5 w-5" aria-hidden="true" />
                <span className="text-sm">{label}</span>
              </a>
            ))}
          </div>
        </div>
      </Container>
    </main>
  );
}
