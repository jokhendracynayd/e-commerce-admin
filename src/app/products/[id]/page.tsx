"use client";

import { MainLayout } from "@/components/MainLayout";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Info, Loader2, Save, Trash, Upload, X, Plus } from "lucide-react";
import Link from "next/link";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { useEffect, useState, useRef } from "react";
import { useParams, useRouter, useSearchParams } from "next/navigation";
import { productsApi, Product, UpdateProductDto, ProductImage } from "@/lib/api/products-api";
import { categoriesApi, Category } from "@/lib/api/categories-api";
import { brandsApi, Brand } from "@/lib/api/brands-api";
import { toast } from "sonner";
import { Checkbox } from "@/components/ui/checkbox";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Switch } from "@/components/ui/switch";
import { getCurrencySymbol } from "@/lib/utils";
import Image from "next/image";
import { Badge } from "@/components/ui/badge";
import { ProductSpecificationsForm } from "@/components/ProductSpecificationsForm";
import { ProductSpecificationsDisplay } from "@/components/ProductSpecificationsDisplay";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export default function ProductEditPage() {
  const router = useRouter();
  const params = useParams();
  const searchParams = useSearchParams();
  const productId = params.id as string;
  const imagesRef = useRef<HTMLDivElement>(null);
  
  // State for data
  const [product, setProduct] = useState<Product | null>(null);
  const [categories, setCategories] = useState<Category[]>([]);
  const [subCategories, setSubCategories] = useState<Category[]>([]);
  const [brands, setBrands] = useState<Brand[]>([]);
  
  // Form state
  const [form, setForm] = useState<UpdateProductDto>({});
  const [categoryId, setCategoryId] = useState<string>("");
  const [subCategoryId, setSubCategoryId] = useState<string>("");
  const [images, setImages] = useState<ProductImage[]>([]);
  const [currency, setCurrency] = useState<string>("USD");
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [uploadedImageUrls, setUploadedImageUrls] = useState<string[]>([]);
  const [imagesToDelete, setImagesToDelete] = useState<string[]>([]);
  
  // UI state
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);

  // Fetch product data
  useEffect(() => {
    const fetchProductData = async () => {
      try {
        setLoading(true);
        setError(null);
        
        const productData = await productsApi.getProductById(productId);
        
        setProduct(productData);
        setForm({
          title: productData.title,
          description: productData.description,
          shortDescription: productData.shortDescription,
          price: productData.price,
          discountPrice: productData.discountPrice,
          stockQuantity: productData.stockQuantity,
          sku: productData.sku,
          barcode: productData.barcode as string,
          weight: productData.weight,
          dimensions: productData.dimensions,
          isActive: productData.isActive,
          isFeatured: productData.isFeatured,
          visibility: productData.visibility,
          metaTitle: productData.metaTitle,
          metaDescription: productData.metaDescription,
          metaKeywords: productData.metaKeywords,
          brandId: productData.brand?.id,
          categoryId: productData.category?.id,
          subCategoryId: productData.subCategory?.id
        });
        
        setCategoryId(productData.category?.id || "");
        setSubCategoryId(productData.subCategory?.id || "");
        setCurrency(productData.currency || "USD");
        setImages(productData.images || []);
        
      } catch (error: any) {
        console.error("Error fetching product:", error);
        setError(error.message || "Failed to load product");
      } finally {
        setLoading(false);
      }
    };
    
    const fetchOptionsData = async () => {
      try {
        const [categoriesData, brandsData] = await Promise.all([
          categoriesApi.getCategories(),
          brandsApi.getBrands()
        ]);
        
        // Add defensive checks for categories and brands data
        setCategories(Array.isArray(categoriesData) ? 
          categoriesData.filter(cat => !cat.parentId) : []);
          
        setSubCategories(Array.isArray(categoriesData) ? 
          categoriesData.filter(cat => cat.parentId) : []);
          
        setBrands(Array.isArray(brandsData) ? brandsData : []);
      } catch (error) {
        console.error("Error fetching options data:", error);
        setCategories([]);
        setSubCategories([]);
        setBrands([]);
      }
    };
    
    if (productId) {
      fetchProductData();
      fetchOptionsData();
    }
  }, [productId]);
  
  // Scroll to images section if tab=images in URL
  useEffect(() => {
    const tab = searchParams.get('tab');
    if (tab === 'images' && imagesRef.current && !loading) {
      setTimeout(() => {
        imagesRef.current?.scrollIntoView({ behavior: 'smooth' });
      }, 300);
    }
  }, [searchParams, loading]);
  
  // Handle form field changes
  const handleChange = (field: string, value: any) => {
    setForm(prev => ({ ...prev, [field]: value }));
  };
  
  // Handle category change
  const handleCategoryChange = (value: string) => {
    setCategoryId(value);
    handleChange('categoryId', value);
    
    // Reset subcategory if parent category changes
    setSubCategoryId("");
    handleChange('subCategoryId', null);
  };
  
  // Handle file input change
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const filesArray = Array.from(e.target.files);
      setSelectedFiles(prev => [...prev, ...filesArray]);
    }
  };
  
  // Remove selected file
  const removeSelectedFile = (index: number) => {
    setSelectedFiles(prev => prev.filter((_, i) => i !== index));
  };
  
  // Remove existing image
  const removeExistingImage = (imageId: string) => {
    setImagesToDelete(prev => [...prev, imageId]);
    setImages(prev => prev.filter(img => img.id !== imageId));
  };

  // Upload images
  const uploadImages = async () => {
    if (selectedFiles.length === 0) return [];
    
    // In a real implementation, you'd upload each file to your server
    // For now, we'll mock this behavior with URLs
    const uploadedUrls = selectedFiles.map(
      (file, index) => URL.createObjectURL(file)
    );
    
    setUploadedImageUrls(uploadedUrls);
    return uploadedUrls.map((url, index) => ({
      imageUrl: url,
      altText: selectedFiles[index].name,
      position: images.length + index
    }));
  };
  
  // Product images
  const addImageFromUrl = (url: string, altText: string) => {
    if (!url.trim()) return;
    
    // Basic URL validation
    let validUrl = url;
    // If URL doesn't start with http or https, assume it's https
    if (!url.match(/^https?:\/\//i)) {
      validUrl = `https://${url}`;
    }
    
    const newImage: ProductImage = {
      imageUrl: validUrl,
      altText: altText || form.title || "Product image",
      position: images.length
    };
    
    setImages([...images, newImage]);
  };
  
  // Update an image
  const updateImage = (index: number, field: keyof ProductImage, value: string) => {
    const updatedImages = [...images];
    
    // If updating the URL, ensure it's valid
    if (field === 'imageUrl' && value) {
      // Basic URL validation
      let validUrl = value;
      if (!value.match(/^https?:\/\//i)) {
        validUrl = `https://${value}`;
      }
      
      updatedImages[index] = {
        ...updatedImages[index],
        imageUrl: validUrl
      };
    } else {
      updatedImages[index] = {
        ...updatedImages[index],
        [field]: value
      };
    }
    
    setImages(updatedImages);
  };
  
  // Reorder images
  const moveImage = (fromIndex: number, toIndex: number) => {
    if (toIndex < 0 || toIndex >= images.length) return;
    
    const updatedImages = [...images];
    const [movedItem] = updatedImages.splice(fromIndex, 1);
    updatedImages.splice(toIndex, 0, movedItem);
    
    // Update positions after reordering
    const reorderedImages = updatedImages.map((img, i) => ({
      ...img,
      position: i
    }));
    
    setImages(reorderedImages);
  };

  // Edit image alt text and URL
  const editImage = (index: number, newUrl: string, newAlt: string) => {
    const updatedImages = [...images];
    
    // Ensure the URL is valid
    let validUrl = newUrl;
    if (newUrl && !newUrl.match(/^https?:\/\//i)) {
      validUrl = `https://${newUrl}`;
    }
    
    updatedImages[index] = {
      ...updatedImages[index],
      imageUrl: validUrl,
      altText: newAlt
    };
    
    setImages(updatedImages);
  };

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      setSubmitting(true);
      
      // Basic validation
      if (!form.title || !form.price || !form.sku) {
        toast.error("Validation Error", {
          description: "Please fill in all required fields"
        });
        return;
      }
      
      // Upload images if any
      let uploadedImages: ProductImage[] = [];
      if (selectedFiles.length > 0) {
        uploadedImages = await uploadImages();
      }
      
      // Prepare update data with the correct structure
      const updateData: UpdateProductDto = {
        title: form.title,
        description: form.description,
        shortDescription: form.shortDescription,
        price: form.price,
        discountPrice: form.discountPrice,
        currency: currency,
        stockQuantity: form.stockQuantity,
        sku: form.sku,
        barcode: form.barcode as string,
        weight: form.weight,
        dimensions: form.dimensions,
        isActive: form.isActive,
        isFeatured: form.isFeatured,
        visibility: form.visibility,
        metaTitle: form.metaTitle,
        metaDescription: form.metaDescription,
        metaKeywords: form.metaKeywords,
        brandId: form.brandId,
        categoryId: form.categoryId,
        subCategoryId: form.subCategoryId,
        // Include only images not marked for deletion and add new uploaded images
        images: [
          ...images
            .filter(img => !imagesToDelete.includes(img.id || ''))
            .map(img => ({
              imageUrl: img.imageUrl,
              altText: img.altText || '',
              position: img.position
            })),
          ...uploadedImages.map(img => ({
            imageUrl: img.imageUrl,
            altText: img.altText || '',
            position: img.position
          }))
        ],
        // Include variants if present
        variants: form.variants
      };
      
      // Submit update using PUT (not PATCH) as per API implementation
      await productsApi.updateProduct(productId, updateData);
      
      toast.success("Success", {
        description: "Product updated successfully"
      });
      
      router.push('/products');
    } catch (error: any) {
      console.error("Error updating product:", error);
      toast.error("Error", {
        description: error.message || "Failed to update product"
      });
    } finally {
      setSubmitting(false);
    }
  };
  
  // Handle product deletion
  const handleDelete = async () => {
    try {
      setSubmitting(true);
      await productsApi.deleteProduct(productId);
      
      toast.success("Success", {
        description: "Product deleted successfully"
      });
      
      router.push('/products');
    } catch (error: any) {
      console.error("Error deleting product:", error);
      toast.error("Error", {
        description: error.message || "Failed to delete product"
      });
      setDeleteDialogOpen(false);
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <MainLayout>
        <div className="flex h-full items-center justify-center">
          <div className="flex flex-col items-center gap-2">
            <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
          <p>Loading product details...</p>
          </div>
        </div>
      </MainLayout>
    );
  }

  if (error || !product) {
    return (
      <MainLayout>
        <div className="flex flex-col h-full items-center justify-center gap-4">
          <div className="flex items-center gap-2 text-destructive">
            <Info className="h-6 w-6" />
            <p className="font-medium">{error || "Product not found"}</p>
          </div>
          <Button onClick={() => router.push('/products')}>
            Go Back to Products
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
          <Link href="/products" className="rounded-full w-8 h-8 flex items-center justify-center bg-muted hover:bg-muted/80">
            <ArrowLeft className="h-4 w-4" />
          </Link>
          <h1 className="text-3xl font-bold">Edit Product</h1>
            </div>
            
            <div className="flex gap-3">
              <Button 
                variant="outline" 
                type="button" 
                onClick={() => router.push('/products')}
                disabled={submitting}
              >
                Cancel
              </Button>
              <Button 
                type="submit"
                disabled={submitting}
              >
                {submitting ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Saving...
                  </>
                ) : (
                  <>
                    <Save className="mr-2 h-4 w-4" />
                    Save Changes
                  </>
                )}
              </Button>
            </div>
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
                      <Label htmlFor="title">Product Name <span className="text-destructive">*</span></Label>
                      <Input 
                        id="title" 
                        value={form.title || ""} 
                        onChange={e => handleChange("title", e.target.value)} 
                        placeholder="Enter product name" 
                        required 
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="sku">SKU <span className="text-destructive">*</span></Label>
                      <Input 
                        id="sku" 
                        value={form.sku || ""} 
                        onChange={e => handleChange("sku", e.target.value)} 
                        placeholder="Enter SKU code" 
                        required 
                      />
                  </div>

                  <div className="space-y-2">
                      <Label htmlFor="barcode">Barcode</Label>
                      <Input 
                        id="barcode" 
                        value={form.barcode || ""} 
                        onChange={e => handleChange("barcode", e.target.value)} 
                        placeholder="Enter barcode (optional)" 
                      />
                  </div>
                  
                  <div className="space-y-2">
                      <Label htmlFor="brandId">Brand</Label>
                      <Select 
                        value={form.brandId || ""} 
                        onValueChange={value => handleChange("brandId", value)}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select brand" />
                        </SelectTrigger>
                        <SelectContent>
                          {brands.map((brand) => (
                            <SelectItem key={brand.id} value={brand.id}>
                              {brand.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                  </div>
                  
                  <div className="space-y-2">
                      <Label htmlFor="categoryId">Category</Label>
                      <Select 
                        value={categoryId}
                        onValueChange={handleCategoryChange}
                      >
                      <SelectTrigger>
                        <SelectValue placeholder="Select category" />
                      </SelectTrigger>
                      <SelectContent>
                          {categories.map((category) => (
                            <SelectItem key={category.id} value={category.id}>
                              {category.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="subCategoryId">Subcategory</Label>
                      <Select 
                        value={subCategoryId}
                        onValueChange={value => {
                          setSubCategoryId(value);
                          handleChange("subCategoryId", value);
                        }}
                        disabled={!categoryId}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder={categoryId ? "Select subcategory" : "Select a category first"} />
                        </SelectTrigger>
                        <SelectContent>
                          {subCategories
                            .filter(subCat => subCat.parentId === categoryId)
                            .map((subCategory) => (
                              <SelectItem key={subCategory.id} value={subCategory.id}>
                                {subCategory.name}
                              </SelectItem>
                            ))
                          }
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <Label htmlFor="price">Price <span className="text-destructive">*</span></Label>
                        <Select 
                          value={currency} 
                          onValueChange={setCurrency}
                        >
                          <SelectTrigger className="w-24">
                            <SelectValue placeholder="USD" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="USD">USD ($)</SelectItem>
                            <SelectItem value="INR">INR (₹)</SelectItem>
                            <SelectItem value="EUR">EUR (€)</SelectItem>
                            <SelectItem value="GBP">GBP (£)</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="relative">
                        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">
                          {getCurrencySymbol(currency)}
                        </span>
                    <Input 
                      id="price" 
                      type="number"
                      step="0.01" 
                          value={form.price?.toString() || ""} 
                          onChange={e => handleChange("price", parseFloat(e.target.value))} 
                      placeholder="0.00" 
                          className="pl-7"
                          required
                          min="0"
                    />
                      </div>
                  </div>
                  
                  <div className="space-y-2">
                      <Label htmlFor="discountPrice">Discount Price</Label>
                      <div className="relative">
                        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">
                          {getCurrencySymbol(currency)}
                        </span>
                        <Input 
                          id="discountPrice" 
                          type="number"
                          step="0.01" 
                          value={form.discountPrice?.toString() || ""} 
                          onChange={e => handleChange("discountPrice", e.target.value ? parseFloat(e.target.value) : null)} 
                          placeholder="0.00" 
                          className="pl-7"
                          min="0"
                        />
                      </div>
                  </div>
                                
                  <div className="space-y-2 md:col-span-2">
                      <Label htmlFor="shortDescription">Short Description</Label>
                      <Textarea 
                        id="shortDescription" 
                        rows={2}
                        value={form.shortDescription || ""} 
                        onChange={e => handleChange("shortDescription", e.target.value)}
                        placeholder="Brief product description" 
                      />
                    </div>
                    
                    <div className="space-y-2 md:col-span-2">
                      <Label htmlFor="description">Full Description</Label>
                    <Textarea 
                      id="description" 
                      rows={5}
                        value={form.description || ""} 
                        onChange={e => handleChange("description", e.target.value)}
                        placeholder="Detailed product description" 
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
                      <Label htmlFor="weight">Weight (g)</Label>
                      <Input 
                        id="weight" 
                        type="number"
                        step="0.1" 
                        value={form.weight?.toString() || ""} 
                        onChange={e => handleChange("weight", parseFloat(e.target.value))} 
                        min="0"
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="length">Length (cm)</Label>
                    <Input 
                      id="length" 
                      type="number"
                      step="0.1" 
                        value={form.dimensions?.length?.toString() || ""} 
                        onChange={e => handleChange("dimensions", {
                          ...form.dimensions,
                          length: parseFloat(e.target.value)
                        })} 
                        min="0"
                    />
                  </div>
                  
                  <div className="space-y-2">
                      <Label htmlFor="width">Width (cm)</Label>
                    <Input 
                      id="width" 
                      type="number"
                      step="0.1" 
                        value={form.dimensions?.width?.toString() || ""} 
                        onChange={e => handleChange("dimensions", {
                          ...form.dimensions,
                          width: parseFloat(e.target.value)
                        })} 
                        min="0"
                    />
                  </div>
                  
                  <div className="space-y-2">
                      <Label htmlFor="height">Height (cm)</Label>
                    <Input 
                      id="height" 
                      type="number"
                      step="0.1" 
                        value={form.dimensions?.height?.toString() || ""} 
                        onChange={e => handleChange("dimensions", {
                          ...form.dimensions,
                          height: parseFloat(e.target.value)
                        })} 
                        min="0"
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle>SEO Settings</CardTitle>
                  <CardDescription>
                    Search engine optimization
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="grid grid-cols-1 gap-6">
                    <div className="space-y-2">
                      <Label htmlFor="metaTitle">Meta Title</Label>
                      <Input 
                        id="metaTitle" 
                        value={form.metaTitle || ""} 
                        onChange={e => handleChange("metaTitle", e.target.value)} 
                        placeholder="SEO title" 
                    />
                  </div>
                  
                  <div className="space-y-2">
                      <Label htmlFor="metaDescription">Meta Description</Label>
                      <Textarea 
                        id="metaDescription" 
                        rows={2}
                        value={form.metaDescription || ""} 
                        onChange={e => handleChange("metaDescription", e.target.value)}
                        placeholder="SEO description" 
                    />
                  </div>
                  
                    <div className="space-y-2">
                      <Label htmlFor="metaKeywords">Meta Keywords</Label>
                    <Input 
                        id="metaKeywords" 
                        value={form.metaKeywords || ""} 
                        onChange={e => handleChange("metaKeywords", e.target.value)} 
                        placeholder="keyword1, keyword2, keyword3" 
                    />
                      <p className="text-sm text-muted-foreground">Separate keywords with commas</p>
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
                    <Label htmlFor="stockQuantity">Stock Quantity <span className="text-destructive">*</span></Label>
                  <Input 
                      id="stockQuantity" 
                    type="number" 
                      value={form.stockQuantity?.toString() || "0"} 
                      onChange={e => handleChange("stockQuantity", parseInt(e.target.value))}
                      required
                      min="0" 
                  />
                </div>
                
                  <div className="border-t pt-4">
                    <h3 className="text-sm font-medium mb-2">Product Status</h3>
                <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <div className="space-y-0.5">
                          <Label htmlFor="active">Active</Label>
                          <p className="text-sm text-muted-foreground">
                            Product is visible and purchasable
                          </p>
                        </div>
                        <Switch 
                          id="active"
                          checked={form.isActive}
                          onCheckedChange={checked => handleChange("isActive", checked)}
                        />
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <div className="space-y-0.5">
                          <Label htmlFor="featured">Featured</Label>
                          <p className="text-sm text-muted-foreground">
                            Show in featured sections
                          </p>
                        </div>
                        <Switch 
                          id="featured"
                          checked={form.isFeatured}
                          onCheckedChange={checked => handleChange("isFeatured", checked)}
                        />
                      </div>
                
                      <div className="space-y-2">
                        <Label htmlFor="visibility">Visibility</Label>
                        <Select 
                          value={form.visibility} 
                          onValueChange={value => handleChange("visibility", value)}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Select visibility" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="PUBLIC">Public (visible to all)</SelectItem>
                            <SelectItem value="PRIVATE">Private (restricted access)</SelectItem>
                            <SelectItem value="HIDDEN">Hidden (not visible in listings)</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                </div>
              </CardContent>
            </Card>
            
            <Card ref={imagesRef}>
              <CardHeader>
                <CardTitle>Images</CardTitle>
                <CardDescription>
                  Product photos
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Add Image URL form */}
                <div className="space-y-3">
                  <h4 className="text-sm font-medium">Add Image by URL</h4>
                  <div className="flex gap-2 items-center">
                    <Button 
                      type="button" 
                      size="sm"
                      onClick={() => {
                        const urlInput = document.getElementById("add-image-url") as HTMLInputElement;
                        const altInput = document.getElementById("add-image-alt") as HTMLInputElement;
                        if (urlInput && urlInput.value) {
                          addImageFromUrl(urlInput.value, altInput?.value || "");
                          urlInput.value = "";
                          if (altInput) altInput.value = "";
                        }
                      }}
                    >
                      <Plus className="h-4 w-4 mr-1" />
                      Add
                    </Button>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-2 flex-1">
                      <Input 
                        id="add-image-url" 
                        placeholder="https://example.com/image.jpg" 
                      />
                      <Input 
                        id="add-image-alt" 
                        placeholder="Image description" 
                      />
                    </div>
                  </div>
                </div>
                
                {/* Existing Images */}
                <div className="border-t my-4 pt-4">
                  <h4 className="font-medium mb-2">Product Images ({images.length})</h4>
                  
                  {images.length === 0 ? (
                    <p className="text-sm text-muted-foreground text-center py-4">
                      No images added yet. Add an image using the form above or upload a file below.
                    </p>
                  ) : (
                    <div className="space-y-3">
                      {images.map((image, index) => (
                        <div 
                          key={index}
                          className="border rounded-md p-3 flex flex-col sm:flex-row items-start sm:items-center gap-3"
                        >
                          <div className="flex items-center gap-1">
                            <Button 
                              type="button" 
                              variant="ghost" 
                              size="sm"
                              disabled={index === 0} 
                              onClick={() => moveImage(index, index - 1)}
                              className="px-1"
                            >
                              ↑
                            </Button>
                            <Button 
                              type="button"
                              variant="ghost" 
                              size="sm"
                              disabled={index === images.length - 1} 
                              onClick={() => moveImage(index, index + 1)}
                              className="px-1"
                            >
                              ↓
                            </Button>
                            <div className="font-mono font-medium">
                              {index === 0 ? (
                                <span className="text-xs text-primary font-bold">Primary</span>
                              ) : (
                                <span className="text-xs text-muted-foreground">#{index + 1}</span>
                              )}
                            </div>
                          </div>
                          
                          <div className="w-16 h-16 rounded border overflow-hidden flex-shrink-0 mr-2">
                            <Image 
                              src={image.imageUrl} 
                              alt={image.altText || "Product image"} 
                              width={64}
                              height={64}
                              className="w-full h-full object-contain"
                              onError={(e) => {
                                const target = e.target as HTMLImageElement;
                                target.src = "https://placehold.co/100x100?text=Error";
                              }}
                            />
                          </div>
                          
                          <div className="flex-grow min-w-0">
                            <div className="text-sm truncate">{image.imageUrl}</div>
                            <div className="text-xs text-muted-foreground truncate">
                              {image.altText || "No alt text"}
                            </div>
                          </div>
                
                          <div className="flex gap-1">
                            <Button 
                              type="button"
                              variant="ghost"
                              size="sm"
                              onClick={() => {
                                // Create a prompt to edit the image details
                                const newUrl = window.prompt(
                                  "Edit image URL:", 
                                  image.imageUrl
                                );
                                if (newUrl !== null) {
                                  const newAlt = window.prompt(
                                    "Edit alt text:", 
                                    image.altText || ""
                                  );
                                  if (newAlt !== null) {
                                    editImage(index, newUrl, newAlt);
                                  }
                                }
                              }}
                              className="px-2 h-8"
                            >
                              Edit
                            </Button>
                            <Button 
                              type="button"
                              variant="ghost"
                              size="sm"
                              onClick={() => removeExistingImage(image.id!)}
                              className="text-destructive hover:text-destructive px-2 h-8"
                            >
                              <Trash className="h-3 w-3" />
                            </Button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
                
                  <label className="border-2 border-dashed rounded-lg p-6 text-center cursor-pointer hover:bg-muted/50 block">
                    <div className="flex flex-col items-center gap-1">
                      <Upload className="h-6 w-6 text-muted-foreground" />
                      <p className="text-sm font-medium">
                    Drag & drop product images here or click to upload
                  </p>
                      <p className="text-xs text-muted-foreground">
                    (Max 5MB each, up to 5 images)
                  </p>
                </div>
                    <input 
                      type="file" 
                      accept="image/*" 
                      multiple 
                      onChange={handleFileChange} 
                      className="hidden" 
                    />
                  </label>
                  
                  {/* Selected files preview */}
                  {selectedFiles.length > 0 && (
                    <div className="space-y-3 mt-4">
                      <h4 className="text-sm font-medium">Selected Files:</h4>
                      <div className="grid grid-cols-2 gap-2">
                        {selectedFiles.map((file, index) => (
                          <div key={index} className="relative rounded-md border bg-muted p-1">
                            <div className="aspect-square w-full overflow-hidden rounded-sm">
                              <img
                                src={URL.createObjectURL(file)}
                                alt={file.name}
                                className="h-full w-full object-cover"
                              />
                            </div>
                            <div className="absolute -top-1 -right-1">
                              <Button
                                type="button"
                                variant="destructive"
                                size="icon"
                                className="h-5 w-5 rounded-full"
                                onClick={() => removeSelectedFile(index)}
                              >
                                <X className="h-3 w-3" />
                              </Button>
                            </div>
                            <div className="mt-1 truncate text-xs text-muted-foreground px-1">
                              {file.name.length > 20 ? `${file.name.slice(0, 17)}...` : file.name}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Existing images display - original code */}
                  {images.length > 0 && (
                    <div className="space-y-3 mt-4 hidden">
                      <div className="flex items-center justify-between">
                        <h4 className="text-sm font-medium">Current Images:</h4>
                        <Badge variant="outline" className="text-xs">
                          {images.length} image{images.length !== 1 ? 's' : ''}
                        </Badge>
                      </div>
                      <div className="grid grid-cols-2 gap-2">
                        {images.map((image, idx) => (
                          <div key={image.id || `image-${idx}`} className="relative rounded-md border bg-muted p-1">
                            <div className="aspect-square w-full overflow-hidden rounded-sm">
                              <Image
                                src={image.imageUrl}
                                alt={image.altText || "Product image"}
                                width={200}
                                height={200}
                                className="h-full w-full object-cover"
                              />
                            </div>
                            <div className="absolute -top-1 -right-1">
                              <Button
                                type="button"
                                variant="destructive"
                                size="icon"
                                className="h-5 w-5 rounded-full"
                                onClick={() => removeExistingImage(image.id!)}
                              >
                                <X className="h-3 w-3" />
                              </Button>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
              </CardContent>
            </Card>
          </div>
        </div>
        
        {/* Add Specifications Section */}
        <div className="mt-8">
          <Tabs defaultValue="view" className="w-full">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-2xl font-bold">Technical Specifications</h2>
              <TabsList>
                <TabsTrigger value="view">View</TabsTrigger>
                <TabsTrigger value="edit">Edit</TabsTrigger>
              </TabsList>
            </div>
            
            <TabsContent value="view" className="mt-0">
              <ProductSpecificationsDisplay productId={productId} />
            </TabsContent>
            
            <TabsContent value="edit" className="mt-0">
              <ProductSpecificationsForm 
                productId={productId} 
                categoryId={categoryId} 
              />
            </TabsContent>
          </Tabs>
        </div>
        
        <Card className="border-destructive/50 mt-8">
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
                <Button 
                  variant="destructive"
                  type="button"
                  onClick={() => setDeleteDialogOpen(true)}
                  disabled={submitting}
                >
                Delete Product
              </Button>
            </div>
          </CardContent>
        </Card>
        </div>
      </form>
      
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently delete the product "{product.title}". This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={submitting}>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              disabled={submitting}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              {submitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Deleting...
                </>
              ) : (
                <>
                  <Trash className="mr-2 h-4 w-4" />
                  Delete
                </>
              )}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </MainLayout>
  );
} 