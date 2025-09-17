// Performance utilities for development
export const isDevelopment = process.env.NODE_ENV === "development";

// Reduce animation complexity in development
export const getAnimationDuration = (baseDuration: number) => {
  return isDevelopment ? baseDuration * 0.5 : baseDuration;
};

// Disable heavy animations in development
export const shouldAnimate = (component: string) => {
  if (!isDevelopment) return true;

  // Disable heavy animations in development
  const disabledInDev = ["pixelated-canvas", "marquee", "complex-motion"];
  return !disabledInDev.some((disabled) => component.includes(disabled));
};

// Reduce particle count in development
export const getParticleCount = (baseCount: number) => {
  return isDevelopment ? Math.min(baseCount, 100) : baseCount;
};

// Throttle function for development
export const throttle = <T extends (...args: any[]) => any>(
  func: T,
  delay: number
): T => {
  let timeoutId: NodeJS.Timeout | null = null;
  let lastExecTime = 0;

  return ((...args: Parameters<T>) => {
    const currentTime = Date.now();

    if (currentTime - lastExecTime > delay) {
      func(...args);
      lastExecTime = currentTime;
    } else {
      if (timeoutId) clearTimeout(timeoutId);
      timeoutId = setTimeout(() => {
        func(...args);
        lastExecTime = Date.now();
      }, delay - (currentTime - lastExecTime));
    }
  }) as T;
};
