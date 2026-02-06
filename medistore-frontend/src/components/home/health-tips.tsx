"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Activity, Apple, Moon, Sun } from "lucide-react";

const tips = [
  {
    title: "Stay Hydrated",
    description:
      "Drink at least 8 glasses of water daily to maintain energy levels.",
    icon: Activity,
    color: "text-blue-500",
    bg: "bg-blue-500/10",
  },
  {
    title: "Balanced Diet",
    description:
      "Include plenty of fruits, vegetables, and whole grains in your meals.",
    icon: Apple,
    color: "text-emerald-500",
    bg: "bg-emerald-500/10",
  },
  {
    title: "Regular Exercise",
    description: "Aim for at least 30 minutes of moderate activity every day.",
    icon: Sun,
    color: "text-orange-500",
    bg: "bg-orange-500/10",
  },
  {
    title: "Quality Sleep",
    description:
      "Get 7-9 hours of sleep each night to support your immune system.",
    icon: Moon,
    color: "text-indigo-500",
    bg: "bg-indigo-500/10",
  },
];

export function HealthTips() {
  return (
    <section className="container mx-auto px-4 py-16">
      <div className="mb-8">
        <h2 className="text-3xl font-bold tracking-tight text-zinc-900 dark:text-white">
          Daily Health Tips
        </h2>
        <p className="text-muted-foreground">
          Curated expert advice for a healthier lifestyle.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {tips.map((tip, index) => (
          <Card
            key={index}
            className="border-none shadow-sm bg-white dark:bg-zinc-900 overflow-hidden group hover:ring-1 hover:ring-primary/20 transition-all"
          >
            <CardContent className="p-6">
              <div
                className={`w-12 h-12 rounded-2xl flex items-center justify-center mb-4 transition-transform group-hover:scale-110 ${tip.bg}`}
              >
                <tip.icon className={`w-6 h-6 ${tip.color}`} />
              </div>
              <h3 className="font-bold text-zinc-900 dark:text-zinc-100 mb-2">
                {tip.title}
              </h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                {tip.description}
              </p>
            </CardContent>
          </Card>
        ))}
      </div>
    </section>
  );
}
