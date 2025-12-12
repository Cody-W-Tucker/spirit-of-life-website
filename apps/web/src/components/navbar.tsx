import { Clock, MapPin } from "lucide-react";
import type { FC } from "react";

import { sanityFetch } from "@/lib/sanity/live";
import { queryGlobalSeoSettings, queryNavbarData } from "@/lib/sanity/query";
import type {
  QueryGlobalSeoSettingsResult,
  QueryNavbarDataResult,
} from "@/lib/sanity/sanity.types";

import { Logo } from "./logo";
import { NavbarClient, NavbarSkeletonResponsive } from "./navbar-client";

export const NavbarServer: FC = async () => {
  const [navbarData, settingsData] = await Promise.all([
    sanityFetch(queryNavbarData),
    sanityFetch(queryGlobalSeoSettings),
  ]);
  return <Navbar navbarData={navbarData} settingsData={settingsData} />;
};

export const Navbar: FC<{
  navbarData: QueryNavbarDataResult;
  settingsData: QueryGlobalSeoSettingsResult;
}> = ({ navbarData, settingsData }) => {
  const { siteTitle: settingsSiteTitle, logo } = settingsData ?? {};
  return (
    <div className="flex flex-col">
      {/* Top Bar */}
      <div className="bg-brand-primary text-brand-text-white text-sm py-2 px-4">
        <div className="container mx-auto px-4 md:px-6 flex flex-col sm:flex-row justify-between items-center gap-2 sm:gap-4">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 opacity-90 hover:opacity-100 transition-opacity">
              <MapPin className="w-4 h-4 text-accent" />
              <span>3148 Dove Hill Ave, Kearney, NE 68845</span>
            </div>
          </div>
          <div className="flex items-center gap-2 opacity-90 hover:opacity-100 transition-opacity">
            <Clock className="w-4 h-4 text-accent" />
            <span className="font-medium">Sunday at 10:00am</span>
          </div>
        </div>
      </div>

      <section className="py-3 md:border-b bg-white relative z-50">
        <div className="container mx-auto px-4 md:px-6">
          <nav className="grid grid-cols-[max-content_1fr] items-center gap-4">
            <div className="flex items-center gap-2 md:gap-4">
              {logo && <Logo alt={settingsSiteTitle} priority image={logo} />}
              {settingsSiteTitle && (
                <h1 className="hidden lg:block text-xl md:text-2xl font-bold text-foreground whitespace-nowrap">
                  {settingsSiteTitle}
                </h1>
              )}
            </div>

            <NavbarClient navbarData={navbarData} />
          </nav>
        </div>
      </section>
    </div>
  );
};

export const NavbarSkeleton: FC = () => {
  return (
    <header className="h-[75px] py-4 md:border-b">
      <div className="container mx-auto px-4 md:px-6">
        <nav className="grid grid-cols-[auto_1fr] items-center gap-4">
          <div className="flex items-center gap-4">
            <div className="h-[40px] w-[170px] rounded animate-pulse bg-muted" />
            <div className="hidden lg:block h-[32px] w-[200px] rounded animate-pulse bg-muted" />
          </div>
          <NavbarSkeletonResponsive />
        </nav>
      </div>
    </header>
  );
};
