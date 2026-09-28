// Format an ISO date string as a Thai-locale date, e.g. "14 มิถุนายน 2569".
export function formatThaiDate(iso: string): string {
  return new Intl.DateTimeFormat("th-TH", {
    year: "numeric",
    month: "long",
    day: "numeric",
  }).format(new Date(iso));
}
