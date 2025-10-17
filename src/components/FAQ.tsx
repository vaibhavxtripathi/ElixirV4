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
    question: "What kind of events do you host?",
    answer:
      "We host technical workshops, hackathons, speaker sessions, and networking events. Our events focus on emerging technologies, career development, and building real-world projects.",
  },
  {
    question: "How do I join events?",
    answer:
      "Browse the Events page and register. You’ll receive details via email and on your dashboard once you log in.",
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
    <section className="relative overflow-hidden -mt-8">
      <Header
        badge="Need help?"
        title="Frequently asked questions"
        subtitle="Everything you need to know about Elixir events, mentorship, and blogs."
        variant="secondary"
      />

      <motion.div
        className="mx-auto mt-8 sm:mt-12 lg:mt-16 w-full max-w-5xl px-3 sm:px-4 pb-6 sm:pb-8 lg:pb-10 lg:px-6"
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, margin: "-10% 0px -10% 0px" }}
        variants={containerStagger(0.1, 0.2)}
      >
        <motion.div
          className="overflow-hidden rounded-xl sm:rounded-2xl border border-white/10 bg-[#0A0B1A]/60 shadow-[0_0_0_1px_rgba(255,255,255,0.06)_inset] backdrop-blur"
          variants={fadeInUp}
        >
          {faqs.map((item, idx) => (
            <FAQRow key={idx} item={item} />
          ))}
        </motion.div>
      </motion.div>
    </section>
  );
}

function FAQRow({ item }: { item: FAQItem }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="group border-b border-white/10 last:border-b-0">
      <button
        type="button"
        aria-expanded={open}
        onClick={() => setOpen(!open)}
        className="flex w-full items-center justify-between gap-3 sm:gap-4 px-3 sm:px-4 lg:px-5 py-3 sm:py-4 lg:py-5 text-left text-white/90 transition-colors hover:bg-white/5"
      >
        <span className="text-sm sm:text-base font-medium md:text-lg leading-relaxed">
          {item.question}
        </span>
        <span
          className={`inline-flex items-center justify-center transition-transform duration-300 shrink-0 ${
            open ? "rotate-180" : "rotate-90"
          }`}
        >
          {open ? (
            <MinusIcon className="h-4 w-4 sm:h-5 sm:w-5 text-white/70" />
          ) : (
            <PlusIcon className="h-4 w-4 sm:h-5 sm:w-5 text-white/70" />
          )}
        </span>
      </button>
      <div
        className={`px-3 sm:px-4 lg:px-5 transition-all duration-300 ease-in-out ${
          open ? "max-h-[500px] opacity-100" : "max-h-0 opacity-0"
        } overflow-hidden`}
      >
        <div className="pb-3 sm:pb-4 lg:pb-5 text-xs sm:text-sm leading-relaxed text-white/70">
          {item.answer}
        </div>
      </div>
    </div>
  );
}

export default FAQSection;
