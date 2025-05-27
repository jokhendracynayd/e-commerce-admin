"use client";

import { MainLayout } from "@/components/MainLayout";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Save } from "lucide-react";
import Link from "next/link";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";

// This is a mock function to simulate fetching product data by ID
async function getProductById(id: string) {
  const products = [
    {
      id: "1",
      name: "Premium Headphones",
      category: "Electronics",
      price: 199.99,
      stock: 45,
      status: "In Stock",
      description: "High-quality noise-cancelling headphones with premium sound quality.",
      sku: "TECH-001",
      images: ["headphones.jpg"],
      dimensions: { length: 8, width: 6, height: 3 },
      weight: 0.65,
      features: ["Noise Cancellation", "Bluetooth 5.0", "40h Battery Life"],
      brand: "AudioTech",
    },
    {
      id: "2",
      name: "Ergonomic Chair",
      category: "Furniture",
      price: 249.99,
      stock: 12,
      status: "In Stock",
      description: "Comfortable ergonomic chair with adjustable height and lumbar support.",
      sku: "FURN-002",
      images: ["chair.jpg"],
      dimensions: { length: 24, width: 22, height: 42 },
      weight: 15.2,
      features: ["Adjustable Height", "Lumbar Support", "Breathable Mesh"],
      brand: "ComfortPlus",
    },
    {
      id: "3",
      name: "Smartphone X",
      category: "Electronics",
      price: 899.99,
      stock: 0,
      status: "Out of Stock",
      description: "Latest smartphone with high-end features and advanced camera system.",
      sku: "TECH-003",
      images: ["smartphone.jpg"],
      dimensions: { length: 6, width: 3, height: 0.4 },
      weight: 0.18,
      features: ["5G", "Triple Camera", "AMOLED Display"],
      brand: "TechGiant",
    },
    {
      id: "4",
      name: "Fitness Watch",
      category: "Wearables",
      price: 129.99,
      stock: 8,
      status: "Low Stock",
      description: "Smart fitness tracker with heart rate monitoring and GPS.",
      sku: "WEAR-004",
      images: ["watch.jpg"],
      dimensions: { length: 1.6, width: 1.4, height: 0.5 },
      weight: 0.05,
      features: ["Heart Rate Monitor", "GPS", "Water Resistant"],
      brand: "FitLife",
    },
    {
      id: "5",
      name: "Designer Backpack",
      category: "Fashion",
      price: 79.99,
      stock: 23,
      status: "In Stock",
      description: "Stylish and durable backpack with multiple compartments.",
      sku: "FASH-005",
      images: ["backpack.jpg"],
      dimensions: { length: 18, width: 12, height: 6 },
      weight: 1.2,
      features: ["Water Resistant", "Laptop Compartment", "Adjustable Straps"],
      brand: "UrbanGear",
    },
  ];

  // Simulate async behavior with a small delay
  await new Promise(resolve => setTimeout(resolve, 10));
  return products.find(product => product.id === id) || products[0];
}

// Define a type for the product
type Product = {
  id: string;
  name: string;
  category: string;
  price: number;
  stock: number;
  status: string;
  description: string;
  sku: string;
  images: string[];
  dimensions: { length: number; width: number; height: number };
  weight: number;
  features: string[];
  brand: string;
};

export default function ProductEditPage() {
  // Use the useParams hook to get the ID parameter from the URL
  const params = useParams();
  const productId = params.id as string;
  
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const productData = await getProductById(productId);
        setProduct(productData);
      } catch (error) {
        console.error("Error fetching product:", error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchProduct();
  }, [productId]);

  if (loading) {
    return (
      <MainLayout>
        <div className="flex h-full items-center justify-center">
          <p>Loading product details...</p>
        </div>
      </MainLayout>
    );
  }

  if (!product) {
    return (
      <MainLayout>
        <div className="flex h-full items-center justify-center">
          <p>Product not found</p>
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <div className="flex flex-col gap-5">
        <div className="flex items-center gap-2">
          <Link href="/products" className="rounded-full w-8 h-8 flex items-center justify-center bg-muted hover:bg-muted/80">
            <ArrowLeft className="h-4 w-4" />
          </Link>
          <h1 className="text-3xl font-bold">Edit Product</h1>
        </div>

        <div className="grid gap-5 grid-cols-1 md:grid-cols-3">
          <div className="md:col-span-2 space-y-5">
            <Card>
              <CardHeader>
                <CardTitle>Product Information</CardTitle>
                <CardDescription>
                  Basic product details
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="name">Product Name</Label>
                    <Input id="name" defaultValue={product.name} placeholder="Enter product name" />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="sku">SKU</Label>
                    <Input id="sku" defaultValue={product.sku} placeholder="Enter SKU code" />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="brand">Brand</Label>
                    <Input id="brand" defaultValue={product.brand} placeholder="Enter brand name" />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="category">Category</Label>
                    <Select defaultValue={product.category}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select category" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Electronics">Electronics</SelectItem>
                        <SelectItem value="Furniture">Furniture</SelectItem>
                        <SelectItem value="Wearables">Wearables</SelectItem>
                        <SelectItem value="Fashion">Fashion</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="price">Price ($)</Label>
                    <Input 
                      id="price" 
                      type="number"
                      step="0.01" 
                      defaultValue={product.price.toString()} 
                      placeholder="0.00" 
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="status">Status</Label>
                    <Select defaultValue={product.status}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select status" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="In Stock">In Stock</SelectItem>
                        <SelectItem value="Low Stock">Low Stock</SelectItem>
                        <SelectItem value="Out of Stock">Out of Stock</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                                
                  <div className="space-y-2 md:col-span-2">
                    <Label htmlFor="description">Description</Label>
                    <Textarea 
                      id="description" 
                      rows={5}
                      defaultValue={product.description}
                      placeholder="Product description" 
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Product Specifications</CardTitle>
                <CardDescription>
                  Technical details and measurements
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="length">Length (in)</Label>
                    <Input 
                      id="length" 
                      type="number"
                      step="0.1" 
                      defaultValue={product.dimensions.length.toString()} 
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="width">Width (in)</Label>
                    <Input 
                      id="width" 
                      type="number"
                      step="0.1" 
                      defaultValue={product.dimensions.width.toString()} 
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="height">Height (in)</Label>
                    <Input 
                      id="height" 
                      type="number"
                      step="0.1" 
                      defaultValue={product.dimensions.height.toString()} 
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="weight">Weight (lb)</Label>
                    <Input 
                      id="weight" 
                      type="number"
                      step="0.01" 
                      defaultValue={product.weight.toString()} 
                    />
                  </div>
                  
                  <div className="space-y-2 md:col-span-4">
                    <Label htmlFor="features">Features (comma separated)</Label>
                    <Input 
                      id="features" 
                      defaultValue={product.features.join(", ")} 
                      placeholder="Feature 1, Feature 2, Feature 3" 
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
          
          <div className="space-y-5">
            <Card>
              <CardHeader>
                <CardTitle>Inventory</CardTitle>
                <CardDescription>
                  Stock and availability
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="stock">Stock Quantity</Label>
                  <Input 
                    id="stock" 
                    type="number" 
                    defaultValue={product.stock.toString()} 
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="low-stock">Low Stock Threshold</Label>
                  <Input 
                    id="low-stock" 
                    type="number" 
                    defaultValue="10" 
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="backorder">Allow Backorder</Label>
                  <Select defaultValue="no">
                    <SelectTrigger>
                      <SelectValue placeholder="Select option" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="yes">Yes</SelectItem>
                      <SelectItem value="no">No</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Images</CardTitle>
                <CardDescription>
                  Product photos
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="border-2 border-dashed rounded-lg p-6 text-center cursor-pointer hover:bg-muted/50">
                  <p className="text-sm text-muted-foreground">
                    Drag & drop product images here or click to upload
                  </p>
                  <p className="mt-2 text-xs text-muted-foreground">
                    (Max 5MB each, up to 5 images)
                  </p>
                </div>
                
                {product.images.length > 0 && (
                  <div className="grid grid-cols-2 gap-2 mt-4">
                    {product.images.map((image, index) => (
                      <div key={index} className="relative aspect-square bg-muted rounded-md flex items-center justify-center text-muted-foreground">
                        {image}
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
        
        <Card className="border-destructive/50 mt-4">
          <CardHeader className="text-destructive">
            <CardTitle>Danger Zone</CardTitle>
            <CardDescription>
              Actions that can't be undone
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-medium">Delete Product</h3>
                <p className="text-sm text-muted-foreground">Permanently remove this product from the catalog</p>
              </div>
              <Button variant="destructive">
                Delete Product
              </Button>
            </div>
          </CardContent>
        </Card>
        
        <div className="flex justify-end gap-4 mt-4">
          <Button variant="outline">
            <Link href="/products" className="flex items-center">Cancel</Link>
          </Button>
          <Button>
            <Save className="mr-2 h-4 w-4" />
            Save Changes
          </Button>
        </div>
      </div>
    </MainLayout>
  );
} 