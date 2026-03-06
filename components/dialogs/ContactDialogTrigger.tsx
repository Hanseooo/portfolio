"use client";

import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import ContactInfo from "../cards/ContactInfo";
import { Phone } from "lucide-react";
import { cn } from "@/lib/utils";

type ContactDialogTriggerProps = {
  email: string;
  phone: string;
  linkedinUrl: string;
  className?: string;
};

export default function ContactDialogTrigger({
  email,
  phone,
  linkedinUrl,
  className,
}: ContactDialogTriggerProps) {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <button
          className={cn(
            "flex min-h-11 items-center gap-2 rounded-md border border-primary px-5 py-3 font-sans text-sm text-primary transition hover:cursor-pointer hover:bg-primary hover:text-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
            className
          )}
        >
          <Phone size={16} /> Contact
        </button>
      </DialogTrigger>

      <DialogContent className="max-w-sm py-8">
        <DialogHeader>
          <DialogTitle className="text-sm uppercase tracking-[0.3em] opacity-70">
            Let’s Connect
          </DialogTitle>
        </DialogHeader>

        <ContactInfo
          email={email}
          phone={phone}
          linkedinUrl={linkedinUrl}
        />
      </DialogContent>
    </Dialog>
  );
}
