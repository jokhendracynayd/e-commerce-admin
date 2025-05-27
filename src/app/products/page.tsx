import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { PlusCircle } from "lucide-react";
import { MainLayout } from "@/components/MainLayout";
import Link from "next/link";

const products = [
  {
    id: "1",
    name: "Premium Headphones",
    category: "Electronics",
    price: 199.99,
    stock: 45,
    status: "In Stock",
  },
  {
    id: "2",
    name: "Ergonomic Chair",
    category: "Furniture",
    price: 249.99,
    stock: 12,
    status: "In Stock",
  },
  {
    id: "3",
    name: "Smartphone X",
    category: "Electronics",
    price: 899.99,
    stock: 0,
    status: "Out of Stock",
  },
  {
    id: "4",
    name: "Fitness Watch",
    category: "Wearables",
    price: 129.99,
    stock: 8,
    status: "Low Stock",
  },
  {
    id: "5",
    name: "Designer Backpack",
    category: "Fashion",
    price: 79.99,
    stock: 23,
    status: "In Stock",
  },
];

export default function ProductsPage() {
  return (
    <MainLayout>
      <div className="flex flex-col gap-5">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold">Products</h1>
          <Link href="/products/new">
            <Button>
              <PlusCircle className="mr-2 h-4 w-4" />
              Add Product
            </Button>
          </Link>
        </div>
        
        <Card>
          <CardHeader>
            <CardTitle>Product Management</CardTitle>
            <CardDescription>
              Manage your product inventory
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Category</TableHead>
                  <TableHead>Price</TableHead>
                  <TableHead>Stock</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {products.map((product) => (
                  <TableRow key={product.id}>
                    <TableCell className="font-medium">
                      <Link href={`/products/${product.id}/view`} className="hover:underline">
                        {product.name}
                      </Link>
                    </TableCell>
                    <TableCell>{product.category}</TableCell>
                    <TableCell>${product.price.toFixed(2)}</TableCell>
                    <TableCell>{product.stock}</TableCell>
                    <TableCell>
                      <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
                        product.status === "In Stock" 
                          ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300" 
                          : product.status === "Low Stock"
                          ? "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300"
                          : "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300"
                      }`}>
                        {product.status}
                      </span>
                    </TableCell>
                    <TableCell className="text-right space-x-2">
                      <Link href={`/products/${product.id}/view`} className="text-sm text-blue-600 hover:underline dark:text-blue-400">
                        View
                      </Link>
                      <Link href={`/products/${product.id}`} className="text-sm text-blue-600 hover:underline dark:text-blue-400">
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