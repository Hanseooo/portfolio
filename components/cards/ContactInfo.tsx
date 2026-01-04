"use client";

import { Mail, Phone, Linkedin } from "lucide-react";

type ContactInfoProps = {
  email: string;
  phone: string;
  linkedinUrl: string;
};

export default function ContactInfo({
  email,
  phone,
  linkedinUrl,
}: ContactInfoProps) {
  return (
    <div className="flex flex-col gap-4 text-sm sm:text-base">
      {/* <span className="text-xs uppercase tracking-[0.3em] opacity-60">
        Let’s Connect
      </span> */}

      <div className="flex flex-col gap-3">
        {/* Email */}
        <a
          href={`mailto:${email}`}
          className="flex items-center gap-3 opacity-85 hover:text-primary transition hover:opacity-100"
        >
          <Mail size={16} />
          <span>{email}</span>
        </a>

        {/* Phone */}
        <a
          href={`tel:${phone.replace(/\s+/g, '')}`}
          className="flex items-center gap-3 opacity-85 hover:text-primary transition hover:opacity-100"
        >
          <Phone size={16} />
          <span>{phone}</span>
        </a>

        {/* LinkedIn */}
        <a
          href={linkedinUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-3 opacity-85 hover:text-primary transition hover:opacity-100"
        >
          <Linkedin size={16} />
          <span>hanseooo</span>
        </a>
      </div>
    </div>
  );
}
