"use client";

import { MainLayout } from "@/components/MainLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Edit, Package, Truck, CreditCard, User, RefreshCw } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { useToast } from "@/components/ui/use-toast";
import ordersService from "@/services/ordersService";
import { Order, OrderStatus, PaymentStatus } from "@/types/order";
import { formatCurrency } from "@/lib/utils";

export default function OrderViewPage() {
  // Use the useParams hook to get the ID parameter from the URL
  const params = useParams();
  const orderId = params.id as string;
  
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        setLoading(true);
        setError(null);
        
        const response = await ordersService.getOrderById(orderId);
        
        if (response.success) {
          setOrder(response.data);
        } else {
          setError(response.error || "Failed to load order details");
          toast({
            title: "Error",
            description: response.error || "Failed to load order details",
            variant: "destructive",
          });
        }
      } catch (err: any) {
        console.error("Error fetching order:", err);
        setError(err.message || "An unexpected error occurred");
        toast({
          title: "Error",
          description: "Failed to load order details",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };
    
    if (orderId) {
      fetchOrder();
    }
  }, [orderId, toast]);

  // Format customer name
  const formatCustomerName = (order: Order) => {
    if (order.user) {
      const fullName = `${order.user.firstName || ''} ${order.user.lastName || ''}`.trim();
      return fullName || order.user.email;
    }
    return 'Guest Customer';
  };

  // Format customer email
  const getCustomerEmail = (order: Order) => {
    return order.user?.email || 'N/A';
  };

  // Format date
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };



  // Format address
  const formatAddress = (address: any) => {
    if (typeof address === 'string') return address;
    if (!address) return 'N/A';
    
    const parts = [
      address.street,
      address.city,
      address.state,
      address.zipCode,
      address.country
    ].filter(Boolean);
    
    return parts.join(', ');
  };

  // Get status badge configuration
  const getOrderStatusBadge = (status: OrderStatus) => {
    const config = ordersService.getOrderStatusBadgeConfig(status);
    return (
      <Badge className={config.color}>
        {config.label}
      </Badge>
    );
  };

  // Get payment status badge configuration
  const getPaymentStatusBadge = (status: PaymentStatus) => {
    const config = ordersService.getPaymentStatusBadgeConfig(status);
    return config;
  };

  if (loading) {
    return (
      <MainLayout>
        <div className="flex h-full items-center justify-center">
          <RefreshCw className="h-8 w-8 animate-spin mr-2" />
          <p>Loading order details...</p>
        </div>
      </MainLayout>
    );
  }

  if (error || !order) {
    return (
      <MainLayout>
        <div className="flex flex-col items-center justify-center h-64 gap-4">
          <p className="text-red-600">{error || "Order not found"}</p>
          <div className="flex gap-2">
            <Link href="/orders">
              <Button variant="outline">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back to Orders
              </Button>
            </Link>
            <Button onClick={() => window.location.reload()}>
              <RefreshCw className="mr-2 h-4 w-4" />
              Try Again
            </Button>
          </div>
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
                  <CardTitle className="text-2xl">{order.orderNumber}</CardTitle>
                  <p className="text-sm text-muted-foreground mt-1">
                    Placed on {formatDate(order.placedAt)}
                  </p>
                </div>
                {getOrderStatusBadge(order.status)}
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-medium mb-3">Items ({order.items.length})</h3>
                  <div className="space-y-3">
                    {order.items.map((item) => (
                      <div key={item.id} className="flex justify-between items-center border-b pb-3 last:border-0">
                        <div className="flex items-center gap-3">
                          <div className="h-12 w-12 rounded-md bg-muted flex items-center justify-center">
                            {item.product?.imageUrl ? (
                              <img 
                                src={item.product.imageUrl} 
                                alt={item.product.title || 'Product'} 
                                className="h-12 w-12 rounded-md object-cover"
                              />
                            ) : (
                              <Package className="h-6 w-6 text-muted-foreground" />
                            )}
                          </div>
                          <div>
                            <p className="font-medium">
                              {item.product?.title || 'Product'}
                            </p>
                            <p className="text-sm text-muted-foreground">
                              Qty: {item.quantity} × {formatCurrency(item.unitPrice,item.currency)}
                            </p>
                            {item.variant && (
                              <p className="text-xs text-muted-foreground">
                                Variant: {item.variant.variantName}
                              </p>
                            )}
                          </div>
                        </div>
                        <span className="font-medium">{formatCurrency(item.totalPrice,item.currency)}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div>
                  <h3 className="text-lg font-medium mb-3">Order Summary</h3>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Subtotal</span>
                      <span>{formatCurrency(order.subtotal,order.currency)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Tax</span>
                      <span>{formatCurrency(order.tax,order.currency)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Shipping</span>
                      <span>{formatCurrency(order.shippingFee,order.currency)}</span>
                    </div>
                    {order.discount > 0 && (
                      <div className="flex justify-between text-green-600">
                        <span>Discount</span>
                        <span>-{formatCurrency(order.discount,order.currency)}</span>
                      </div>
                    )}
                    <Separator />
                    <div className="flex justify-between font-bold">
                      <span>Total</span>
                      <span>{formatCurrency(order.total,order.currency)}</span>
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
                  <p className="font-medium">{formatCustomerName(order)}</p>
                  <p className="text-sm text-muted-foreground">{getCustomerEmail(order)}</p>
                  {order.user?.id && (
                    <p className="text-xs text-muted-foreground">ID: {order.user.id}</p>
                  )}
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
                    <p className="text-sm text-muted-foreground">Shipping Address</p>
                    <p>{formatAddress(order.shippingAddress)}</p>
                  </div>
                  {order.billingAddress && (
                    <div>
                      <p className="text-sm text-muted-foreground">Billing Address</p>
                      <p>{formatAddress(order.billingAddress)}</p>
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
                    <p>{order.paymentMethod || 'N/A'}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Payment Status</p>
                    <p className={
                      order.paymentStatus === PaymentStatus.PAID 
                        ? "text-green-600" 
                        : order.paymentStatus === PaymentStatus.REFUNDED 
                        ? "text-amber-600" 
                        : order.paymentStatus === PaymentStatus.FAILED
                        ? "text-red-600"
                        : "text-gray-600"
                    }>
                      {getPaymentStatusBadge(order.paymentStatus).label}
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
            <CardDescription>
              Track the progress of this order
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ol className="relative border-l border-gray-200 dark:border-gray-700">
              <li className="mb-6 ml-6">
                <span className="absolute flex items-center justify-center w-6 h-6 bg-primary rounded-full -left-3 ring-8 ring-background">
                  <span className="h-2.5 w-2.5 rounded-full bg-primary-foreground" />
                </span>
                <h3 className="flex items-center mb-1 font-medium">Order Placed</h3>
                <time className="block mb-2 text-sm text-muted-foreground">
                  {formatDate(order.placedAt)}
                </time>
              </li>
              {order.updatedAt !== order.placedAt && (
                <li className="mb-6 ml-6">
                  <span className="absolute flex items-center justify-center w-6 h-6 bg-primary rounded-full -left-3 ring-8 ring-background">
                    <span className="h-2.5 w-2.5 rounded-full bg-primary-foreground" />
                  </span>
                  <h3 className="flex items-center mb-1 font-medium">Last Updated</h3>
                  <time className="block mb-2 text-sm text-muted-foreground">
                    {formatDate(order.updatedAt)}
                  </time>
                </li>
              )}
              <li className="ml-6">
                <span className="absolute flex items-center justify-center w-6 h-6 bg-primary rounded-full -left-3 ring-8 ring-background">
                  <span className="h-2.5 w-2.5 rounded-full bg-primary-foreground" />
                </span>
                <h3 className="flex items-center mb-1 font-medium">Current Status</h3>
                <div className="mb-2">
                  {getOrderStatusBadge(order.status)}
                </div>
              </li>
            </ol>
          </CardContent>
        </Card>
      </div>
    </MainLayout>
  );
} 