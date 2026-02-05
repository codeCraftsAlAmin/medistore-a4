import { reviewService } from "@/app/service/review.service";
import { userService } from "@/app/service/user.service";
import { Star, Trash2, MessageSquare, Pill, Calendar } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { revalidatePath } from "next/cache";
import { Card, CardContent } from "@/components/ui/card";

export const dynamic = "force-dynamic";

export default async function MyReviewsPage() {
  const { data: sessionData } = await userService.getSession();
  const currentUser = sessionData?.user;
  const { data: allReviews } = await reviewService.getMyReviews();

  const reviewsToDisplay = allReviews || [];

  async function handleDelete(formData: FormData) {
    "use server";
    const id = formData.get("reviewId") as string;
    await reviewService.deleteReview(id);
    revalidatePath("/customer/reviews");
  }

  return (
    <div className="container mx-auto py-10 px-4 max-w-5xl text-slate-200">
      <div className="mb-10">
        <h1 className="text-3xl font-bold flex items-center gap-3 text-white">
          <MessageSquare className="h-8 w-8 text-primary" />
          Feedback Hub
        </h1>
        <p className="text-muted-foreground mt-1">
          Explore and manage medicine feedback from the community.
        </p>
      </div>

      <div className="grid gap-6">
        {reviewsToDisplay.length === 0 ? (
          <div className="text-center py-24 border border-dashed rounded-xl bg-card/50">
            <MessageSquare className="mx-auto h-12 w-12 text-muted-foreground/30" />
            <p className="mt-4 text-muted-foreground font-medium">
              No reviews documented yet.
            </p>
          </div>
        ) : (
          reviewsToDisplay.map((review: any) => (
            <Card
              key={review.id}
              className="overflow-hidden border bg-card/40 backdrop-blur-sm hover:bg-card/60 transition-all border-white/5"
            >
              <div className="flex flex-col md:flex-row">
                <div className="md:w-64 bg-primary/5 p-6 flex flex-col justify-between border-b md:border-b-0 md:border-r border-white/5">
                  <div className="space-y-3">
                    <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center border border-primary/20">
                      <Pill className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-lg leading-tight text-white">
                        {review.medicine?.name || "Product"}
                      </h3>
                      <Badge
                        variant="secondary"
                        className="mt-2 text-[10px] uppercase tracking-wider"
                      >
                        Verified Purchase
                      </Badge>
                    </div>
                  </div>
                  <div className="pt-4 mt-4 flex items-center gap-2 text-muted-foreground">
                    <Calendar className="h-3 w-3" />
                    <p className="text-xs">
                      {new Date(review.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                </div>

                <CardContent className="flex-1 p-6 flex flex-col justify-between">
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="flex gap-1">
                        {[...Array(5)].map((_, i) => (
                          <Star
                            key={i}
                            className={`h-4 w-4 ${i < review.rating ? "fill-yellow-500 text-yellow-500" : "text-white/10"}`}
                          />
                        ))}
                      </div>
                      <div className="flex items-center gap-3">
                        <div className="text-right">
                          <p className="text-xs font-medium text-white">
                            {review.user?.name || "User"}
                          </p>
                          <p className="text-[10px] text-muted-foreground">
                            Reviewer
                          </p>
                        </div>
                        <div className="w-8 h-8 rounded-full bg-primary/20 text-primary flex items-center justify-center font-bold text-xs border border-primary/30">
                          {review.user?.name?.[0]?.toUpperCase() || "U"}
                        </div>
                      </div>
                    </div>
                    <blockquote className="border-l-2 border-primary/30 pl-4 italic text-slate-300 py-1">
                      "{review.comment}"
                    </blockquote>
                  </div>

                  <div className="flex justify-end mt-6">
                    {review.userId === currentUser?.id && (
                      <form action={handleDelete}>
                        <input
                          type="hidden"
                          name="reviewId"
                          value={review.id}
                        />
                        <Button
                          variant="ghost"
                          size="sm"
                          className="text-destructive hover:bg-destructive/10 text-xs gap-2"
                        >
                          <Trash2 className="h-3.5 w-3.5" /> Delete My Review
                        </Button>
                      </form>
                    )}
                  </div>
                </CardContent>
              </div>
            </Card>
          ))
        )}
      </div>
    </div>
  );
}
