"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { 
  Store, 
  MapPin, 
  Phone, 
  Mail, 
  Package, 
  CheckCircle2,
  AtSign,
  Loader2,
  AlertCircle,
  ArrowLeft,
  Building,
  PenSquare,
  Contact,
  Camera,
  Image as ImageIcon
} from "lucide-react";
import { toast } from "sonner";
import { categories as allCategories } from "@/constants/categories";
import Link from "next/link";
import api from "@/lib/api";
import imageCompression from 'browser-image-compression';

const categories = allCategories.filter(c => c.value !== 'all');

const CreateShopPage = () => {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    username: "",
    description: "",
    category: "",
    address: "",
    phone: "",
    email: ""
  });

  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const [bannerFile, setBannerFile] = useState<File | null>(null);
  const [avatarPreview, setAvatarPreview] = useState<string>("");
  const [bannerPreview, setBannerPreview] = useState<string>("");

  const [usernameStatus, setUsernameStatus] = useState<{
    loading: boolean;
    available: boolean | null;
    error: string | null;
  }>({
    loading: false,
    available: null,
    error: null
  });

  useEffect(() => {
    const checkUsername = async () => {
      if (!formData.username) {
        setUsernameStatus({ loading: false, available: null, error: null });
        return;
      }
      if (formData.username.length < 3) {
        setUsernameStatus({ loading: false, available: null, error: "Username too short" });
        return;
      }
      if (!/^[a-zA-Z0-9_]+$/.test(formData.username)) {
        setUsernameStatus({ loading: false, available: null, error: "Only letters, numbers, and underscores" });
        return;
      }

      setUsernameStatus(prev => ({ ...prev, loading: true }));
      try {
        const res = await api.get(`/shops/check-username/${formData.username}`);
        const data = res.data;
        setUsernameStatus({ loading: false, available: data.available, error: data.available ? null : "Username already taken" });
      } catch (e) {
        setUsernameStatus({ loading: false, available: null, error: "Error checking availability" });
      }
    };

    const timeoutId = setTimeout(checkUsername, 500);
    return () => clearTimeout(timeoutId);
  }, [formData.username]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>, type: 'avatar' | 'banner') => {
    const file = e.target.files?.[0];
    if (!file) return;

    const options = {
      maxSizeMB: 1,
      maxWidthOrHeight: type === 'banner' ? 1920 : 800,
      useWebWorker: true,
    };

    try {
      const compressedFile = await imageCompression(file, options);
      const reader = new FileReader();
      reader.onloadend = () => {
        if (type === 'avatar') {
          setAvatarPreview(reader.result as string);
          setAvatarFile(compressedFile);
        } else {
          setBannerPreview(reader.result as string);
          setBannerFile(compressedFile);
        }
      };
      reader.readAsDataURL(compressedFile);
    } catch (error) {
      console.error('Image compression error:', error);
      // Fallback to original
      const reader = new FileReader();
      reader.onloadend = () => {
        if (type === 'avatar') {
          setAvatarPreview(reader.result as string);
          setAvatarFile(file);
        } else {
          setBannerPreview(reader.result as string);
          setBannerFile(file);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const submitData = new FormData();
      Object.entries(formData).forEach(([key, value]) => {
        submitData.append(key, value);
      });

      if (avatarFile) submitData.append("avatar", avatarFile);
      if (bannerFile) submitData.append("banner", bannerFile);

      const response = await api.post("/shops", submitData, {
        headers: {
          "Content-Type": "multipart/form-data"
        }
      });

      if (response.data.success) {
        const userData = JSON.parse(localStorage.getItem("user") || "{}");
        if (userData) {
          userData.accountType = "seller";
          localStorage.setItem("user", JSON.stringify(userData));
        }
        
        toast.success("Shop registered successfully!");
        router.push("/account/seller");
      } else {
        throw new Error(response.data.message || "Failed to register shop");
      }
    } catch (err: any) {
      toast.error(err.response?.data?.message || err.message || "Failed to register shop");
    } finally {
      setIsLoading(false);
    }
  };

  const nextStep = () => setStep(prev => prev + 1);
  const prevStep = () => setStep(prev => prev - 1);

  const steps = [
    { title: "Identity", icon: <Building/> },
    { title: "Details", icon: <PenSquare/> },
    { title: "Branding", icon: <Camera/> },
    { title: "Contact", icon: <Contact/> }
  ];

  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center p-4 pb-24 lg:pb-4">
      <div className="w-full max-w-2xl">
        <div className="mb-8 text-center">
            <div className="inline-block p-3 bg-primary/10 rounded-2xl mb-4">
                <Store className="w-8 h-8 text-primary"/>
            </div>
            <h1 className="text-3xl font-bold text-foreground">Let's Create Your Shop</h1>
            <p className="text-muted-foreground mt-2">Follow the steps to get your shop up and running.</p>
        </div>

        <div className="bg-muted/40 p-2 rounded-2xl mb-8 flex items-center gap-2 overflow-x-auto custom-scrollbar">
            {steps.map((s, i) => (
                <div key={i} className={`flex-1 min-w-[100px] text-center px-4 py-2.5 rounded-xl transition-all duration-300 ${step === i + 1 ? 'bg-background shadow-sm' : ''}`}>
                    <p className={`font-bold text-xs md:text-sm ${step > i + 1 ? 'text-primary' : step === i + 1 ? 'text-foreground' : 'text-muted-foreground'}`}>{s.title}</p>
                </div>
            ))}
        </div>

        <form onSubmit={handleSubmit} className="bg-background border border-border rounded-2xl shadow-sm p-8 space-y-8">
          {step === 1 && (
            <section className="space-y-6 animate-in fade-in duration-500">
              <h3 className="text-xl font-semibold flex items-center gap-3"><Building className="text-primary"/> Shop Identity</h3>
              <div className="space-y-4">
                <div>
                    <label className="font-medium text-sm">Shop Name</label>
                    <input type="text" name="name" required value={formData.name} onChange={handleInputChange} placeholder="e.g., Urban Threads" className="w-full mt-2 px-4 py-3 bg-muted/50 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50"/>
                </div>
                <div>
                    <label className="font-medium text-sm flex justify-between items-center">Shop Handle {usernameStatus.loading && <Loader2 className="w-4 h-4 animate-spin"/>}</label>
                    <div className="relative mt-2">
                        <AtSign className={`absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 ${usernameStatus.error ? 'text-red-500' : usernameStatus.available ? 'text-green-500' : 'text-muted-foreground'}`} />
                        <input type="text" name="username" required value={formData.username} onChange={handleInputChange} placeholder="your_shop_handle" className={`w-full pl-10 pr-4 py-3 bg-muted/50 border rounded-lg focus:outline-none focus:ring-2 ${usernameStatus.error ? 'border-red-500 focus:ring-red-500/50' : usernameStatus.available ? 'border-green-500 focus:ring-green-500/50' : 'border-border focus:ring-primary/50'}`}/>
                    </div>
                    {usernameStatus.error && <p className="text-xs text-red-500 mt-1 flex items-center gap-1"><AlertCircle className="w-3 h-3"/>{usernameStatus.error}</p>}
                    {usernameStatus.available && <p className="text-xs text-green-500 mt-1 flex items-center gap-1"><CheckCircle2 className="w-3 h-3"/>Username is available</p>}
                </div>
              </div>
            </section>
          )}

          {step === 2 && (
            <section className="space-y-6 animate-in fade-in duration-500">
              <h3 className="text-xl font-semibold flex items-center gap-3"><PenSquare className="text-primary"/> Details & Category</h3>
              <div className="space-y-4">
                <div>
                    <label className="font-medium text-sm">Description</label>
                    <textarea name="description" required value={formData.description} onChange={handleInputChange} placeholder="What makes your shop special?" rows={4} className="w-full mt-2 px-4 py-3 bg-muted/50 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50 resize-none"/>
                </div>
                <div>
                    <label className="font-medium text-sm">Category</label>
                    <div className="relative mt-2">
                        <select name="category" required value={formData.category} onChange={handleInputChange} className="w-full px-4 py-3 bg-muted/50 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50 appearance-none">
                            <option value="">Select Category</option>
                            {categories.map(cat => <option key={cat.value} value={cat.value}>{cat.label}</option>)}
                        </select>
                        <Package className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground pointer-events-none" />
                    </div>
                </div>
              </div>
            </section>
          )}

          {step === 3 && (
            <section className="space-y-6 animate-in fade-in duration-500">
              <h3 className="text-xl font-semibold flex items-center gap-3"><Camera className="text-primary"/> Shop Branding</h3>
              <p className="text-sm text-muted-foreground">Make your shop stand out with a beautiful banner and avatar. These are optional but highly recommended.</p>
              
              <div className="space-y-6">
                <div>
                  <label className="font-medium text-sm">Shop Banner</label>
                  <div className="mt-2 relative group h-32 w-full bg-muted/50 border-2 border-dashed border-border rounded-xl overflow-hidden hover:border-primary/50 transition-all cursor-pointer">
                    {bannerPreview ? (
                      <img src={bannerPreview} alt="Banner Preview" className="w-full h-full object-cover" />
                    ) : (
                      <div className="absolute inset-0 flex flex-col items-center justify-center gap-2 text-muted-foreground">
                        <ImageIcon className="w-8 h-8" />
                        <span className="text-xs font-bold uppercase tracking-wider">Upload Banner</span>
                      </div>
                    )}
                    <input 
                      type="file" 
                      accept="image/*" 
                      onChange={(e) => handleImageChange(e, 'banner')}
                      className="absolute inset-0 opacity-0 cursor-pointer" 
                    />
                  </div>
                  <p className="text-[10px] text-muted-foreground mt-2">Recommended: 1200x400px</p>
                </div>

                <div>
                  <label className="font-medium text-sm">Shop Avatar (Logo)</label>
                  <div className="mt-2 flex items-center gap-6">
                    <div className="relative group w-24 h-24 bg-muted/50 border-2 border-dashed border-border rounded-2xl overflow-hidden hover:border-primary/50 transition-all cursor-pointer">
                      {avatarPreview ? (
                        <img src={avatarPreview} alt="Avatar Preview" className="w-full h-full object-cover" />
                      ) : (
                        <div className="absolute inset-0 flex flex-col items-center justify-center gap-1 text-muted-foreground">
                          <Camera className="w-6 h-6" />
                        </div>
                      )}
                      <input 
                        type="file" 
                        accept="image/*" 
                        onChange={(e) => handleImageChange(e, 'avatar')}
                        className="absolute inset-0 opacity-0 cursor-pointer" 
                      />
                    </div>
                    <div>
                      <p className="text-sm font-bold">Store Profile Photo</p>
                      <p className="text-xs text-muted-foreground mt-1">Recommended: 512x512px square image.</p>
                    </div>
                  </div>
                </div>
              </div>
            </section>
          )}

          {step === 4 && (
            <section className="space-y-6 animate-in fade-in duration-500">
              <h3 className="text-xl font-semibold flex items-center gap-3"><Contact className="text-primary"/> Contact Info</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                    <label className="font-medium text-sm">Business Email</label>
                    <div className="relative mt-2">
                        <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                        <input type="email" name="email" required value={formData.email} onChange={handleInputChange} placeholder="hello@yourshop.com" className="w-full pl-10 pr-4 py-3 bg-muted/50 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50"/>
                    </div>
                </div>
                <div>
                    <label className="font-medium text-sm">Phone Number</label>
                    <div className="relative mt-2">
                        <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                        <input type="tel" name="phone" required value={formData.phone} onChange={handleInputChange} placeholder="+254 700 000 000" className="w-full pl-10 pr-4 py-3 bg-muted/50 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50"/>
                    </div>
                </div>
                <div className="md:col-span-2">
                    <label className="font-medium text-sm">Physical Address</label>
                    <div className="relative mt-2">
                        <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                        <input type="text" name="address" required value={formData.address} onChange={handleInputChange} placeholder="e.g., 1st Floor, Garden Plaza" className="w-full pl-10 pr-4 py-3 bg-muted/50 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50"/>
                    </div>
                </div>
              </div>
            </section>
          )}

          <div className="pt-6 flex items-center justify-between border-t border-border">
            <Link href="/account" className="px-6 py-3 text-muted-foreground hover:text-foreground transition-colors font-semibold">Cancel</Link>
            <div className="flex items-center gap-4">
                {step > 1 && <button type="button" onClick={prevStep} className="px-6 py-3 bg-muted text-foreground rounded-lg font-semibold hover:bg-muted/80">Back</button>}
                {step < 4 ? (
                    <button type="button" onClick={nextStep} className="px-6 py-3 bg-primary text-primary-foreground rounded-lg font-semibold shadow-sm hover:bg-primary/90">
                        Next
                    </button>
                ) : (
                    <button type="submit" disabled={isLoading || !formData.name || !formData.category || !formData.username || usernameStatus.available === false} className="px-6 py-3 bg-primary text-primary-foreground rounded-lg font-semibold shadow-sm hover:bg-primary/90 disabled:opacity-50 flex items-center gap-2">
                        {isLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : <CheckCircle2 className="w-5 h-5"/>}
                        {isLoading ? "Creating Shop..." : "Launch Shop"}
                    </button>
                )}
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateShopPage;