import { reviewService } from "@/app/service/review.service";
import { userService } from "@/app/service/user.service";
import { Star, Trash2, MessageSquare } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { revalidatePath } from "next/cache";

export default async function MyReviewsPage() {
  const { data: sessionData } = await userService.getSession();
  const currentUser = sessionData?.user;

  const { data: allReviews } = await reviewService.getMyReviews();

  // Filter reviews in the frontend to only show those belonging to the current user
  const myReviews =
    currentUser && allReviews
      ? allReviews.filter((review: any) => review.userId === currentUser.id)
      : [];

  async function handleDelete(formData: FormData) {
    "use server";
    const id = formData.get("reviewId") as string;
    await reviewService.deleteReview(id);
    revalidatePath("/customer/reviews");
  }

  return (
    <div className="container mx-auto py-10 px-4 max-w-5xl">
      <div className="mb-10">
        <h1 className="text-3xl font-bold tracking-tight">My Reviews</h1>
        <p className="text-muted-foreground">
          Manage the feedback you've shared on medications.
        </p>
      </div>

      <div className="grid gap-6">
        {myReviews.length === 0 ? (
          <div className="text-center py-20 border-2 border-dashed rounded-3xl">
            <MessageSquare className="mx-auto h-12 w-12 text-muted-foreground/20" />
            <p className="mt-4 text-muted-foreground">
              You haven't written any reviews yet.
            </p>
          </div>
        ) : (
          myReviews.map((review: any) => (
            <div
              key={review.id}
              className="bg-card border rounded-2xl p-6 flex flex-col md:flex-row justify-between gap-4"
            >
              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <div className="flex">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className={`h-4 w-4 ${i < review.rating ? "fill-yellow-400 text-yellow-400" : "text-slate-300"}`}
                      />
                    ))}
                  </div>
                  <Badge variant="secondary" className="text-[10px] uppercase">
                    {review.medicine?.name || "Product"}
                  </Badge>
                </div>
                <p className="text-slate-700 italic">"{review.comment}"</p>
                <p className="text-xs text-slate-400">
                  Posted on {new Date(review.createdAt).toLocaleDateString()}
                </p>
              </div>

              {review.userId === currentUser?.id && (
                <form action={handleDelete}>
                  <input type="hidden" name="reviewId" value={review.id} />
                  <Button
                    variant="ghost"
                    size="sm"
                    className="text-destructive hover:bg-destructive/10"
                  >
                    <Trash2 className="h-4 w-4 mr-2" /> Delete Review
                  </Button>
                </form>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
}
