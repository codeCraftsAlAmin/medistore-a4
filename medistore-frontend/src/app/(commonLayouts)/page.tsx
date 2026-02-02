import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Pill, Search, ShoppingBag, ArrowRight } from "lucide-react";
import Link from "next/link";

import { MedicineList } from "@/components/ui/medicine-list";
import { userService } from "../service/user.service";
import { medicineService } from "../service/medicine.service";

function HeroBadge({
  children,
  variant,
}: {
  children: React.ReactNode;
  variant?: "secondary";
}) {
  return (
    <span
      className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold transition-colors ${
        variant === "secondary"
          ? "bg-zinc-100 text-zinc-900 dark:bg-zinc-800 dark:text-zinc-100"
          : "bg-primary text-primary-foreground"
      }`}
    >
      {children}
    </span>
  );
}

export default async function Home({
  searchParams,
}: {
  searchParams: Promise<{ page?: string }>;
}) {
  // Resolve page from URL
  const params = await searchParams;
  const currentPage = params.page ? parseInt(params.page) : 1;

  const [sessionResponse, medResponse] = await Promise.all([
    userService.getSession(),
    medicineService.getAllMedicines({ page: currentPage, limit: 5 }),
  ]);

  const session = sessionResponse.data;
  const medData = medResponse.data;
  const error = medResponse.error;

  return (
    <div className="min-h-screen bg-zinc-50 font-sans dark:bg-zinc-950">
      {/* --- HERO SECTION --- */}
      <section className="bg-white border-b dark:bg-zinc-900 dark:border-zinc-800">
        <div className="container mx-auto px-4 py-16 text-center">
          <HeroBadge variant="secondary">
            {session ? `Welcome back, ${session.name}` : "Welcome to medStore"}
          </HeroBadge>
          <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight text-zinc-900 dark:text-white mt-4 mb-6">
            Your Trusted <span className="text-primary">Digital Pharmacy</span>
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto mb-8">
            Order authentic medicines, health supplements, and wellness
            products. Delivered directly to your doorstep with expert care.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Button size="lg" asChild shadow-lg="true">
              <Link href="/customer/shop">
                Shop Now <ShoppingBag className="ml-2 h-5 w-5" />
              </Link>
            </Button>
            {!session && (
              <Button size="lg" variant="outline" asChild>
                <Link href="/register">Partner with Us</Link>
              </Button>
            )}
          </div>
        </div>
      </section>

      <section className="container mx-auto px-4 -mt-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {[
            { label: "Authentic Meds", desc: "100% verified", icon: Pill },
            {
              label: "Fast Delivery",
              desc: "Under 24 hours",
              icon: ArrowRight,
            },
            { label: "Expert Support", desc: "24/7 Pharmacists", icon: Search },
          ].map((feature, i) => (
            <Card
              key={i}
              className="shadow-sm border-none bg-white dark:bg-zinc-900"
            >
              <CardContent className="flex items-center p-6 gap-4">
                <div className="p-3 bg-primary/10 rounded-full">
                  <feature.icon className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <h3 className="font-bold">{feature.label}</h3>
                  <p className="text-sm text-muted-foreground">
                    {feature.desc}
                  </p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      <section className="container mx-auto px-4 py-16">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-3xl font-bold tracking-tight">
              Recent Arrivals
            </h2>
            <p className="text-muted-foreground">
              Latest stock in our pharmacy
            </p>
          </div>
          <Button variant="ghost" asChild>
            <Link href="/medicine">
              View All <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
        </div>

        {error ? (
          <div className="bg-red-50 text-red-500 p-4 rounded-lg border border-red-200">
            Could not load medicines: {error.message}
          </div>
        ) : (
          <div className="bg-white p-6 rounded-xl border dark:bg-zinc-900 shadow-sm">
            <MedicineList
              data={medData?.data || []}
              paginations={
                medData?.paginations || {
                  page: 1,
                  limit: 5,
                  totalMedicine: 0,
                  totalPage: 0,
                }
              }
              baseUrl="/"
            />
          </div>
        )}
      </section>
    </div>
  );
}
