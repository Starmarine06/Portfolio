"use client";
import React from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import ContactForm from "../ContactForm";
import { config } from "@/data/config";
import { SectionHeader } from "./section-header";
import SectionWrapper from "../ui/section-wrapper";
import { useSectionContext } from "@/contexts/section-context";
import { cn } from "@/lib/utils";

const ContactSection = () => {
  const { activeSection } = useSectionContext();
  const isInactive = activeSection !== "contact";

  return (
    <SectionWrapper id="contact" className={cn("h-auto py-20 max-w-7xl mx-auto", isInactive && "pointer-inactive")}>
      {/* Title pushed down a bit with extra top padding so it clears the model nicely */}
      <SectionHeader
        id="contact"
        className="relative mb-4 pt-8"
        title={
          <>
            LET&apos;S WORK <br />
            TOGETHER
          </>
        }
      />
      {/* Two-column grid: form left, empty right (model floats in the right half) */}
      <div className="grid grid-cols-1 md:grid-cols-2 mx-4 mt-8 md:mt-16 gap-8">
        {/* Contact form card — shifted slightly down to vertically align with the phone */}
        <Card className="min-w-7xl bg-white/70 dark:bg-black/70 backdrop-blur-sm rounded-xl md:mt-10 self-center">
          <CardHeader>
            <CardTitle className="text-4xl">Contact Form</CardTitle>
            <CardDescription>
              Please contact me directly at{" "}
              <a
                target="_blank"
                href={`mailto:${config.email}`}
                className="text-gray-200 cursor-can-hover rounded-lg"
              >
                {config.email.replace(/@/g, "(at)")}
              </a>{" "}
              or drop your info here.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ContactForm />
          </CardContent>
        </Card>

        {/* Right column is intentionally empty — the Spline model renders here via AnimatedBackground */}
        <div className="hidden md:block" aria-hidden="true" />
      </div>
    </SectionWrapper>
  );
};

export default ContactSection;
