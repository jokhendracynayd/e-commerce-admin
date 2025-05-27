import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Check, Star, ThumbsUp, ThumbsDown, AlertOctagon, Archive } from "lucide-react";
import { MainLayout } from "@/components/MainLayout";

const reviews = [
  {
    id: "rev-1",
    customer: "John Doe",
    product: "Premium Headphones",
    rating: 5,
    comment: "Excellent sound quality and comfortable to wear for long periods. Battery life is impressive too.",
    date: "2023-08-15",
    status: "Published",
    reported: false,
    helpfulCount: 12,
  },
  {
    id: "rev-2",
    customer: "Emma Smith",
    product: "Smartphone X",
    rating: 2,
    comment: "Poor battery life and overheats easily. Not worth the high price tag.",
    date: "2023-08-14",
    status: "Pending",
    reported: true,
    helpfulCount: 3,
  },
  {
    id: "rev-3",
    customer: "Michael Johnson",
    product: "Ergonomic Chair",
    rating: 4,
    comment: "Very comfortable and easy to adjust. Taking off one star because assembly was a bit tricky.",
    date: "2023-08-13",
    status: "Published",
    reported: false,
    helpfulCount: 8,
  },
  {
    id: "rev-4",
    customer: "Sophia Williams",
    product: "Designer Backpack",
    rating: 5,
    comment: "Beautiful design and very spacious. Love all the compartments!",
    date: "2023-08-12",
    status: "Published",
    reported: false,
    helpfulCount: 6,
  },
  {
    id: "rev-5",
    customer: "Robert Brown",
    product: "Fitness Watch",
    rating: 1,
    comment: "Stopped working after 2 weeks. Terrible quality control.",
    date: "2023-08-11",
    status: "Pending",
    reported: true,
    helpfulCount: 15,
  },
];

export default function ReviewsPage() {
  return (
    <MainLayout>
      <div className="flex flex-col gap-5">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold">Reviews</h1>
          <div className="flex gap-2">
            <Button variant="outline">
              <AlertOctagon className="mr-2 h-4 w-4" />
              Reported Reviews
            </Button>
          </div>
        </div>
        
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Total Reviews</CardTitle>
              <Star className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {reviews.length}
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Average Rating</CardTitle>
              <Star className="h-4 w-4 fill-current text-yellow-400" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {(reviews.reduce((sum, review) => sum + review.rating, 0) / reviews.length).toFixed(1)}
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Pending Reviews</CardTitle>
              <ThumbsUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {reviews.filter(review => review.status === "Pending").length}
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Reported Reviews</CardTitle>
              <AlertOctagon className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {reviews.filter(review => review.reported).length}
              </div>
            </CardContent>
          </Card>
        </div>
        
        <Card>
          <CardHeader>
            <CardTitle>Customer Reviews</CardTitle>
            <CardDescription>
              Manage and moderate user product reviews
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Customer</TableHead>
                  <TableHead>Product</TableHead>
                  <TableHead>Rating</TableHead>
                  <TableHead>Comment</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {reviews.map((review) => (
                  <TableRow key={review.id}>
                    <TableCell className="font-medium">{review.customer}</TableCell>
                    <TableCell>{review.product}</TableCell>
                    <TableCell>
                      <div className="flex">
                        {[...Array(5)].map((_, i) => (
                          <Star 
                            key={i} 
                            className={`h-4 w-4 ${i < review.rating ? "fill-current text-yellow-400" : "text-gray-300"}`} 
                          />
                        ))}
                      </div>
                    </TableCell>
                    <TableCell className="max-w-xs truncate">{review.comment}</TableCell>
                    <TableCell>{review.date}</TableCell>
                    <TableCell>
                      <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
                        review.status === "Published" 
                          ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300" 
                          : "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300"
                      }`}>
                        {review.status}
                      </span>
                      {review.reported && (
                        <span className="ml-2 inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300">
                          Reported
                        </span>
                      )}
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        {review.status === "Pending" && (
                          <Button size="sm" variant="ghost" className="h-8 w-8 p-0">
                            <Check className="h-4 w-4" />
                            <span className="sr-only">Approve</span>
                          </Button>
                        )}
                        <Button size="sm" variant="ghost" className="h-8 w-8 p-0">
                          <Archive className="h-4 w-4" />
                          <span className="sr-only">Archive</span>
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Rating Distribution</CardTitle>
            <CardDescription>
              Review distribution by star rating
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {[5, 4, 3, 2, 1].map((rating) => {
                const count = reviews.filter(review => review.rating === rating).length;
                const percentage = (count / reviews.length) * 100;
                
                return (
                  <div key={rating} className="flex items-center">
                    <div className="w-16 text-sm font-medium">
                      {rating} star{rating !== 1 ? 's' : ''}
                    </div>
                    <div className="flex-1 mx-4">
                      <div className="h-2 w-full bg-gray-100 rounded-full overflow-hidden dark:bg-gray-700">
                        <div 
                          className={`h-2 bg-yellow-400 rounded-full`} 
                          style={{ width: `${percentage}%` }}
                        />
                      </div>
                    </div>
                    <div className="w-12 text-sm font-medium text-gray-600 dark:text-gray-400">
                      {count}
                    </div>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>
      </div>
    </MainLayout>
  );
} 