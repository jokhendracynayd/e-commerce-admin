"use client";

import { MainLayout } from "@/components/MainLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Edit, Tag, Layers, FolderPlus } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";

// Mock function to get category by ID
async function getCategoryById(id: string) {
  const categories = [
    {
      id: "cat-1",
      name: "Electronics",
      slug: "electronics",
      description: "Electronic devices and accessories",
      featured: true,
      metaTitle: "Electronics - Shop the latest devices",
      metaDescription: "Browse our range of electronic devices, gadgets, and accessories",
      parent: null,
      image: "/images/categories/electronics.jpg",
      productCount: 124,
      subcategories: [
        { id: "subcat-1", name: "Smartphones", slug: "smartphones", products: 45 },
        { id: "subcat-2", name: "Laptops", slug: "laptops", products: 32 },
        { id: "subcat-3", name: "Audio", slug: "audio", products: 28 },
        { id: "subcat-4", name: "Accessories", slug: "accessories", products: 19 },
        { id: "subcat-5", name: "Cameras", slug: "cameras", products: 12 }
      ],
      topProducts: [
        { id: "prod-1", name: "iPhone 14 Pro", price: 999.99, stock: 45, rating: 4.8 },
        { id: "prod-2", name: "MacBook Air M2", price: 1199.99, stock: 23, rating: 4.9 },
        { id: "prod-3", name: "Samsung Galaxy S23", price: 899.99, stock: 38, rating: 4.7 }
      ]
    },
    {
      id: "cat-2",
      name: "Clothing",
      slug: "clothing",
      description: "Men's, women's, and children's apparel",
      featured: true,
      metaTitle: "Clothing - Fashion for everyone",
      metaDescription: "Find the latest trends in men's, women's, and children's fashion",
      parent: null,
      image: "/images/categories/clothing.jpg",
      productCount: 89,
      subcategories: [
        { id: "subcat-6", name: "Men's", slug: "mens", products: 37 },
        { id: "subcat-7", name: "Women's", slug: "womens", products: 42 },
        { id: "subcat-8", name: "Children's", slug: "childrens", products: 10 }
      ],
      topProducts: [
        { id: "prod-4", name: "Men's Cotton T-Shirt", price: 19.99, stock: 120, rating: 4.5 },
        { id: "prod-5", name: "Women's Casual Dress", price: 49.99, stock: 35, rating: 4.6 },
        { id: "prod-6", name: "Kid's Denim Jeans", price: 29.99, stock: 42, rating: 4.4 }
      ]
    }
  ];

  // Simulate async behavior
  await new Promise(resolve => setTimeout(resolve, 10));
  return categories.find(category => category.id === id) || categories[0];
}

type Subcategory = {
  id: string;
  name: string;
  slug: string;
  products: number;
};

type TopProduct = {
  id: string;
  name: string;
  price: number;
  stock: number;
  rating: number;
};

type Category = {
  id: string;
  name: string;
  slug: string;
  description: string;
  featured: boolean;
  metaTitle: string;
  metaDescription: string;
  parent: string | null;
  image: string;
  productCount: number;
  subcategories: Subcategory[];
  topProducts: TopProduct[];
};

export default function CategoryViewPage() {
  const params = useParams();
  const categoryId = params.id as string;
  
  const [category, setCategory] = useState<Category | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCategory = async () => {
      try {
        const categoryData = await getCategoryById(categoryId);
        setCategory(categoryData as Category);
      } catch (error) {
        console.error("Error fetching category:", error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchCategory();
  }, [categoryId]);

  if (loading) {
    return (
      <MainLayout>
        <div className="flex h-full items-center justify-center">
          <p>Loading category details...</p>
        </div>
      </MainLayout>
    );
  }

  if (!category) {
    return (
      <MainLayout>
        <div className="flex h-full items-center justify-center">
          <p>Category not found</p>
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <div className="flex flex-col gap-5">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Link href="/categories" className="rounded-full w-8 h-8 flex items-center justify-center bg-muted hover:bg-muted/80">
              <ArrowLeft className="h-4 w-4" />
            </Link>
            <h1 className="text-3xl font-bold">Category Details</h1>
          </div>
          <Link href={`/categories/${categoryId}`}>
            <Button>
              <Edit className="mr-2 h-4 w-4" />
              Edit Category
            </Button>
          </Link>
        </div>

        <div className="flex flex-col md:flex-row gap-5">
          <Card className="flex-1">
            <CardHeader className="relative pb-8">
              <div className="flex justify-between items-center">
                <div>
                  <CardTitle className="text-2xl">{category.name}</CardTitle>
                  <p className="text-sm text-muted-foreground mt-1">/{category.slug}</p>
                </div>
                {category.featured && (
                  <Badge className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300">
                    Featured
                  </Badge>
                )}
              </div>
              {category.image && (
                <div className="absolute right-6 bottom-0 translate-y-1/2 w-16 h-16 border rounded-md overflow-hidden bg-white">
                  <img 
                    src={category.image} 
                    alt={category.name}
                    className="w-full h-full object-cover"
                  />
                </div>
              )}
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div className="pt-6">
                  <h3 className="text-lg font-medium mb-3">Description</h3>
                  <p>{category.description}</p>
                </div>
                
                <div>
                  <h3 className="text-lg font-medium mb-3">Statistics</h3>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div className="p-4 border rounded-lg">
                      <div className="flex items-center gap-3">
                        <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                          <Tag className="h-5 w-5 text-primary" />
                        </div>
                        <div>
                          <p className="text-sm text-muted-foreground">Products</p>
                          <p className="font-bold text-xl">{category.productCount}</p>
                        </div>
                      </div>
                    </div>
                    <div className="p-4 border rounded-lg">
                      <div className="flex items-center gap-3">
                        <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                          <Layers className="h-5 w-5 text-primary" />
                        </div>
                        <div>
                          <p className="text-sm text-muted-foreground">Subcategories</p>
                          <p className="font-bold text-xl">{category.subcategories.length}</p>
                        </div>
                      </div>
                    </div>
                    <div className="p-4 border rounded-lg">
                      <div className="flex items-center gap-3">
                        <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                          <Tag className="h-5 w-5 text-primary" />
                        </div>
                        <div>
                          <p className="text-sm text-muted-foreground">Status</p>
                          <p className="font-bold text-xl">Active</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="text-lg font-medium mb-3">SEO Information</h3>
                  <div className="space-y-3">
                    <div>
                      <p className="text-sm text-muted-foreground">Meta Title</p>
                      <p className="font-medium">{category.metaTitle}</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Meta Description</p>
                      <p>{category.metaDescription}</p>
                    </div>
                  </div>
                </div>

                <div>
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="text-lg font-medium">Top Products</h3>
                    <Link href={`/products?category=${category.id}`}>
                      <Button variant="outline" size="sm">View All Products</Button>
                    </Link>
                  </div>
                  <div className="space-y-3">
                    {category.topProducts.map((product) => (
                      <div key={product.id} className="flex justify-between items-center border-b pb-3 last:border-0">
                        <div>
                          <Link href={`/products/${product.id}/view`} className="font-medium hover:underline">
                            {product.name}
                          </Link>
                          <div className="flex items-center gap-2 mt-1">
                            <div className="flex items-center">
                              <span className="text-yellow-500">★</span>
                              <span className="text-sm ml-1">{product.rating}</span>
                            </div>
                            <span className="text-sm text-muted-foreground">Stock: {product.stock}</span>
                          </div>
                        </div>
                        <span className="font-medium">${product.price.toFixed(2)}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <div className="md:w-96 space-y-5">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FolderPlus className="h-5 w-5" />
                  Subcategories
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {category.subcategories.map((subcategory) => (
                    <div key={subcategory.id} className="flex items-center justify-between border-b pb-3 last:border-0">
                      <div>
                        <p className="font-medium">{subcategory.name}</p>
                        <p className="text-sm text-muted-foreground">/{subcategory.slug}</p>
                      </div>
                      <Badge variant="outline">{subcategory.products} products</Badge>
                    </div>
                  ))}
                </div>
                <div className="mt-4">
                  <Link href={`/categories/${categoryId}/subcategories`}>
                    <Button variant="outline" className="w-full">
                      Manage Subcategories
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Related Actions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <Button variant="outline" className="w-full justify-start">
                  <Tag className="mr-2 h-4 w-4" />
                  Add Product to Category
                </Button>
                <Button variant="outline" className="w-full justify-start">
                  <FolderPlus className="mr-2 h-4 w-4" />
                  Create Subcategory
                </Button>
                <Link href={`/categories/${categoryId}/edit`} className="w-full">
                  <Button variant="outline" className="w-full justify-start">
                    <Edit className="mr-2 h-4 w-4" />
                    Edit Category
                  </Button>
                </Link>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </MainLayout>
  );
} 