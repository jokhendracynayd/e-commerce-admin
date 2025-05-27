import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { PlusCircle } from "lucide-react";
import { MainLayout } from "@/components/MainLayout";
import Link from "next/link";

const orders = [
  {
    id: "ORD-5312",
    customer: "John Doe",
    date: "2023-08-15",
    status: "Delivered",
    total: 125.99,
    items: 3
  },
  {
    id: "ORD-5313",
    customer: "Emma Smith",
    date: "2023-08-15",
    status: "Processing",
    total: 89.50,
    items: 2
  },
  {
    id: "ORD-5314",
    customer: "Michael Johnson",
    date: "2023-08-14",
    status: "Shipped",
    total: 354.25,
    items: 5
  },
  {
    id: "ORD-5315",
    customer: "Sophia Williams",
    date: "2023-08-13",
    status: "Delivered",
    total: 42.99,
    items: 1
  },
  {
    id: "ORD-5316",
    customer: "Robert Brown",
    date: "2023-08-12",
    status: "Cancelled",
    total: 210.75,
    items: 4
  }
];

export default function OrdersPage() {
  return (
    <MainLayout>
      <div className="flex flex-col gap-5">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold">Orders</h1>
          <Link href="/orders/new">
            <Button>
              <PlusCircle className="mr-2 h-4 w-4" />
              New Order
            </Button>
          </Link>
        </div>
        
        <Card>
          <CardHeader>
            <CardTitle>Order Management</CardTitle>
            <CardDescription>
              View and manage customer orders
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Order ID</TableHead>
                  <TableHead>Customer</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Items</TableHead>
                  <TableHead>Total</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {orders.map((order) => (
                  <TableRow key={order.id}>
                    <TableCell className="font-medium">
                      <Link href={`/orders/${order.id}/view`} className="hover:underline">
                        {order.id}
                      </Link>
                    </TableCell>
                    <TableCell>{order.customer}</TableCell>
                    <TableCell>{order.date}</TableCell>
                    <TableCell>{order.items} items</TableCell>
                    <TableCell>${order.total.toFixed(2)}</TableCell>
                    <TableCell>
                      <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
                        order.status === "Delivered" 
                          ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300" 
                          : order.status === "Processing"
                          ? "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300"
                          : order.status === "Shipped"
                          ? "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300"
                          : "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300"
                      }`}>
                        {order.status}
                      </span>
                    </TableCell>
                    <TableCell className="text-right space-x-2">
                      <Link href={`/orders/${order.id}/view`} className="text-sm text-blue-600 hover:underline dark:text-blue-400">
                        View
                      </Link>
                      <Link href={`/orders/${order.id}`} className="text-sm text-blue-600 hover:underline dark:text-blue-400">
                        Edit
                      </Link>
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