import React from "react";
import Link from "next/link";
import { footer } from "./config";
import { Button } from "../ui/button";
import SocialMediaButtons from "../social/social-media-icons";
import { config } from "@/data/config";
import MobileDock from "./mobile-dock";

function Footer() {
  const year = new Date().getFullYear();
  return (
    <>
    <MobileDock />
    <footer className="hidden w-full shrink-0 flex-col items-center gap-2 border-t border-border px-6 pt-6 pb-6 md:flex md:flex-row md:justify-between pointer-events-auto relative z-[90]">
      <p className="text-xs text-gray-500 dark:text-gray-400">
        © {year} {config.author}. All rights reserved.
      </p>
      <SocialMediaButtons />
      <nav className="flex gap-4 sm:gap-6 z-10 pointer-events-auto">
        {footer.map((link, index) => {
          const { title, href } = link;

          return (
            <Link
              className="text-xs underline-offset-4 hover:underline"
              href={href}
              key={`l_${index}`}
            >
              <Button variant={"link"}>{title}</Button>
            </Link>
          );
        })}
      </nav>
    </footer>
    </>
  );
}

export default Footer;
