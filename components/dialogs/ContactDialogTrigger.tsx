"use client";

import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import ContactInfo from "../cards/ContactInfo";
import { Phone } from "lucide-react";

type ContactDialogTriggerProps = {
  email: string;
  phone: string;
  linkedinUrl: string;
};

export default function ContactDialogTrigger({
  email,
  phone,
  linkedinUrl,
}: ContactDialogTriggerProps) {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <button
          className="flex items-center gap-2 hover:cursor-pointer border border-primary px-5 py-3 text-sm text-primary transition hover:bg-primary hover:text-background"
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
