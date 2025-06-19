import { sanityFetch } from "@/lib/sanity/live";
import { queryGlobalSeoSettings, queryNavbarData } from "@/lib/sanity/query";
import type {
  QueryGlobalSeoSettingsResult,
  QueryNavbarDataResult,
} from "@/lib/sanity/sanity.types";
import type { FC } from "react";

import { Logo } from "./logo";
import { NavbarClient, NavbarSkeletonResponsive } from "./navbar-client";

export const NavbarServer: FC = async () => {
  const [navbarData, settingsData] = await Promise.all([
    sanityFetch({ query: queryNavbarData }),
    sanityFetch({ query: queryGlobalSeoSettings }),
  ]);
  return (
    <Navbar navbarData={navbarData.data} settingsData={settingsData.data} />
  );
}

export const Navbar: FC<{
  navbarData: QueryNavbarDataResult;
  settingsData: QueryGlobalSeoSettingsResult;
}> = ({ navbarData, settingsData }) => {
  const { siteTitle: settingsSiteTitle, logo } = settingsData ?? {};
  return (
    <section className="py-3 md:border-b">
      <div className="container mx-auto px-4 md:px-6">
        <nav className="grid grid-cols-[auto_1fr] items-center gap-4">
          <div className="flex items-center gap-4">
            {logo && <Logo alt={settingsSiteTitle} priority image={logo} />}
            {settingsSiteTitle && (
              <h1 className="text-2xl font-bold text-foreground">
                {settingsSiteTitle}
              </h1>
            )}
          </div>

          <NavbarClient navbarData={navbarData} />
        </nav>
      </div>
    </section>
  );
}

export const NavbarSkeleton: FC = () => {
  return (
    <header className="h-[75px] py-4 md:border-b">
      <div className="container mx-auto px-4 md:px-6">
        <nav className="grid grid-cols-[auto_1fr] items-center gap-4">
          <div className="flex items-center gap-4">
            <div className="h-[40px] w-[170px] rounded animate-pulse bg-muted" />
            <div className="h-[32px] w-[200px] rounded animate-pulse bg-muted" />
          </div>
          <NavbarSkeletonResponsive />
        </nav>
      </div>
    </header>
  );
}
