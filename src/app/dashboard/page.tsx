"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart3, Box, DollarSign, ShoppingCart, TrendingUp, Users, RefreshCw, Currency } from "lucide-react";
import { MainLayout } from "@/components/MainLayout";
import { useToast } from "@/components/ui/use-toast";
import ordersService from "@/services/ordersService";
import { Order } from "@/types/order";
import Link from "next/link";
import { formatCurrency } from "@/lib/utils";

export default function DashboardPage() {
  const [recentOrders, setRecentOrders] = useState<Order[]>([]);
  const [ordersLoading, setOrdersLoading] = useState(true);
  const { toast } = useToast();

  // Fetch recent orders
  const fetchRecentOrders = async () => {
    try {
      setOrdersLoading(true);
      
      const response = await ordersService.getOrders({
        limit: 5,
        sortBy: 'placedAt',
        sortOrder: 'desc'
      });
      
      if (response.success) {
        setRecentOrders(response.data.orders);
      } else {
        console.error("Failed to load recent orders:", response.error);
        toast({
          title: "Error",
          description: "Failed to load recent orders",
          variant: "destructive",
        });
      }
    } catch (err: any) {
      console.error("Error fetching recent orders:", err);
      toast({
        title: "Error",
        description: "Failed to load recent orders",
        variant: "destructive",
      });
    } finally {
      setOrdersLoading(false);
    }
  };

  useEffect(() => {
    fetchRecentOrders();
  }, []);

  // Format customer name
  const formatCustomerName = (order: Order) => {
    if (order.user) {
      const fullName = `${order.user.firstName || ''} ${order.user.lastName || ''}`.trim();
      return fullName || order.user.email;
    }
    return 'Guest Customer';
  };



  return (
    <MainLayout>
      <div className="flex flex-col gap-5">
        <h1 className="text-3xl font-bold">Dashboard</h1>
        
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
              <DollarSign className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">$45,231.89</div>
              <p className="text-xs text-muted-foreground">
                +20.1% from last month
              </p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Orders</CardTitle>
              <ShoppingCart className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">+2350</div>
              <p className="text-xs text-muted-foreground">
                +10.5% from last month
              </p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Products</CardTitle>
              <Box className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">1,234</div>
              <p className="text-xs text-muted-foreground">
                +12 new products added
              </p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Active Users</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">573</div>
              <p className="text-xs text-muted-foreground">
                +5.2% from last week
              </p>
            </CardContent>
          </Card>
        </div>

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
          <Card className="lg:col-span-4">
            <CardHeader>
              <CardTitle>Sales Overview</CardTitle>
              <CardDescription>
                Monthly sales performance
              </CardDescription>
            </CardHeader>
            <CardContent className="h-[300px]">
              <div className="flex h-full items-center justify-center text-muted-foreground">
                Chart will be implemented with Recharts
              </div>
            </CardContent>
          </Card>
          
          <Card className="lg:col-span-3">
            <CardHeader>
              <CardTitle>Recent Orders</CardTitle>
              <CardDescription>
                Latest 5 orders
              </CardDescription>
            </CardHeader>
            <CardContent>
              {ordersLoading ? (
                <div className="flex items-center justify-center h-32">
                  <RefreshCw className="h-6 w-6 animate-spin text-muted-foreground" />
                  <span className="ml-2 text-muted-foreground">Loading orders...</span>
                </div>
              ) : recentOrders.length === 0 ? (
                <div className="flex items-center justify-center h-32">
                  <p className="text-muted-foreground">No recent orders found</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {recentOrders.map((order) => (
                    <div key={order.id} className="flex items-center gap-4">
                      <div className="rounded-full bg-primary/10 p-2">
                        <ShoppingCart className="h-4 w-4 text-primary" />
                      </div>
                      <div className="flex-1">
                        <p className="text-sm font-medium">
                          <Link 
                            href={`/orders/${order.id}/view`} 
                            className="hover:underline"
                          >
                            {order.orderNumber}
                          </Link>
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {formatCustomerName(order)}
                        </p>
                      </div>
                      <div className="text-sm font-medium">
                        {formatCurrency(order.total,order.currency)}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </MainLayout>
  );
} 