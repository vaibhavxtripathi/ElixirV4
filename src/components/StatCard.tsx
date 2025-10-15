"use client";

import * as React from "react";
import { Card, CardContent } from "@/components/ui/card";

type StatCardProps = {
  label: string;
  value: number | string;
  icon?: React.ReactNode;
  iconBgClassName?: string; // e.g., "bg-blue-500/20 text-blue-400"
  className?: string;
};

export function StatCard({
  label,
  value,
  icon,
  iconBgClassName,
  className,
}: StatCardProps) {
  return (
    <Card className={className ?? "bg-white/5 border-white/10"}>
      <CardContent className="p-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-white/60">{label}</p>
            <p className="text-3xl font-bold text-white mt-1">{value}</p>
          </div>
          {icon && (
            <div
              className={`p-3 rounded-lg border border-white/10 ${
                iconBgClassName ?? "bg-white/10 text-white/80"
              }`}
            >
              {icon}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
