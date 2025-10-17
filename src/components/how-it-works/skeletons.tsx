"use client";
import { ElixirLogo, ForkIcon, GDGLogo, GFGLogo } from "@/icons/general";
import { CCLogo } from "@/icons/general";
import { cn } from "@/lib/utils";
import React, { useEffect, useMemo, useRef, useState } from "react";
import { DivideX } from "../divide";
import { motion, useMotionValue, useTransform } from "framer-motion";
import type { MotionValue } from "framer-motion";
import { Card } from "../tech-card";
import { Scale } from "../scale";
import { LogoSVG } from "../logo";
import { IntegrationsLogo } from "@/icons/bento-icons";
import Image from "next/image";
import { BuildingIcon, CalendarIcon, UsersIcon } from "lucide-react";

export const DesignYourWorkflowSkeleton = () => {
  return (
    <div className="mt-12 flex flex-col items-center">
      <div className="relative">
        <Card
          title="Elixir"
          subtitle="#elixir"
          logo={<ElixirLogo className="w-5 h-5" />}
          cta="Community"
          tone="default"
        />
        <LeftSVG className="absolute top-14 -left-[128px]" />
        <RightSVG className="absolute top-14 -right-[149px]" />
        <CenterSVG className="absolute top-24 right-[80px]" />
      </div>

      <div className="mt-12 flex flex-row gap-8">
        <Card
          title="GDG"
          subtitle="Google"
          logo={<GDGLogo className="w-5 h-5" />}
          cta="Google Club"
          tone="danger"
          delay={0.2}
        />
        <Card
          title="GFG"
          subtitle="vibin'"
          logo={<GFGLogo className="w-5 h-5" />}
          cta="GeeksForGeeks"
          tone="green"
          delay={0.4}
        />
        <Card
          title="CodeChef"
          subtitle="CodeChef"
          logo={<CCLogo className="w-5 h-5" />}
          cta="CodeChef Club"
          tone="success"
          delay={0.6}
        />
      </div>
    </div>
  );
};

type DeployCardData = {
  title: string;
  subtitle: string;
  branch: string;
  variant?: "default" | "danger" | "success" | "warning";
};

const ScrollingDeployCard = ({
  index,
  y,
  offset,
  itemHeight,
  card,
}: {
  index: number;
  y: MotionValue<number>;
  offset: number;
  itemHeight: number;
  card: DeployCardData;
}) => {
  const scale = useTransform(
    y,
    [
      offset + (index - 2) * -itemHeight,
      offset + (index - 1) * -itemHeight,
      offset + index * -itemHeight,
      offset + (index + 1) * -itemHeight,
      offset + (index + 2) * -itemHeight,
    ],
    [0.85, 0.95, 1.1, 0.95, 0.85]
  );

  const background = useTransform(
    y,
    [
      offset + (index - 1) * -itemHeight,
      offset + index * -itemHeight,
      offset + (index + 1) * -itemHeight,
    ],
    ["#FFFFFF", "#f17463", "#FFFFFF"]
  );

  const borderColor = useTransform(
    y,
    [
      offset + (index - 1) * -itemHeight,
      offset + index * -itemHeight,
      offset + (index + 1) * -itemHeight,
    ],
    ["#FFFFFF", "#f17463", "#FFFFFF"]
  );

  return (
    <motion.div
      className="mx-auto mt-4 w-full max-w-sm shrink-0 rounded-2xl shadow-xl"
      style={{ scale, background, borderColor }}
    >
      <DeployCard
        variant={card.variant}
        title={card.title}
        subtitle={card.subtitle}
        branch={card.branch}
      />
    </motion.div>
  );
};

export const ConnectYourTooklsSkeleton = () => {
  const text = `Managing, tracking, and growing our college clubs and the events we organize.`;
  const [mounted, setMounted] = useState(false);
  // Generate once after mount; value doesn't need to track `mounted`
  const randomWidth = useMemo(() => Math.random() * 100, []);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  return (
    <div className="relative flex h-full w-full items-center justify-between">
      <motion.div
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="relative h-70 w-60 -translate-x-2 rounded-2xl border-t border-gray-300 bg-white p-4 shadow-2xl md:translate-x-0 dark:border-neutral-700 dark:bg-neutral-900"
      >
        <div className="absolute -top-4 -right-4 flex h-14 w-14 items-center justify-center rounded-lg bg-inherit  shadow-xl">
          <Scale />
          <Image
            src="/elixir-logo.png"
            height={8}
            width={8}
            alt="Elixir"
            className="relative z-20 h-8 w-8"
          />
        </div>
        <div className="mt-12 flex items-center gap-2">
          <IntegrationsLogo />
          <span className="text-charcoal-700 text-sm font-medium dark:text-neutral-200">
            Tasks
          </span>
        </div>
        <DivideX className="mt-2" />

        <div className="mt-4 flex items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <span className="text-charcoal-700 text-[10px] leading-loose font-normal md:text-xs dark:text-neutral-200">
              {text.split(/(\s+)/).map((word, index) => (
                <motion.span
                  key={index}
                  initial={{
                    opacity: 0,
                  }}
                  animate={{
                    opacity: 1,
                  }}
                  transition={{
                    duration: 0.2,
                    delay: index * 0.02,
                    ease: "linear",
                  }}
                  className="inline-block"
                >
                  {word === " " ? "\u00A0" : word}
                </motion.span>
              ))}
            </span>
          </div>
        </div>
        <div className="mt-2 flex flex-col">
          {[...Array(2)].map((_, index) => (
            <motion.div
              key={`width-bar-right-${index}`}
              initial={{
                width: "0%",
              }}
              animate={{
                width: `${randomWidth}%`,
              }}
              transition={{
                duration: 4,
                delay: index * 0.2,
                ease: "easeInOut",
                repeat: Infinity,
                repeatType: "reverse",
              }}
              className="mt-2 h-4 w-full rounded-full bg-gray-200 dark:bg-neutral-800"
            />
          ))}
        </div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1, delay: 1 }}
        className="absolute inset-x-0 z-30 hidden items-center justify-center md:flex"
      >
        <div className="size-3 rounded-full border-2 border-blue-500 bg-white dark:bg-neutral-800" />
        <div className="h-[2px] w-36 bg-blue-500" />
        <div className="size-3 rounded-full border-2 border-blue-500 bg-white dark:bg-neutral-800" />
      </motion.div>
      <motion.div
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5, delay: 1 }}
        className="relative h-70 w-60 translate-x-10 rounded-2xl border-t border-gray-300 bg-white p-4 shadow-2xl md:translate-x-0 dark:border-neutral-700 dark:bg-neutral-900"
      >
        <div className="absolute -top-4 -left-4 flex h-14 w-14 items-center justify-center rounded-lg bg-white shadow-xl dark:bg-neutral-800">
          <Scale />
          <LogoSVG className="relative z-20 h-8 w-8" />
        </div>
        <div className="mt-12 flex items-center gap-2">
          <IntegrationsLogo className="dark:text-neutral-200" />
          <span className="text-charcoal-700 text-xs font-medium md:text-sm dark:text-neutral-200">
            Integrations
          </span>
          <span className="text-charcoal-700 rounded-lg border border-gray-200 bg-gray-50 px-2 py-0.5 text-xs dark:border-neutral-600 dark:bg-neutral-800 dark:text-neutral-200">
            Elixir
          </span>
        </div>
        <DivideX className="mt-2" />
        <div className="mt-4 flex items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <UsersIcon className="h-4 w-4 shrink-0 text-blue-500" />
            <span className="text-charcoal-700 text-xs font-medium md:text-sm dark:text-neutral-200">
              Students
            </span>
          </div>

          <div className="rounded-sm border border-blue-500 bg-blue-50 px-2 py-0.5 text-xs text-blue-500">
            Connected
          </div>
        </div>
        <div className="mt-4 flex items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <BuildingIcon className="h-4 w-4 shrink-0 text-blue-500" />
            <span className="text-charcoal-700 text-xs font-medium md:text-sm dark:text-neutral-200">
              Clubs
            </span>
          </div>

          <div className="rounded-sm border border-blue-500 bg-blue-50 px-2 py-0.5 text-xs text-blue-500">
            Synced
          </div>
        </div>
        <div className="mt-4 flex items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <CalendarIcon className="h-4 w-4 shrink-0 text-blue-500" />
            <span className="text-charcoal-700 text-xs font-medium md:text-sm dark:text-neutral-200">
              Events
            </span>
          </div>

          <div className="rounded-sm border border-blue-500 bg-blue-50 px-2 py-0.5 text-xs text-blue-500">
            Synced
          </div>
        </div>
        <div className="mt-2 flex flex-col">
          {[...Array(2)].map((_, index) => (
            <motion.div
              key={`width-bar-right-${index}`}
              initial={{
                width: `${20 + Math.random() * 20}%`,
              }}
              animate={{
                width: `${70 + Math.random() * 30}%`,
              }}
              transition={{
                duration: 4,
                delay: index * 0.2,
                ease: "easeInOut",
                repeat: Infinity,
                repeatType: "reverse",
              }}
              className="mt-2 h-4 w-full rounded-full bg-gray-200 dark:bg-neutral-800"
            />
          ))}
        </div>
      </motion.div>
    </div>
  );
};

export const DeployAndScaleSkeleton = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [containerHeight, setContainerHeight] = useState(0);

  // Define deploy cards data for reusability
  const deployCards = [
    { title: "reg-elxr-CS22-487", subtitle: "2h ago", branch: "master" },
    {
      title: "reg-elxr-IT23-941",
      subtitle: "10m ago",
      branch: "main",
      variant: "success" as const,
    },
    {
      title: "reg-elxr-EE23-653",
      subtitle: "45m ago",
      branch: "events/elixir",
    },
    {
      title: "reg-elxr-CS22-234",
      subtitle: "1h ago",
      branch: "signup",
      variant: "success" as const,
    },
    {
      title: "reg-elxr-DS25-212",
      subtitle: "2h ago",
      branch: "blogs/elixir",
      variant: "warning" as const,
    },
    {
      title: "reg-elxr-ME23-480",
      subtitle: "3h ago",
      branch: "added as a mentor",
      variant: "success" as const,
    },
    {
      title: "reg-elxr-CE24-338",
      subtitle: "4h ago",
      branch: "club head added",
      variant: "danger" as const,
    },
    {
      title: "reg-elxr-IT22-725",
      subtitle: "5h ago",
      branch: "member added",
      variant: "default" as const,
    },
    {
      title: "reg-elxr-CS25-502",
      subtitle: "6h ago",
      branch: "event created",
      variant: "success" as const,
    },
    {
      title: "reg-elxr-EE23-653",
      subtitle: "7h ago",
      branch: "event updated",
      variant: "warning" as const,
    },
    {
      title: "reg-elxr-CS22-234",
      subtitle: "8h ago",
      branch: "event pushed",
      variant: "success" as const,
    },
    {
      title: "reg-elxr-DS25-212",
      subtitle: "9h ago",
      branch: "analytics",
      variant: "default" as const,
    },
  ];

  const extendedCards = [...deployCards, ...deployCards, ...deployCards];

  const cardHeight = 64;
  const gap = 4;
  const itemHeight = cardHeight + gap;
  const offset = (containerHeight - cardHeight) / 2;

  useEffect(() => {
    const observer = new ResizeObserver((entries) => {
      const height = entries[0]?.contentRect.height ?? 0;
      setContainerHeight(height);
    });

    if (containerRef.current) {
      observer.observe(containerRef.current);
    }

    return () => observer.disconnect();
  }, []);

  const y = useMotionValue(0);
  const totalHeight = extendedCards.length * itemHeight;

  useEffect(() => {
    let animationFrame: number;
    let lastTime = performance.now();
    const speed = 30;

    function animateScroll(now: number) {
      const elapsed = (now - lastTime) / 1000;
      lastTime = now;
      let current = y.get();
      current -= speed * elapsed;

      if (Math.abs(current) >= totalHeight / 3) {
        current += totalHeight / 3;
      }
      y.set(current);
      animationFrame = requestAnimationFrame(animateScroll);
    }
    animationFrame = requestAnimationFrame(animateScroll);
    return () => cancelAnimationFrame(animationFrame);
  }, [y, totalHeight]);

  return (
    <div
      className="relative h-full w-full overflow-hidden"
      ref={containerRef}
      // style={{
      //   maskImage:
      //     "linear-gradient(to bottom, transparent 0%, black 20%, black 80%, transparent 100%)",
      //   WebkitMaskImage:
      //     "linear-gradient(to bottom, transparent 0%, black 20%, black 80%, transparent 100%)",
      // }}
    >
      <motion.div
        className="absolute  flex w-full -translate-x-1/2 flex-col items-center"
        style={{ y }}
      >
        {extendedCards.map((card, index) => (
          <ScrollingDeployCard
            key={`${index}-${card.title}`}
            index={index}
            y={y}
            offset={offset}
            itemHeight={itemHeight}
            card={card}
          />
        ))}
      </motion.div>
    </div>
  );
};

const DeployCard = ({
  variant = "default",
  title,
  subtitle,
  branch,
}: {
  variant?: "default" | "danger" | "success" | "warning";
  title: string;
  subtitle: string;
  branch: string;
}) => {
  return (
    <div className="mx-auto flex w-full max-w-sm items-center justify-between rounded-lg p-3">
      <div className="flex items-center gap-2">
        <div
          className={cn(
            "flex h-6 w-6 items-center justify-center rounded-md",
            variant === "default" && "bg-gray-200",
            variant === "danger" && "bg-red-200",
            variant === "success" && "bg-green-200",
            variant === "warning" && "bg-yellow-200"
          )}
        >
          <ForkIcon
            className={cn(
              "h-4 w-4",
              variant === "default" && "text-gray-500",
              variant === "danger" && "text-red-500",
              variant === "success" && "text-green-500",
              variant === "warning" && "text-yellow-500"
            )}
          />
        </div>
        <span className="text-charcoal-700 text-xs font-medium sm:text-sm">
          {title}
        </span>
      </div>
      <div className="ml-2 flex flex-row items-center gap-2">
        <span className="text-charcoal-700 text-xs font-normal">
          {subtitle}
        </span>
        <div className="h-[1px] w-4 bg-gray-400"></div>
        <span className="text-charcoal-700 text-xs font-normal">{branch}</span>
      </div>
    </div>
  );
};

const LeftSVG = (props: React.SVGProps<SVGSVGElement>) => {
  return (
    <motion.svg
      width="128"
      height="97"
      viewBox="0 0 128 97"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      initial={{
        opacity: 0,
      }}
      animate={{
        opacity: 1,
      }}
      transition={{
        duration: 1,
      }}
      className={props.className}
    >
      <mask id="path-1-inside-1_557_1106" fill="gray">
        <path d="M127.457 0.0891113L127.576 95.9138L0.939007 96.0718L0.839368 16.2472C0.828338 7.41063 7.98283 0.238242 16.8194 0.227212L127.457 0.0891113Z" />
      </mask>
      <path
        d="M127.457 0.0891113L127.576 95.9138L127.457 0.0891113ZM-0.0609919 96.0731L-0.160632 16.2484C-0.172351 6.85959 7.4293 -0.761068 16.8181 -0.772787L16.8206 1.22721C8.53637 1.23755 1.82903 7.96166 1.83937 16.2459L1.93901 96.0706L-0.0609919 96.0731ZM-0.160632 16.2484C-0.172351 6.85959 7.4293 -0.761068 16.8181 -0.772787L127.455 -0.910888L127.458 1.08911L16.8206 1.22721C8.53637 1.23755 1.82903 7.96166 1.83937 16.2459L-0.160632 16.2484ZM127.576 95.9138L0.939007 96.0718L127.576 95.9138Z"
        fill="#EAEDF1"
        mask="url(#path-1-inside-1_557_1106)"
      />
      <path
        d="M127.457 0.0891113L127.576 95.9138L127.457 0.0891113ZM-0.0609919 96.0731L-0.160632 16.2484C-0.172351 6.85959 7.4293 -0.761068 16.8181 -0.772787L16.8206 1.22721C8.53637 1.23755 1.82903 7.96166 1.83937 16.2459L1.93901 96.0706L-0.0609919 96.0731ZM-0.160632 16.2484C-0.172351 6.85959 7.4293 -0.761068 16.8181 -0.772787L127.455 -0.910888L127.458 1.08911L16.8206 1.22721C8.53637 1.23755 1.82903 7.96166 1.83937 16.2459L-0.160632 16.2484ZM127.576 95.9138L0.939007 96.0718L127.576 95.9138Z"
        fill="url(#gradient-one)"
        mask="url(#path-1-inside-1_557_1106)"
      />
      {/* <rect d={path} width="128" height="97" fill="url(#gradient-one)" /> */}
      <defs>
        <motion.linearGradient
          id="gradient-one"
          initial={{
            x1: "100%",
            x2: "90%",
            y1: "90%",
            y2: "80%",
          }}
          animate={{
            x1: "20%",
            x2: "0%",
            y1: "90%",
            y2: "220%",
          }}
          transition={{
            duration: 5,
            repeat: Infinity,
            repeatDelay: 2,
          }}
          gradientUnits="userSpaceOnUse"
        >
          <stop stopColor="gray" stopOpacity="0.5" offset="0" />
          <stop stopColor="#5787FF" stopOpacity="1" offset="0.5" />
          <stop stopColor="gray" stopOpacity="0" offset="1" />
        </motion.linearGradient>
      </defs>
    </motion.svg>
  );
};

const RightSVG = (props: React.SVGProps<SVGSVGElement>) => {
  return (
    <motion.svg
      width="150"
      height="96"
      viewBox="0 0 150 96"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      initial={{
        opacity: 0,
      }}
      animate={{
        opacity: 1,
      }}
      transition={{
        duration: 1,
      }}
      className={props.className}
    >
      <mask id="path-1-inside-1_557_1107" fill="gray">
        <path d="M0.619629 0L0.500018 95.8247L127.137 95.9827L127.237 16.1581C127.248 7.32152 120.093 0.149131 111.257 0.138101L0.619629 0Z" />
      </mask>
      <path
        d="M0.619629 0L0.500018 95.8247L0.619629 0ZM128.137 95.984L128.237 16.1593C128.249 6.77047 120.647 -0.850179 111.258 -0.861898L111.256 1.1381C119.54 1.14844 126.247 7.87255 126.237 16.1568L126.137 95.9815L128.137 95.984ZM128.237 16.1593C128.249 6.77047 120.647 -0.850179 111.258 -0.861898L0.620877 -0.999999L0.618381 0.999999L111.256 1.1381C119.54 1.14844 126.247 7.87255 126.237 16.1568L128.237 16.1593ZM0.500018 95.8247L127.137 95.9827L0.500018 95.8247Z"
        fill="#EAEDF1"
        mask="url(#path-1-inside-1_557_1107)"
      />
      <path
        d="M0.619629 0L0.500018 95.8247L0.619629 0ZM128.137 95.984L128.237 16.1593C128.249 6.77047 120.647 -0.850179 111.258 -0.861898L111.256 1.1381C119.54 1.14844 126.247 7.87255 126.237 16.1568L126.137 95.9815L128.137 95.984ZM128.237 16.1593C128.249 6.77047 120.647 -0.850179 111.258 -0.861898L0.620877 -0.999999L0.618381 0.999999L111.256 1.1381C119.54 1.14844 126.247 7.87255 126.237 16.1568L128.237 16.1593ZM0.500018 95.8247L127.137 95.9827L0.500018 95.8247Z"
        fill="url(#gradient-two)"
        mask="url(#path-1-inside-1_557_1107)"
      />
      {/* <rect d={PATH} width="128" height="97" fill="url(#gradient-two)" /> */}

      <defs>
        <motion.linearGradient
          id="gradient-two"
          initial={{
            x1: "-10%",
            x2: "0%",
            y1: "0%",
            y2: "0%",
          }}
          animate={{
            x1: "100%",
            x2: "110%",
            y1: "110%",
            y2: "140%",
          }}
          transition={{
            duration: 5,
            repeat: Infinity,
            repeatDelay: 2,
          }}
          gradientUnits="userSpaceOnUse"
        >
          <stop stopColor="white" stopOpacity="0.5" offset="0" />
          <stop stopColor="#F17463" stopOpacity="1" offset="0.5" />
          <stop stopColor="white" stopOpacity="0" offset="1" />
        </motion.linearGradient>
      </defs>
    </motion.svg>
  );
};

const CenterSVG = (props: React.SVGProps<SVGSVGElement>) => {
  return (
    <motion.svg
      width="1.5"
      height="90"
      viewBox="0 0 2 78"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      initial={{
        opacity: 0,
      }}
      animate={{
        opacity: 1,
      }}
      transition={{
        duration: 1,
      }}
      className={props.className}
    >
      <line x1="1" y1="56" x2="1" stroke="gray" strokeWidth="2" />
      <line
        x1="1"
        y1="56"
        x2="1"
        stroke="url(#gradient-three)"
        strokeWidth="1"
      />
      <defs>
        <motion.linearGradient
          id="gradient-three"
          initial={{
            x1: "0%",
            x2: "0%",
            y1: "-100%",
            y2: "-90%",
          }}
          animate={{
            x1: "0%",
            x2: "0%",
            y1: "90%",
            y2: "100%",
          }}
          transition={{
            duration: 5,
            repeat: Infinity,
            repeatDelay: 2,
          }}
          gradientUnits="userSpaceOnUse"
        >
          <stop stopColor="gray" stopOpacity="1" offset="0" />
          <stop stopColor="#F17463" stopOpacity="0.5" offset="0.5" />
          <stop stopColor="#F17463" stopOpacity="0" offset="1" />
        </motion.linearGradient>
      </defs>
    </motion.svg>
  );
};
