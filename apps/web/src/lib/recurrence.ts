export type Recurrence = {
    frequency?: "daily" | "weekly" | "monthly";
    interval?: number; // repeat every N units (default 1)
    byWeekday?: ("sun" | "mon" | "tue" | "wed" | "thu" | "fri" | "sat")[];
    byMonthday?: number[]; // 1-31
    monthlyMode?: "byDate" | "byWeekdayOfMonth";
    weekOfMonth?: number | null; // 1-5
    weekday?: "sun" | "mon" | "tue" | "wed" | "thu" | "fri" | "sat" | null;
    until?: string | null; // ISO date string
    count?: number | null; // optional cap on number of occurrences
    exceptions?: (string | null)[]; // ISO dates to skip
};

export type RecurringEventLike = {
    _id: string;
    startDate: string | null;
    endDate?: string | null;
    occurrenceType?: "single" | "recurring" | null;
    recurrence?: Recurrence | null;
};

const WEEKDAY_TO_INDEX: Record<string, number> = {
    sun: 0,
    mon: 1,
    tue: 2,
    wed: 3,
    thu: 4,
    fri: 5,
    sat: 6,
};

function cleanToken(value?: string | null): string {
    return (value ?? "").toLowerCase().replace(/[^a-z]/g, "");
}

function normalizeFrequency(value?: string | null): "daily" | "weekly" | "monthly" {
    const v = cleanToken(value);
    if (v.includes("daily")) return "daily";
    if (v.includes("weekly")) return "weekly";
    if (v.includes("monthly")) return "monthly";
    return "weekly";
}

function normalizeMonthlyMode(value?: string | null): "byDate" | "byWeekdayOfMonth" {
    const v = cleanToken(value);
    if (v.includes("byweekdayofmonth") || v.includes("weekdayofmonth")) {
        return "byWeekdayOfMonth";
    }
    return "byDate";
}

function normalizeWeekday(value?: string | null): "sun" | "mon" | "tue" | "wed" | "thu" | "fri" | "sat" | null {
    const v = cleanToken(value);
    if (v.startsWith("sun")) return "sun";
    if (v.startsWith("mon")) return "mon";
    if (v.startsWith("tue")) return "tue";
    if (v.startsWith("wed")) return "wed";
    if (v.startsWith("thu")) return "thu";
    if (v.startsWith("fri")) return "fri";
    if (v.startsWith("sat")) return "sat";
    return null;
}

function normalizeWeekdayArray(values?: (string | null | undefined)[] | null): ("sun" | "mon" | "tue" | "wed" | "thu" | "fri" | "sat")[] {
    const list = Array.isArray(values) ? values : [];
    const mapped = list
        .map((v) => normalizeWeekday(typeof v === "string" ? v : String(v ?? "")))
        .filter((v): v is NonNullable<ReturnType<typeof normalizeWeekday>> => v !== null);
    return mapped.length > 0 ? mapped : [];
}

function startOfDay(date: Date): Date {
    const d = new Date(date);
    d.setHours(0, 0, 0, 0);
    return d;
}

function isSameDay(a: Date, b: Date): boolean {
    return (
        a.getFullYear() === b.getFullYear() &&
        a.getMonth() === b.getMonth() &&
        a.getDate() === b.getDate()
    );
}

function addDays(date: Date, days: number): Date {
    const d = new Date(date);
    d.setDate(d.getDate() + days);
    return d;
}

function addMonths(date: Date, months: number): Date {
    const d = new Date(date);
    d.setMonth(d.getMonth() + months);
    return d;
}

function diffInDays(from: Date, to: Date): number {
    const ms = startOfDay(to).getTime() - startOfDay(from).getTime();
    return Math.floor(ms / (24 * 60 * 60 * 1000));
}

function diffInWeeks(from: Date, to: Date): number {
    return Math.floor(diffInDays(from, to) / 7);
}

function diffInMonths(from: Date, to: Date): number {
    return (
        (to.getFullYear() - from.getFullYear()) * 12 + (to.getMonth() - from.getMonth())
    );
}

function getDurationMs(start: Date, end?: Date | null): number | null {
    if (!end) return null;
    return end.getTime() - start.getTime();
}

function parseIso(iso?: string | null): Date | null {
    if (!iso) return null;
    const d = new Date(iso);
    return isNaN(d.getTime()) ? null : d;
}

export type Occurrence = { startDate: string; endDate: string | null };

export function computeNextOccurrence(
    event: RecurringEventLike,
    fromDate: Date = new Date(),
): Occurrence | null {
    const baseStart = parseIso(event.startDate);
    if (!baseStart) return null;
    const baseEnd = parseIso(event.endDate ?? null);
    const duration = getDurationMs(baseStart, baseEnd);

    if (event.occurrenceType !== "recurring" || !event.recurrence) {
        // Single instance
        if (startOfDay(baseStart) < startOfDay(fromDate)) {
            return null; // past
        }
        return {
            startDate: baseStart.toISOString(),
            endDate: duration ? new Date(baseStart.getTime() + duration).toISOString() : null,
        };
    }

    const r = event.recurrence;
    const frequency = normalizeFrequency(r.frequency ?? undefined);
    const interval = Math.max(1, r.interval ?? 1);
    const until = parseIso(r.until ?? null);
    const exceptions = (r.exceptions ?? [])
        .map((e) => parseIso(e))
        .filter((d): d is Date => !!d)
        .map((d) => startOfDay(d));

    // Start searching from today or the base start, whichever is later
    let cursor = startOfDay(fromDate) > startOfDay(baseStart)
        ? startOfDay(fromDate)
        : startOfDay(baseStart);

    // Cap the search to prevent infinite loops
    for (let i = 0; i < 1000; i += 1) {
        if (until && cursor > until) return null;

        let matches = false;
        if (frequency === "daily") {
            const daysSinceBase = diffInDays(startOfDay(baseStart), cursor);
            matches = daysSinceBase >= 0 && daysSinceBase % interval === 0;
        } else if (frequency === "weekly") {
            const weeksSinceBase = diffInWeeks(startOfDay(baseStart), cursor);
            const inInterval = weeksSinceBase >= 0 && weeksSinceBase % interval === 0;
            const normalizedWeekdays = normalizeWeekdayArray(
                Array.isArray((r as any).byWeekday) ? (r as any).byWeekday : [],
            );
            const weekdays =
                normalizedWeekdays.length > 0
                    ? normalizedWeekdays.map((d) => WEEKDAY_TO_INDEX[d])
                    : [startOfDay(baseStart).getDay()];
            matches = inInterval && weekdays.includes(cursor.getDay());
        } else if (frequency === "monthly") {
            const monthsSinceBase = diffInMonths(startOfDay(baseStart), cursor);
            const inInterval = monthsSinceBase >= 0 && monthsSinceBase % interval === 0;
            const monthlyMode = normalizeMonthlyMode(r.monthlyMode ?? undefined);
            if (monthlyMode === "byDate") {
                const monthdays = (r.byMonthday && r.byMonthday.length > 0)
                    ? r.byMonthday
                    : [startOfDay(baseStart).getDate()];
                matches = inInterval && monthdays.includes(cursor.getDate());
            } else {
                // byWeekdayOfMonth: e.g., first Sunday
                const desiredWeek = Math.max(1, Math.min(5, r.weekOfMonth ?? 1));
                const normalizedWeekday = normalizeWeekday(r.weekday ?? null);
                const desiredWeekdayIndex: number =
                    normalizedWeekday !== null && WEEKDAY_TO_INDEX[normalizedWeekday] !== undefined
                        ? (WEEKDAY_TO_INDEX[normalizedWeekday] as number)
                        : startOfDay(baseStart).getDay();
                // compute the n-th weekday of this month
                const firstOfMonth = new Date(cursor.getFullYear(), cursor.getMonth(), 1);
                const firstWeekday = firstOfMonth.getDay();
                let offset = desiredWeekdayIndex - firstWeekday;
                if (offset < 0) offset += 7;
                const nthDate = 1 + offset + (desiredWeek - 1) * 7; // candidate date
                const candidate = new Date(cursor.getFullYear(), cursor.getMonth(), nthDate);
                const isSameMonth = candidate.getMonth() === cursor.getMonth();
                matches = inInterval && isSameMonth && isSameDay(candidate, cursor);
            }
        }

        if (matches) {
            // Skip exceptions
            const isException = exceptions.some((ex) => isSameDay(ex, cursor));
            if (!isException) {
                // Build start at base start time of day
                const occurrenceStart = new Date(
                    cursor.getFullYear(),
                    cursor.getMonth(),
                    cursor.getDate(),
                    baseStart.getHours(),
                    baseStart.getMinutes(),
                    baseStart.getSeconds(),
                    baseStart.getMilliseconds(),
                );
                const occurrenceEnd = duration
                    ? new Date(occurrenceStart.getTime() + duration)
                    : null;
                return {
                    startDate: occurrenceStart.toISOString(),
                    endDate: occurrenceEnd ? occurrenceEnd.toISOString() : null,
                };
            }
        }

        // Advance cursor by 1 day for next check
        cursor = addDays(cursor, 1);
    }

    return null;
}

export function buildDisplayEvents<T extends RecurringEventLike & { [key: string]: any }>(
    events: T[],
    options: { onlyUpcoming?: boolean; includeRecurring?: boolean; limit?: number } = {},
): (T & { displayStartDate: string | null; displayEndDate: string | null })[] {
    const { onlyUpcoming = true, includeRecurring = true, limit = 6 } = options;

    const now = new Date();
    const decorated = (events || [])
        .map((e) => {
            if (e.occurrenceType === "recurring") {
                if (!includeRecurring) {
                    return null;
                }
                const next = computeNextOccurrence(e, now);
                if (!next) return null;
                return {
                    ...e,
                    displayStartDate: next.startDate,
                    displayEndDate: next.endDate,
                };
            }

            // single events
            const start = parseIso(e.startDate);
            if (!start) {
                // Keep items without a start date when not strictly filtering upcoming
                if (!onlyUpcoming) {
                    return { ...e, displayStartDate: null, displayEndDate: null };
                }
                return null;
            }
            if (onlyUpcoming && start < now) return null;
            const end = parseIso(e.endDate ?? null);
            return {
                ...e,
                displayStartDate: start.toISOString(),
                displayEndDate: end ? end.toISOString() : null,
            };
        })
        .filter(Boolean) as (T & {
            displayStartDate: string | null;
            displayEndDate: string | null;
        })[];

    decorated.sort((a, b) => {
        const aTime = a.displayStartDate ? new Date(a.displayStartDate).getTime() : 0;
        const bTime = b.displayStartDate ? new Date(b.displayStartDate).getTime() : 0;
        return aTime - bTime;
    });

    return decorated.slice(0, Math.max(1, limit));
}


