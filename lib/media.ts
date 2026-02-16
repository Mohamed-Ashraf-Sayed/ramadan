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

/**
 * Extract YouTube video ID and return embed URL
 * Supports: youtube.com/watch?v=ID, youtu.be/ID, youtube.com/embed/ID, youtube.com/shorts/ID
 */
export function getYoutubeEmbedUrl(url: string): string | null {
  const patterns = [
    /youtube\.com\/watch\?v=([^&\s]+)/,
    /youtu\.be\/([^?\s]+)/,
    /youtube\.com\/embed\/([^?\s]+)/,
    /youtube\.com\/shorts\/([^?\s]+)/,
  ];
  for (const pattern of patterns) {
    const match = url.match(pattern);
    if (match) return `https://www.youtube.com/embed/${match[1]}`;
  }
  return null;
}

/**
 * Check if a URL is a valid YouTube URL
 */
export function isYoutubeUrl(url: string): boolean {
  return getYoutubeEmbedUrl(url) !== null;
}
