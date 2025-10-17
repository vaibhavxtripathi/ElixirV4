"use client";
import React, { useEffect, useMemo, useState } from "react";
import { Container } from "@/components/container";
import { PixelatedCanvas } from "@/components/pixelated-canvas";
import { cn } from "@/lib/utils";
import { AnimatePresence, motion } from "framer-motion";
import {
  ConnectYourTooklsSkeleton,
  DeployAndScaleSkeleton,
  DesignYourWorkflowSkeleton,
} from "./skeletons";
import { Header } from "../Header";

type Tab = {
  title: string;
  description: string;
  icon: React.FC<React.SVGProps<SVGSVGElement>>;
  id: string;
  skeleton: React.ReactNode;
};

export const HowItWorks = () => {
  const tabs = useMemo(
    () => [
      {
        title: "Join our community",
        description:
          "Connect with 5000+ tech enthusiasts across our three specialized clubs: GFG, GDG, and CodeChef",
        icon: FirstIcon,
        id: "join",
        skeleton: <DesignYourWorkflowSkeleton />,
      },
      {
        title: "Share ideas & collaborate",
        description:
          "Participate in discussions, share your projects, and collaborate with like-minded developers and tech professionals",
        icon: SecondIcon,
        id: "collaborate",
        skeleton: <ConnectYourTooklsSkeleton />,
      },
      {
        title: "Grow together",
        description:
          "Attend workshops, hackathons, and events to learn new skills, build connections, and advance your tech career",
        icon: ThirdIcon,
        id: "grow",
        skeleton: <DeployAndScaleSkeleton />,
      },
    ],
    []
  );

  const [activeTab, setActiveTab] = useState(tabs[0]);
  const [showGrid, setShowGrid] = useState(false);

  const DURATION = 12000; // Increased from 8000 to reduce frequency
  const GRID_DELAY = 2500; // wait for pixelated canvas animation

  useEffect(() => {
    // Only auto-switch on desktop (lg and above)
    const mediaQuery = window.matchMedia("(min-width: 1024px)");

    if (!mediaQuery.matches) {
      return; // Don't auto-switch on mobile
    }

    const interval = setInterval(() => {
      const currentIndex = tabs.findIndex((tab) => tab.id === activeTab.id);
      const nextIndex = (currentIndex + 1) % tabs.length;
      setActiveTab(tabs[nextIndex]);
    }, DURATION);

    return () => clearInterval(interval);
  }, [activeTab, tabs]);

  // Toggle grid visibility after canvas animation completes for the active item
  useEffect(() => {
    setShowGrid(false);
    const t = setTimeout(() => setShowGrid(true), GRID_DELAY);
    return () => clearTimeout(t);
  }, [activeTab]);
  return (
    <section className="relative z-99">
      <Container>
        <Header
          badge="How it works?"
          title="Join the Elixir Tech Community"
          subtitle="Connect with fellow developers and grow your skills."
          variant="secondary"
        />

        <div className="mt-20 bg-card relative w-full grid-cols-2 items-stretch divide-x divide-white/10 border-t border-b border-l border-r border-white/10 lg:grid">
          {/* Ensure center divider is always visible above masked content */}
          <div className="pointer-events-none absolute inset-y-0 left-1/2 hidden w-px bg-white/10 lg:block z-50" />
          {/* Left Column - Feature Cards */}
          <div className="hidden divide-y divide-white/10 lg:block">
            {tabs.map((tab) => (
              <button
                key={tab.title}
                className={cn(
                  "group relative flex w-full flex-col items-start overflow-hidden px-6 py-8 transition-all duration-200",
                  "hover:bg-white/5",
                  tab.id === activeTab.id &&
                    "bg-gradient-to-b from-white/5 to-transparent border border-blue-500/20 ring-1 ring-blue-500/10"
                )}
                onClick={() => setActiveTab(tab)}
              >
                {/* Grid background only for active card after animation */}
                {tab.id === activeTab.id && showGrid && (
                  <div
                    className="pointer-events-none absolute inset-0 z-0 opacity-30 bg-[image:repeating-linear-gradient(0deg,var(--grid-color)_0,var(--grid-color)_1px,transparent_1px,transparent_8px),repeating-linear-gradient(90deg,var(--grid-color)_0,var(--grid-color)_1px,transparent_1px,transparent_8px)]"
                    style={
                      {
                        ["--grid-color"]: "rgba(255,255,255,0.18)",
                      } as React.CSSProperties
                    }
                  />
                )}
                {tab.id === activeTab.id && (
                  <Canvas activeTab={tab} duration={2500} />
                )}
                {tab.id === activeTab.id && <Loader duration={DURATION} />}
                <div
                  className={cn(
                    "relative z-20 flex items-center gap-3 font-semibold",
                    activeTab.id === tab.id
                      ? "text-white"
                      : "text-white/90 group-hover:text-white"
                  )}
                >
                  <tab.icon className="shrink-0 h-4 w-4" />
                  <span className="text-base">{tab.title}</span>
                </div>
                <p
                  className={cn(
                    "relative z-20 mt-3 text-left text-sm leading-relaxed",
                    activeTab.id === tab.id ? "text-white/85" : "text-white/70"
                  )}
                >
                  {tab.description}
                </p>
                {tab.id === activeTab.id && (
                  <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-500" />
                )}
              </button>
            ))}
          </div>

          {/* Right Column - Visual Content */}
          <div
            className="relative h-full overflow-hidden opacity-70"
            style={{
              maskImage:
                "radial-gradient(circle at 50% 50%, rgba(0,0,0,1) 35%, rgba(0,0,0,0.35) 60%, rgba(0,0,0,0) 90%)",
              WebkitMaskImage:
                "radial-gradient(circle at 50% 50%, rgba(0,0,0,1) 35%, rgba(0,0,0,0.35) 60%, rgba(0,0,0,0) 90%)",
            }}
          >
            {showGrid && (
              <div
                className="pointer-events-none absolute inset-0 z-0 opacity-40 bg-[radial-gradient(var(--color-dots)_1px,transparent_1px)] [background-size:10px_10px]"
                style={
                  {
                    ["--color-dots"]: "rgba(255,255,255,0.28)",
                  } as React.CSSProperties
                }
              />
            )}
            {/* Consistent vertical vignette */}
            <div
              className="pointer-events-none absolute inset-0 z-10"
              style={{
                background:
                  "linear-gradient(to bottom, rgba(0,0,0,0) 0%, rgba(0,0,0,0) 55%, rgba(0,0,0,0.6) 100%)",
              }}
            />
            <AnimatePresence mode="wait">
              <motion.div
                key={activeTab.id}
                className="absolute inset-0"
                initial={{ filter: "blur(10px)", opacity: 0 }}
                animate={{ filter: "blur(0px)", opacity: 1 }}
                exit={{ filter: "blur(10px)", opacity: 0 }}
                transition={{ duration: 0.5 }}
              >
                {activeTab.skeleton}
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
        {/* Mobile Tabs - Show all sections */}
        <div className="mt-8 w-full lg:hidden space-y-6 sm:space-y-8">
          {tabs.map((tab, index) => (
            <div
              key={tab.id}
              className={cn(
                "relative flex w-full flex-col items-start rounded-md border border-white/10 bg-white/5 px-4 py-6 sm:px-6 sm:py-8",
                "bg-[radial-gradient(var(--color-dots)_1px,transparent_1px)] [background-size:10px_10px]"
              )}
            >
              <div className="relative z-20 flex items-center gap-3 font-medium text-white/90 w-full">
                <tab.icon className="shrink-0 h-4 w-4" />
                <span className="text-base">{tab.title}</span>
              </div>
              <p className="relative z-20 mt-3 text-left text-sm text-white/70 leading-relaxed w-full">
                {tab.description}
              </p>
              <div className="relative mx-auto mt-6 h-60 w-full overflow-hidden bg-[radial-gradient(var(--color-dots)_1px,transparent_1px)] [background-size:10px_10px]">
                {tab.skeleton}
              </div>
            </div>
          ))}
        </div>
      </Container>
    </section>
  );
};

const Loader = ({ duration = 2500 }: { duration?: number }) => {
  return (
    <motion.div
      className="absolute inset-x-0 bottom-0 z-30 h-0.5 w-full rounded-full bg-[#080914]"
      initial={{ width: "0%", backgroundColor: "#080914" }}
      animate={{ width: "100%", backgroundColor: "#2563eb" }}
      transition={{ duration: duration / 1000 }}
    />
  );
};

const Canvas = ({
  activeTab,
  duration,
}: {
  activeTab: Tab;
  duration: number;
}) => {
  return (
    <PixelatedCanvas
      key={activeTab.id}
      isActive={true}
      fillColor="#2563eb"
      backgroundColor="#1a1a1a"
      size={3}
      duration={duration}
      className="absolute inset-0 opacity-20"
    />
  );
};

const FirstIcon = (props: React.SVGProps<SVGSVGElement>) => {
  return (
    <svg
      width="16"
      height="17"
      viewBox="0 0 16 17"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <path
        d="M8.02287 8.95395C7.99883 8.89366 7.993 8.82765 8.00609 8.76407C8.01918 8.7005 8.05061 8.64216 8.09651 8.59626C8.1424 8.55037 8.20075 8.51893 8.26432 8.50584C8.32789 8.49276 8.39391 8.49859 8.4542 8.52262L14.4542 10.856C14.5185 10.8811 14.5735 10.9256 14.6114 10.9833C14.6493 11.041 14.6684 11.1091 14.666 11.1781C14.6636 11.2471 14.6398 11.3137 14.5979 11.3686C14.556 11.4235 14.4981 11.464 14.4322 11.4846L12.1362 12.1966C12.0326 12.2286 11.9384 12.2855 11.8617 12.3621C11.785 12.4388 11.7282 12.533 11.6962 12.6366L10.9849 14.932C10.9643 14.9979 10.9237 15.0558 10.8688 15.0977C10.8139 15.1396 10.7474 15.1634 10.6783 15.1658C10.6093 15.1682 10.5412 15.1491 10.4835 15.1112C10.4258 15.0732 10.3813 15.0183 10.3562 14.954L8.02287 8.95395Z"
        stroke="currentColor"
        strokeWidth="1.33333"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M14 7.83333V3.83333C14 3.47971 13.8595 3.14057 13.6095 2.89052C13.3594 2.64048 13.0203 2.5 12.6667 2.5H3.33333C2.97971 2.5 2.64057 2.64048 2.39052 2.89052C2.14048 3.14057 2 3.47971 2 3.83333V13.1667C2 13.5203 2.14048 13.8594 2.39052 14.1095C2.64057 14.3595 2.97971 14.5 3.33333 14.5H7.33333"
        stroke="currentColor"
        strokeWidth="1.33333"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
};

export const SecondIcon = (props: React.SVGProps<SVGSVGElement>) => {
  return (
    <svg
      width="16"
      height="17"
      viewBox="0 0 16 17"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <path
        d="M8 12.5V3.83337"
        stroke="currentColor"
        strokeWidth="1.33333"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M10 9.16667C9.4232 8.99806 8.91656 8.64708 8.556 8.16633C8.19544 7.68558 8.00036 7.10094 8 6.5C7.99964 7.10094 7.80456 7.68558 7.444 8.16633C7.08344 8.64708 6.5768 8.99806 6 9.16667"
        stroke="currentColor"
        strokeWidth="1.33333"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M11.732 4.83322C11.8854 4.56754 11.9756 4.27014 11.9957 3.96401C12.0158 3.65789 11.9652 3.35125 11.8478 3.06781C11.7304 2.78438 11.5494 2.53175 11.3187 2.32947C11.0881 2.12719 10.814 1.98068 10.5176 1.90128C10.2213 1.82188 9.91069 1.81171 9.6098 1.87156C9.30891 1.93142 9.02583 2.05969 8.78244 2.24645C8.53906 2.43321 8.3419 2.67346 8.20623 2.94861C8.07055 3.22376 7.99999 3.52643 8 3.83322C8.00001 3.52643 7.92945 3.22376 7.79377 2.94861C7.6581 2.67346 7.46094 2.43321 7.21756 2.24645C6.97417 2.05969 6.69109 1.93142 6.3902 1.87156C6.08931 1.81171 5.77868 1.82188 5.48236 1.90128C5.18603 1.98068 4.91193 2.12719 4.68129 2.32947C4.45064 2.53175 4.26961 2.78438 4.15222 3.06781C4.03483 3.35125 3.98421 3.65789 4.00429 3.96401C4.02436 4.27014 4.11459 4.56754 4.268 4.83322"
        stroke="currentColor"
        strokeWidth="1.33333"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M11.998 3.91663C12.3899 4.01738 12.7537 4.20599 13.0619 4.46817C13.3701 4.73034 13.6146 5.05921 13.7768 5.42986C13.9391 5.80051 14.0149 6.20322 13.9985 6.6075C13.982 7.01178 13.8738 7.40702 13.682 7.76329"
        stroke="currentColor"
        strokeWidth="1.33333"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M12 12.4999C12.587 12.4999 13.1576 12.3062 13.6233 11.9488C14.089 11.5915 14.4238 11.0905 14.5757 10.5235C14.7276 9.95645 14.6882 9.35516 14.4636 8.81284C14.239 8.27051 13.8417 7.81745 13.3333 7.52393"
        stroke="currentColor"
        strokeWidth="1.33333"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M13.3114 12.1553C13.3581 12.5168 13.3303 12.884 13.2295 13.2343C13.1287 13.5846 12.9572 13.9105 12.7256 14.1919C12.4939 14.4733 12.207 14.7043 11.8826 14.8704C11.5582 15.0366 11.2032 15.1346 10.8394 15.1582C10.4757 15.1818 10.111 15.1306 9.76782 15.0077C9.42466 14.8848 9.11033 14.6929 8.84424 14.4438C8.57815 14.1947 8.36596 13.8937 8.22077 13.5593C8.07558 13.225 8.00047 12.8644 8.00008 12.4999C7.99969 12.8644 7.92458 13.225 7.77939 13.5593C7.6342 13.8937 7.42201 14.1947 7.15592 14.4438C6.88983 14.6929 6.5755 14.8848 6.23234 15.0077C5.88917 15.1306 5.52446 15.1818 5.16073 15.1582C4.797 15.1346 4.44197 15.0366 4.11756 14.8704C3.79315 14.7043 3.50626 14.4733 3.2746 14.1919C3.04294 13.9105 2.87144 13.5846 2.77067 13.2343C2.66991 12.884 2.64202 12.5168 2.68875 12.1553"
        stroke="currentColor"
        strokeWidth="1.33333"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M3.9998 12.4999C3.4128 12.4999 2.84221 12.3062 2.37651 11.9488C1.91082 11.5915 1.57605 11.0905 1.42412 10.5235C1.27219 9.95645 1.31159 9.35516 1.53621 8.81284C1.76083 8.27051 2.15812 7.81745 2.66647 7.52393"
        stroke="currentColor"
        strokeWidth="1.33333"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M4.00187 3.91663C3.61001 4.01738 3.24621 4.20599 2.93803 4.46817C2.62985 4.73034 2.38536 5.05921 2.2231 5.42986C2.06084 5.80051 1.98504 6.20322 2.00146 6.6075C2.01788 7.01178 2.12608 7.40702 2.31787 7.76329"
        stroke="currentColor"
        strokeWidth="1.33333"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
};

export const ThirdIcon = (props: React.SVGProps<SVGSVGElement>) => {
  return (
    <svg
      width="16"
      height="17"
      viewBox="0 0 16 17"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <path
        d="M10.6667 9.16664L14.1487 11.488C14.1989 11.5214 14.2573 11.5405 14.3175 11.5434C14.3777 11.5463 14.4376 11.5328 14.4907 11.5043C14.5439 11.4759 14.5883 11.4335 14.6193 11.3818C14.6503 11.3301 14.6667 11.2709 14.6667 11.2106V5.74664C14.6668 5.68799 14.6513 5.63037 14.6219 5.57961C14.5926 5.52884 14.5503 5.48672 14.4995 5.45751C14.4486 5.42829 14.3909 5.41301 14.3323 5.41321C14.2736 5.41341 14.2161 5.42908 14.1654 5.45864L10.6667 7.49997"
        stroke="currentColor"
        strokeWidth="1.33333"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M9.33325 4.5H2.66659C1.93021 4.5 1.33325 5.09695 1.33325 5.83333V11.1667C1.33325 11.903 1.93021 12.5 2.66659 12.5H9.33325C10.0696 12.5 10.6666 11.903 10.6666 11.1667V5.83333C10.6666 5.09695 10.0696 4.5 9.33325 4.5Z"
        stroke="currentColor"
        strokeWidth="1.33333"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
};
