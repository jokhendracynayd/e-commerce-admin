"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { PlusCircle, RefreshCw, AlertTriangle, Search, X } from "lucide-react";
import { MainLayout } from "@/components/MainLayout";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/components/ui/use-toast";
import Link from "next/link";

// Import from our types and services
import { InventoryItem, InventoryStats, InventoryStatus } from "@/types/inventory";
import { inventoryService } from "@/services/inventoryService";
import { AddStockModal } from "@/components/inventory/AddStockModal";

export default function InventoryPage() {
  const [inventory, setInventory] = useState<InventoryItem[]>([]);
  const [filteredInventory, setFilteredInventory] = useState<InventoryItem[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [stats, setStats] = useState<InventoryStats>({
    total: 0,
    lowStock: 0,
    outOfStock: 0,
    reserved: 0
  });
  const [isAddStockModalOpen, setIsAddStockModalOpen] = useState(false);
  const { toast } = useToast();

  // Fetch inventory data
  const fetchInventory = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await inventoryService.getInventory();
      
      if (response.success) {
        setInventory(response.data);
        setFilteredInventory(response.data);
        setStats(inventoryService.getInventoryStats(response.data));
      } else {
        setError(response.error || "Failed to load inventory data");
        toast({
          title: "Error",
          description: response.error || "Failed to load inventory data",
          variant: "destructive",
        });
      }
    } catch (err: any) {
      console.error("Error fetching inventory:", err);
      setError(err.message || "An unexpected error occurred");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchInventory();
  }, []);

  // Handle search
  useEffect(() => {
    if (searchQuery) {
      const lowerQuery = searchQuery.toLowerCase();
      const filtered = inventory.filter(item => 
        (item.title || '').toLowerCase().includes(lowerQuery) ||
        (item.sku || '').toLowerCase().includes(lowerQuery) ||
        (item.variant?.variantName || '').toLowerCase().includes(lowerQuery) ||
        item.productId.toLowerCase().includes(lowerQuery)
      );
      setFilteredInventory(filtered);
    } else {
      setFilteredInventory(inventory);
    }
  }, [searchQuery, inventory]);

  // Get inventory status
  const getInventoryStatus = (item: InventoryItem): InventoryStatus => {
    return inventoryService.getInventoryStatus(item);
  };

  // Get status badge class
  const getStatusBadgeVariant = (status: InventoryStatus) => {
    switch (status) {
      case "Out of Stock":
        return "destructive";
      case "Low Stock":
        return "secondary";
      default:
        return "outline";
    }
  };

  // Handle add stock success
  const handleAddStockSuccess = () => {
    fetchInventory();
    toast({
      title: "Stock Added",
      description: "The inventory has been updated successfully",
    });
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
            <Button
              onClick={() => setIsAddStockModalOpen(true)}
              variant="default"
              size="default"
              className="bg-green-600 hover:bg-green-700 text-white"
            >
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
              <div className="text-2xl font-bold">{stats.total}</div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Low Stock Items</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {stats.lowStock}
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Out of Stock</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {stats.outOfStock}
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Reserved Items</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {stats.reserved}
              </div>
            </CardContent>
          </Card>
        </div>
        
        <Card>
          <CardHeader>
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div>
                <CardTitle>Inventory Management</CardTitle>
                <CardDescription>
                  Track and update your product inventory
                </CardDescription>
              </div>
              <div className="relative w-full md:w-64">
                <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search inventory..."
                  className="pl-8 pr-8"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
                {searchQuery && (
                  <button 
                    className="absolute right-2 top-2.5 h-4 w-4 text-muted-foreground cursor-pointer"
                    onClick={() => setSearchQuery('')}
                  >
                    <X className="h-4 w-4" />
                  </button>
                )}
              </div>
            </div>
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
            ) : filteredInventory.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-8 text-center">
                {searchQuery ? (
                  <>
                    <h3 className="text-lg font-semibold">No matching inventory items</h3>
                    <p className="text-muted-foreground">Try a different search term</p>
                  </>
                ) : (
                  <>
                    <h3 className="text-lg font-semibold">No inventory items found</h3>
                    <p className="text-muted-foreground">Add stock to create inventory items</p>
                    <Button onClick={() => setIsAddStockModalOpen(true)} className="mt-4">
                      Add Your First Item
                    </Button>
                  </>
                )}
              </div>
            ) : (
              <div className="overflow-x-auto">
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
                    {filteredInventory.map((item) => {
                      const status = getInventoryStatus(item);
                      const badgeVariant = getStatusBadgeVariant(status);
                      
                      return (
                        <TableRow key={item.id}>
                          <TableCell className="font-medium">
                            {item.title || (item.product?.title) || 'Unknown Product'}
                          </TableCell>
                          <TableCell>{item.sku || item.product?.sku || item.variant?.sku || 'N/A'}</TableCell>
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
              </div>
            )}
          </CardContent>
        </Card>
      </div>
      
      {/* Add Stock Modal */}
      <AddStockModal
        isOpen={isAddStockModalOpen}
        onClose={() => setIsAddStockModalOpen(false)}
        onSuccess={handleAddStockSuccess}
      />
    </MainLayout>
  );
} 