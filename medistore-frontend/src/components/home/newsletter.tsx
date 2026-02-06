"use client";

import { Mail, ShieldCheck, Truck, Clock, Sparkles } from "lucide-react";

export function Newsletter() {
  return (
    <section className="container mx-auto px-4 py-16">
      <div className="bg-white border dark:bg-zinc-900 dark:border-zinc-800 rounded-3xl p-8 md:p-12 relative overflow-hidden shadow-sm">
        {/* Subtle Background Decoration */}
        <div className="absolute top-0 right-0 p-8 opacity-5">
          <Sparkles className="h-32 w-32 text-primary" />
        </div>

        <div className="flex flex-col lg:flex-row items-center gap-12 relative z-10">
          <div className="lg:w-1/2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-bold mb-4 uppercase tracking-wider">
              <ShieldCheck className="h-3 w-3" /> Quality Assurance
            </div>
            <h2 className="text-3xl md:text-4xl font-bold tracking-tight text-zinc-900 dark:text-white mb-4">
              Your Health is Our <br className="hidden md:block" />
              <span className="text-primary">Number One Priority.</span>
            </h2>
            <p className="text-lg text-muted-foreground max-w-md">
              We source all medications directly from certified manufacturers to
              ensure you receive 100% authentic healthcare products.
            </p>
          </div>

          <div className="lg:w-1/2 w-full grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="p-6 rounded-2xl bg-zinc-50 dark:bg-zinc-950 border border-zinc-100 dark:border-zinc-800">
              <div className="h-10 w-10 rounded-xl bg-primary/10 flex items-center justify-center mb-4">
                <Truck className="h-5 w-5 text-primary" />
              </div>
              <h4 className="font-bold text-zinc-900 dark:text-zinc-100 mb-1">
                Express Delivery
              </h4>
              <p className="text-sm text-muted-foreground">
                Doorstep delivery within 24 hours across the city.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-zinc-50 dark:bg-zinc-950 border border-zinc-100 dark:border-zinc-800">
              <div className="h-10 w-10 rounded-xl bg-primary/10 flex items-center justify-center mb-4">
                <Clock className="h-5 w-5 text-primary" />
              </div>
              <h4 className="font-bold text-zinc-900 dark:text-zinc-100 mb-1">
                24/7 Support
              </h4>
              <p className="text-sm text-muted-foreground">
                Consult with our expert pharmacists anytime you need.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
