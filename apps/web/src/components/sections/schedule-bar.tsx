import type { PagebuilderType } from "@/types";
import type { FC } from "react";
import React from "react";

// Type for the scheduleBar block
// If typegen is not up to date, you may need to adjust this type
export type ScheduleBarBlockProps = PagebuilderType<"scheduleBar">;

export const ScheduleBar: FC<ScheduleBarBlockProps> = ({ times = [], infoText, location }) => {
  return (
    <section
      className="bg-[#274344] text-white py-5 text-[1.13rem] tracking-wide schedule-bar"
    >
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row md:justify-center md:items-center gap-4 md:gap-8 schedule-times w-full">
          {times.map((t, i) => (
            <React.Fragment key={t._key || i}>
              <div className="flex items-center gap-2">
                <span className="font-semibold text-[#B2DCF7]">{t.label}</span>
                <span>{t.time}</span>
              </div>
              {i < times.length - 1 && times.length > 1 && (
                <span key={`dot-${i}`} aria-hidden="true" className="mx-2">&#8226;</span>
              )}
            </React.Fragment>
          ))}m
          {(infoText || location) && (
            <div className="flex items-center gap-2">
              {infoText && <span>{infoText}</span>}
              {infoText && location && <strong className="font-semibold">|</strong>}
              {location && <span>{location}</span>}
            </div>
          )}
        </div>
      </div>
    </section>
  );
}; 