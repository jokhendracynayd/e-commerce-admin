"use client";

import { MainLayout } from "@/components/MainLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Edit, Package, Truck, CreditCard, User } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { Badge } from "@/components/ui/badge";
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
    },
    {
      id: "ORD-5314",
      customer: {
        name: "Michael Johnson",
        email: "michael@example.com",
        phone: "+1 (555) 345-6789",
      },
      date: "2023-08-14",
      status: "Shipped",
      total: 354.25,
      subtotal: 329.25,
      tax: 20.00,
      shippingCost: 5.00,
      items: [
        { id: "2", name: "Ergonomic Chair", price: 249.99, quantity: 1 },
        { id: "4", name: "Fitness Watch", price: 79.99, quantity: 1 }
      ],
      payment: {
        method: "Credit Card",
        cardLast4: "1234",
        status: "Paid"
      },
      shippingInfo: {
        address: "789 Pine St, Village, Country",
        method: "Standard Shipping",
        carrier: "FedEx",
        trackingNumber: "799123456123"
      },
      notes: "",
      timeline: [
        { date: "2023-08-14 11:05", status: "Order Placed" },
        { date: "2023-08-14 11:10", status: "Payment Confirmed" },
        { date: "2023-08-14 15:30", status: "Shipped" }
      ]
    },
    {
      id: "ORD-5315",
      customer: {
        name: "Sophia Williams",
        email: "sophia@example.com",
        phone: "+1 (555) 456-7890",
      },
      date: "2023-08-13",
      status: "Delivered",
      total: 42.99,
      subtotal: 39.99,
      tax: 3.00,
      shippingCost: 0,
      items: [
        { id: "5", name: "Designer Backpack", price: 39.99, quantity: 1 }
      ],
      payment: {
        method: "Credit Card",
        cardLast4: "5678",
        status: "Paid"
      },
      shippingInfo: {
        address: "101 Elm St, Suburb, Country",
        method: "Express Shipping",
        carrier: "DHL",
        trackingNumber: "DHL123456789"
      },
      notes: "",
      timeline: [
        { date: "2023-08-12 13:45", status: "Order Placed" },
        { date: "2023-08-12 13:50", status: "Payment Confirmed" },
        { date: "2023-08-12 16:15", status: "Shipped" },
        { date: "2023-08-13 10:30", status: "Delivered" }
      ]
    },
    {
      id: "ORD-5316",
      customer: {
        name: "Robert Brown",
        email: "robert@example.com",
        phone: "+1 (555) 567-8901",
      },
      date: "2023-08-12",
      status: "Cancelled",
      total: 210.75,
      subtotal: 199.99,
      tax: 10.76,
      shippingCost: 0,
      items: [
        { id: "1", name: "Premium Headphones", price: 89.99, quantity: 1 },
        { id: "2", name: "Ergonomic Chair", price: 110.00, quantity: 1 }
      ],
      payment: {
        method: "Credit Card",
        cardLast4: "9012",
        status: "Refunded"
      },
      shippingInfo: {
        address: "202 Maple St, City, Country",
        method: "Standard Shipping",
        carrier: "",
        trackingNumber: ""
      },
      notes: "Customer requested cancellation due to ordering incorrect item.",
      timeline: [
        { date: "2023-08-12 09:15", status: "Order Placed" },
        { date: "2023-08-12 09:20", status: "Payment Confirmed" },
        { date: "2023-08-12 11:30", status: "Cancelled" },
        { date: "2023-08-12 14:45", status: "Refunded" }
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

export default function OrderViewPage() {
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

  // Function to get the status color
  const getStatusColor = (status: string) => {
    switch (status) {
      case "Delivered":
        return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300";
      case "Processing":
        return "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300";
      case "Shipped":
        return "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300";
      case "Cancelled":
        return "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300";
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300";
    }
  };

  return (
    <MainLayout>
      <div className="flex flex-col gap-5">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Link href="/orders" className="rounded-full w-8 h-8 flex items-center justify-center bg-muted hover:bg-muted/80">
              <ArrowLeft className="h-4 w-4" />
            </Link>
            <h1 className="text-3xl font-bold">Order Details</h1>
          </div>
          <Link href={`/orders/${orderId}`}>
            <Button>
              <Edit className="mr-2 h-4 w-4" />
              Edit Order
            </Button>
          </Link>
        </div>

        <div className="flex flex-col md:flex-row gap-5">
          <Card className="flex-1">
            <CardHeader>
              <div className="flex justify-between items-start">
                <div>
                  <CardTitle className="text-2xl">{order.id}</CardTitle>
                  <p className="text-sm text-muted-foreground mt-1">Placed on {order.date}</p>
                </div>
                <Badge className={getStatusColor(order.status)}>
                  {order.status}
                </Badge>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-medium mb-3">Items</h3>
                  <div className="space-y-3">
                    {order.items.map((item) => (
                      <div key={item.id} className="flex justify-between items-center border-b pb-3 last:border-0">
                        <div className="flex items-center gap-3">
                          <div className="h-12 w-12 rounded-md bg-muted flex items-center justify-center">
                            <Package className="h-6 w-6 text-muted-foreground" />
                          </div>
                          <div>
                            <p className="font-medium">{item.name}</p>
                            <p className="text-sm text-muted-foreground">Qty: {item.quantity}</p>
                          </div>
                        </div>
                        <span className="font-medium">${item.price.toFixed(2)}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div>
                  <h3 className="text-lg font-medium mb-3">Order Summary</h3>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Subtotal</span>
                      <span>${order.subtotal.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Tax</span>
                      <span>${order.tax.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Shipping</span>
                      <span>${order.shippingCost.toFixed(2)}</span>
                    </div>
                    <Separator />
                    <div className="flex justify-between font-bold">
                      <span>Total</span>
                      <span>${order.total.toFixed(2)}</span>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <div className="space-y-5 md:w-96">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <User className="h-5 w-5" />
                  Customer Information
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-1">
                  <p className="font-medium">{order.customer.name}</p>
                  <p className="text-sm text-muted-foreground">{order.customer.email}</p>
                  <p className="text-sm text-muted-foreground">{order.customer.phone}</p>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Truck className="h-5 w-5" />
                  Shipping Information
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div>
                    <p className="text-sm text-muted-foreground">Address</p>
                    <p>{order.shippingInfo.address}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Method</p>
                    <p>{order.shippingInfo.method}</p>
                  </div>
                  {order.shippingInfo.trackingNumber && (
                    <div>
                      <p className="text-sm text-muted-foreground">Tracking</p>
                      <p>
                        {order.shippingInfo.carrier}: {order.shippingInfo.trackingNumber}
                      </p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <CreditCard className="h-5 w-5" />
                  Payment Information
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div>
                    <p className="text-sm text-muted-foreground">Method</p>
                    <p>{order.payment.method}</p>
                  </div>
                  {order.payment.cardLast4 && (
                    <div>
                      <p className="text-sm text-muted-foreground">Card</p>
                      <p>**** **** **** {order.payment.cardLast4}</p>
                    </div>
                  )}
                  <div>
                    <p className="text-sm text-muted-foreground">Status</p>
                    <p className={order.payment.status === "Paid" ? "text-green-600" : order.payment.status === "Refunded" ? "text-amber-600" : "text-red-600"}>
                      {order.payment.status}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Order Timeline</CardTitle>
          </CardHeader>
          <CardContent>
            <ol className="relative border-l border-gray-200 dark:border-gray-700">
              {order.timeline.map((event, index) => (
                <li key={index} className="mb-6 ml-6 last:mb-0">
                  <span className="absolute flex items-center justify-center w-6 h-6 bg-primary rounded-full -left-3 ring-8 ring-background">
                    <span className="h-2.5 w-2.5 rounded-full bg-primary-foreground" />
                  </span>
                  <h3 className="flex items-center mb-1 font-medium">{event.status}</h3>
                  <time className="block mb-2 text-sm text-muted-foreground">{event.date}</time>
                </li>
              ))}
            </ol>
          </CardContent>
        </Card>

        {order.notes && (
          <Card>
            <CardHeader>
              <CardTitle>Notes</CardTitle>
            </CardHeader>
            <CardContent>
              <p>{order.notes}</p>
            </CardContent>
          </Card>
        )}
      </div>
    </MainLayout>
  );
} 