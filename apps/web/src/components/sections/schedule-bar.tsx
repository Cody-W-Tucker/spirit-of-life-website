import { MapPin } from "lucide-react";
import type { FC } from "react";
import React from "react";

import type { PagebuilderType } from "@/types";

// Type for the scheduleBar block
// If typegen is not up to date, you may need to adjust this type
export type ScheduleBarBlockProps = PagebuilderType<"scheduleBar">;

export const ScheduleBar: FC<ScheduleBarBlockProps> = ({
  times = [],
  infoText,
  location,
}) => {
  return (
    <section className="w-full bg-brand-primary text-brand-text-white py-4 md:py-3 border-b border-brand-primary-light/10">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row justify-center items-center gap-4 md:gap-8 text-center md:text-left">
          {/* Times */}
          <div className="flex flex-col md:flex-row items-center gap-3 md:gap-6">
            {times.map((t, i) => (
              <React.Fragment key={t._key || i}>
                <div className="flex items-center gap-2.5">
                  <span className="text-accent font-bold uppercase tracking-widest text-xs md:text-sm">
                    {t.label}
                  </span>
                  <span className="text-lg md:text-xl font-light tracking-tight">
                    {t.time}
                  </span>
                </div>
                {/* Desktop Separator */}
                {i < times.length - 1 && (
                  <div
                    className="hidden md:block h-4 w-px bg-white/20 mx-2"
                    aria-hidden="true"
                  />
                )}
              </React.Fragment>
            ))}
          </div>

          {/* Section Divider (Desktop) */}
          {times.length > 0 && (infoText || location) && (
            <div
              className="hidden md:block h-6 w-px bg-white/20"
              aria-hidden="true"
            />
          )}

          {/* Info & Location */}
          {(infoText || location) && (
            <div className="flex flex-col md:flex-row items-center gap-2 md:gap-6 text-brand-text-light/90 text-sm md:text-base font-medium">
              {infoText && <span>{infoText}</span>}

              {infoText && location && (
                <span className="hidden md:inline text-accent">•</span>
              )}

              {location && (
                <div className="flex items-center gap-1.5 opacity-90 hover:opacity-100 transition-opacity">
                  <MapPin className="w-4 h-4 text-accent" />
                  <span>{location}</span>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </section>
  );
};
