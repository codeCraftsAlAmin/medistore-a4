import { reviewService } from "@/app/service/review.service";
import { Star, Trash2, ShieldAlert, User, Pill } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";

import { toast } from "sonner"; 

export default async function AdminReviewsPage() {
  const { data: allReviews } = await reviewService.getMyReviews();
  const reviews = allReviews || [];

  return (
    <div className="container mx-auto py-10 px-4 max-w-7xl text-slate-200">
      <div className="mb-8 flex justify-between items-end">
        <div>
          <h1 className="text-3xl font-bold flex items-center gap-3 text-white">
            <Star className="h-8 w-8 text-primary" />
            Review Logs
          </h1>
          <p className="text-muted-foreground mt-1">
            Monitor customer feedback and ratings across the entire platform.
          </p>
        </div>
        <Badge
          variant="outline"
          className="h-fit py-1 px-4 border-primary/30 text-primary"
        >
          Total Logs: {reviews.length}
        </Badge>
      </div>

      <Card className="border-white/5 bg-card/40 backdrop-blur-md">
        <CardContent className="p-0">
          <div className="relative overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead className="text-xs uppercase bg-white/5 text-muted-foreground border-b border-white/5">
                <tr>
                  <th className="px-6 py-4">Customer</th>
                  <th className="px-6 py-4">Medicine</th>
                  <th className="px-6 py-4">Rating</th>
                  <th className="px-6 py-4">Comment</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {reviews.map((review: any) => (
                  <tr
                    key={review.id}
                    className="hover:bg-white/5 transition-colors"
                  >
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="h-8 w-8 rounded-full bg-primary/20 flex items-center justify-center text-[10px] font-bold text-primary">
                          {review.user?.name?.[0].toUpperCase()}
                        </div>
                        <div>
                          <p className="font-medium text-white">
                            {review.user?.name}
                          </p>
                          <p className="text-[10px] text-muted-foreground">
                            {review.user?.email}
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <Pill className="h-3 w-3 text-primary" />
                        <span className="text-slate-300 font-medium">
                          {review.medicine?.name}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex gap-0.5">
                        {[...Array(5)].map((_, i) => (
                          <Star
                            key={i}
                            className={`h-3 w-3 ${i < review.rating ? "fill-yellow-500 text-yellow-500" : "text-white/10"}`}
                          />
                        ))}
                      </div>
                    </td>
                    <td className="px-6 py-4 max-w-xs">
                      <p className="truncate text-slate-400 italic">
                        "{review.comment}"
                      </p>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            {reviews.length === 0 && (
              <div className="text-center py-20 text-muted-foreground">
                No reviews found in the system.
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
