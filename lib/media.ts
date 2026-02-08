/**
 * Convert old /uploads/ URLs to /api/files/ URLs
 * This handles backward compatibility for images uploaded before the API file serving change
 */
export function getMediaUrl(url: string | null | undefined): string {
  if (!url) return "";
  if (url.startsWith("/uploads/")) {
    const filename = url.replace("/uploads/", "");
    return `/api/files/${filename}`;
  }
  return url;
}
