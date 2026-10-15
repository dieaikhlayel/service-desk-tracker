// Turns "2026-10-15T10:30:00" into something like "Oct 15, 2026"
export function formatDate(isoString: string): string {
    const date = new Date(isoString)
    if (Number.isNaN(date.getTime())) {
        return isoString
    }
    return date.toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' })
}