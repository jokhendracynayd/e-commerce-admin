"use client";

import { MainLayout } from "@/components/MainLayout";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Edit, UserRound } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";

// This is a mock function to simulate fetching user data by ID
async function getUserById(id: string) {
  const users = [
    {
      id: "1",
      name: "John Doe",
      email: "john@example.com",
      role: "Admin",
      status: "Active",
      phone: "+1 (555) 123-4567",
      address: "123 Main St, City, Country",
      joinDate: "2023-01-15",
      lastLogin: "2023-08-15 09:45",
      orders: 12,
      totalSpent: 2450.75,
    },
    {
      id: "2",
      name: "Jane Smith",
      email: "jane@example.com",
      role: "Manager",
      status: "Active",
      phone: "+1 (555) 234-5678",
      address: "456 Oak St, Town, Country",
      joinDate: "2023-02-20",
      lastLogin: "2023-08-14 14:22",
      orders: 8,
      totalSpent: 1580.25,
    },
    // Other users would be here in a real application
  ];

  // Simulate async behavior with a small delay
  await new Promise(resolve => setTimeout(resolve, 10));
  return users.find(user => user.id === id) || users[0];
}

// Define a type for the user
type User = {
  id: string;
  name: string;
  email: string;
  role: string;
  status: string;
  phone: string;
  address: string;
  joinDate: string;
  lastLogin: string;
  orders: number;
  totalSpent: number;
};

export default function UserViewPage() {
  // Use the useParams hook to get the ID parameter from the URL
  const params = useParams();
  const userId = params.id as string;
  
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const userData = await getUserById(userId);
        setUser(userData);
      } catch (error) {
        console.error("Error fetching user:", error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchUser();
  }, [userId]);

  if (loading) {
    return (
      <MainLayout>
        <div className="flex h-full items-center justify-center">
          <p>Loading user details...</p>
        </div>
      </MainLayout>
    );
  }

  if (!user) {
    return (
      <MainLayout>
        <div className="flex h-full items-center justify-center">
          <p>User not found</p>
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <div className="flex flex-col gap-5">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Link href="/users" className="rounded-full w-8 h-8 flex items-center justify-center bg-muted hover:bg-muted/80">
              <ArrowLeft className="h-4 w-4" />
            </Link>
            <h1 className="text-3xl font-bold">User Details</h1>
          </div>
          <Link href={`/users/${userId}`}>
            <Button>
              <Edit className="mr-2 h-4 w-4" />
              Edit User
            </Button>
          </Link>
        </div>

        <div className="grid gap-5 md:grid-cols-3">
          <Card className="md:col-span-1">
            <CardHeader>
              <CardTitle>Profile</CardTitle>
            </CardHeader>
            <CardContent className="flex flex-col items-center">
              <div className="w-24 h-24 rounded-full bg-muted flex items-center justify-center mb-4">
                <UserRound className="h-12 w-12 text-muted-foreground" />
              </div>
              <h2 className="text-xl font-bold">{user.name}</h2>
              <p className="text-muted-foreground">{user.email}</p>
              <div className="mt-2">
                <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium 
                  ${
                    user.status === "Active" 
                      ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300" 
                      : "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300"
                  }`}>
                  {user.status}
                </span>
              </div>
            </CardContent>
          </Card>

          <Card className="md:col-span-2">
            <CardHeader>
              <CardTitle>User Information</CardTitle>
              <CardDescription>
                Detailed user profile information
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-y-4">
                <div>
                  <h3 className="text-sm font-medium text-muted-foreground">Role</h3>
                  <p>{user.role}</p>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-muted-foreground">Join Date</h3>
                  <p>{user.joinDate}</p>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-muted-foreground">Phone</h3>
                  <p>{user.phone}</p>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-muted-foreground">Last Login</h3>
                  <p>{user.lastLogin}</p>
                </div>
                <div className="md:col-span-2">
                  <h3 className="text-sm font-medium text-muted-foreground">Address</h3>
                  <p>{user.address}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Activity</CardTitle>
              <CardDescription>
                User activity information
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <h3 className="text-sm font-medium text-muted-foreground">Orders Placed</h3>
                  <p className="text-2xl font-bold">{user.orders}</p>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-muted-foreground">Total Spent</h3>
                  <p className="text-2xl font-bold">${user.totalSpent.toFixed(2)}</p>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-muted-foreground">Last Login</h3>
                  <p>{user.lastLogin}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="md:col-span-2">
            <CardHeader>
              <CardTitle>Recent Orders</CardTitle>
              <CardDescription>
                Last 5 orders placed by user
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {[...Array(3)].map((_, i) => (
                  <div key={i} className="flex items-center justify-between border-b pb-2 last:border-0">
                    <div>
                      <p className="font-medium">Order #{user.id}0{i + 1}</p>
                      <p className="text-sm text-muted-foreground">{new Date(Date.now() - (i * 7 * 24 * 60 * 60 * 1000)).toISOString().split('T')[0]}</p>
                    </div>
                    <div className="text-right">
                      <p className="font-medium">${(Math.random() * 500 + 50).toFixed(2)}</p>
                      <span className="inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300">
                        Completed
                      </span>
                    </div>
                  </div>
                ))}
              </div>
              <div className="mt-4">
                <Button variant="outline" size="sm" className="w-full">View All Orders</Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </MainLayout>
  );
} 