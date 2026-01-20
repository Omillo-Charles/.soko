"use client";

import React from "react";
import { LogOut, X } from "lucide-react";

interface LogoutConfirmationProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
}

const LogoutConfirmation: React.FC<LogoutConfirmationProps> = ({ isOpen, onClose, onConfirm }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm transition-opacity duration-300"
        onClick={onClose}
      />
      
      {/* Modal */}
      <div className="relative w-full max-w-md bg-white rounded-[2.5rem] shadow-2xl shadow-slate-900/20 overflow-hidden animate-modal-pop">
        {/* Close Button */}
        <button 
          onClick={onClose}
          className="absolute top-6 right-6 p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-full transition-all"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="p-8 md:p-10 text-center">
          {/* Icon */}
          <div className="w-20 h-20 bg-red-50 rounded-[2rem] flex items-center justify-center mx-auto mb-6">
            <LogOut className="w-10 h-10 text-red-500" />
          </div>

          {/* Text */}
          <h3 className="text-2xl font-black text-slate-900 mb-2 uppercase tracking-tight">
            Sign Out?
          </h3>
          <p className="text-slate-500 font-medium leading-relaxed mb-8">
            Are you sure you want to sign out of your account? You'll need to sign back in to access your dashboard.
          </p>

          {/* Actions */}
          <div className="flex flex-col sm:flex-row gap-3">
            <button
              onClick={onClose}
              className="flex-1 px-8 py-4 bg-slate-100 text-slate-600 rounded-2xl font-black text-sm hover:bg-slate-200 transition-all uppercase tracking-widest"
            >
              Cancel
            </button>
            <button
              onClick={onConfirm}
              className="flex-1 px-8 py-4 bg-red-500 text-white rounded-2xl font-black text-sm hover:bg-red-600 transition-all shadow-lg shadow-red-500/20 uppercase tracking-widest"
            >
              Sign Out
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LogoutConfirmation;
