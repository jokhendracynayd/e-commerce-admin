"use client";

import { MainLayout } from "@/components/MainLayout";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Save, Plus, Trash2 } from "lucide-react";
import Link from "next/link";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { Separator } from "@/components/ui/separator";

// This is a mock function to simulate fetching order data by ID
async function getOrderById(id: string) {
  const orders = [
    {
      id: "ORD-5312",
      customer: {
        name: "John Doe",
        email: "john@example.com",
        phone: "+1 (555) 123-4567",
      },
      date: "2023-08-15",
      status: "Delivered",
      total: 125.99,
      subtotal: 119.99,
      tax: 6.00,
      shippingCost: 0,
      items: [
        { id: "1", name: "Premium Headphones", price: 89.99, quantity: 1 },
        { id: "5", name: "Designer Backpack", price: 29.99, quantity: 1 },
      ],
      payment: {
        method: "Credit Card",
        cardLast4: "4242",
        status: "Paid"
      },
      shippingInfo: {
        address: "123 Main St, City, Country",
        method: "Express Shipping",
        carrier: "UPS",
        trackingNumber: "1Z999AA10123456784"
      },
      notes: "Please leave the package at the front door.",
      timeline: [
        { date: "2023-08-12 10:23", status: "Order Placed" },
        { date: "2023-08-12 14:45", status: "Payment Confirmed" },
        { date: "2023-08-13 09:15", status: "Shipped" },
        { date: "2023-08-15 13:20", status: "Delivered" }
      ]
    },
    {
      id: "ORD-5313",
      customer: {
        name: "Emma Smith",
        email: "emma@example.com",
        phone: "+1 (555) 234-5678",
      },
      date: "2023-08-15",
      status: "Processing",
      total: 89.50,
      subtotal: 79.50,
      tax: 5.00,
      shippingCost: 5.00,
      items: [
        { id: "3", name: "Smartphone X", price: 79.50, quantity: 1 }
      ],
      payment: {
        method: "PayPal",
        email: "emma@example.com",
        status: "Paid"
      },
      shippingInfo: {
        address: "456 Oak St, Town, Country",
        method: "Standard Shipping",
        carrier: "USPS",
        trackingNumber: "9400123456789012345678"
      },
      notes: "",
      timeline: [
        { date: "2023-08-15 09:10", status: "Order Placed" },
        { date: "2023-08-15 09:12", status: "Payment Confirmed" },
        { date: "2023-08-15 14:30", status: "Processing" }
      ]
    }
  ];

  // Simulate async behavior with a small delay
  await new Promise(resolve => setTimeout(resolve, 10));
  return orders.find(order => order.id === id) || orders[0];
}

// Define types
type OrderItem = {
  id: string;
  name: string;
  price: number;
  quantity: number;
};

type Order = {
  id: string;
  customer: {
    name: string;
    email: string;
    phone: string;
  };
  date: string;
  status: string;
  total: number;
  subtotal: number;
  tax: number;
  shippingCost: number;
  items: OrderItem[];
  payment: {
    method: string;
    cardLast4?: string;
    email?: string;
    status: string;
  };
  shippingInfo: {
    address: string;
    method: string;
    carrier: string;
    trackingNumber: string;
  };
  notes: string;
  timeline: {
    date: string;
    status: string;
  }[];
};

export default function OrderEditPage() {
  // Use the useParams hook to get the ID parameter from the URL
  const params = useParams();
  const orderId = params.id as string;
  
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        const orderData = await getOrderById(orderId);
        setOrder(orderData as Order);
      } catch (error) {
        console.error("Error fetching order:", error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchOrder();
  }, [orderId]);

  if (loading) {
    return (
      <MainLayout>
        <div className="flex h-full items-center justify-center">
          <p>Loading order details...</p>
        </div>
      </MainLayout>
    );
  }

  if (!order) {
    return (
      <MainLayout>
        <div className="flex h-full items-center justify-center">
          <p>Order not found</p>
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <div className="flex flex-col gap-5">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Link href="/orders" className="rounded-full w-8 h-8 flex items-center justify-center bg-muted hover:bg-muted/80">
              <ArrowLeft className="h-4 w-4" />
            </Link>
            <h1 className="text-3xl font-bold">Edit Order</h1>
          </div>
          <div className="flex gap-2">
            <Link href={`/orders/${orderId}/view`}>
              <Button variant="outline">View Order</Button>
            </Link>
            <Button>
              <Save className="mr-2 h-4 w-4" />
              Save Changes
            </Button>
          </div>
        </div>

        <div className="grid gap-5 grid-cols-1 md:grid-cols-3">
          <div className="md:col-span-2 space-y-5">
            <Card>
              <CardHeader>
                <CardTitle>Order Information</CardTitle>
                <CardDescription>
                  Basic order details
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="orderId">Order ID</Label>
                    <Input id="orderId" defaultValue={order.id} readOnly />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="date">Date</Label>
                    <Input id="date" type="date" defaultValue={order.date} />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="status">Status</Label>
                    <Select defaultValue={order.status}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select status" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Processing">Processing</SelectItem>
                        <SelectItem value="Shipped">Shipped</SelectItem>
                        <SelectItem value="Delivered">Delivered</SelectItem>
                        <SelectItem value="Cancelled">Cancelled</SelectItem>
                        <SelectItem value="Refunded">Refunded</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <div className="flex justify-between">
                  <div>
                    <CardTitle>Order Items</CardTitle>
                    <CardDescription>
                      Products in this order
                    </CardDescription>
                  </div>
                  <Button size="sm" variant="outline">
                    <Plus className="h-4 w-4 mr-2" />
                    Add Item
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {order.items.map((item, index) => (
                    <div key={index} className="flex items-center gap-4 border-b pb-4 last:border-0">
                      <div className="flex-1">
                        <div className="space-y-2">
                          <Label htmlFor={`item-name-${index}`}>Product</Label>
                          <Input id={`item-name-${index}`} defaultValue={item.name} />
                        </div>
                      </div>
                      <div className="w-24">
                        <div className="space-y-2">
                          <Label htmlFor={`item-price-${index}`}>Price</Label>
                          <Input id={`item-price-${index}`} type="number" step="0.01" defaultValue={item.price.toString()} />
                        </div>
                      </div>
                      <div className="w-20">
                        <div className="space-y-2">
                          <Label htmlFor={`item-qty-${index}`}>Qty</Label>
                          <Input id={`item-qty-${index}`} type="number" defaultValue={item.quantity.toString()} />
                        </div>
                      </div>
                      <div className="flex items-end pb-2">
                        <Button size="icon" variant="ghost" className="text-destructive hover:text-destructive">
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Order Summary</CardTitle>
                <CardDescription>
                  Price calculations
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="subtotal">Subtotal</Label>
                    <Input id="subtotal" type="number" step="0.01" defaultValue={order.subtotal.toString()} />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="tax">Tax</Label>
                    <Input id="tax" type="number" step="0.01" defaultValue={order.tax.toString()} />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="shipping">Shipping Cost</Label>
                    <Input id="shipping" type="number" step="0.01" defaultValue={order.shippingCost.toString()} />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="total">Total</Label>
                    <Input id="total" type="number" step="0.01" defaultValue={order.total.toString()} />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="space-y-5">
            <Card>
              <CardHeader>
                <CardTitle>Customer Details</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="customerName">Name</Label>
                  <Input id="customerName" defaultValue={order.customer.name} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="customerEmail">Email</Label>
                  <Input id="customerEmail" type="email" defaultValue={order.customer.email} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="customerPhone">Phone</Label>
                  <Input id="customerPhone" defaultValue={order.customer.phone} />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Shipping Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="shippingAddress">Address</Label>
                  <Textarea id="shippingAddress" defaultValue={order.shippingInfo.address} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="shippingMethod">Method</Label>
                  <Select defaultValue={order.shippingInfo.method}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select shipping method" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Standard Shipping">Standard Shipping</SelectItem>
                      <SelectItem value="Express Shipping">Express Shipping</SelectItem>
                      <SelectItem value="Next Day Delivery">Next Day Delivery</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="carrier">Carrier</Label>
                  <Input id="carrier" defaultValue={order.shippingInfo.carrier} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="trackingNumber">Tracking Number</Label>
                  <Input id="trackingNumber" defaultValue={order.shippingInfo.trackingNumber} />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Payment Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="paymentMethod">Method</Label>
                  <Select defaultValue={order.payment.method}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select payment method" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Credit Card">Credit Card</SelectItem>
                      <SelectItem value="PayPal">PayPal</SelectItem>
                      <SelectItem value="Bank Transfer">Bank Transfer</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                {order.payment.cardLast4 && (
                  <div className="space-y-2">
                    <Label htmlFor="cardLast4">Card (last 4)</Label>
                    <Input id="cardLast4" defaultValue={order.payment.cardLast4} />
                  </div>
                )}
                <div className="space-y-2">
                  <Label htmlFor="paymentStatus">Payment Status</Label>
                  <Select defaultValue={order.payment.status}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select payment status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Pending">Pending</SelectItem>
                      <SelectItem value="Paid">Paid</SelectItem>
                      <SelectItem value="Failed">Failed</SelectItem>
                      <SelectItem value="Refunded">Refunded</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Notes</CardTitle>
              </CardHeader>
              <CardContent>
                <Textarea rows={4} defaultValue={order.notes} placeholder="Add notes about this order" />
              </CardContent>
            </Card>
          </div>
        </div>

        <div className="flex justify-end gap-4 mt-4">
          <Button variant="outline">
            <Link href="/orders" className="flex items-center">Cancel</Link>
          </Button>
          <Button variant="destructive">Delete Order</Button>
          <Button>
            <Save className="mr-2 h-4 w-4" />
            Save Changes
          </Button>
        </div>
      </div>
    </MainLayout>
  );
} 