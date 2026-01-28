"use client";
import { useState } from "react";
import {
  Phone,
  Mail,
  MapPin,
  Instagram,
  Facebook,
  Linkedin,
  CheckCircle2,
  AlertCircle,
  Loader2,
} from "lucide-react";
import { toast } from "sonner";

const XIcon = () => (
  <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24" aria-hidden="true">
    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
  </svg>
);

const ContactPage = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [form, setForm] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });

  const onChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setForm((f) => ({ ...f, [name]: value }));
  };

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5500/api/v1";
      const response = await fetch(`${apiUrl}/contacts`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(form),
      });

      const contentType = response.headers.get("content-type");
      let data;
      
      if (contentType && contentType.includes("application/json")) {
        data = await response.json();
      } else {
        const text = await response.text();
        throw new Error(response.statusText || "Server returned non-JSON response");
      }

      if (!response.ok) {
        throw new Error(data?.message || data?.error || "Failed to send message");
      }

      toast.success(data?.message || "Thank you! Your message has been sent successfully.");
      setForm({ name: "", email: "", subject: "", message: "" });
    } catch (err: any) {
      toast.error(err.message || "Something went wrong. Please try again later.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <main className="flex flex-col pb-24 lg:pb-0">
      <section className="bg-background">
        <div className="container mx-auto px-4 md:px-8 pt-6 pb-10">
          <h1 className="text-2xl md:text-3xl font-bold text-foreground">Contact Us</h1>
          <p className="mt-2 text-muted-foreground">
            We'd love to hear from you. Reach out anytime.
          </p>

          <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="flex items-center gap-3 bg-background border border-border rounded-md p-4">
              <Phone className="w-6 h-6 text-primary" />
              <div>
                <div className="font-semibold text-foreground">Phone</div>
                <a href="tel:+254700000000" className="text-sm text-muted-foreground">
                  +254 700 000 000
                </a>
              </div>
            </div>
            <div className="flex items-center gap-3 bg-background border border-border rounded-md p-4">
              <Mail className="w-6 h-6 text-primary" />
              <div>
                <div className="font-semibold text-foreground">Email</div>
                <a
                  href="mailto:support@dotsoko.com"
                  className="text-sm text-muted-foreground"
                >
                  support@dotsoko.com
                </a>
              </div>
            </div>
            <div className="flex items-center gap-3 bg-background border border-border rounded-md p-4">
              <MapPin className="w-6 h-6 text-primary" />
              <div>
                <div className="font-semibold text-foreground">Location</div>
                <div className="text-sm text-muted-foreground">Nairobi, Kenya</div>
              </div>
            </div>
          </div>

          <div className="mt-10 grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-6">
              <form
                onSubmit={onSubmit}
                className="bg-background border border-border rounded-lg p-6"
              >
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="name" className="text-sm text-muted-foreground">
                      Name
                    </label>
                    <input
                      id="name"
                      name="name"
                      type="text"
                      required
                      value={form.name}
                      onChange={onChange}
                      placeholder="John Doe"
                      className="mt-1 w-full rounded-md border border-border bg-background px-3 py-2 text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                    />
                  </div>
                  <div>
                    <label htmlFor="email" className="text-sm text-muted-foreground">
                      Email
                    </label>
                    <input
                      id="email"
                      name="email"
                      type="email"
                      required
                      value={form.email}
                      onChange={onChange}
                      placeholder="john@example.com"
                      className="mt-1 w-full rounded-md border border-border bg-background px-3 py-2 text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                    />
                  </div>
                </div>
                <div className="mt-4">
                  <label htmlFor="subject" className="text-sm text-muted-foreground">
                    Subject
                  </label>
                  <input
                    id="subject"
                    name="subject"
                    type="text"
                    value={form.subject}
                    onChange={onChange}
                    placeholder="Order inquiry, product question..."
                    className="mt-1 w-full rounded-md border border-border bg-background px-3 py-2 text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                </div>
                <div className="mt-4">
                  <label htmlFor="message" className="text-sm text-muted-foreground">
                    Message
                  </label>
                  <textarea
                    id="message"
                    name="message"
                    required
                    rows={6}
                    value={form.message}
                    onChange={onChange}
                    placeholder="Write your message here..."
                    className="mt-1 w-full rounded-md border border-border bg-background px-3 py-2 text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                </div>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="mt-6 w-full bg-primary text-primary-foreground font-semibold py-3 rounded-md hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="w-5 h-5 animate-spin" />
                      Sending...
                    </>
                  ) : (
                    "Send Message"
                  )}
                </button>
              </form>
            </div>

            <div className="bg-background border border-border rounded-lg p-6">
              <div className="font-semibold text-foreground">Business Hours</div>
              <div className="mt-2 text-sm text-muted-foreground">
                Mon–Fri: 9:00 AM – 6:00 PM
              </div>
              <div className="text-sm text-muted-foreground">
                Sat: 10:00 AM – 4:00 PM
              </div>
              <div className="text-sm text-muted-foreground">Sun: Closed</div>
              <div className="mt-6 font-semibold text-foreground">Follow Us</div>
              <div className="mt-2 flex flex-wrap items-center gap-3">
                <a
                  href="#"
                  aria-label="X"
                  className="p-3 rounded-full bg-foreground text-background shadow hover:scale-105 transition"
                >
                  <XIcon />
                </a>
                <a
                  href="#"
                  aria-label="Facebook"
                  className="p-3 rounded-full bg-[#1877F2] text-white shadow hover:scale-105 transition"
                >
                  <Facebook className="w-5 h-5" />
                </a>
                <a
                  href="#"
                  aria-label="LinkedIn"
                  className="p-3 rounded-full bg-[#0A66C2] text-white shadow hover:scale-105 transition"
                >
                  <Linkedin className="w-5 h-5" />
                </a>
                <a
                  href="#"
                  aria-label="Instagram"
                  className="p-3 rounded-full bg-gradient-to-tr from-yellow-400 via-pink-500 to-purple-600 text-white shadow hover:scale-105 transition"
                >
                  <Instagram className="w-5 h-5" />
                </a>
              </div>
              <iframe
                title="Nairobi, Kenya Map"
                src="https://www.google.com/maps?q=Nairobi,+Kenya&output=embed"
                width="100%"
                height="240"
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                style={{ border: 0 }}
                className="mt-6 w-full rounded-md border border-border"
              />
            </div>
          </div>
        </div>
      </section>
    </main>
  );
};

export default ContactPage;
