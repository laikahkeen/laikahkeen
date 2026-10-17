// UTC on both sides, so the prerendered date and the hydrated one cannot differ.
const format = new Intl.DateTimeFormat('en-GB', { day: 'numeric', month: 'long', year: 'numeric', timeZone: 'UTC' });

export function formatDate(date: string): string {
  return format.format(new Date(`${date}T00:00:00Z`));
}
