"use client";

import { MainLayout } from "@/components/MainLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Edit, Package, Tag, BarChart2, Star } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { Badge } from "@/components/ui/badge";

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
      ratings: { 
        average: 4.5,
        count: 128,
        distribution: [5, 8, 12, 45, 58]
      },
      related: ["2", "4"]
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
      ratings: { 
        average: 4.2,
        count: 75,
        distribution: [3, 5, 9, 25, 33]
      },
      related: ["5"]
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
      ratings: { 
        average: 4.7,
        count: 203,
        distribution: [4, 7, 15, 56, 121]
      },
      related: ["1", "4"]
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
      ratings: { 
        average: 4.1,
        count: 92,
        distribution: [5, 8, 12, 37, 30]
      },
      related: ["1", "3"]
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
      ratings: { 
        average: 4.3,
        count: 67,
        distribution: [2, 5, 9, 21, 30]
      },
      related: ["2"]
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
  ratings: { 
    average: number;
    count: number;
    distribution: number[];
  };
  related: string[];
};

export default function ProductViewPage() {
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
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Link href="/products" className="rounded-full w-8 h-8 flex items-center justify-center bg-muted hover:bg-muted/80">
              <ArrowLeft className="h-4 w-4" />
            </Link>
            <h1 className="text-3xl font-bold">Product Details</h1>
          </div>
          <Link href={`/products/${productId}`}>
            <Button>
              <Edit className="mr-2 h-4 w-4" />
              Edit Product
            </Button>
          </Link>
        </div>

        <div className="grid gap-5 grid-cols-1 md:grid-cols-3">
          <Card className="md:col-span-1">
            <CardContent className="flex flex-col items-center pt-6">
              <div className="mb-4 w-full aspect-square bg-muted rounded-md flex items-center justify-center">
                <Package className="h-16 w-16 text-muted-foreground" />
                <p className="text-muted-foreground">{product.images[0]}</p>
              </div>
              
              {product.images.length > 1 && (
                <div className="grid grid-cols-4 gap-2 w-full">
                  {product.images.slice(0, 4).map((image, index) => (
                    <div key={index} className="aspect-square bg-muted rounded-md flex items-center justify-center text-xs text-muted-foreground">
                      {image}
                    </div>
                  ))}
                </div>
              )}

              <div className="mt-6 w-full">
                <Badge className={`w-full text-center justify-center py-1.5 ${
                  product.status === "In Stock" 
                    ? "bg-green-100 text-green-800 hover:bg-green-100 dark:bg-green-900 dark:text-green-300" 
                    : product.status === "Low Stock"
                    ? "bg-yellow-100 text-yellow-800 hover:bg-yellow-100 dark:bg-yellow-900 dark:text-yellow-300"
                    : "bg-red-100 text-red-800 hover:bg-red-100 dark:bg-red-900 dark:text-red-300"
                }`}>
                  {product.status} - {product.stock} units
                </Badge>
              </div>
            </CardContent>
          </Card>

          <Card className="md:col-span-2">
            <CardHeader>
              <div className="flex justify-between items-start">
                <div>
                  <CardTitle className="text-2xl">{product.name}</CardTitle>
                  <div className="flex gap-2 mt-1">
                    <Badge variant="outline">{product.category}</Badge>
                    <Badge variant="outline">{product.brand}</Badge>
                  </div>
                </div>
                <div className="text-2xl font-bold">${product.price.toFixed(2)}</div>
              </div>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <h3 className="text-lg font-medium mb-2">Product Details</h3>
                <p>{product.description}</p>
              </div>
              
              <div>
                <h3 className="text-lg font-medium mb-2">Features</h3>
                <ul className="list-disc pl-5 space-y-1">
                  {product.features.map((feature, index) => (
                    <li key={index}>{feature}</li>
                  ))}
                </ul>
              </div>
              
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="border rounded-md p-3">
                  <p className="text-xs text-muted-foreground">SKU</p>
                  <p className="font-medium">{product.sku}</p>
                </div>
                <div className="border rounded-md p-3">
                  <p className="text-xs text-muted-foreground">Weight</p>
                  <p className="font-medium">{product.weight} lb</p>
                </div>
                <div className="border rounded-md p-3">
                  <p className="text-xs text-muted-foreground">Dimensions</p>
                  <p className="font-medium">{product.dimensions.length}" × {product.dimensions.width}" × {product.dimensions.height}"</p>
                </div>
                <div className="border rounded-md p-3">
                  <p className="text-xs text-muted-foreground">Brand</p>
                  <p className="font-medium">{product.brand}</p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BarChart2 className="h-5 w-5" />
                Sales Performance
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Last 30 days</span>
                  <span className="font-medium">28 units</span>
                </div>
                <div className="h-[120px] flex items-end gap-1">
                  {[12, 8, 15, 6, 10, 18, 14].map((value, index) => (
                    <div 
                      key={index} 
                      className="flex-1 bg-primary rounded-t-sm" 
                      style={{ height: `${(value / 20) * 100}%` }}
                    ></div>
                  ))}
                </div>
                <div className="flex items-center justify-between text-xs text-muted-foreground">
                  <span>May 1</span>
                  <span>May 7</span>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card className="md:col-span-2">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Star className="h-5 w-5" />
                Customer Ratings
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-4">
                <div className="text-center">
                  <div className="text-3xl font-bold">{product.ratings.average}</div>
                  <div className="flex mt-1">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className={`h-4 w-4 ${i < Math.round(product.ratings.average) ? "fill-primary text-primary" : "text-gray-300"}`} />
                    ))}
                  </div>
                  <div className="text-sm text-muted-foreground mt-1">{product.ratings.count} ratings</div>
                </div>
                
                <div className="flex-1">
                  {[5, 4, 3, 2, 1].map((star) => {
                    const count = product.ratings.distribution[5 - star];
                    const percentage = (count / product.ratings.count) * 100;
                    
                    return (
                      <div key={star} className="flex items-center gap-2">
                        <div className="w-12 text-sm">{star} star</div>
                        <div className="flex-1 h-2 bg-muted rounded-full">
                          <div 
                            className="h-2 bg-primary rounded-full" 
                            style={{ width: `${percentage}%` }}
                          ></div>
                        </div>
                        <div className="w-9 text-xs text-right">{count}</div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card className="md:col-span-3">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Tag className="h-5 w-5" />
                Related Products
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4">
                {product.related.map((relatedId) => {
                  const relatedProduct = [
                    { id: "1", name: "Premium Headphones", price: 199.99 },
                    { id: "2", name: "Ergonomic Chair", price: 249.99 },
                    { id: "3", name: "Smartphone X", price: 899.99 },
                    { id: "4", name: "Fitness Watch", price: 129.99 },
                    { id: "5", name: "Designer Backpack", price: 79.99 },
                  ].find(p => p.id === relatedId);
                  
                  return relatedProduct ? (
                    <Link key={relatedId} href={`/products/${relatedId}/view`} className="block group">
                      <div className="aspect-square bg-muted rounded-md flex items-center justify-center mb-2 group-hover:bg-muted/80">
                        <Package className="h-8 w-8 text-muted-foreground" />
                      </div>
                      <h4 className="text-sm font-medium truncate group-hover:text-primary">{relatedProduct.name}</h4>
                      <p className="text-sm text-muted-foreground">${relatedProduct.price.toFixed(2)}</p>
                    </Link>
                  ) : null;
                })}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </MainLayout>
  );
} 