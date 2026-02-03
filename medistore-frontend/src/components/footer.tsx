import React from "react";
import Link from "next/link";
import {
  Pill,
  Github,
  Twitter,
  Facebook,
  Mail,
  Phone,
  MapPin,
  ExternalLink,
} from "lucide-react";

export function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-zinc-950 border-t border-white/5 pt-16 pb-8">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-12">
          {/* Brand Section */}
          <div className="space-y-6">
            <Link href="/" className="flex items-center gap-2 group">
              <Pill className="size-8 text-primary transition-transform group-hover:rotate-12" />
              <span className="text-2xl font-bold tracking-tighter text-white">
                mediStore
              </span>
            </Link>
            <p className="text-muted-foreground text-sm leading-relaxed max-w-xs">
              Your trusted partner in healthcare. Providing quality medicines
              and healthcare products delivered right to your doorstep with 24/7
              support.
            </p>
            <div className="flex items-center gap-4">
              <a
                href="#"
                className="p-2 rounded-lg bg-white/5 hover:bg-primary/10 hover:text-primary transition-colors text-muted-foreground"
              >
                <Github className="size-5" />
              </a>
              <a
                href="#"
                className="p-2 rounded-lg bg-white/5 hover:bg-primary/10 hover:text-primary transition-colors text-muted-foreground"
              >
                <Twitter className="size-5" />
              </a>
              <a
                href="#"
                className="p-2 rounded-lg bg-white/5 hover:bg-primary/10 hover:text-primary transition-colors text-muted-foreground"
              >
                <Facebook className="size-5" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-6">
            <h4 className="text-white font-semibold flex items-center gap-2">
              <div className="w-1.5 h-4 bg-primary rounded-full" />
              Quick Links
            </h4>
            <ul className="space-y-4">
              <li>
                <Link
                  href="/"
                  className="text-muted-foreground hover:text-primary transition-colors text-sm flex items-center gap-2"
                >
                  <ExternalLink className="size-3" /> Home
                </Link>
              </li>
              <li>
                <Link
                  href="/medicine"
                  className="text-muted-foreground hover:text-primary transition-colors text-sm flex items-center gap-2"
                >
                  <ExternalLink className="size-3" /> Medicines
                </Link>
              </li>
              <li>
                <Link
                  href="/about"
                  className="text-muted-foreground hover:text-primary transition-colors text-sm flex items-center gap-2"
                >
                  <ExternalLink className="size-3" /> About Us
                </Link>
              </li>
              <li>
                <Link
                  href="/contact"
                  className="text-muted-foreground hover:text-primary transition-colors text-sm flex items-center gap-2"
                >
                  <ExternalLink className="size-3" /> Contact
                </Link>
              </li>
            </ul>
          </div>

          {/* Categories/Services */}
          <div className="space-y-6">
            <h4 className="text-white font-semibold flex items-center gap-2">
              <div className="w-1.5 h-4 bg-primary rounded-full" />
              Our Services
            </h4>
            <ul className="space-y-4">
              <li className="text-sm text-muted-foreground">
                Medicine Delivery
              </li>
              <li className="text-sm text-muted-foreground">
                Seller Marketplace
              </li>
              <li className="text-sm text-muted-foreground">
                Inventory Management
              </li>
              <li className="text-sm text-muted-foreground">
                Healthcare Consultation
              </li>
            </ul>
          </div>

          {/* Contact Info */}
          <div className="space-y-6">
            <h4 className="text-white font-semibold flex items-center gap-2">
              <div className="w-1.5 h-4 bg-primary rounded-full" />
              Contact Us
            </h4>
            <ul className="space-y-4">
              <li className="flex items-start gap-4">
                <div className="p-2 rounded-lg bg-primary/10 text-primary">
                  <MapPin className="size-4" />
                </div>
                <div>
                  <p className="text-sm text-white font-medium">Headquarters</p>
                  <p className="text-xs text-muted-foreground mt-1">
                    123 Health Ave, Dhaka, Bangladesh
                  </p>
                </div>
              </li>
              <li className="flex items-start gap-4">
                <div className="p-2 rounded-lg bg-primary/10 text-primary">
                  <Mail className="size-4" />
                </div>
                <div>
                  <p className="text-sm text-white font-medium">
                    Email Support
                  </p>
                  <p className="text-xs text-muted-foreground mt-1">
                    support@medistore.com
                  </p>
                </div>
              </li>
              <li className="flex items-start gap-4">
                <div className="p-2 rounded-lg bg-primary/10 text-primary">
                  <Phone className="size-4" />
                </div>
                <div>
                  <p className="text-sm text-white font-medium">
                    Emergency Line
                  </p>
                  <p className="text-xs text-muted-foreground mt-1">
                    +880 1234-567890
                  </p>
                </div>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-xs text-muted-foreground">
            © {currentYear}{" "}
            <span className="text-white font-medium">mediStore</span>. All
            rights reserved.
          </p>
          <div className="flex gap-8">
            <Link
              href="/privacy"
              className="text-xs text-muted-foreground hover:text-white transition-colors"
            >
              Privacy Policy
            </Link>
            <Link
              href="/terms"
              className="text-xs text-muted-foreground hover:text-white transition-colors"
            >
              Terms of Service
            </Link>
            <Link
              href="/cookies"
              className="text-xs text-muted-foreground hover:text-white transition-colors"
            >
              Cookie Policy
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
