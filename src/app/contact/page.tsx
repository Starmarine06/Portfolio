import React from "react";
import type { Metadata } from "next";
import ContactForm from "@/components/ContactForm";
import ContactLinks from "@/components/contact/contact-links";

export const metadata: Metadata = {
  title: "Contact | Dev Nambiar",
  description:
    "Hire Dev Nambiar or pitch a project, internship or collaboration. Send a message and get a reply by email.",
  alternates: { canonical: "/contact" },
  openGraph: { url: "/contact", title: "Contact | Dev Nambiar" },
};

function Page() {
  return (
    <main className="mx-auto min-h-screen max-w-xl px-4 pb-16 pt-28">
      <h1 className="mb-3 text-center text-4xl font-extrabold tracking-tight text-foreground sm:text-5xl">
        Let&apos;s work together
      </h1>
      <p className="mb-6 text-center text-muted-foreground">
        Got a project, an internship or just an idea? Send it over.
      </p>
      <ContactLinks className="mb-5 justify-center" />
      <div className="rounded-3xl border border-border bg-card/70 p-5 shadow-2xl backdrop-blur-xl sm:p-7">
        <ContactForm />
      </div>
    </main>
  );
}

export default Page;
