"use client";

import { MainLayout } from "@/components/MainLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Save, Trash2 } from "lucide-react";
import Link from "next/link";
import { Checkbox } from "@/components/ui/checkbox";
import { Textarea } from "@/components/ui/textarea";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { Separator } from "@/components/ui/separator";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

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
      subcategories: [
        { id: "subcat-1", name: "Smartphones", slug: "smartphones", products: 45 },
        { id: "subcat-2", name: "Laptops", slug: "laptops", products: 32 },
        { id: "subcat-3", name: "Audio", slug: "audio", products: 28 },
        { id: "subcat-4", name: "Accessories", slug: "accessories", products: 19 },
        { id: "subcat-5", name: "Cameras", slug: "cameras", products: 12 }
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
      subcategories: [
        { id: "subcat-6", name: "Men's", slug: "mens", products: 37 },
        { id: "subcat-7", name: "Women's", slug: "womens", products: 42 },
        { id: "subcat-8", name: "Children's", slug: "childrens", products: 10 }
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
  subcategories: Subcategory[];
};

export default function CategoryEditPage() {
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
            <h1 className="text-3xl font-bold">Edit Category</h1>
          </div>
          <div className="flex gap-2">
            <Link href={`/categories/${categoryId}/view`}>
              <Button variant="outline">View Category</Button>
            </Link>
            <Button>
              <Save className="mr-2 h-4 w-4" />
              Save Changes
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          <div className="md:col-span-2 space-y-5">
            <Card>
              <CardHeader>
                <CardTitle>Basic Information</CardTitle>
                <CardDescription>
                  Edit the basic details of this category
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="name">Category Name</Label>
                    <Input id="name" defaultValue={category.name} />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="slug">Slug</Label>
                    <Input id="slug" defaultValue={category.slug} />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="description">Description</Label>
                  <Textarea id="description" rows={4} defaultValue={category.description} />
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox id="featured" defaultChecked={category.featured} />
                  <Label htmlFor="featured">Featured Category</Label>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>SEO Information</CardTitle>
                <CardDescription>
                  Optimize category for search engines
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="metaTitle">Meta Title</Label>
                  <Input id="metaTitle" defaultValue={category.metaTitle} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="metaDescription">Meta Description</Label>
                  <Textarea id="metaDescription" rows={3} defaultValue={category.metaDescription} />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Subcategories</CardTitle>
                <CardDescription>
                  Manage subcategories for this category
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {category.subcategories.map((subcategory) => (
                      <div key={subcategory.id} className="flex items-center justify-between p-3 border rounded-md">
                        <div>
                          <p className="font-medium">{subcategory.name}</p>
                          <p className="text-sm text-muted-foreground">{subcategory.products} products</p>
                        </div>
                        <Button size="sm" variant="ghost">
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    ))}
                  </div>
                  <div className="flex justify-end">
                    <Button variant="outline">
                      Add Subcategory
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="space-y-5">
            <Card>
              <CardHeader>
                <CardTitle>Category Image</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="border rounded-md aspect-square flex items-center justify-center bg-muted">
                  {category.image ? (
                    <img 
                      src={category.image} 
                      alt={category.name} 
                      className="max-w-full max-h-full object-contain"
                    />
                  ) : (
                    <div className="text-muted-foreground">No image</div>
                  )}
                </div>
                <div className="space-y-2">
                  <Button variant="outline" className="w-full">
                    Change Image
                  </Button>
                  <Button variant="ghost" className="w-full text-destructive hover:text-destructive">
                    Remove Image
                  </Button>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Parent Category</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <Label htmlFor="parentCategory">Parent</Label>
                  <Select defaultValue={category.parent || "none"}>
                    <SelectTrigger>
                      <SelectValue placeholder="No parent category" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="none">No parent category</SelectItem>
                      <SelectItem value="cat-2">Clothing</SelectItem>
                      <SelectItem value="cat-3">Home & Garden</SelectItem>
                    </SelectContent>
                  </Select>
                  <p className="text-sm text-muted-foreground pt-2">
                    Setting a parent category will make this a subcategory
                  </p>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Danger Zone</CardTitle>
              </CardHeader>
              <CardContent>
                <Button variant="destructive" className="w-full">
                  Delete Category
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>

        <div className="flex justify-end gap-4 mt-4">
          <Button variant="outline">
            <Link href="/categories" className="flex items-center">Cancel</Link>
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