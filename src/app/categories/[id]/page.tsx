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
import { useParams, useRouter } from "next/navigation";
import { Separator } from "@/components/ui/separator";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { categoriesApi, Category, CategoryDetail, CreateCategoryDto } from "@/lib/api/categories-api";

export default function CategoryEditPage() {
  const params = useParams();
  const router = useRouter();
  const categoryId = params.id as string;
  
  const [category, setCategory] = useState<CategoryDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [parentCategories, setParentCategories] = useState<Category[]>([]);
  const [loadingParents, setLoadingParents] = useState(false);
  
  // Form data
  const [name, setName] = useState("");
  const [slug, setSlug] = useState("");
  const [description, setDescription] = useState("");
  const [icon, setIcon] = useState("");
  const [parentId, setParentId] = useState("none");
  const [featured, setFeatured] = useState(false);
  const [metaTitle, setMetaTitle] = useState("");
  const [metaDescription, setMetaDescription] = useState("");
  const [showInMenu, setShowInMenu] = useState(true);
  const [showInFilters, setShowInFilters] = useState(true);
  const [displayOrder, setDisplayOrder] = useState("0");

  // Fetch category and parent categories
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setLoadingParents(true);
        
        // Fetch category details
        const categoryData = await categoriesApi.getCategoryById(categoryId);
        setCategory(categoryData);
        
        // Set form data from category
        setName(categoryData.name || "");
        setSlug(categoryData.slug || "");
        setDescription(categoryData.description || "");
        setIcon(categoryData.icon || "");
        setParentId(categoryData.parentId || "none");
        
        // Set mock data for UI-only fields
        setFeatured(false);
        setMetaTitle("");
        setMetaDescription("");
        setShowInMenu(true);
        setShowInFilters(true);
        setDisplayOrder("0");
        
        // Fetch parent categories
        const categories = await categoriesApi.getCategories();
        // Filter out the current category to prevent self-reference
        const filteredCategories = categories.filter(cat => cat.id !== categoryId);
        setParentCategories(filteredCategories);
      } catch (error: any) {
        console.error("Error fetching data:", error);
        setError(error.message || "Failed to load category data");
      } finally {
        setLoading(false);
        setLoadingParents(false);
      }
    };
    
    if (categoryId) {
      fetchData();
    }
  }, [categoryId]);

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!name.trim()) {
      setError("Category name is required");
      return;
    }
    
    setSaving(true);
    setError(null);
    
    try {
      // Prepare data for API (only sending fields the API accepts)
      const categoryData: Partial<CreateCategoryDto> = {
        name: name.trim()
      };
      
      if (description.trim()) {
        categoryData.description = description.trim();
      }
      
      if (icon.trim()) {
        categoryData.icon = icon.trim();
      }
      
      if (parentId && parentId !== "none") {
        categoryData.parentId = parentId;
      }
      
      console.log("Updating category with data:", categoryData);
      
      // Call API to update category
      const result = await categoriesApi.updateCategory(categoryId, categoryData);
      console.log("Category updated successfully:", result);
      
      // Redirect to category view page
      router.push(`/categories/${categoryId}/view`);
    } catch (error: any) {
      console.error("Error updating category:", error);
      
      // Extract error message
      let errorMessage = "Failed to update category";
      if (error.response) {
        if (error.response.data && error.response.data.message) {
          errorMessage = error.response.data.message;
        } else if (error.response.status === 400) {
          errorMessage = "Invalid category data";
        } else if (error.response.status === 401) {
          errorMessage = "You are not authorized to update this category";
        } else if (error.response.status === 404) {
          errorMessage = "Category not found";
        }
      } else if (error.message) {
        errorMessage = error.message;
      }
      
      setError(errorMessage);
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <MainLayout>
        <div className="flex h-full items-center justify-center">
          <div className="flex flex-col items-center gap-2">
            <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
            <p>Loading category details...</p>
          </div>
        </div>
      </MainLayout>
    );
  }

  if (!category) {
    return (
      <MainLayout>
        <div className="flex h-full items-center justify-center">
          <p>Category not found</p>
          <Button 
            variant="outline" 
            className="ml-4"
            onClick={() => router.push('/categories')}
          >
            Back to Categories
          </Button>
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <form onSubmit={handleSubmit}>
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
                <Button variant="outline" type="button">View Category</Button>
              </Link>
              <Button type="submit" disabled={saving}>
                <Save className="mr-2 h-4 w-4" />
                {saving ? "Saving..." : "Save Changes"}
              </Button>
            </div>
          </div>

          {error && (
            <div className="bg-destructive/10 border border-destructive text-destructive p-4 rounded-md">
              {error}
            </div>
          )}

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
                      <Input 
                        id="name" 
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="slug">Slug</Label>
                      <Input 
                        id="slug" 
                        value={slug}
                        onChange={(e) => setSlug(e.target.value)}
                        disabled
                      />
                      <p className="text-xs text-muted-foreground">
                        Slug is automatically generated from the name and cannot be edited directly
                      </p>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="description">Description</Label>
                    <Textarea 
                      id="description" 
                      rows={4} 
                      value={description}
                      onChange={(e) => setDescription(e.target.value)}
                    />
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox 
                      id="featured" 
                      checked={featured}
                      onCheckedChange={(checked) => setFeatured(checked as boolean)}
                    />
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
                    <Input 
                      id="metaTitle" 
                      value={metaTitle}
                      onChange={(e) => setMetaTitle(e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="metaDescription">Meta Description</Label>
                    <Textarea 
                      id="metaDescription" 
                      rows={3} 
                      value={metaDescription}
                      onChange={(e) => setMetaDescription(e.target.value)}
                    />
                  </div>
                </CardContent>
              </Card>

              {category.children && category.children.length > 0 && (
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
                        {category.children.map((subcategory) => (
                          <div key={subcategory.id} className="flex items-center justify-between p-3 border rounded-md">
                            <div>
                              <p className="font-medium">{subcategory.name}</p>
                              <p className="text-sm text-muted-foreground">{subcategory.productCount || 0} products</p>
                            </div>
                            <Link href={`/categories/${subcategory.id}/view`}>
                              <Button size="sm" variant="ghost">
                                View
                              </Button>
                            </Link>
                          </div>
                        ))}
                      </div>
                      <div className="flex justify-end">
                        <Link href="/categories/new">
                          <Button variant="outline" type="button">
                            Add Subcategory
                          </Button>
                        </Link>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>

            <div className="space-y-5">
              <Card>
                <CardHeader>
                  <CardTitle>Category Image</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="border rounded-md aspect-square flex items-center justify-center bg-muted">
                    {icon ? (
                      <img 
                        src={icon} 
                        alt={name} 
                        className="max-w-full max-h-full object-contain"
                      />
                    ) : (
                      <div className="text-muted-foreground">No image</div>
                    )}
                  </div>
                  <div className="space-y-2">
                    <Input
                      id="icon"
                      type="text"
                      placeholder="Enter icon URL"
                      value={icon}
                      onChange={(e) => setIcon(e.target.value)}
                    />
                    <Button variant="outline" className="w-full" type="button">
                      Upload Image
                    </Button>
                    {icon && (
                      <Button 
                        variant="ghost" 
                        className="w-full text-destructive hover:text-destructive"
                        type="button"
                        onClick={() => setIcon("")}
                      >
                        Remove Image
                      </Button>
                    )}
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
                    <Select
                      value={parentId}
                      onValueChange={setParentId}
                    >
                      <SelectTrigger id="parentCategory">
                        <SelectValue placeholder="No parent category" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="none">No parent category</SelectItem>
                        {loadingParents ? (
                          <SelectItem value="loading" disabled>Loading categories...</SelectItem>
                        ) : (
                          parentCategories.map((cat) => (
                            <SelectItem key={cat.id} value={cat.id}>
                              {cat.name}
                            </SelectItem>
                          ))
                        )}
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
                  <CardTitle>Display Options</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center space-x-2">
                    <Checkbox 
                      id="showInMenu"
                      checked={showInMenu}
                      onCheckedChange={(checked) => setShowInMenu(checked as boolean)}
                    />
                    <Label htmlFor="showInMenu">Show in Menu</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox 
                      id="showInFilters"
                      checked={showInFilters}
                      onCheckedChange={(checked) => setShowInFilters(checked as boolean)}
                    />
                    <Label htmlFor="showInFilters">Show in Filters</Label>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="displayOrder">Display Order</Label>
                    <Input 
                      id="displayOrder" 
                      type="number"
                      value={displayOrder}
                      onChange={(e) => setDisplayOrder(e.target.value)}
                    />
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-destructive/5 border-destructive/20">
                <CardHeader>
                  <CardTitle className="text-destructive">Danger Zone</CardTitle>
                </CardHeader>
                <CardContent>
                  <Button 
                    variant="destructive" 
                    className="w-full"
                    type="button"
                    onClick={() => {
                      if (window.confirm('Are you sure you want to delete this category? This action cannot be undone.')) {
                        categoriesApi.deleteCategory(categoryId)
                          .then(() => {
                            router.push('/categories');
                          })
                          .catch(error => {
                            console.error('Error deleting category:', error);
                            alert('Failed to delete category. Please try again.');
                          });
                      }
                    }}
                  >
                    Delete Category
                  </Button>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </form>
    </MainLayout>
  );
} 