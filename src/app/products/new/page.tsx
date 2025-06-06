"use client";

import { MainLayout } from "@/components/MainLayout";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { ArrowLeft, GripVertical, Plus, Trash, Upload, Save, X, Eye } from "lucide-react";
import Link from "next/link";
import { useState, useEffect, useRef, useCallback, useMemo } from "react";
import { useRouter } from "next/navigation";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { 
  productsApi, 
  CreateProductDto, 
  Dimensions, 
  CreateProductImageDto,
  CreateProductVariantDto
} from "@/lib/api/products-api";
import { categoriesApi } from "@/lib/api/categories-api";
import { brandsApi } from "@/lib/api/brands-api";
import { tagsApi } from "@/lib/api/tags-api";
import {
  saveProductDraft,
  loadProductDraft,
  clearProductDraft,
  determineCompletedSections,
  ProductDraftSection
} from "@/lib/product-draft-utils";
import { toast } from "sonner";
import { FormTooltip } from "@/components/ui/form-tooltip";
import dynamic from "next/dynamic";
import { getSafeImageSrc, truncateText } from "@/lib/utils";
import { useProductPreview, PreviewProduct } from "@/hooks/useProductPreview";

// Lazy load components with a different name
const LazyProductFormProgress = dynamic(
  () => import("@/components/ProductFormProgress").then(mod => mod.ProductFormProgress),
  { ssr: false }
);

const LazyProductDraftAlert = dynamic(
  () => import("@/components/ProductDraftAlert").then(mod => mod.ProductDraftAlert),
  { ssr: false }
);

const ProductPreviewModal = dynamic(() => import("@/components/ProductPreviewModal").then(mod => mod.ProductPreviewModal), { ssr: false });

export default function NewProductPage() {
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  // Add this for auto-save timer
  const autoSaveTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  
  // Add state for tracking completed sections and draft
  const [completedSections, setCompletedSections] = useState<ProductDraftSection[]>([]);
  const [hasDraft, setHasDraft] = useState<boolean>(false);
  const [draftId, setDraftId] = useState<string>("");
  const [showDraftAlert, setShowDraftAlert] = useState<boolean>(false);
  const [lastSaved, setLastSaved] = useState<number | null>(null);
  
  // Form state
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [shortDescription, setShortDescription] = useState("");
  const [price, setPrice] = useState<string>("");
  const [discountPrice, setDiscountPrice] = useState<string>("");
  const [sku, setSku] = useState("");
  const [barcode, setBarcode] = useState("");
  const [weight, setWeight] = useState<string>("");
  const [length, setLength] = useState<string>("");
  const [width, setWidth] = useState<string>("");
  const [height, setHeight] = useState<string>("");
  const [stockQuantity, setStockQuantity] = useState<string>("0");
  const [brandId, setBrandId] = useState<string>("");
  const [categoryId, setCategoryId] = useState<string>("");
  const [subCategoryId, setSubCategoryId] = useState<string>("");
  const [isActive, setIsActive] = useState(true);
  const [isFeatured, setIsFeatured] = useState(false);
  const [visibility, setVisibility] = useState<"PUBLIC" | "PRIVATE" | "HIDDEN">("PUBLIC");
  const [metaTitle, setMetaTitle] = useState("");
  const [metaDescription, setMetaDescription] = useState("");
  const [metaKeywords, setMetaKeywords] = useState("");
  const [productImages, setProductImages] = useState<CreateProductImageDto[]>([]);
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [currency, setCurrency] = useState<string>("INR");
  const [variants, setVariants] = useState<CreateProductVariantDto[]>([]);
  const [uploadingImage, setUploadingImage] = useState(false);
  
  // Form validation and submission state
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  // Data loading state
  const [categories, setCategories] = useState<any[]>([]);
  const [allCategories, setAllCategories] = useState<any[]>([]);
  const [subcategories, setSubcategories] = useState<any[]>([]);
  const [brands, setBrands] = useState<any[]>([]);
  const [tags, setTags] = useState<any[]>([]);
  const [loadingCategories, setLoadingCategories] = useState(false);
  const [loadingBrands, setLoadingBrands] = useState(false);
  const [loadingTags, setLoadingTags] = useState(false);
  const [loadingSubcategories, setLoadingSubcategories] = useState(false);
  
  // Available currencies
  const currencies = [
    { code: "INR", name: "Indian Rupee (₹)" },
    { code: "USD", name: "US Dollar ($)" },
    { code: "EUR", name: "Euro (€)" },
    { code: "GBP", name: "British Pound (£)" },
    { code: "JPY", name: "Japanese Yen (¥)" },
    { code: "CAD", name: "Canadian Dollar (C$)" },
    { code: "AUD", name: "Australian Dollar (A$)" }
  ];
  
  // Add product preview functionality
  const { 
    isPreviewOpen,
    previewDevice,
    previewContext,
    togglePreview,
    openPreview,
    closePreview,
    setPreviewDevice,
    setPreviewContext
  } = useProductPreview();
  
  // Fetch categories, brands, and tags on page load
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoadingCategories(true);
        setLoadingBrands(true);
        setLoadingTags(true);
        
        const [categoryTreeData, brandsData, tagsData] = await Promise.all([
          categoriesApi.getCategoryTree(),
          brandsApi.getBrands(),
          tagsApi.getTags()
        ]);
        
        // Create a flat list of all categories
        const flattenCategories = (categories: any[], parentId: string | null = null): any[] => {
          return categories.reduce((acc, category) => {
            const children = category.children || [];
            const current = { 
              ...category, 
              parentId
            };
            
            // Remove the children property from the current category
            delete current.children;
            
            return [...acc, current, ...flattenCategories(children, category.id)];
          }, []);
        };
        
        const allCategories = flattenCategories(categoryTreeData);
        
        // Get parent categories (those without parentId)
        const parentCategories = allCategories.filter(cat => !cat.parentId);
        
        setCategories(parentCategories);
        // Store all categories for filtering subcategories later
        setAllCategories(allCategories);
        setBrands(brandsData);
        setTags(tagsData);
      } catch (error) {
        console.error("Error fetching data:", error);
        setError("Failed to load required data. Please try again.");
      } finally {
        setLoadingCategories(false);
        setLoadingBrands(false);
        setLoadingTags(false);
      }
    };
    
    fetchData();
  }, []);
  
  // Update subcategories when category changes
  useEffect(() => {
    if (categoryId) {
      setLoadingSubcategories(true);
      // Reset subcategory selection when parent category changes
      setSubCategoryId("");
      
      // Filter all categories to find subcategories of the selected category
      const subs = allCategories.filter(cat => cat.parentId === categoryId);
      setSubcategories(subs);
      
      setLoadingSubcategories(false);
    } else {
      // Clear subcategories when no parent category is selected
      setSubcategories([]);
      setSubCategoryId("");
    }
  }, [categoryId, allCategories]);
  
  // Generate SKU for product
  const generateSku = (title: string): string => {
    if (!title.trim()) return "";
    
    // Extract prefix from title (first 3 characters, uppercase)
    const prefix = title
      .substring(0, 3)
      .toUpperCase()
      .replace(/[^A-Z0-9]/g, '');
    
    // Add timestamp and random string for uniqueness
    const timestamp = Date.now().toString().slice(-6);
    const random = Math.random().toString(36).substring(2, 5).toUpperCase();
    
    return `${prefix}-${timestamp}-${random}`;
  };
  
  // Generate SKU for variant
  const generateVariantSku = (baseSku: string, variantName: string): string => {
    if (!baseSku.trim() || !variantName.trim()) return "";
    
    // Extract suffix from variant name (first 5 characters, uppercase)
    const variantSuffix = variantName
      .substring(0, 5)
      .toUpperCase()
      .replace(/[^A-Z0-9]/g, '')
      .padEnd(5, 'X');
    
    return `${baseSku}-${variantSuffix}`;
  };
  
  // Update SKU when title changes
  useEffect(() => {
    if (title && !sku) {
      setSku(generateSku(title));
    }
  }, [title, sku]);
  
  // Add a new variant with auto-generated SKU
  const addVariant = () => {
    const variantName = "";
    const variantSku = sku ? generateVariantSku(sku, variantName) : "";
    
    setVariants([
      ...variants,
      {
        variantName,
        sku: variantSku,
        stockQuantity: 0,
        price: Number(price) || 0,  // Use the main product price as default
        additionalPrice: 0
      }
    ]);
  };
  
  // Update a variant
  const updateVariant = (index: number, field: keyof CreateProductVariantDto, value: any) => {
    const updatedVariants = [...variants];
    updatedVariants[index] = {
      ...updatedVariants[index],
      [field]: field === 'stockQuantity' || field === 'price' || field === 'additionalPrice' 
        ? Number(value) || 0 // Ensure we always have a number, default to 0
        : value
    };
    
    // Auto-generate SKU when variant name changes
    if (field === 'variantName' && sku) {
      updatedVariants[index].sku = generateVariantSku(sku, value);
    }
    
    setVariants(updatedVariants);
  };
  
  // Remove a variant
  const removeVariant = (index: number) => {
    const updatedVariants = variants.filter((_, i) => i !== index);
    setVariants(updatedVariants);
  };
  
  // Add a new image from URL
  const addImageFromUrl = (url: string, altText: string) => {
    if (!url.trim()) return;
    
    // Basic URL validation
    let validUrl = url;
    // If URL doesn't start with http or https, assume it's http
    if (!url.match(/^https?:\/\//i)) {
      validUrl = `https://${url}`;
    }
    
    const newImage: CreateProductImageDto = {
      imageUrl: validUrl,
      altText: altText || title || "Product image",
      position: productImages.length
    };
    
    setProductImages([...productImages, newImage]);
  };
  
  // Update an image
  const updateImage = (index: number, field: keyof CreateProductImageDto, value: string) => {
    const updatedImages = [...productImages];
    
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
    
    setProductImages(updatedImages);
  };
  
  // Remove an image
  const removeImage = (index: number) => {
    const updatedImages = productImages.filter((_, i) => i !== index);
    // Update positions after removal
    const reorderedImages = updatedImages.map((img, i) => ({
      ...img,
      position: i
    }));
    setProductImages(reorderedImages);
  };
  
  // Handle file selection
  const handleFileSelect = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (!files || files.length === 0) return;
    
    setUploadingImage(true);
    
    try {
      const file = files[0];
      // Use the URL directly without going through FileReader
      addImageFromUrl(getSafeImageSrc(file), file.name);
          setUploadingImage(false);
      
      // Reset the file input
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    } catch (error) {
      console.error("Error handling file:", error);
      setError("Failed to process the selected image.");
      setUploadingImage(false);
    }
  };
  
  // Handle drag and drop
  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
  };
  
  const handleDrop = async (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      setUploadingImage(true);
      
      try {
        const file = e.dataTransfer.files[0];
        // Use the URL directly without going through FileReader
        addImageFromUrl(getSafeImageSrc(file), file.name);
            setUploadingImage(false);
      } catch (error) {
        console.error("Error handling dropped file:", error);
        setError("Failed to process the dropped image.");
        setUploadingImage(false);
      }
    }
  };
  
  // Reorder images
  const moveImage = (fromIndex: number, toIndex: number) => {
    if (toIndex < 0 || toIndex >= productImages.length) return;
    
    const updatedImages = [...productImages];
    const [movedItem] = updatedImages.splice(fromIndex, 1);
    updatedImages.splice(toIndex, 0, movedItem);
    
    // Update positions after reordering
    const reorderedImages = updatedImages.map((img, i) => ({
      ...img,
      position: i
    }));
    
    setProductImages(reorderedImages);
  };
  
  // Memoize the dimensions object to prevent unnecessary re-renders
  const dimensions = useMemo(() => ({
    length: length || "",
    width: width || "",
    height: height || ""
  }), [length, width, height]);
  
  // Memoize the filtered subcategories
  const filteredSubcategories = useMemo(() => {
    if (!categoryId) return [];
    return allCategories.filter(cat => cat.parentId === categoryId);
  }, [categoryId, allCategories]);
  
  // Optimize image URLs by using a lazy-access approach
  const imageObjectURLs = useMemo(() => {
    return productImages.map(image => ({ 
      image, 
      // Use helper function to safely create object URL
      url: getSafeImageSrc(image.imageUrl)
    }));
  }, [productImages]);
  
  // Update the form validation function to be memoized
  const validateForm = useCallback((): boolean => {
    const newErrors: { [key: string]: string } = {};
    
    // Validate required fields
    if (!title.trim()) newErrors.title = "Product title is required";
    if (!sku.trim()) newErrors.sku = "SKU is required";
    if (!price || isNaN(Number(price)) || Number(price) <= 0) {
      newErrors.price = "Valid price is required";
    }
    
    // Validate variants
    variants.forEach((variant, index) => {
      if (!variant.variantName) {
        newErrors[`variant_${index}_name`] = "Variant name is required";
      }
      if (!variant.sku) {
        newErrors[`variant_${index}_sku`] = "Variant SKU is required";
      }
      if (variant.price <= 0) {
        newErrors[`variant_${index}_price`] = "Variant price must be greater than 0";
      }
    });
    
    // Validate image URLs
    productImages.forEach((image, index) => {
      if (!image.imageUrl) {
        newErrors[`image_${index}_url`] = "Image URL is required";
      }
      
      // Check if URL is valid
      try {
        new URL(image.imageUrl);
      } catch (e) {
        newErrors[`image_${index}_url`] = "Image URL is not valid";
      }
    });
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }, [title, sku, price, variants, productImages]);
  
  // If the selected files are possibly large images, optimize rendering
  const renderedSelectedFiles = useMemo(() => {
    if (productImages.length === 0) return null;
    
    return (
      <div className="space-y-3 mt-4">
        <h4 className="text-sm font-medium">Selected Files:</h4>
        <div className="grid grid-cols-2 gap-2">
          {productImages.map((image, index) => (
            <div key={index} className="relative rounded-md border bg-muted p-1">
              <div className="aspect-square w-full overflow-hidden rounded-sm">
                <img
                  src={getSafeImageSrc(image.imageUrl)}
                  alt={truncateText(image.altText, 20)}
                  className="h-full w-full object-cover"
                />
              </div>
              <div className="absolute -top-1 -right-1">
                <Button
                  type="button"
                  variant="destructive"
                  size="icon"
                  className="h-5 w-5 rounded-full"
                  onClick={() => removeImage(index)}
                >
                  <X className="h-3 w-3" />
                </Button>
              </div>
              <div className="mt-1 truncate text-xs text-muted-foreground px-1">
                {truncateText(image.altText, 20)}
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }, [productImages]);
  
  // Function to collect all form data
  const collectFormData = useCallback(() => {
    return {
      title,
      description,
      shortDescription,
      price,
      discountPrice,
      sku,
      barcode,
      weight,
      dimensions,
      stockQuantity,
      brandId,
      categoryId,
      subCategoryId,
      isActive,
      isFeatured,
      visibility,
      metaTitle,
      metaDescription,
      metaKeywords,
      productImages,
      selectedTags,
      currency,
      variants,
    };
  }, [
    title, description, shortDescription, price, discountPrice,
    sku, barcode, weight, dimensions, stockQuantity,
    brandId, categoryId, subCategoryId, isActive, isFeatured,
    visibility, metaTitle, metaDescription, metaKeywords,
    productImages, selectedTags, currency, variants
  ]);

  // Auto-save function
  const autoSaveDraft = useCallback(() => {
    if (autoSaveTimerRef.current) {
      clearTimeout(autoSaveTimerRef.current);
    }
    
    autoSaveTimerRef.current = setTimeout(() => {
      try {
        const formData = collectFormData();
        
        // Only save if there's at least some data (title or SKU)
        if (formData.title || formData.sku) {
          // Determine completed sections
          const sections = determineCompletedSections(formData);
          setCompletedSections(sections);
          
          // Save draft
          const newDraftId = saveProductDraft(formData, sections, draftId, true);
          setDraftId(newDraftId);
          setHasDraft(true);
          setLastSaved(Date.now());
        }
      } catch (error) {
        console.error("Auto-save error:", error);
      }
    }, 3000); // Auto-save after 3 seconds of inactivity
  }, [collectFormData, draftId]);

  // Function to manually save draft
  const saveDraft = useCallback(() => {
    try {
      const formData = collectFormData();
      const sections = determineCompletedSections(formData);
      setCompletedSections(sections);
      
      const newDraftId = saveProductDraft(formData, sections, draftId);
      setDraftId(newDraftId);
      setHasDraft(true);
      setLastSaved(Date.now());
    } catch (error) {
      console.error("Save draft error:", error);
    }
  }, [collectFormData, draftId]);

  // Function to load draft
  const loadDraft = useCallback(() => {
    const draft = loadProductDraft();
    
    if (draft && draft.data) {
      // Set form fields from draft data
      const data = draft.data;
      
      // Basic info
      if (data.title) setTitle(data.title);
      if (data.description) setDescription(data.description);
      if (data.shortDescription) setShortDescription(data.shortDescription);
      if (data.price) setPrice(data.price.toString());
      if (data.discountPrice) setDiscountPrice(data.discountPrice.toString());
      if (data.sku) setSku(data.sku);
      if (data.barcode) setBarcode(data.barcode);
      
      // Dimensions
      if (data.dimensions?.length) setLength(data.dimensions.length.toString());
      if (data.dimensions?.width) setWidth(data.dimensions.width.toString());
      if (data.dimensions?.height) setHeight(data.dimensions.height.toString());
      if (data.weight) setWeight(data.weight.toString());
      
      // Inventory
      if (data.stockQuantity) setStockQuantity(data.stockQuantity.toString());
      
      // Categories and relations
      if (data.brandId) setBrandId(data.brandId);
      if (data.categoryId) setCategoryId(data.categoryId);
      if (data.subCategoryId) setSubCategoryId(data.subCategoryId);
      
      // Product status
      if (data.isActive !== undefined) setIsActive(data.isActive);
      if (data.isFeatured !== undefined) setIsFeatured(data.isFeatured);
      if (data.visibility) setVisibility(data.visibility);
      
      // SEO
      if (data.metaTitle) setMetaTitle(data.metaTitle);
      if (data.metaDescription) setMetaDescription(data.metaDescription);
      if (data.metaKeywords) setMetaKeywords(data.metaKeywords);
      
      // Complex arrays
      if (data.productImages) setProductImages(data.productImages);
      if (data.selectedTags) setSelectedTags(data.selectedTags);
      if (data.variants) setVariants(data.variants);
      if (data.currency) setCurrency(data.currency);
      
      // Update state
      setDraftId(draft.draftId);
      setHasDraft(true);
      setLastSaved(draft.lastUpdated);
      setCompletedSections(draft.completedSections);
      setShowDraftAlert(false);
      
      toast.success("Draft loaded", {
        description: "Your saved work has been restored"
      });
    }
  }, []);

  // Function to discard draft
  const discardDraft = useCallback(() => {
    clearProductDraft(false);
    setHasDraft(false);
    setDraftId("");
    setShowDraftAlert(false);
  }, []);
  
  // Set up form field change listeners to trigger auto-save
  useEffect(() => {
    autoSaveDraft();
  }, [
    title, description, shortDescription, price, discountPrice,
    sku, barcode, weight, length, width, height, stockQuantity,
    brandId, categoryId, subCategoryId, isActive, isFeatured,
    visibility, metaTitle, metaDescription, metaKeywords,
    productImages, selectedTags, currency, variants,
    autoSaveDraft
  ]);
  
  // Check for existing draft on initial load
  useEffect(() => {
    const draft = loadProductDraft();
    if (draft) {
      setShowDraftAlert(true);
      setDraftId(draft.draftId);
      setHasDraft(true);
      setLastSaved(draft.lastUpdated);
      setCompletedSections(draft.completedSections);
    }
  }, []);
  
  // Clear auto-save timer on unmount
  useEffect(() => {
    return () => {
      if (autoSaveTimerRef.current) {
        clearTimeout(autoSaveTimerRef.current);
      }
    };
  }, []);
  
  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      // Scroll to the first error
      const firstErrorEl = document.querySelector(".border-destructive");
      if (firstErrorEl) {
        firstErrorEl.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
      return;
    }
    
    setSubmitting(true);
    setError(null);
    
    try {
      // Prepare dimensions object if any dimension field is provided
      let dimensions: Dimensions | undefined;
      if (length || width || height) {
        dimensions = {
          length: Number(length) || 0,
          width: Number(width) || 0,
          height: Number(height) || 0
        };
      }
      
      // Create product data object
      const productData: CreateProductDto = {
        title: title.trim(),
        sku: sku.trim(),
        price: Number(price),
      };
      
      // Add optional fields if they have values
      if (description) productData.description = description;
      if (shortDescription) productData.shortDescription = shortDescription;
      if (discountPrice) productData.discountPrice = Number(discountPrice);
      if (stockQuantity) productData.stockQuantity = Number(stockQuantity);
      if (barcode) productData.barcode = barcode;
      if (weight) productData.weight = Number(weight);
      if (dimensions) productData.dimensions = dimensions;
      if (brandId) productData.brandId = brandId;
      if (categoryId) productData.categoryId = categoryId;
      if (subCategoryId) productData.subCategoryId = subCategoryId;
      if (metaTitle) productData.metaTitle = metaTitle;
      if (metaDescription) productData.metaDescription = metaDescription;
      if (metaKeywords) productData.metaKeywords = metaKeywords;
      if (productImages.length > 0) productData.images = productImages;
      if (selectedTags.length > 0) productData.tagIds = selectedTags;
      if (variants.length > 0) {
        // Ensure all variants have proper price values
        productData.variants = variants.map(variant => ({
          ...variant,
          price: variant.price > 0 ? variant.price : Number(price),
          additionalPrice: variant.additionalPrice || 0,
          stockQuantity: variant.stockQuantity || 0
        }));
      }
      
      // These properties have default values
      productData.isActive = isActive;
      productData.isFeatured = isFeatured;
      productData.visibility = visibility;
      productData.currency = currency;
      
      console.log("Creating product with data:", productData);
      
      // Call API to create product
      const result = await productsApi.createProduct(productData);
      console.log("Product created successfully:", result);
      
      // Add this at the end after successful creation
      clearProductDraft(true); // Silently clear the draft
      
      // Navigate to product detail page
      router.push(`/products/${result.id}`);
    } catch (error: any) {
      console.error("Error creating product:", error);
      
      // Extract error message from API response
      let errorMessage = "Failed to create product";
      if (error.response) {
        if (error.response.data && error.response.data.message) {
          // Handle array of error messages
          if (Array.isArray(error.response.data.message)) {
            errorMessage = error.response.data.message.join('\n');
          } else {
          errorMessage = error.response.data.message;
          }
        } else if (error.response.status === 400) {
          errorMessage = "Invalid product data. Please check all required fields.";
        } else if (error.response.status === 401) {
          errorMessage = "You are not authorized to create products";
        }
      } else if (error.message) {
        errorMessage = error.message;
      }
      
      setError(errorMessage);
    } finally {
      setSubmitting(false);
    }
  };
  
  // Handle tag selection
  const toggleTag = (tagId: string) => {
    setSelectedTags(prev => 
      prev.includes(tagId) 
        ? prev.filter(id => id !== tagId) 
        : [...prev, tagId]
    );
  };

  // Build a preview-ready product object from form data
  const previewProduct: PreviewProduct = {
    title: title || "New Product",
    shortDescription: shortDescription || "",
    description: description || "",
    price,
    discountPrice,
    images: productImages.map(img => ({
      imageUrl: img.imageUrl,
      altText: img.altText
    })),
    brand: brandId ? { 
      name: brands.find(b => b.id === brandId)?.name || '' 
    } : undefined,
    category: categoryId ? { 
      name: categories.find(c => c.id === categoryId)?.name || '' 
    } : undefined,
    isActive,
    isFeatured,
    currency
  };

  return (
    <MainLayout>
      <form onSubmit={handleSubmit}>
        <div className="flex flex-col gap-5">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Link href="/products" className="rounded-full w-8 h-8 flex items-center justify-center bg-muted hover:bg-muted/80">
                <ArrowLeft className="h-4 w-4" />
              </Link>
              <h1 className="text-3xl font-bold">Add New Product</h1>
            </div>
            <div className="flex gap-2">
              <Button 
                type="button" 
                variant="outline" 
                onClick={togglePreview}
                title="Preview product"
              >
                <Eye className="mr-2 h-4 w-4" />
                Preview
              </Button>
              <Button 
                type="button" 
                variant="outline"
                onClick={saveDraft}
                disabled={submitting}
              >
                <Save className="mr-2 h-4 w-4" />
                Save Draft
              </Button>
              <Button type="submit" disabled={submitting}>
                <Plus className="mr-2 h-4 w-4" />
                {submitting ? "Creating..." : "Create Product"}
              </Button>
            </div>
          </div>
          
          {showDraftAlert && (
            <LazyProductDraftAlert
              draft={{
                data: {},
                lastUpdated: lastSaved || Date.now(),
                completedSections,
                draftId
              }}
              onResume={loadDraft}
              onDiscard={discardDraft}
            />
          )}
          
          {hasDraft && (
            <LazyProductFormProgress
              completedSections={completedSections}
              className="mb-2"
            />
          )}
          
          {error && (
            <div className="bg-destructive/10 border border-destructive text-destructive p-4 rounded-md">
              {error}
            </div>
          )}

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
                      <Label htmlFor="title" className="flex items-center">
                        Product Title*
                        <FormTooltip content="Enter a clear, descriptive title that will help customers find your product. Good titles include key product attributes like brand, model, color or size." />
                      </Label>
                      <Input 
                        id="title" 
                        placeholder="Enter product title" 
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        className={errors.title ? "border-destructive" : ""}
                      />
                      {errors.title && (
                        <p className="text-sm text-destructive">{errors.title}</p>
                      )}
                    </div>

                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <Label htmlFor="sku" className="flex items-center">
                          SKU* (Auto-generated)
                          <FormTooltip content="SKU (Stock Keeping Unit) is a unique identifier for your product. It's used for inventory management and helps track products across your store." />
                        </Label>
                        <Button 
                          type="button" 
                          size="sm" 
                          variant="outline" 
                          className="h-7 text-xs"
                          onClick={() => setSku(generateSku(title))}
                        >
                          Regenerate
                        </Button>
                      </div>
                      <Input 
                        id="sku" 
                        placeholder="Enter SKU code" 
                        value={sku}
                        onChange={(e) => setSku(e.target.value)}
                        className={errors.sku ? "border-destructive" : ""}
                      />
                      {errors.sku && (
                        <p className="text-sm text-destructive">{errors.sku}</p>
                      )}
                      <p className="text-xs text-muted-foreground">
                        SKU is auto-generated based on the product title, but you can edit it manually
                      </p>
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="brand" className="flex items-center">
                        Brand
                        <FormTooltip content="Associating your product with a brand helps with categorization and makes it easier for customers to find related products." />
                      </Label>
                      <Select value={brandId} onValueChange={setBrandId}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select brand" />
                        </SelectTrigger>
                        <SelectContent>
                          {loadingBrands ? (
                            <SelectItem value="loading" disabled>Loading brands...</SelectItem>
                          ) : (
                            brands.map((brand) => (
                              <SelectItem key={brand.id} value={brand.id}>
                                {brand.name}
                              </SelectItem>
                            ))
                          )}
                        </SelectContent>
                      </Select>
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="category" className="flex items-center">
                        Category
                        <FormTooltip content="Categories help organize your products and make them easier to find. Select the most relevant category for this product." />
                      </Label>
                      <Select value={categoryId} onValueChange={setCategoryId}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select category" />
                        </SelectTrigger>
                        <SelectContent>
                          {loadingCategories ? (
                            <SelectItem value="loading" disabled>Loading categories...</SelectItem>
                          ) : (
                            categories.map((category) => (
                              <SelectItem key={category.id} value={category.id}>
                                {category.name}
                              </SelectItem>
                            ))
                          )}
                        </SelectContent>
                      </Select>
                    </div>
                    
                    {categoryId && (
                    <div className="space-y-2">
                        <Label htmlFor="subcategory">Subcategory</Label>
                        <Select value={subCategoryId} onValueChange={setSubCategoryId}>
                          <SelectTrigger>
                            <SelectValue placeholder="Select subcategory" />
                          </SelectTrigger>
                          <SelectContent>
                            {loadingSubcategories ? (
                              <SelectItem value="loading" disabled>Loading subcategories...</SelectItem>
                            ) : subcategories.length > 0 ? (
                              subcategories.map((subcategory) => (
                                <SelectItem key={subcategory.id} value={subcategory.id}>
                                  {subcategory.name}
                                </SelectItem>
                              ))
                            ) : (
                              <SelectItem value="none" disabled>No subcategories available</SelectItem>
                            )}
                          </SelectContent>
                        </Select>
                        <p className="text-xs text-muted-foreground">Optional</p>
                      </div>
                    )}
                    
                    <div className="space-y-2">
                      <Label htmlFor="price" className="flex items-center">
                        Price*
                        <FormTooltip content="Set your product's base price. This is what customers will pay when there's no discount or sale applied." />
                      </Label>
                      <Input 
                        id="price" 
                        type="number"
                        step="0.01" 
                        placeholder="0.00" 
                        value={price}
                        onChange={(e) => setPrice(e.target.value)}
                        className={errors.price ? "border-destructive" : ""}
                      />
                      {errors.price && (
                        <p className="text-sm text-destructive">{errors.price}</p>
                      )}
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="currency">Currency</Label>
                      <Select value={currency} onValueChange={setCurrency}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select currency" />
                        </SelectTrigger>
                        <SelectContent>
                          {currencies.map((curr) => (
                            <SelectItem key={curr.code} value={curr.code}>
                              {curr.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="discountPrice" className="flex items-center">
                        Discount Price
                        <FormTooltip content="Optional discounted price that will be shown as a special offer. Leave empty if your product isn't on sale." />
                      </Label>
                      <Input 
                        id="discountPrice" 
                        type="number"
                        step="0.01" 
                        placeholder="0.00" 
                        value={discountPrice}
                        onChange={(e) => setDiscountPrice(e.target.value)}
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="barcode">Barcode</Label>
                      <Input 
                        id="barcode" 
                        placeholder="Enter barcode" 
                        value={barcode}
                        onChange={(e) => setBarcode(e.target.value)}
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="stockQuantity" className="flex items-center">
                        Stock Quantity*
                        <FormTooltip content="Enter the number of units currently available for sale. This will decrease as orders are placed." />
                      </Label>
                      <Input 
                        id="stockQuantity" 
                        type="number"
                        placeholder="0" 
                        value={stockQuantity}
                        onChange={(e) => setStockQuantity(e.target.value)}
                      />
                    </div>
                                
                    <div className="space-y-2 md:col-span-2">
                      <Label htmlFor="shortDescription">Short Description</Label>
                      <Textarea 
                        id="shortDescription" 
                        rows={2}
                        placeholder="Brief product description" 
                        value={shortDescription}
                        onChange={(e) => setShortDescription(e.target.value)}
                      />
                    </div>
                    
                    <div className="space-y-2 md:col-span-2">
                      <Label htmlFor="description" className="flex items-center">
                        Full Description
                        <FormTooltip content="Provide a comprehensive description including all relevant product details, features, and benefits. Use formatting to make it readable." />
                      </Label>
                      <Textarea 
                        id="description" 
                        rows={5}
                        placeholder="Full product description" 
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle>Product Variants</CardTitle>
                  <CardDescription>
                    Different versions of the product (colors, sizes, etc.)
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  {variants.length > 0 ? (
                    <div className="space-y-6">
                      {variants.map((variant, index) => (
                        <div key={index} className="border rounded-md p-4 space-y-4">
                          <div className="flex justify-between items-center">
                            <h4 className="font-medium">Variant #{index + 1}</h4>
                            <Button 
                              type="button" 
                              variant="ghost" 
                              size="sm"
                              onClick={() => removeVariant(index)}
                            >
                              <Trash className="h-4 w-4" />
                            </Button>
                          </div>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="space-y-2">
                              <Label htmlFor={`variant-${index}-name`}>Variant Name*</Label>
                              <Input 
                                id={`variant-${index}-name`} 
                                placeholder="e.g., Red, XL" 
                                value={variant.variantName}
                                onChange={(e) => updateVariant(index, 'variantName', e.target.value)}
                                className={errors[`variant_${index}_name`] ? "border-destructive" : ""}
                              />
                              {errors[`variant_${index}_name`] && (
                                <p className="text-sm text-destructive">{errors[`variant_${index}_name`]}</p>
                              )}
                            </div>
                            
                            <div className="space-y-2">
                              <Label htmlFor={`variant-${index}-sku`}>Variant SKU* (Auto-generated)</Label>
                              <Input 
                                id={`variant-${index}-sku`} 
                                placeholder="Enter variant SKU" 
                                value={variant.sku}
                                onChange={(e) => updateVariant(index, 'sku', e.target.value)}
                                className={errors[`variant_${index}_sku`] ? "border-destructive" : ""}
                              />
                              {errors[`variant_${index}_sku`] && (
                                <p className="text-sm text-destructive">{errors[`variant_${index}_sku`]}</p>
                              )}
                              <p className="text-xs text-muted-foreground">
                                Auto-generated based on product SKU and variant name
                              </p>
                            </div>
                            
                            <div className="space-y-2">
                              <Label htmlFor={`variant-${index}-price`}>Price (leave empty to use base price)</Label>
                              <Input 
                                id={`variant-${index}-price`} 
                                type="number"
                                step="0.01"
                                placeholder="0.00" 
                                value={variant.price || ""}
                                onChange={(e) => updateVariant(index, 'price', e.target.value || null)}
                              />
                            </div>
                            
                            <div className="space-y-2">
                              <Label htmlFor={`variant-${index}-additional`}>Additional Price</Label>
                              <Input 
                                id={`variant-${index}-additional`} 
                                type="number"
                                step="0.01"
                                placeholder="0.00" 
                                value={variant.additionalPrice || ""}
                                onChange={(e) => updateVariant(index, 'additionalPrice', e.target.value || 0)}
                              />
                            </div>
                            
                            <div className="space-y-2">
                              <Label htmlFor={`variant-${index}-stock`}>Stock Quantity</Label>
                              <Input 
                                id={`variant-${index}-stock`} 
                                type="number"
                                placeholder="0" 
                                value={variant.stockQuantity || 0}
                                onChange={(e) => updateVariant(index, 'stockQuantity', e.target.value || 0)}
                              />
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center text-muted-foreground text-sm p-4">
                      No variants added yet. Add a variant using the button below.
                    </div>
                  )}
                  
                  <Button 
                    type="button"
                    variant="outline"
                    onClick={addVariant}
                    className="w-full"
                  >
                    <Plus className="mr-2 h-4 w-4" />
                    Add Variant
                  </Button>
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
                      <Label htmlFor="length">Length</Label>
                      <Input 
                        id="length" 
                        type="number"
                        step="0.1"
                        value={length}
                        onChange={(e) => setLength(e.target.value)}
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="width">Width</Label>
                      <Input 
                        id="width" 
                        type="number"
                        step="0.1"
                        value={width}
                        onChange={(e) => setWidth(e.target.value)}
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="height">Height</Label>
                      <Input 
                        id="height" 
                        type="number"
                        step="0.1"
                        value={height}
                        onChange={(e) => setHeight(e.target.value)}
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="weight">Weight</Label>
                      <Input 
                        id="weight" 
                        type="number"
                        step="0.01"
                        value={weight}
                        onChange={(e) => setWeight(e.target.value)}
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
                      <Label htmlFor="metaTitle" className="flex items-center">
                        Meta Title
                        <FormTooltip content="The meta title appears in search engine results and browser tabs. Keep it under 60 characters for best SEO practices." />
                      </Label>
                      <Input 
                        id="metaTitle" 
                        placeholder="SEO title" 
                        value={metaTitle}
                        onChange={(e) => setMetaTitle(e.target.value)}
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="metaDescription">Meta Description</Label>
                      <Textarea 
                        id="metaDescription" 
                        rows={3}
                        placeholder="SEO description" 
                        value={metaDescription}
                        onChange={(e) => setMetaDescription(e.target.value)}
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="metaKeywords">Meta Keywords</Label>
                      <Input 
                        id="metaKeywords" 
                        placeholder="keyword1, keyword2, keyword3" 
                        value={metaKeywords}
                        onChange={(e) => setMetaKeywords(e.target.value)}
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
            
            <div className="space-y-5">
              <Card>
                <CardHeader>
                  <CardTitle>Status</CardTitle>
                  <CardDescription>
                    Product visibility settings
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="visibility">Visibility</Label>
                    <Select 
                      value={visibility} 
                      onValueChange={(value: "PUBLIC" | "PRIVATE" | "HIDDEN") => setVisibility(value)}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select visibility" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="PUBLIC">Public</SelectItem>
                        <SelectItem value="PRIVATE">Private</SelectItem>
                        <SelectItem value="HIDDEN">Hidden</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <Checkbox 
                      id="isActive" 
                      checked={isActive}
                      onCheckedChange={(checked) => setIsActive(!!checked)}
                    />
                    <Label htmlFor="isActive">Active Product</Label>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <Checkbox 
                      id="isFeatured" 
                      checked={isFeatured}
                      onCheckedChange={(checked) => setIsFeatured(!!checked)}
                    />
                    <Label htmlFor="isFeatured">Featured Product</Label>
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
                  <div className="flex flex-col space-y-4">
                    <div className="flex items-center justify-between">
                      <Label htmlFor="add-image-url">Add Image URL</Label>
                      <Button 
                        type="button" 
                        size="sm"
                        variant="outline" 
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
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
                  
                  <div className="border-t my-4 pt-4">
                    <h4 className="font-medium mb-2">Product Images ({productImages.length})</h4>
                    
                    {productImages.length === 0 ? (
                      <p className="text-sm text-muted-foreground text-center py-4">
                        No images added yet. Add an image using the form above or upload a file below.
                      </p>
                    ) : (
                      <div className="space-y-3">
                        {productImages.map((image, index) => (
                          <div 
                            key={index}
                            className={`border rounded-md p-3 flex flex-col sm:flex-row items-start sm:items-center gap-3 ${
                              errors[`image_${index}_url`] ? "border-destructive" : ""
                            }`}
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
                                disabled={index === productImages.length - 1} 
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
                              <img 
                                src={getSafeImageSrc(image.imageUrl)} 
                                alt={truncateText(image.altText, 20)} 
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
                                {truncateText(image.altText, 20)}
                              </div>
                              {errors[`image_${index}_url`] && (
                                <p className="text-xs text-destructive">
                                  {errors[`image_${index}_url`]}
                                </p>
                  )}
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
                                      image.altText
                                    );
                                    if (newAlt !== null) {
                                      const updatedImages = [...productImages];
                                      updatedImages[index] = {
                                        ...updatedImages[index],
                                        imageUrl: newUrl,
                                        altText: newAlt
                                      };
                                      setProductImages(updatedImages);
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
                                onClick={() => removeImage(index)}
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
                  
                  <div 
                    className={`border-2 border-dashed rounded-lg p-6 text-center cursor-pointer hover:bg-muted/50 transition-colors ${uploadingImage ? 'opacity-50' : ''}`}
                    onDragOver={handleDragOver}
                    onDrop={handleDrop}
                    onClick={() => fileInputRef.current?.click()}
                  >
                    <input
                      type="file"
                      ref={fileInputRef}
                      accept="image/*"
                      onChange={handleFileSelect}
                      style={{ display: 'none' }}
                    />
                    <Upload className="h-6 w-6 mx-auto mb-2 text-muted-foreground" />
                    {uploadingImage ? (
                    <p className="text-sm text-muted-foreground">
                        Processing image...
                      </p>
                    ) : (
                      <>
                        <p className="text-sm text-muted-foreground">
                          Click to select or drag and drop an image
                    </p>
                    <p className="mt-2 text-xs text-muted-foreground">
                          PNG, JPG, GIF up to 5MB
                    </p>
                      </>
                    )}
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle>Tags</CardTitle>
                  <CardDescription>
                    Product tags for better discoverability
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  {loadingTags ? (
                    <p className="text-sm text-muted-foreground">Loading tags...</p>
                  ) : tags.length > 0 ? (
                    <div className="space-y-2">
                      {tags.map(tag => (
                        <div key={tag.id} className="flex items-center space-x-2">
                          <Checkbox 
                            id={`tag-${tag.id}`} 
                            checked={selectedTags.includes(tag.id)}
                            onCheckedChange={() => toggleTag(tag.id)}
                          />
                          <Label htmlFor={`tag-${tag.id}`}>{tag.name}</Label>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-sm text-muted-foreground">No tags available</p>
                  )}
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </form>
      
      {/* Add the preview modal */}
      <ProductPreviewModal 
        open={isPreviewOpen}
        onOpenChange={(open) => open ? openPreview() : closePreview()}
        product={previewProduct}
      />
    </MainLayout>
  );
} 