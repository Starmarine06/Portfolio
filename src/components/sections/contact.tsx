"use client";
import React from "react";
import ContactForm from "../ContactForm";
import ContactLinks from "../contact/contact-links";
import { SectionHeader } from "./section-header";
import SectionWrapper from "../ui/section-wrapper";
import { useSectionContext } from "@/contexts/section-context";
import { cn } from "@/lib/utils";

const ContactSection = () => {
  const { activeSection } = useSectionContext();
  const isInactive = activeSection !== "contact";

  return (
    <SectionWrapper
      id="contact"
      className={cn("h-auto max-w-7xl mx-auto px-4 pt-6 pb-28 md:py-20", isInactive && "pointer-inactive")}
    >
      <SectionHeader
        id="contact"
        className="pt-4 md:pt-8 md:static mb-8 sm:mb-10 md:mb-12"
        title={
          <>
            LET&apos;S WORK <br />
            TOGETHER
          </>
        }
        desc="Got a project, an internship or just an idea? Send it over."
      />

      {/* Form on the left, the 3D phone floats in the empty right half (AnimatedBackground) */}
      <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
        <div className="w-full max-w-xl space-y-5 md:max-w-none lg:max-w-xl">
          <ContactLinks />
          <div className="rounded-3xl border border-border bg-card/70 p-5 shadow-2xl backdrop-blur-xl sm:p-7">
            <ContactForm />
          </div>
        </div>
        <div className="hidden md:block" aria-hidden="true" />
      </div>
    </SectionWrapper>
  );
};

export default ContactSection;
