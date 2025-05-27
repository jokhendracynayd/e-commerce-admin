import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { PlusCircle } from "lucide-react";
import { MainLayout } from "@/components/MainLayout";

const inventory = [
  {
    id: "INV001",
    name: "Premium Headphones",
    sku: "TECH-001",
    category: "Electronics",
    stock: 45,
    reserved: 5,
    reorderPoint: 10,
    status: "In Stock",
  },
  {
    id: "INV002",
    name: "Ergonomic Chair",
    sku: "FURN-002",
    category: "Furniture",
    stock: 12,
    reserved: 3,
    reorderPoint: 5,
    status: "In Stock",
  },
  {
    id: "INV003",
    name: "Smartphone X",
    sku: "TECH-003",
    category: "Electronics",
    stock: 0,
    reserved: 0,
    reorderPoint: 5,
    status: "Out of Stock",
  },
  {
    id: "INV004",
    name: "Fitness Watch",
    sku: "WEAR-004",
    category: "Wearables",
    stock: 8,
    reserved: 2,
    reorderPoint: 10,
    status: "Low Stock",
  },
  {
    id: "INV005",
    name: "Designer Backpack",
    sku: "FASH-005",
    category: "Fashion",
    stock: 23,
    reserved: 3,
    reorderPoint: 8,
    status: "In Stock",
  },
];

export default function InventoryPage() {
  return (
    <MainLayout>
      <div className="flex flex-col gap-5">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold">Inventory</h1>
          <Button>
            <PlusCircle className="mr-2 h-4 w-4" />
            Add Stock
          </Button>
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
                {inventory.filter(item => item.status === "Low Stock").length}
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Out of Stock</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {inventory.filter(item => item.status === "Out of Stock").length}
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Reserved Items</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {inventory.reduce((total, item) => total + item.reserved, 0)}
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
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>SKU</TableHead>
                  <TableHead>Category</TableHead>
                  <TableHead>Stock</TableHead>
                  <TableHead>Reserved</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {inventory.map((item) => (
                  <TableRow key={item.id}>
                    <TableCell className="font-medium">{item.name}</TableCell>
                    <TableCell>{item.sku}</TableCell>
                    <TableCell>{item.category}</TableCell>
                    <TableCell>{item.stock}</TableCell>
                    <TableCell>{item.reserved}</TableCell>
                    <TableCell>
                      <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
                        item.status === "In Stock" 
                          ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300" 
                          : item.status === "Low Stock"
                          ? "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300"
                          : "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300"
                      }`}>
                        {item.status}
                      </span>
                    </TableCell>
                    <TableCell className="text-right space-x-2">
                      <button className="text-sm text-blue-600 hover:underline dark:text-blue-400">
                        Update
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