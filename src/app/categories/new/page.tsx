"use client";

import { MainLayout } from "@/components/MainLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Save, FolderPlus } from "lucide-react";
import Link from "next/link";
import { Checkbox } from "@/components/ui/checkbox";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

export default function NewCategoryPage() {
  return (
    <MainLayout>
      <div className="flex flex-col gap-5">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Link href="/categories" className="rounded-full w-8 h-8 flex items-center justify-center bg-muted hover:bg-muted/80">
              <ArrowLeft className="h-4 w-4" />
            </Link>
            <h1 className="text-3xl font-bold">Create New Category</h1>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          <div className="md:col-span-2 space-y-5">
            <Card>
              <CardHeader>
                <CardTitle>Basic Information</CardTitle>
                <CardDescription>
                  Enter the basic details of this category
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="name">Category Name</Label>
                    <Input id="name" placeholder="Enter category name" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="slug">Slug</Label>
                    <Input id="slug" placeholder="enter-slug-here" />
                    <p className="text-sm text-muted-foreground">
                      The slug is used in the URL of the category page
                    </p>
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="description">Description</Label>
                  <Textarea id="description" rows={4} placeholder="Enter category description" />
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox id="featured" />
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
                  <Input id="metaTitle" placeholder="Enter meta title" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="metaDescription">Meta Description</Label>
                  <Textarea id="metaDescription" rows={3} placeholder="Enter meta description" />
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
                  <FolderPlus className="h-10 w-10 text-muted-foreground" />
                </div>
                <div className="space-y-2">
                  <Button variant="outline" className="w-full">
                    Upload Image
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
                  <Select defaultValue="none">
                    <SelectTrigger>
                      <SelectValue placeholder="No parent category" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="none">No parent category</SelectItem>
                      <SelectItem value="cat-1">Electronics</SelectItem>
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
                <CardTitle>Display Options</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center space-x-2">
                  <Checkbox id="showInMenu" defaultChecked />
                  <Label htmlFor="showInMenu">Show in Menu</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox id="showInFilters" defaultChecked />
                  <Label htmlFor="showInFilters">Show in Filters</Label>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="displayOrder">Display Order</Label>
                  <Input id="displayOrder" type="number" defaultValue="0" />
                </div>
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
            Create Category
          </Button>
        </div>
      </div>
    </MainLayout>
  );
} 