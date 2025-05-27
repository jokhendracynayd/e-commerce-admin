import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { ChevronRight, PlusCircle, FolderPlus } from "lucide-react";
import { MainLayout } from "@/components/MainLayout";
import Link from "next/link";

const categories = [
  {
    id: "cat-1",
    name: "Electronics",
    slug: "electronics",
    products: 124,
    subcategories: 5,
    featured: true,
  },
  {
    id: "cat-2",
    name: "Clothing",
    slug: "clothing",
    products: 89,
    subcategories: 7,
    featured: true,
  },
  {
    id: "cat-3",
    name: "Home & Garden",
    slug: "home-garden",
    products: 75,
    subcategories: 4,
    featured: true,
  },
  {
    id: "cat-4",
    name: "Sports & Outdoors",
    slug: "sports-outdoors",
    products: 62,
    subcategories: 3,
    featured: false,
  },
  {
    id: "cat-5",
    name: "Beauty & Personal Care",
    slug: "beauty-personal-care",
    products: 43,
    subcategories: 2,
    featured: false,
  }
];

const brands = [
  { id: "b-1", name: "Apple", products: 35, featured: true },
  { id: "b-2", name: "Samsung", products: 28, featured: true },
  { id: "b-3", name: "Nike", products: 42, featured: true },
  { id: "b-4", name: "Adidas", products: 36, featured: false },
  { id: "b-5", name: "Sony", products: 22, featured: false }
];

export default function CategoriesPage() {
  return (
    <MainLayout>
      <div className="flex flex-col gap-5">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold">Categories & Brands</h1>
          <div className="flex gap-2">
            <Link href="/categories/new">
              <Button>
                <PlusCircle className="mr-2 h-4 w-4" />
                Add Category
              </Button>
            </Link>
            <Link href="/brands/new">
              <Button variant="outline">
                <PlusCircle className="mr-2 h-4 w-4" />
                Add Brand
              </Button>
            </Link>
          </div>
        </div>
        
        <Card>
          <CardHeader>
            <CardTitle>Product Categories</CardTitle>
            <CardDescription>
              Manage your product categories and subcategories
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Slug</TableHead>
                  <TableHead>Products</TableHead>
                  <TableHead>Subcategories</TableHead>
                  <TableHead>Featured</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {categories.map((category) => (
                  <TableRow key={category.id}>
                    <TableCell className="font-medium flex items-center">
                      <FolderPlus className="mr-2 h-4 w-4 text-muted-foreground" />
                      <Link href={`/categories/${category.id}/view`} className="hover:underline">
                        {category.name}
                      </Link>
                    </TableCell>
                    <TableCell>{category.slug}</TableCell>
                    <TableCell>{category.products}</TableCell>
                    <TableCell>
                      <div className="flex items-center">
                        {category.subcategories}
                        <Link href={`/categories/${category.id}/subcategories`}>
                          <Button size="sm" variant="ghost" className="h-8 w-8 p-0 ml-2">
                            <ChevronRight className="h-4 w-4" />
                          </Button>
                        </Link>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className={`h-2.5 w-2.5 rounded-full ${category.featured ? "bg-green-500" : "bg-gray-300"}`}></div>
                    </TableCell>
                    <TableCell className="text-right space-x-2">
                      <Link href={`/categories/${category.id}/view`} className="text-sm text-blue-600 hover:underline dark:text-blue-400">
                        View
                      </Link>
                      <Link href={`/categories/${category.id}`} className="text-sm text-blue-600 hover:underline dark:text-blue-400">
                        Edit
                      </Link>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Brands</CardTitle>
            <CardDescription>
              Manage your product brands
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Products</TableHead>
                  <TableHead>Featured</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {brands.map((brand) => (
                  <TableRow key={brand.id}>
                    <TableCell className="font-medium">
                      <Link href={`/brands/${brand.id}/view`} className="hover:underline">
                        {brand.name}
                      </Link>
                    </TableCell>
                    <TableCell>{brand.products}</TableCell>
                    <TableCell>
                      <div className={`h-2.5 w-2.5 rounded-full ${brand.featured ? "bg-green-500" : "bg-gray-300"}`}></div>
                    </TableCell>
                    <TableCell className="text-right space-x-2">
                      <Link href={`/brands/${brand.id}/view`} className="text-sm text-blue-600 hover:underline dark:text-blue-400">
                        View
                      </Link>
                      <Link href={`/brands/${brand.id}`} className="text-sm text-blue-600 hover:underline dark:text-blue-400">
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