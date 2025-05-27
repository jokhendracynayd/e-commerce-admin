import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Calendar, PlusCircle, Tag, Percent } from "lucide-react";
import { MainLayout } from "@/components/MainLayout";

const deals = [
  {
    id: "deal-1",
    name: "Summer Sale",
    discountType: "Percentage",
    discountValue: 20,
    startDate: "2023-08-01",
    endDate: "2023-08-31",
    status: "Active",
    productsCount: 45,
  },
  {
    id: "deal-2",
    name: "Back to School",
    discountType: "Fixed Amount",
    discountValue: 10,
    startDate: "2023-08-15",
    endDate: "2023-09-15",
    status: "Active",
    productsCount: 32,
  },
  {
    id: "deal-3",
    name: "Flash Sale",
    discountType: "Percentage",
    discountValue: 30,
    startDate: "2023-09-05",
    endDate: "2023-09-06",
    status: "Upcoming",
    productsCount: 15,
  },
  {
    id: "deal-4",
    name: "Clearance",
    discountType: "Percentage",
    discountValue: 50,
    startDate: "2023-07-15",
    endDate: "2023-08-15",
    status: "Ended",
    productsCount: 28,
  },
  {
    id: "deal-5",
    name: "Holiday Special",
    discountType: "Fixed Amount",
    discountValue: 25,
    startDate: "2023-12-01",
    endDate: "2023-12-31",
    status: "Upcoming",
    productsCount: 0,
  },
];

const coupons = [
  {
    id: "cpn-1",
    code: "SUMMER25",
    discount: "25%",
    usageLimit: 100,
    usageCount: 42,
    expiryDate: "2023-08-31",
    status: "Active",
  },
  {
    id: "cpn-2",
    code: "FREESHIP",
    discount: "Free Shipping",
    usageLimit: 500,
    usageCount: 189,
    expiryDate: "2023-09-30",
    status: "Active",
  },
  {
    id: "cpn-3",
    code: "WELCOME10",
    discount: "$10 off",
    usageLimit: 1000,
    usageCount: 356,
    expiryDate: "2023-12-31",
    status: "Active",
  },
  {
    id: "cpn-4",
    code: "FLASH50",
    discount: "50%",
    usageLimit: 50,
    usageCount: 50,
    expiryDate: "2023-07-15",
    status: "Expired",
  },
];

export default function DealsPage() {
  return (
    <MainLayout>
      <div className="flex flex-col gap-5">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold">Deals & Promotions</h1>
          <div className="flex gap-2">
            <Button>
              <Tag className="mr-2 h-4 w-4" />
              Create Deal
            </Button>
            <Button variant="outline">
              <Percent className="mr-2 h-4 w-4" />
              Create Coupon
            </Button>
          </div>
        </div>
        
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Active Deals</CardTitle>
              <Tag className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {deals.filter(deal => deal.status === "Active").length}
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Active Coupons</CardTitle>
              <Percent className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {coupons.filter(coupon => coupon.status === "Active").length}
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Upcoming Deals</CardTitle>
              <Calendar className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {deals.filter(deal => deal.status === "Upcoming").length}
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Products on Sale</CardTitle>
              <PlusCircle className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {deals.filter(deal => deal.status === "Active").reduce((sum, deal) => sum + deal.productsCount, 0)}
              </div>
            </CardContent>
          </Card>
        </div>
        
        <Card>
          <CardHeader>
            <CardTitle>Deals</CardTitle>
            <CardDescription>
              Manage your promotional deals and discounts
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Discount</TableHead>
                  <TableHead>Products</TableHead>
                  <TableHead>Start Date</TableHead>
                  <TableHead>End Date</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {deals.map((deal) => (
                  <TableRow key={deal.id}>
                    <TableCell className="font-medium">{deal.name}</TableCell>
                    <TableCell>
                      {deal.discountType === "Percentage" 
                        ? `${deal.discountValue}%` 
                        : `$${deal.discountValue}`
                      }
                    </TableCell>
                    <TableCell>{deal.productsCount}</TableCell>
                    <TableCell>{deal.startDate}</TableCell>
                    <TableCell>{deal.endDate}</TableCell>
                    <TableCell>
                      <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
                        deal.status === "Active" 
                          ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300" 
                          : deal.status === "Upcoming"
                          ? "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300"
                          : "bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300"
                      }`}>
                        {deal.status}
                      </span>
                    </TableCell>
                    <TableCell className="text-right space-x-2">
                      <button className="text-sm text-blue-600 hover:underline dark:text-blue-400">
                        Edit
                      </button>
                      <button className="text-sm text-red-600 hover:underline dark:text-red-400">
                        Delete
                      </button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Coupons</CardTitle>
            <CardDescription>
              Manage your discount coupon codes
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Code</TableHead>
                  <TableHead>Discount</TableHead>
                  <TableHead>Usage</TableHead>
                  <TableHead>Expiry Date</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {coupons.map((coupon) => (
                  <TableRow key={coupon.id}>
                    <TableCell className="font-medium font-mono">{coupon.code}</TableCell>
                    <TableCell>{coupon.discount}</TableCell>
                    <TableCell>{coupon.usageCount} / {coupon.usageLimit}</TableCell>
                    <TableCell>{coupon.expiryDate}</TableCell>
                    <TableCell>
                      <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
                        coupon.status === "Active" 
                          ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300" 
                          : "bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300"
                      }`}>
                        {coupon.status}
                      </span>
                    </TableCell>
                    <TableCell className="text-right space-x-2">
                      <button className="text-sm text-blue-600 hover:underline dark:text-blue-400">
                        Edit
                      </button>
                      <button className="text-sm text-red-600 hover:underline dark:text-red-400">
                        Delete
                      </button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </MainLayout>
  );
} 