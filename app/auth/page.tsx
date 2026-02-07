"use client";

import React, { useState, useEffect, Suspense } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import {
  Mail,
  Lock,
  Eye,
  EyeOff,
  ArrowRight,
  Github,
  UserPlus,
  LogIn,
  ShieldCheck,
  Zap,
  Headphones,
  RefreshCw,
  Tag,
  Trophy,
  AlertCircle,
  User,
  CheckCircle2,
  ArrowLeft,
} from "lucide-react";
import { toast } from "sonner";

const GoogleIcon = () => (
  <svg
    viewBox="0 0 24 24"
    className="w-5 h-5"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
      fill="#4285F4"
    />
    <path
      d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-1 .67-2.28 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
      fill="#34A853"
    />
    <path
      d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z"
      fill="#FBBC05"
    />
    <path
      d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
      fill="#EA4335"
    />
  </svg>
);

type AuthMode = "login" | "register" | "forgot" | "verify" | "reset";

const AuthContent = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5500/api/v1";

  const [mode, setMode] = useState<AuthMode>("login");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [pendingEmail, setPendingEmail] = useState<string>("");
  const [resetToken, setResetToken] = useState<string>("");

  useEffect(() => {
    // Get params from both searchParams hook and window.location for maximum reliability
    const urlParams = new URLSearchParams(window.location.search);
    const m = searchParams.get("mode") || urlParams.get("mode");
    const t = searchParams.get("token") || urlParams.get("token");
    const path = window.location.pathname;

    // Redirect if already logged in (and not in a special flow like reset/verify)
    const token = localStorage.getItem("accessToken");
    if (token && !["reset", "verify"].includes(m || "")) {
      router.push("/account");
      return;
    }

    console.log("Auth State Sync:", { m, t, path });

    // Handle direct reset-password path (from rewrite)
    if (path.includes("/reset-password/")) {
      const token = path.split("/").filter(Boolean).pop();
      if (token && token !== "reset-password") {
        setMode("reset");
        setResetToken(token);
        return;
      }
    }

    // Handle query param modes
    const errorParam = searchParams.get("error") || urlParams.get("error");
    if (errorParam) {
      toast.error(errorParam);
    }

    if (m === "social-success") {
      const userData = searchParams.get("user") || urlParams.get("user");
      if (t && userData) {
        try {
          localStorage.setItem("accessToken", t);
          localStorage.setItem("user", userData);
          toast.success("Social login successful! Redirecting...");
          setTimeout(() => router.push("/account"), 1500);
          return;
        } catch (e) {
          toast.error("Failed to process login data");
        }
      }
    }

    if (m === "reset") {
      setMode("reset");
      if (t) setResetToken(t);
    } else if (m === "verify") {
      setMode("verify");
      if (t) setFormData(prev => ({ ...prev, otp: t }));
    } else if (m === "forgot") {
      setMode("forgot");
    } else if (m === "register") {
      setMode("register");
    } else if (m === "login") {
      setMode("login");
    }
  }, [searchParams]);

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    otp: "",
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      let response;
      let data;

      switch (mode) {
        case "login":
          response = await fetch(`${apiUrl}/auth/sign-in`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ email: formData.email, password: formData.password }),
          });
          data = await response.json();
          if (!response.ok) throw new Error(data.message || data.error || "Login failed");
          
          // Store token in localStorage
          localStorage.setItem("accessToken", data.data.accessToken);
          localStorage.setItem("user", JSON.stringify(data.data.user));
          
          toast.success("Login successful! Redirecting...");
          setTimeout(() => router.push("/account"), 1500);
          break;

        case "register":
          response = await fetch(`${apiUrl}/auth/sign-up`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ name: formData.name, email: formData.email, password: formData.password }),
          });
          data = await response.json();
          if (!response.ok) throw new Error(data.message || data.error || "Registration failed");
          
          setPendingEmail(formData.email);
          setMode("verify");
          toast.success("Account created! Please check your email for the verification code.");
          break;

        case "verify":
          response = await fetch(`${apiUrl}/auth/verify-email`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ email: pendingEmail || formData.email, otp: formData.otp }),
          });
          data = await response.json();
          if (!response.ok) throw new Error(data.message || data.error || "Verification failed");
          
          toast.success("Email verified successfully! You can now sign in.");
          setTimeout(() => setMode("login"), 2000);
          break;

        case "forgot":
          response = await fetch(`${apiUrl}/auth/forgot-password`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ email: formData.email }),
          });
          data = await response.json();
          if (!response.ok) throw new Error(data.message || data.error || "Request failed");
          
          toast.success("Password reset link sent to your email!");
          break;

        case "reset":
          response = await fetch(`${apiUrl}/auth/reset-password/${resetToken}`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ password: formData.password }),
          });
          data = await response.json();
          if (!response.ok) throw new Error(data.message || data.error || "Reset failed");
          
          toast.success("Password reset successful! You can now sign in.");
          setTimeout(() => setMode("login"), 2000);
          break;
      }
    } catch (err: any) {
      toast.error(err.message || "Something went wrong");
    } finally {
      setIsLoading(false);
    }
  };

  const handleSocialAuth = (provider: "google" | "github") => {
    setIsLoading(true);
    // Redirect to backend social auth endpoint
    // The backend will handle the OAuth flow and redirect back to /auth?mode=social-success&token=...&user=...
    window.location.href = `${apiUrl}/auth/${provider}`;
  };

  const resetForm = () => {
    setFormData({ name: "", email: "", password: "", otp: "" });
  };

  const switchMode = (newMode: AuthMode) => {
    setMode(newMode);
    resetForm();
  };

  const renderForm = () => {
    switch (mode) {
      case "verify":
        return (
          <div className="space-y-6">
            <div className="text-center">
              <CheckCircle2 className="w-16 h-16 text-emerald-500 dark:text-emerald-400 mx-auto mb-4" />
              <h2 className="text-2xl font-bold text-foreground">
                Verify Your Email
              </h2>
              <p className="text-muted-foreground mt-2">
                We sent a verification code to <strong>{pendingEmail}</strong>
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="relative group">
                <input
                  type="text"
                  name="otp"
                  required
                  value={formData.otp}
                  onChange={handleInputChange}
                  placeholder="Enter verification code"
                  className="w-full px-4 py-4 bg-muted border border-border rounded-2xl focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all font-medium text-center text-lg tracking-widest text-foreground placeholder:text-muted-foreground/50"
                  maxLength={6}
                />
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full bg-primary text-primary-foreground py-4 rounded-2xl font-bold flex items-center justify-center gap-2 hover:bg-primary/90 transition-all shadow-xl shadow-primary/20 disabled:opacity-70 disabled:cursor-not-allowed group"
              >
                {isLoading ? (
                  <div className="w-6 h-6 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full animate-spin"></div>
                ) : (
                  <>
                    Verify Email
                    <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                  </>
                )}
              </button>
            </form>

            <div className="text-center">
              <button
                onClick={() => switchMode("login")}
                className="text-sm font-bold text-primary hover:underline flex items-center justify-center gap-2"
              >
                <ArrowLeft className="w-4 h-4" />
                Back to Login
              </button>
            </div>
          </div>
        );

      case "forgot":
        return (
          <div className="space-y-6">
            <div className="text-center">
              <h2 className="text-2xl font-bold text-foreground">
                Forgot Password
              </h2>
              <p className="text-muted-foreground mt-2">
                Enter your email and we'll send you a reset link
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="relative group">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground group-focus-within:text-primary transition-colors" />
                <input
                  type="email"
                  name="email"
                  required
                  value={formData.email}
                  onChange={handleInputChange}
                  placeholder="Email Address"
                  className="w-full pl-12 pr-4 py-4 bg-muted border border-border rounded-2xl focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all font-medium text-foreground placeholder:text-muted-foreground/50"
                />
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full bg-primary text-primary-foreground py-4 rounded-2xl font-bold flex items-center justify-center gap-2 hover:bg-primary/90 transition-all shadow-xl shadow-primary/20 disabled:opacity-70 disabled:cursor-not-allowed group"
              >
                {isLoading ? (
                  <div className="w-6 h-6 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full animate-spin"></div>
                ) : (
                  <>
                    Send Reset Link
                    <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                  </>
                )}
              </button>
            </form>

            <div className="text-center">
              <button
                onClick={() => switchMode("login")}
                className="text-sm font-bold text-primary hover:underline flex items-center justify-center gap-2"
              >
                <ArrowLeft className="w-4 h-4" />
                Back to Login
              </button>
            </div>
          </div>
        );

      case "reset":
        return (
          <div className="space-y-6">
            <div className="text-center">
              <h2 className="text-2xl font-bold text-foreground">
                Reset Password
              </h2>
              <p className="text-muted-foreground mt-2">
                Enter your new password below
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="relative group">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground group-focus-within:text-primary transition-colors" />
                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  required
                  value={formData.password}
                  onChange={handleInputChange}
                  placeholder="New Password"
                  className="w-full pl-12 pr-12 py-4 bg-muted border border-border rounded-2xl focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all font-medium text-foreground placeholder:text-muted-foreground/50"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                >
                  {showPassword ? (
                    <EyeOff className="w-5 h-5" />
                  ) : (
                    <Eye className="w-5 h-5" />
                  )}
                </button>
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full bg-primary text-primary-foreground py-4 rounded-2xl font-bold flex items-center justify-center gap-2 hover:bg-primary/90 transition-all shadow-xl shadow-primary/20 disabled:opacity-70 disabled:cursor-not-allowed group"
              >
                {isLoading ? (
                  <div className="w-6 h-6 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full animate-spin"></div>
                ) : (
                  <>
                    Reset Password
                    <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                  </>
                )}
              </button>
            </form>
          </div>
        );

      default:
        return (
          <div className="space-y-6">
            <div className="mb-10 text-center md:text-left">
              <h2 className="text-3xl font-bold text-foreground tracking-tight">
                {mode === "login" ? "Welcome Back" : "Create Account"}
              </h2>
              <p className="text-muted-foreground mt-2 font-medium">
                {mode === "login"
                  ? "Enter your details to access your account"
                  : "Create an account to start your journey"}
              </p>
            </div>

            {/* Tab Switcher */}
            <div className="flex p-1 bg-muted rounded-2xl mb-8">
              <button
                onClick={() => switchMode("login")}
                className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-xl font-bold transition-all ${
                  mode === "login"
                    ? "bg-background text-primary shadow-sm"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                <LogIn className="w-4 h-4" /> Login
              </button>
              <button
                onClick={() => switchMode("register")}
                className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-xl font-bold transition-all ${
                  mode === "register"
                    ? "bg-background text-primary shadow-sm"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                <UserPlus className="w-4 h-4" /> Register
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-5">
              {mode === "register" && (
                <div className="relative group">
                  <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground group-focus-within:text-primary transition-colors" />
                  <input
                    type="text"
                    name="name"
                    required
                    value={formData.name}
                    onChange={handleInputChange}
                    placeholder="Full Name"
                    className="w-full pl-12 pr-4 py-4 bg-muted border border-border rounded-2xl focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all font-medium text-foreground placeholder:text-muted-foreground/50"
                  />
                </div>
              )}

              <div className="relative group">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground group-focus-within:text-primary transition-colors" />
                <input
                  type="email"
                  name="email"
                  required
                  value={formData.email}
                  onChange={handleInputChange}
                  placeholder="Email Address"
                  className="w-full pl-12 pr-4 py-4 bg-muted border border-border rounded-2xl focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all font-medium text-foreground placeholder:text-muted-foreground/50"
                />
              </div>

              <div className="relative group">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground group-focus-within:text-primary transition-colors" />
                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  required
                  value={formData.password}
                  onChange={handleInputChange}
                  placeholder="Password"
                  className="w-full pl-12 pr-12 py-4 bg-muted border border-border rounded-2xl focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all font-medium text-foreground placeholder:text-muted-foreground/50"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 p-1 text-muted-foreground hover:text-foreground transition-colors"
                >
                  {showPassword ? (
                    <EyeOff className="w-5 h-5" />
                  ) : (
                    <Eye className="w-5 h-5" />
                  )}
                </button>
              </div>

              {mode === "login" && (
                <div className="flex justify-end">
                  <button
                    type="button"
                    onClick={() => switchMode("forgot")}
                    className="text-sm font-bold text-primary hover:underline"
                  >
                    Forgot password?
                  </button>
                </div>
              )}

              <button
                type="submit"
                disabled={isLoading}
                className="w-full bg-primary text-primary-foreground py-4 rounded-2xl font-bold flex items-center justify-center gap-2 hover:bg-primary/90 transition-all shadow-xl shadow-primary/20 disabled:opacity-70 disabled:cursor-not-allowed group"
              >
                {isLoading ? (
                  <div className="w-6 h-6 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full animate-spin"></div>
                ) : (
                  <>
                    {mode === "login" ? "Sign In" : "Create Account"}
                    <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                  </>
                )}
              </button>
            </form>

            {/* Divider */}
            <div className="my-8 flex items-center gap-4">
              <div className="flex-1 h-px bg-border"></div>
              <span className="text-xs font-bold text-muted-foreground uppercase tracking-widest">
                Or continue with
              </span>
              <div className="flex-1 h-px bg-border"></div>
            </div>

            {/* Social Auth */}
            <div className="grid grid-cols-2 gap-4">
              <button
                onClick={() => handleSocialAuth("google")}
                className="flex items-center justify-center gap-3 py-4 border border-border rounded-2xl font-bold text-foreground hover:bg-muted transition-all group"
              >
                <div className="group-hover:scale-110 transition-transform">
                  <GoogleIcon />
                </div>
                Google
              </button>
              <button
                onClick={() => handleSocialAuth("github")}
                className="flex items-center justify-center gap-3 py-4 border border-border rounded-2xl font-bold text-foreground hover:bg-muted transition-all group"
              >
                <Github className="w-5 h-5 group-hover:scale-110 transition-transform text-foreground" />
                Github
              </button>
            </div>

            <p className="mt-10 text-center text-muted-foreground text-sm font-medium">
              By signing up, you agree to our{" "}
              <Link
                href="/terms"
                className="text-primary font-bold hover:underline"
              >
                Terms
              </Link>{" "}
              and{" "}
              <Link
                href="/privacy"
                className="text-primary font-bold hover:underline"
              >
                Privacy Policy
              </Link>
            </p>
          </div>
        );
    }
  };

  return (
    <div className="min-h-[calc(100vh-128px)] flex items-center justify-center bg-muted p-4 md:py-4 md:px-8 pb-32 md:pb-8">
      <div className="max-w-5xl w-full grid md:grid-cols-2 bg-background rounded-[2rem] shadow-2xl overflow-hidden border border-border">
        {/* Left Side: Creative Brand Section */}
        <div className="hidden md:flex flex-col justify-between bg-primary p-12 text-primary-foreground relative overflow-hidden">
          {/* Abstract background shapes */}
          <div className="absolute top-0 right-0 w-64 h-64 bg-primary-foreground/10 rounded-full -mr-32 -mt-32 blur-3xl"></div>
          <div className="absolute bottom-0 left-0 w-64 h-64 bg-secondary/20 rounded-full -ml-32 -mb-32 blur-3xl"></div>

          <div className="relative z-10">
            <Link href="/" className="text-3xl font-bold tracking-tight">
              <span className="text-secondary">.</span>Soko
            </Link>

            <div className="mt-12 space-y-6">
              <div className="flex items-start gap-4">
                <div className="p-3 bg-primary-foreground/10 rounded-2xl shrink-0">
                  <Zap className="w-6 h-6 text-secondary" />
                </div>
                <div>
                  <h3 className="font-bold text-lg leading-tight">
                    Fastest Delivery
                  </h3>
                  <p className="text-primary-foreground/70 text-xs mt-1">
                    Get your products delivered to your doorstep in record time.
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <div className="p-3 bg-primary-foreground/10 rounded-2xl shrink-0">
                  <ShieldCheck className="w-6 h-6 text-secondary" />
                </div>
                <div>
                  <h3 className="font-bold text-lg leading-tight">
                    Secure Shopping
                  </h3>
                  <p className="text-primary-foreground/70 text-xs mt-1">
                    Your data and payments are protected by military-grade
                    security.
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <div className="p-3 bg-primary-foreground/10 rounded-2xl shrink-0">
                  <Headphones className="w-6 h-6 text-secondary" />
                </div>
                <div>
                  <h3 className="font-bold text-lg leading-tight">
                    24/7 Support
                  </h3>
                  <p className="text-primary-foreground/70 text-xs mt-1">
                    Our dedicated team is always here to help you anytime.
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <div className="p-3 bg-primary-foreground/10 rounded-2xl shrink-0">
                  <RefreshCw className="w-6 h-6 text-secondary" />
                </div>
                <div>
                  <h3 className="font-bold text-lg leading-tight">
                    Easy Returns
                  </h3>
                  <p className="text-primary-foreground/70 text-xs mt-1">
                    Not satisfied? Return any product within 30 days, no
                    questions asked.
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <div className="p-3 bg-primary-foreground/10 rounded-2xl shrink-0">
                  <Tag className="w-6 h-6 text-secondary" />
                </div>
                <div>
                  <h3 className="font-bold text-lg leading-tight">
                    Best Prices
                  </h3>
                  <p className="text-primary-foreground/70 text-xs mt-1">
                    We guarantee the most competitive prices in the market.
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <div className="p-3 bg-primary-foreground/10 rounded-2xl shrink-0">
                  <Trophy className="w-6 h-6 text-secondary" />
                </div>
                <div>
                  <h3 className="font-bold text-lg leading-tight">
                    Quality Products
                  </h3>
                  <p className="text-primary-foreground/70 text-xs mt-1">
                    Every product is verified for quality and authenticity.
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="relative z-10">
            <div className="p-6 bg-primary-foreground/5 rounded-3xl border border-primary-foreground/10 backdrop-blur-sm">
              <p className="italic text-primary-foreground/90 text-sm">
                &quot;The best shopping experience I&apos;ve ever had. Simple,
                fast, and reliable!&quot;
              </p>
              <div className="mt-4 flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-primary-foreground/20"></div>
                <div>
                  <p className="font-bold text-xs">Sarah Jenkins</p>
                  <p className="text-[10px] text-primary-foreground/60">Verified Customer</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Side: Auth Forms */}
        <div className="p-8 md:p-16 flex flex-col justify-center">
          {renderForm()}
        </div>
      </div>
    </div>
  );
};

const AuthPage = () => {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <RefreshCw className="w-10 h-10 text-primary animate-spin mx-auto mb-4" />
          <p className="text-muted-foreground font-medium uppercase tracking-widest text-xs">Initializing Auth...</p>
        </div>
      </div>
    }>
      <AuthContent />
    </Suspense>
  );
};

export default AuthPage;
