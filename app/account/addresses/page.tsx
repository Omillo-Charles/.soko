"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { 
  MapPin, 
  Plus, 
  Home, 
  Briefcase, 
  Trash2, 
  Edit2, 
  CheckCircle2, 
  ChevronLeft,
  Loader2,
  X,
  Phone,
  Info
} from "lucide-react";
import { useUser } from "@/hooks/useUser";
import { toast } from "sonner";
import api from "@/lib/api";

interface Address {
  _id: string;
  name: string;
  type: "home" | "work" | "other";
  phone: string;
  city: string;
  street: string;
  isDefault: boolean;
}

const AddressesPage = () => {
  const router = useRouter();
  const { user, isLoading: userLoading, refreshUser } = useUser();
  const [isMounted, setIsMounted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingAddress, setEditingAddress] = useState<Address | null>(null);

  // Form state
  const [formData, setFormData] = useState({
    name: "",
    type: "home" as "home" | "work" | "other",
    phone: "",
    city: "",
    street: "",
    isDefault: false
  });

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target as HTMLInputElement;
    const checked = (e.target as HTMLInputElement).checked;
    
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const resetForm = () => {
    setFormData({
      name: "",
      type: "home",
      phone: "",
      city: "",
      street: "",
      isDefault: false
    });
    setEditingAddress(null);
  };

  const handleAddAddress = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const response = await api.post("/users/addresses", formData);
      if (response.data.success) {
        toast.success("Address added successfully");
        await refreshUser();
        setShowAddModal(false);
        resetForm();
      }
    } catch (error: any) {
      toast.error(error.friendlyMessage || "Failed to add address");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleEditAddress = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingAddress) return;
    setIsSubmitting(true);

    try {
      const response = await api.put(`/users/addresses/${editingAddress._id}`, formData);
      if (response.data.success) {
        toast.success("Address updated successfully");
        await refreshUser();
        setShowAddModal(false);
        resetForm();
      }
    } catch (error: any) {
      toast.error(error.friendlyMessage || "Failed to update address");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteAddress = async (id: string) => {
    if (window.confirm("Are you sure you want to delete this address?")) {
      try {
        const response = await api.delete(`/users/addresses/${id}`);
        if (response.data.success) {
          toast.success("Address deleted");
          await refreshUser();
        }
      } catch (error: any) {
        toast.error(error.friendlyMessage || "Failed to delete address");
      }
    }
  };

  const setDefaultAddress = async (id: string) => {
    try {
      const response = await api.put(`/users/addresses/${id}/set-default`);
      if (response.data.success) {
        toast.success("Default address updated");
        await refreshUser();
      }
    } catch (error: any) {
      toast.error(error.friendlyMessage || "Failed to set default address");
    }
  };

  const openEditModal = (address: Address) => {
    setEditingAddress(address);
    setFormData({
      name: address.name,
      type: address.type,
      phone: address.phone,
      city: address.city,
      street: address.street,
      isDefault: address.isDefault
    });
    setShowAddModal(true);
  };

  if (!isMounted || userLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <Loader2 className="w-10 h-10 text-primary animate-spin" />
      </div>
    );
  }

  const addresses = (user?.addresses || []) as Address[];

  return (
    <div className="min-h-screen bg-background pt-4 md:pt-12 pb-32 lg:pb-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-10">
          <div>
            <button 
              onClick={() => router.push("/account")}
              className="flex items-center gap-2 text-muted-foreground hover:text-foreground font-bold mb-4 transition-colors group"
            >
              <ChevronLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
              Back to Account
            </button>
            <h1 className="text-4xl font-black text-foreground tracking-tight uppercase">My Addresses</h1>
            <p className="text-muted-foreground font-medium mt-2">Manage your delivery and billing addresses.</p>
          </div>
          <button 
            onClick={() => { resetForm(); setShowAddModal(true); }}
            className="flex items-center justify-center gap-3 px-8 py-4 bg-primary text-primary-foreground rounded-2xl font-bold hover:bg-primary/90 transition-all shadow-xl shadow-primary/20 active:scale-95"
          >
            <Plus className="w-5 h-5" />
            Add New Address
          </button>
        </div>

        {/* Address List */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {addresses.length > 0 ? (
            addresses.map((address) => (
              <div 
                key={address._id}
                className={`bg-card rounded-[2rem] p-8 border-2 transition-all relative group ${
                  address.isDefault ? "border-primary shadow-xl shadow-primary/5" : "border-border hover:border-primary/20"
                }`}
              >
                {address.isDefault && (
                  <div className="absolute top-6 right-8 flex items-center gap-1.5 px-3 py-1 bg-primary/10 text-primary text-[10px] font-black uppercase tracking-wider rounded-full">
                    <CheckCircle2 className="w-3 h-3" />
                    Default
                  </div>
                )}
                
                <div className="flex items-start gap-4 mb-6">
                  <div className={`w-14 h-14 rounded-2xl flex items-center justify-center shrink-0 ${
                    address.type === "home" ? "bg-blue-500/10 text-blue-500" : 
                    address.type === "work" ? "bg-amber-500/10 text-amber-500" : "bg-purple-500/10 text-purple-500"
                  }`}>
                    {address.type === "home" ? <Home className="w-7 h-7" /> : 
                     address.type === "work" ? <Briefcase className="w-7 h-7" /> : <MapPin className="w-7 h-7" />}
                  </div>
                  <div>
                    <h3 className="text-xl font-black text-foreground mb-1">{address.name}</h3>
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <Phone className="w-3 h-3" />
                      <span className="text-xs font-bold">{address.phone}</span>
                    </div>
                  </div>
                </div>

                <div className="space-y-2 mb-8">
                  <p className="text-foreground/80 font-bold flex items-center gap-2">
                    <MapPin className="w-4 h-4 text-muted-foreground/50" />
                    {address.city}
                  </p>
                  <p className="text-muted-foreground text-sm font-medium leading-relaxed pl-6">
                    {address.street}
                  </p>
                </div>

                <div className="flex items-center gap-3 pt-6 border-t border-border">
                  <button 
                    onClick={() => openEditModal(address)}
                    className="flex-1 flex items-center justify-center gap-2 py-3 bg-muted hover:bg-muted/80 text-foreground/70 rounded-xl font-bold text-xs transition-colors"
                  >
                    <Edit2 className="w-3.5 h-3.5" />
                    Edit
                  </button>
                  <button 
                    onClick={() => handleDeleteAddress(address._id)}
                    className="flex-1 flex items-center justify-center gap-2 py-3 bg-red-500/10 hover:bg-red-500/20 text-red-500 rounded-xl font-bold text-xs transition-colors"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                    Delete
                  </button>
                  {!address.isDefault && (
                    <button 
                      onClick={() => setDefaultAddress(address._id)}
                      className="p-3 bg-muted hover:bg-primary/5 text-muted-foreground hover:text-primary rounded-xl transition-colors"
                      title="Set as Default"
                    >
                      <CheckCircle2 className="w-4 h-4" />
                    </button>
                  )}
                </div>
              </div>
            ))
          ) : (
            <div className="col-span-full bg-card rounded-[2.5rem] p-16 text-center border-2 border-dashed border-border">
              <div className="w-20 h-20 bg-muted rounded-3xl flex items-center justify-center mx-auto mb-6">
                <MapPin className="w-10 h-10 text-muted-foreground/50" />
              </div>
              <h3 className="text-2xl font-black text-foreground mb-2 uppercase">No Addresses Found</h3>
              <p className="text-muted-foreground font-medium mb-8">You haven't added any delivery addresses yet.</p>
              <button 
                onClick={() => setShowAddModal(true)}
                className="inline-flex items-center gap-3 px-8 py-4 bg-primary text-primary-foreground rounded-2xl font-bold hover:bg-primary/90 transition-all shadow-xl shadow-primary/20"
              >
                <Plus className="w-5 h-5" />
                Add Your First Address
              </button>
            </div>
          )}
        </div>

        {/* Info Card */}
        <div className="mt-12 p-8 bg-primary rounded-[2.5rem] text-primary-foreground relative overflow-hidden shadow-2xl shadow-primary/20">
          <div className="absolute top-0 right-0 w-64 h-64 bg-primary-foreground/10 rounded-full -mr-32 -mt-32 blur-3xl"></div>
          <div className="relative z-10 flex flex-col md:flex-row items-center gap-6">
            <div className="w-16 h-16 bg-primary-foreground/10 rounded-2xl flex items-center justify-center backdrop-blur-md shrink-0">
              <Info className="w-8 h-8" />
            </div>
            <div>
              <h4 className="text-lg font-black uppercase tracking-tight">Pro Tip</h4>
              <p className="text-primary-foreground/90 text-sm font-medium mt-1 leading-relaxed">
                Set a default address to speed up your checkout process. You can always change the delivery address during the final step of your order.
              </p>
            </div>
          </div>
        </div>

        {/* Add/Edit Modal */}
        {showAddModal && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <div 
              className="absolute inset-0 bg-background/80 backdrop-blur-sm transition-opacity"
              onClick={() => setShowAddModal(false)}
            />
            <div className="relative w-full max-w-lg max-h-[90vh] flex flex-col bg-card border border-border rounded-[2.5rem] shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-300">
              <div className="bg-muted p-8 text-foreground relative shrink-0">
                <button 
                  onClick={() => setShowAddModal(false)}
                  className="absolute top-8 right-8 text-muted-foreground hover:text-foreground transition-colors"
                >
                  <X className="w-6 h-6" />
                </button>
                <h3 className="text-2xl font-black uppercase tracking-tight">
                  {editingAddress ? "Edit Address" : "New Address"}
                </h3>
                <p className="text-muted-foreground text-sm font-medium mt-1">
                  Fill in the details for your delivery location.
                </p>
              </div>

              <form onSubmit={editingAddress ? handleEditAddress : handleAddAddress} className="p-8 space-y-6 overflow-y-auto flex-1">
                <div className="space-y-4">
                  <div className="space-y-2">
                    <label className="text-xs font-black text-muted-foreground uppercase tracking-widest ml-1">Address Label</label>
                    <div className="relative">
                      <input
                        type="text"
                        name="name"
                        required
                        placeholder="e.g. Home, Office, Aunt's Place"
                        value={formData.name}
                        onChange={handleInputChange}
                        className="w-full pl-12 pr-6 py-4 bg-muted/50 border border-border rounded-2xl focus:outline-none focus:ring-4 focus:ring-primary/5 focus:border-primary/30 transition-all font-bold text-foreground placeholder:text-muted-foreground/50"
                      />
                      <Tag className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground/50" />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label className="text-xs font-black text-muted-foreground uppercase tracking-widest ml-1">Type</label>
                      <select
                        name="type"
                        value={formData.type}
                        onChange={handleInputChange}
                        className="w-full px-6 py-4 bg-muted/50 border border-border rounded-2xl focus:outline-none focus:ring-4 focus:ring-primary/5 focus:border-primary/30 transition-all font-bold text-foreground appearance-none"
                      >
                        <option value="home">Home</option>
                        <option value="work">Work</option>
                        <option value="other">Other</option>
                      </select>
                    </div>
                    <div className="space-y-2">
                      <label className="text-xs font-black text-muted-foreground uppercase tracking-widest ml-1">Phone Number</label>
                      <div className="relative">
                        <input
                          type="tel"
                          name="phone"
                          required
                          placeholder="+254..."
                          value={formData.phone}
                          onChange={handleInputChange}
                          className="w-full pl-12 pr-6 py-4 bg-muted/50 border border-border rounded-2xl focus:outline-none focus:ring-4 focus:ring-primary/5 focus:border-primary/30 transition-all font-bold text-foreground placeholder:text-muted-foreground/50"
                        />
                        <Phone className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground/50" />
                      </div>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-xs font-black text-muted-foreground uppercase tracking-widest ml-1">City / Town</label>
                    <div className="relative">
                      <input
                        type="text"
                        name="city"
                        required
                        placeholder="Nairobi, Mombasa, etc."
                        value={formData.city}
                        onChange={handleInputChange}
                        className="w-full pl-12 pr-6 py-4 bg-muted/50 border border-border rounded-2xl focus:outline-none focus:ring-4 focus:ring-primary/5 focus:border-primary/30 transition-all font-bold text-foreground placeholder:text-muted-foreground/50"
                      />
                      <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground/50" />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-xs font-black text-muted-foreground uppercase tracking-widest ml-1">Street Address / Landmark</label>
                    <input
                      type="text"
                      name="street"
                      required
                      placeholder="Street name, building, floor, room number..."
                      value={formData.street}
                      onChange={handleInputChange}
                      className="w-full px-6 py-4 bg-muted/50 border border-border rounded-2xl focus:outline-none focus:ring-4 focus:ring-primary/5 focus:border-primary/30 transition-all font-bold text-foreground placeholder:text-muted-foreground/50"
                    />
                  </div>

                  <label className="flex items-center gap-3 p-4 bg-muted/50 rounded-2xl cursor-pointer hover:bg-muted/80 transition-colors">
                    <input
                      type="checkbox"
                      name="isDefault"
                      checked={formData.isDefault}
                      onChange={handleInputChange}
                      className="w-5 h-5 rounded-lg border-border text-primary focus:ring-primary"
                    />
                    <span className="text-sm font-bold text-foreground/70">Set as default delivery address</span>
                  </label>
                </div>

                <div className="pt-4 flex gap-4">
                  <button
                    type="button"
                    onClick={() => setShowAddModal(false)}
                    className="flex-1 px-8 py-4 bg-muted text-foreground/70 rounded-2xl font-bold hover:bg-muted/80 transition-all"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="flex-1 px-8 py-4 bg-primary text-primary-foreground rounded-2xl font-bold hover:bg-primary/90 transition-all shadow-xl shadow-primary/20 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isSubmitting ? (
                      <Loader2 className="w-5 h-5 animate-spin mx-auto" />
                    ) : (
                      editingAddress ? "Save Changes" : "Add Address"
                    )}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

// Simple Tag icon since lucide-react might not have it in the expected version
const Tag = ({ className }: { className?: string }) => (
  <svg className={className} width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M12 2H2v10l9.29 9.29c.94.94 2.48.94 3.42 0l6.58-6.58c.94-.94.94-2.48 0-3.42L12 2Z" />
    <path d="M7 7h.01" />
  </svg>
);

export default AddressesPage;