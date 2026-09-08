export interface CalendarEventDetails {
  title: string;
  description: string;
  location?: string;
  startDate: string | Date;
  endDate?: string | Date;
}

function formatDateToIsoBasic(date: Date): string {
  return date
    .toISOString()
    .replace(/-|:|\.\d\d\d/g, "");
}

export function createGoogleCalendarUrl(event: CalendarEventDetails): string {
  const start = new Date(event.startDate);
  // Default duration: 2 hours if end date is not provided
  const end = event.endDate
    ? new Date(event.endDate)
    : new Date(start.getTime() + 2 * 60 * 60 * 1000);

  const startIso = formatDateToIsoBasic(start);
  const endIso = formatDateToIsoBasic(end);

  const params = new URLSearchParams({
    action: "TEMPLATE",
    text: event.title,
    details: `${event.description}\n\nOrganized by Elixir Tech Community\nhttps://elixircommunity.in`,
    location: event.location || "Online / Elixir Tech Community",
    dates: `${startIso}/${endIso}`,
  });

  return `https://calendar.google.com/calendar/render?${params.toString()}`;
}

export function downloadIcsFile(event: CalendarEventDetails): void {
  const start = new Date(event.startDate);
  const end = event.endDate
    ? new Date(event.endDate)
    : new Date(start.getTime() + 2 * 60 * 60 * 1000);

  const startIso = formatDateToIsoBasic(start);
  const endIso = formatDateToIsoBasic(end);
  const nowIso = formatDateToIsoBasic(new Date());

  const icsContent = [
    "BEGIN:VCALENDAR",
    "VERSION:2.0",
    "PRODID:-//Elixir Tech Community//Event Calendar//EN",
    "CALSCALE:GREGORIAN",
    "METHOD:PUBLISH",
    "BEGIN:VEVENT",
    `UID:elixir-event-${Date.now()}@elixircommunity.in`,
    `DTSTAMP:${nowIso}`,
    `DTSTART:${startIso}`,
    `DTEND:${endIso}`,
    `SUMMARY:${event.title.replace(/\n/g, " ")}`,
    `DESCRIPTION:${event.description.replace(/\n/g, "\\n")}`,
    `LOCATION:${(event.location || "Online / Elixir Tech Community").replace(/\n/g, " ")}`,
    "STATUS:CONFIRMED",
    "END:VEVENT",
    "END:VCALENDAR",
  ].join("\r\n");

  const blob = new Blob([icsContent], { type: "text/calendar;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.setAttribute("download", `${event.title.replace(/[^a-z0-9]/gi, "_").toLowerCase()}.ics`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}
