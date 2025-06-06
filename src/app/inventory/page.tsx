"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { PlusCircle, RefreshCw, AlertTriangle } from "lucide-react";
import { MainLayout } from "@/components/MainLayout";
import { inventoryApi, InventoryItem } from "@/lib/api/inventory-api";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";

export default function InventoryPage() {
  const [inventory, setInventory] = useState<InventoryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchInventory = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await inventoryApi.getInventory();
      setInventory(data);
    } catch (err: any) {
      console.error("Error fetching inventory:", err);
      setError(err.message || "Failed to load inventory data");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchInventory();
  }, []);

  // Calculate derived values for summary cards
  const lowStockCount = inventory.filter(item => item.isLowStock).length;
  const outOfStockCount = inventory.filter(item => item.stockQuantity === 0).length;
  const reservedItemsCount = inventory.reduce((total, item) => total + item.reservedQuantity, 0);

  // Get inventory status
  const getInventoryStatus = (item: InventoryItem) => {
    if (item.stockQuantity === 0) return "Out of Stock";
    if (item.isLowStock) return "Low Stock";
    return "In Stock";
  };

  // Get status badge class
  const getStatusBadgeVariant = (status: string) => {
    switch (status) {
      case "Out of Stock":
        return "destructive";
      case "Low Stock":
        return "secondary";
      default:
        return "outline";
    }
  };

  return (
    <MainLayout>
      <div className="flex flex-col gap-5">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold">Inventory</h1>
          <div className="flex gap-2">
            <Button variant="outline" onClick={fetchInventory} disabled={loading}>
              <RefreshCw className={`mr-2 h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
              Refresh
            </Button>
            <Button>
              <PlusCircle className="mr-2 h-4 w-4" />
              Add Stock
            </Button>
          </div>
        </div>
        
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Total Products</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{inventory.length}</div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Low Stock Items</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {lowStockCount}
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Out of Stock</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {outOfStockCount}
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Reserved Items</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {reservedItemsCount}
              </div>
            </CardContent>
          </Card>
        </div>
        
        <Card>
          <CardHeader>
            <CardTitle>Inventory Management</CardTitle>
            <CardDescription>
              Track and update your product inventory
            </CardDescription>
          </CardHeader>
          <CardContent>
            {error ? (
              <div className="flex flex-col items-center justify-center py-8 text-center">
                <AlertTriangle className="h-10 w-10 text-destructive mb-2" />
                <h3 className="text-lg font-semibold">Error loading inventory</h3>
                <p className="text-muted-foreground">{error}</p>
                <Button variant="outline" onClick={fetchInventory} className="mt-4">
                  Try Again
                </Button>
              </div>
            ) : loading ? (
              <div className="flex justify-center items-center py-8">
                <div className="flex flex-col items-center gap-2">
                  <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
                  <p>Loading inventory data...</p>
                </div>
              </div>
            ) : inventory.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-8 text-center">
                <h3 className="text-lg font-semibold">No inventory items found</h3>
                <p className="text-muted-foreground">Add stock to create inventory items</p>
              </div>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Product</TableHead>
                    <TableHead>SKU</TableHead>
                    <TableHead>Stock</TableHead>
                    <TableHead>Reserved</TableHead>
                    <TableHead>Available</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {inventory.map((item) => {
                    const status = getInventoryStatus(item);
                    const badgeVariant = getStatusBadgeVariant(status);
                    
                    return (
                      <TableRow key={item.id}>
                        <TableCell className="font-medium">
                          {item.product?.title || (item.variant ? `${item.product?.title} - ${item.variant.variantName}` : 'Unknown Product')}
                        </TableCell>
                        <TableCell>{item.product?.sku || item.variant?.sku}</TableCell>
                        <TableCell>{item.stockQuantity}</TableCell>
                        <TableCell>{item.reservedQuantity}</TableCell>
                        <TableCell>{item.availableQuantity}</TableCell>
                        <TableCell>
                          <Badge variant={badgeVariant}>{status}</Badge>
                        </TableCell>
                        <TableCell className="text-right space-x-2">
                          <Link href={`/inventory/${item.productId}`}>
                            <Button variant="link" className="h-auto p-0">
                              Update
                            </Button>
                          </Link>
                          <Link href={`/inventory/${item.productId}`}>
                            <Button variant="link" className="h-auto p-0 text-destructive">
                              History
                            </Button>
                          </Link>
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            )}
          </CardContent>
        </Card>
      </div>
    </MainLayout>
  );
} 