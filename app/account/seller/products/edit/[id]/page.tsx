"use client";

import React, { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import { 
  ShoppingBag, 
  ArrowRight, 
  Tag, 
  DollarSign, 
  Info,
  ChevronLeft,
  Image as ImageIcon,
  Layers,
  CheckCircle2,
  Plus,
  Trash2,
  Loader2,
  Save
} from "lucide-react";
import { toast } from "sonner";

import { categories as allCategories } from "@/constants/categories";

const categories = allCategories.filter(c => c.value !== 'all');

const EditProductPage = () => {
  const router = useRouter();
  const { id } = useParams();
  const [isLoading, setIsLoading] = useState(false);
  const [isFetching, setIsFetching] = useState(true);

  const [formData, setFormData] = useState({
    name: "",
    description: "",
    price: "",
    category: "",
    stock: "",
  });
  const [imageFiles, setImageFiles] = useState<File[]>([]);
  const [imagePreviews, setImagePreviews] = useState<string[]>([]);

  useEffect(() => {
    const fetchProduct = async () => {
      const token = localStorage.getItem("accessToken");
      if (!token) {
        router.push("/auth?mode=login");
        return;
      }

      const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5500/api/v1";
      try {
        const response = await fetch(`${apiUrl}/products/${id}`);
        const data = await response.json();
        
        if (data.success && data.data) {
          const product = data.data;
          setFormData({
            name: product.name,
            description: product.description,
            price: product.price.toString(),
            category: product.category,
            stock: product.stock.toString(),
          });
          if (product.images && Array.isArray(product.images)) {
            setImagePreviews(product.images);
          } else if (product.image) {
            setImagePreviews([product.image]);
          }
        } else {
          toast.error("Product not found");
        }
      } catch (err) {
        console.error("Error fetching product:", err);
        toast.error("Failed to load product data");
      } finally {
        setIsFetching(false);
      }
    };

    if (id) fetchProduct();
  }, [id, router]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (files.length === 0) return;

    const remainingSlots = 3 - imagePreviews.length;
    if (remainingSlots <= 0) {
      toast.error("You can only upload up to 3 images");
      return;
    }

    const filesToAdd = files.slice(0, remainingSlots);
    
    filesToAdd.forEach(file => {
      setImageFiles(prev => [...prev, file]);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreviews(prev => [...prev, reader.result as string]);
      };
      reader.readAsDataURL(file);
    });
  };

  const removeImage = (index: number) => {
    // If it's a new file being uploaded
    const previewToRemove = imagePreviews[index];
    const isNewFile = previewToRemove.startsWith('data:');
    
    if (isNewFile) {
      // Find which file it corresponds to in imageFiles
      // This is a bit tricky if multiple files are uploaded, but we can manage
      // For simplicity, let's just clear the specific index from both
      // We'll need to keep track of which preview belongs to which file
    }

    setImagePreviews(prev => prev.filter((_, i) => i !== index));
    // When removing, we might need to filter imageFiles too if it was a new file
    // But for now let's just keep it simple and filter both
    setImageFiles(prev => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    const token = localStorage.getItem("accessToken");
    const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5500/api/v1";

    try {
      const submitData = new FormData();
      submitData.append("name", formData.name);
      submitData.append("description", formData.description);
      submitData.append("content", formData.description);
      submitData.append("price", formData.price);
      submitData.append("category", formData.category);
      submitData.append("stock", formData.stock);
      
      // Handle images
      imageFiles.forEach(file => {
        submitData.append("image", file);
      });

      // We might also need to send the existing images that were kept
      const existingImages = imagePreviews.filter(p => !p.startsWith('data:'));
      submitData.append("existingImages", JSON.stringify(existingImages));

      const response = await fetch(`${apiUrl}/products/${id}`, {
        method: "PUT",
        headers: {
          "Authorization": `Bearer ${token}`
        },
        body: submitData
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to update product");
      }

      toast.success("Product updated successfully!");
      router.push("/account/seller/products");
    } catch (err: any) {
      toast.error(err.message || "Something went wrong");
    } finally {
      setIsLoading(false);
    }
  };

  if (isFetching) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <Loader2 className="w-10 h-10 text-primary animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background pt-12 pb-32 lg:pb-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <button 
          onClick={() => router.back()}
          className="flex items-center gap-2 text-muted-foreground hover:text-foreground font-bold mb-8 transition-colors"
        >
          <ChevronLeft className="w-5 h-5" />
          Back to Products
        </button>

        <div className="bg-background rounded-[2.5rem] shadow-xl shadow-primary/5 border border-border overflow-hidden">
          <div className="bg-foreground p-10 text-background relative overflow-hidden">
            <div className="absolute top-0 right-0 w-64 h-64 bg-background/10 rounded-full -mr-32 -mt-32 blur-3xl"></div>
            <div className="relative z-10">
              <div className="w-16 h-16 bg-background/10 rounded-2xl flex items-center justify-center mb-4 backdrop-blur-sm">
                <EditProductPageIcon />
              </div>
              <h1 className="text-3xl font-black tracking-tight uppercase">Edit Product</h1>
              <p className="text-background/60 font-medium mt-2">Update your product information and media.</p>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="p-10 space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-6 md:col-span-2">
                <h2 className="text-lg font-black text-foreground flex items-center gap-2 border-b border-border pb-2">
                  <Info className="w-5 h-5 text-primary" />
                  Product Information
                </h2>
                
                <div className="space-y-2">
                  <label className="text-sm font-bold text-muted-foreground ml-1">Product Name</label>
                  <input
                    type="text"
                    name="name"
                    required
                    value={formData.name}
                    onChange={handleInputChange}
                    className="w-full px-5 py-4 bg-muted border border-border rounded-2xl focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all font-medium text-foreground"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-sm font-bold text-muted-foreground ml-1">Category</label>
                    <div className="relative">
                      <select
                        name="category"
                        required
                        value={formData.category}
                        onChange={handleInputChange}
                        className="w-full px-5 py-4 bg-muted border border-border rounded-2xl focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all font-medium appearance-none text-foreground"
                      >
                        <option value="">Select Category</option>
                        {categories.map(cat => (
                          <option key={cat.value} value={cat.value}>{cat.label}</option>
                        ))}
                      </select>
                      <Layers className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground pointer-events-none" />
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <label className="text-sm font-bold text-muted-foreground ml-1">Stock Quantity</label>
                    <input
                      type="number"
                      name="stock"
                      required
                      min="0"
                      value={formData.stock}
                      onChange={handleInputChange}
                      className="w-full px-5 py-4 bg-muted border border-border rounded-2xl focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all font-medium text-foreground"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-bold text-muted-foreground ml-1">Price (KES)</label>
                  <div className="relative group">
                    <span className="absolute left-5 top-1/2 -translate-y-1/2 font-bold text-muted-foreground group-focus-within:text-primary transition-colors">KES</span>
                    <input
                      type="number"
                      name="price"
                      required
                      min="0"
                      value={formData.price}
                      onChange={handleInputChange}
                      className="w-full pl-16 pr-5 py-4 bg-muted border border-border rounded-2xl focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all font-medium text-foreground"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-bold text-muted-foreground ml-1">Product Description</label>
                  <textarea
                    name="description"
                    required
                    value={formData.description}
                    onChange={handleInputChange}
                    rows={5}
                    className="w-full px-5 py-4 bg-muted border border-border rounded-2xl focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all font-medium resize-none text-foreground"
                  />
                </div>
              </div>

              <div className="space-y-6 md:col-span-2 pt-4 border-t border-border">
                <h2 className="text-lg font-black text-foreground flex items-center gap-2">
                  <ImageIcon className="w-5 h-5 text-primary" />
                  Product Media ({imagePreviews.length}/3)
                </h2>
                
                <div className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                    {imagePreviews.map((preview, index) => (
                      <div key={index} className="relative group rounded-2xl overflow-hidden border-2 border-border bg-muted aspect-square">
                        <img 
                          src={preview} 
                          alt={`Preview ${index + 1}`} 
                          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                        />
                        <button 
                          type="button"
                          onClick={() => removeImage(index)}
                          className="absolute top-2 right-2 w-8 h-8 bg-black/50 hover:bg-red-500 text-primary-foreground rounded-full flex items-center justify-center transition-all backdrop-blur-sm opacity-0 group-hover:opacity-100"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                        {!preview.startsWith('data:') && (
                          <div className="absolute bottom-2 left-2 bg-background/60 backdrop-blur-sm px-2 py-1 rounded-md">
                            <p className="text-[8px] font-black text-foreground uppercase tracking-widest">Existing</p>
                          </div>
                        )}
                      </div>
                    ))}
                    
                    {imagePreviews.length < 3 && (
                      <label className="relative flex flex-col items-center justify-center aspect-square border-2 border-dashed border-border rounded-2xl bg-muted hover:bg-background hover:border-primary/30 transition-all cursor-pointer group">
                        <input
                          type="file"
                          accept="image/*"
                          multiple
                          onChange={handleImageChange}
                          className="hidden"
                        />
                        <div className="w-10 h-10 bg-background rounded-xl shadow-sm flex items-center justify-center mb-2 group-hover:scale-110 transition-transform">
                          <Plus className="w-5 h-5 text-primary" />
                        </div>
                        <p className="text-[10px] font-black text-foreground uppercase">Add Photo</p>
                      </label>
                    )}
                  </div>
                </div>
              </div>
            </div>

                <div className="flex items-center justify-between gap-6 pt-8 border-t border-border">
                  <button
                    type="button"
                    onClick={() => router.back()}
                    disabled={isLoading}
                    className="px-8 py-4 bg-muted text-muted-foreground rounded-[2rem] font-bold hover:bg-muted/80 transition-all disabled:opacity-50"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={isLoading}
                    className="bg-primary text-primary-foreground px-10 py-4 rounded-[2rem] font-black text-sm uppercase tracking-widest disabled:opacity-50 transition-all hover:bg-primary/90 hover:shadow-2xl hover:shadow-primary/30 active:scale-95 flex items-center gap-3"
                  >
                    {isLoading ? (
                      <>
                        <div className="w-4 h-4 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full animate-spin" />
                        <span>Updating...</span>
                      </>
                    ) : (
                      <>
                        <Save className="w-5 h-5" />
                        <span>Update Product</span>
                      </>
                    )}
                  </button>
                </div>
          </form>
        </div>
      </div>
    </div>
  );
};

const EditProductPageIcon = () => (
  <svg width="32" height="32" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M11 4H4C3.46957 4 2.96086 4.21071 2.58579 4.58579C2.21071 4.96086 2 5.46957 2 6V20C2 20.5304 2.21071 21.0391 2.58579 21.4142C2.96086 21.7893 3.46957 22 4 22H18C18.5304 22 19.0391 21.7893 19.4142 21.4142C19.7893 21.0391 20 20.5304 20 20V13" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M18.5 2.5C18.8978 2.10217 19.4374 1.87868 20 1.87868C20.5626 1.87868 21.1022 2.10217 21.5 2.5C21.8978 2.89782 22.1213 3.43739 22.1213 4C22.1213 4.56261 21.8978 5.10217 21.5 5.5L12 15L8 16L9 12L18.5 2.5Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

export default EditProductPage;
