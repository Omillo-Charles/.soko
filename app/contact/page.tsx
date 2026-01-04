"use client";
import { useState } from "react";
import { Phone, Mail, MapPin, Instagram, Facebook, Linkedin } from "lucide-react";

const XIcon = () => (
  <svg
    className="w-5 h-5 fill-current"
    viewBox="0 0 24 24"
    aria-hidden="true"
  >
    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
  </svg>
);

const ContactPage = () => {
  const [submitted, setSubmitted] = useState(false);
  const [form, setForm] = useState({ name: "", email: "", subject: "", message: "" });

  const onChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setForm((f) => ({ ...f, [name]: value }));
  };

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
  };

  return (
    <main className="flex flex-col">
      <section className="bg-white">
        <div className="container mx-auto px-4 md:px-8 py-10">
          <h1 className="text-2xl md:text-3xl font-bold">Contact Us</h1>
          <p className="mt-2 text-slate-600">We’d love to hear from you. Reach out anytime.</p>

          <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="flex items-center gap-3 bg-white border border-slate-200 rounded-md p-4">
              <Phone className="w-6 h-6 text-primary" />
              <div>
                <div className="font-semibold">Phone</div>
                <a href="tel:+254700000000" className="text-sm text-slate-600">+254 700 000 000</a>
              </div>
            </div>
            <div className="flex items-center gap-3 bg-white border border-slate-200 rounded-md p-4">
              <Mail className="w-6 h-6 text-primary" />
              <div>
                <div className="font-semibold">Email</div>
                <a href="mailto:support@duuka.com" className="text-sm text-slate-600">support@duuka.com</a>
              </div>
            </div>
            <div className="flex items-center gap-3 bg-white border border-slate-200 rounded-md p-4">
              <MapPin className="w-6 h-6 text-primary" />
              <div>
                <div className="font-semibold">Location</div>
                <div className="text-sm text-slate-600">Nairobi, Kenya</div>
              </div>
            </div>
          </div>

          <div className="mt-10 grid grid-cols-1 md:grid-cols-2 gap-8">
            <form onSubmit={onSubmit} className="bg-white border border-slate-200 rounded-lg p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="name" className="text-sm text-slate-600">Name</label>
                  <input
                    id="name"
                    name="name"
                    type="text"
                    required
                    value={form.name}
                    onChange={onChange}
                    placeholder="John Doe"
                    className="mt-1 w-full rounded-md border border-slate-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                </div>
                <div>
                  <label htmlFor="email" className="text-sm text-slate-600">Email</label>
                  <input
                    id="email"
                    name="email"
                    type="email"
                    required
                    value={form.email}
                    onChange={onChange}
                    placeholder="john@example.com"
                    className="mt-1 w-full rounded-md border border-slate-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                </div>
              </div>
              <div className="mt-4">
                <label htmlFor="subject" className="text-sm text-slate-600">Subject</label>
                <input
                  id="subject"
                  name="subject"
                  type="text"
                  value={form.subject}
                  onChange={onChange}
                  placeholder="Order inquiry, product question..."
                  className="mt-1 w-full rounded-md border border-slate-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>
              <div className="mt-4">
                <label htmlFor="message" className="text-sm text-slate-600">Message</label>
                <textarea
                  id="message"
                  name="message"
                  required
                  rows={6}
                  value={form.message}
                  onChange={onChange}
                  placeholder="Write your message here..."
                  className="mt-1 w-full rounded-md border border-slate-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>
              <button
                type="submit"
                className="mt-6 w-full bg-primary text-white py-2 rounded-md hover:bg-blue-600 transition"
              >
                Send Message
              </button>
              {submitted && (
                <div className="mt-3 text-sm text-green-600">Thanks! Your message has been recorded.</div>
              )}
            </form>

            <div className="bg-white border border-slate-200 rounded-lg p-6">
              <div className="font-semibold">Business Hours</div>
              <div className="mt-2 text-sm text-slate-600">Mon–Fri: 9:00 AM – 6:00 PM</div>
              <div className="text-sm text-slate-600">Sat: 10:00 AM – 4:00 PM</div>
              <div className="text-sm text-slate-600">Sun: Closed</div>
              <div className="mt-6 font-semibold">Follow Us</div>
              <div className="mt-2 flex items-center gap-3">
                <a href="#" aria-label="X" className="p-3 rounded-full bg-black text-white shadow hover:scale-105 transition">
                  <XIcon />
                </a>
                <a href="#" aria-label="Facebook" className="p-3 rounded-full bg-[#1877F2] text-white shadow hover:scale-105 transition">
                  <Facebook className="w-5 h-5" />
                </a>
                <a href="#" aria-label="LinkedIn" className="p-3 rounded-full bg-[#0A66C2] text-white shadow hover:scale-105 transition">
                  <Linkedin className="w-5 h-5" />
                </a>
                <a href="#" aria-label="Instagram" className="p-3 rounded-full bg-gradient-to-tr from-yellow-400 via-pink-500 to-purple-600 text-white shadow hover:scale-105 transition">
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
                className="mt-6 w-full rounded-md"
              />
            </div>
          </div>
        </div>
      </section>
    </main>
  );
};

export default ContactPage;
