"use client";

import { useState } from "react";
import { PlusIcon, MinusIcon } from "lucide-react";
import { motion } from "framer-motion";
import { Header } from "@/components/Header";
import { fadeInUp, containerStagger } from "@/lib/motion";

interface FAQItem {
  question: string;
  answer: string;
}

const faqs: FAQItem[] = [
  {
    question: "What is Elixir?",
    answer:
      "Elixir is the student-led tech community that helps you learn, build, and launch through events, mentorship, and blogs.",
  },
  {
    question: "How do I join events?",
    answer:
      "Browse the Events page and register. You’ll receive details via email and on your dashboard once you log in.",
  },
  {
    question: "How can I become a mentor?",
    answer:
      "Apply through the Mentors page. Our admins will review your profile and get back to you with next steps.",
  },
  {
    question: "Do you post blogs from students?",
    answer:
      "Yes! Share your write‑ups on projects, tutorials, and experiences. Submit a draft from your dashboard for review.",
  },
  {
    question: "Where is my dashboard?",
    answer:
      "Login from the top‑right. Your avatar in the navbar links straight to your role‑based dashboard.",
  },
];

export function FAQSection() {
  return (
    <section className="relative overflow-hidden">
      <div className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute left-1/2 top-0 h-64 w-[60rem] -translate-x-1/2 rounded-full bg-[radial-gradient(circle_at_center,rgba(255,255,255,0.08),transparent_60%)] blur-2xl" />
      </div>

      <Header
        badge="Need help?"
        title="Frequently asked questions"
        subtitle="Everything you need to know about Elixir events, mentorship, and blogs."
        variant="secondary"
      />

      <motion.div
        className="mx-auto mt-8 w-full max-w-5xl px-4 pb-20 lg:px-6"
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, margin: "-10% 0px -10% 0px" }}
        variants={containerStagger(0.1, 0.2)}
      >
        <motion.div
          className="overflow-hidden rounded-2xl border border-white/10 bg-[#0A0B1A]/60 shadow-[0_0_0_1px_rgba(255,255,255,0.06)_inset] backdrop-blur"
          variants={fadeInUp}
        >
          {faqs.map((item, idx) => (
            <FAQRow key={idx} item={item} defaultOpen={idx === 0} />
          ))}
        </motion.div>
      </motion.div>
    </section>
  );
}

function FAQRow({
  item,
  defaultOpen = false,
}: {
  item: FAQItem;
  defaultOpen?: boolean;
}) {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <div className="group border-b border-white/10 last:border-b-0">
      <button
        type="button"
        aria-expanded={open}
        onClick={() => setOpen(!open)}
        className="flex w-full items-center justify-between gap-4 px-5 py-5 text-left text-white/90 transition-colors hover:bg-white/5"
      >
        <span className="text-base font-medium md:text-lg">
          {item.question}
        </span>
        <span
          className={`inline-flex items-center justify-center transition-transform duration-300 ${
            open ? "rotate-180" : "rotate-90"
          }`}
        >
          {open ? (
            <MinusIcon className="h-5 w-5 shrink-0 text-white/70" />
          ) : (
            <PlusIcon className="h-5 w-5 shrink-0 text-white/70" />
          )}
        </span>
      </button>
      <div
        className={`px-5 transition-all duration-300 ease-in-out ${
          open ? "max-h-[500px] opacity-100" : "max-h-0 opacity-0"
        } overflow-hidden`}
      >
        <div className="pb-5 text-sm leading-relaxed text-white/70">
          {item.answer}
        </div>
      </div>
    </div>
  );
}

export default FAQSection;
