"use client";

import React, { useState } from "react";
import { 
  ChevronDown,
  Mail, 
  Phone, 
  CheckCircle2,
  HelpCircle,
  MessageSquare
} from "lucide-react";

const XIcon = () => (
  <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
    <path d="M18.901 1.153h3.68l-8.04 9.19L24 22.846h-7.406l-5.8-7.584-6.638 7.584H.474l8.6-9.83L0 1.154h7.594l5.243 6.932 6.064-6.932zm-1.292 19.494h2.039L6.486 3.24H4.298l13.311 17.407z" />
  </svg>
);

const HelpPage = () => {
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  const faqs = [
    {
      question: "How can I track my order in real-time?",
      answer: "Every order on Duuka comes with high-precision tracking. Visit 'My Orders' in your dashboard, click on the specific order, and you'll see a live map view and status updates from our logistics partners.",
    },
    {
      question: "What makes your refund process different?",
      answer: "We offer 'Instant Credits' for approved returns. Instead of waiting 5-7 days for bank processing, get your refund as Duuka Credits immediately to use on your next purchase.",
    },
    {
      question: "How do I secure my account with 2FA?",
      answer: "Security is our priority. Go to Account Settings > Security and toggle on Two-Factor Authentication. We support Authenticator apps and SMS verification.",
    },
    {
      question: "Are my international payments protected?",
      answer: "Yes, we use military-grade encryption for all transactions. Our partnership with global payment gateways ensures your data never touches our servers directly.",
    }
  ];

  return (
    <div className="min-h-screen bg-white py-10 px-4 md:px-8 selection:bg-primary/10 selection:text-primary">
      <div className="container mx-auto max-w-4xl">
        
        {/* FAQs Section */}
        <div className="mb-12">
          <div className="text-center mb-10">
            <h1 className="text-4xl md:text-5xl font-black text-slate-900 mb-4 tracking-tight">
              Frequently Asked <span className="text-primary">Questions</span>
            </h1>
            <p className="text-slate-500 font-medium text-lg">
              Quick solutions to the most common questions from our community.
            </p>
          </div>
          
          <div className="space-y-4">
            {faqs.map((faq, index) => (
              <div 
                key={index} 
                className={`group bg-white rounded-3xl border transition-all duration-300 ${openFaq === index ? "border-primary shadow-lg shadow-primary/5" : "border-slate-100 hover:border-slate-200"}`}
              >
                <button 
                  onClick={() => setOpenFaq(openFaq === index ? null : index)}
                  className="w-full p-6 md:p-8 flex items-center justify-between text-left"
                >
                  <div className="flex items-center gap-4">
                    <div className={`w-8 h-8 rounded-lg flex items-center justify-center text-xs font-bold ${openFaq === index ? "bg-primary text-white" : "bg-slate-100 text-slate-500"}`}>
                      0{index + 1}
                    </div>
                    <span className={`font-bold text-lg ${openFaq === index ? "text-slate-900" : "text-slate-700"}`}>
                      {faq.question}
                    </span>
                  </div>
                  <div className={`transition-transform duration-300 ${openFaq === index ? "rotate-180" : ""}`}>
                    <ChevronDown className={`w-5 h-5 ${openFaq === index ? "text-primary" : "text-slate-400"}`} />
                  </div>
                </button>
                
                <div className={`overflow-hidden transition-all duration-500 ease-in-out ${openFaq === index ? "max-h-[500px] opacity-100" : "max-h-0 opacity-0"}`}>
                  <div className="px-8 md:px-20 pb-8 text-slate-600 leading-relaxed font-medium">
                    <div className="h-px w-full bg-slate-100 mb-6"></div>
                    {faq.answer}
                    <div className="mt-6 flex items-center gap-4">
                      <button className="text-sm font-bold text-primary hover:underline flex items-center gap-1">
                        Was this helpful? <CheckCircle2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Global Support Channels */}
        <div className="pt-12 border-t border-slate-100">
          <div className="text-center mb-10">
            <h2 className="text-3xl md:text-4xl font-black text-slate-900 mb-4 tracking-tight">
              Global <span className="text-secondary">Channels</span>
            </h2>
            <p className="text-slate-500 font-medium max-w-2xl mx-auto">
              Still need help? Reach out to us through any of our official channels.
            </p>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {[
              { icon: Phone, title: "Phone Support", detail: "+254 700 000 000", action: "Call Now", color: "text-blue-500", bg: "bg-blue-50" },
              { icon: Mail, title: "Email Support", detail: "help@duuka.com", action: "Send Email", color: "text-emerald-500", bg: "bg-emerald-50" },
              { icon: XIcon, title: "Twitter/X Support", detail: "@DuukaHelp", action: "Tweet Us", color: "text-slate-900", bg: "bg-slate-50" },
              { icon: MessageSquare, title: "Live Chat", detail: "Available 24/7", action: "Start Chat", color: "text-primary", bg: "bg-primary/5" }
            ].map((channel, i) => (
              <div key={i} className="group p-8 rounded-[2rem] bg-white border border-slate-100 hover:border-slate-200 transition-all flex items-center gap-6">
                <div className={`w-14 h-14 shrink-0 rounded-2xl ${channel.bg} flex items-center justify-center ${channel.color} group-hover:scale-110 transition-transform shadow-sm`}>
                  <channel.icon className="w-6 h-6" />
                </div>
                <div className="text-left">
                  <h4 className="font-black text-slate-900 mb-1">{channel.title}</h4>
                  <p className="text-sm text-slate-500 font-medium mb-2">{channel.detail}</p>
                  <button className="text-xs font-black uppercase tracking-widest text-primary hover:tracking-[0.2em] transition-all">
                    {channel.action}
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>

      {/* Simplified Help Trigger */}
      <div className="fixed bottom-8 right-8 z-50">
        <button className="flex items-center justify-center w-14 h-14 bg-slate-900 text-white rounded-full shadow-2xl hover:bg-primary transition-all group">
          <HelpCircle className="w-6 h-6 group-hover:scale-110 transition-transform" />
        </button>
      </div>
    </div>
  );
};

export default HelpPage;
