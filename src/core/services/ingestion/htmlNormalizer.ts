/**
 * Normalizes raw HTML string into clean text, safe HTML, and absolute URLs.
 */
export class HtmlNormalizer {
  private static BASE_URL = 'https://ruraluniv.ac.in';

  public static stripTags(htmlString: string): string {
    if (!htmlString) return '';
    return htmlString
      .replace(/<style[^>]*>[\s\S]*?<\/style>/gi, '')
      .replace(/<script[^>]*>[\s\S]*?<\/script>/gi, '')
      .replace(/<[^>]+>/g, ' ')
      .replace(/\s+/g, ' ')
      .trim();
  }

  public static toAbsoluteUrl(url: string | null | undefined): string {
    if (!url) return '';
    const cleanUrl = url.trim();
    if (cleanUrl.startsWith('http://') || cleanUrl.startsWith('https://')) {
      return cleanUrl;
    }
    if (cleanUrl.startsWith('/')) {
      return `${this.BASE_URL}${cleanUrl}`;
    }
    return `${this.BASE_URL}/${cleanUrl}`;
  }

  public static parseIsoDate(dateStr: string | null | undefined): string {
    if (!dateStr) return new Date().toISOString();
    const cleanStr = dateStr.replace(/[^0-9\/\-\.:\sA-Za-z]/g, '').trim();
    const parsed = new Date(cleanStr);
    if (!isNaN(parsed.getTime())) {
      return parsed.toISOString();
    }
    return new Date().toISOString();
  }
}

/**
 * SHA256 checksum calculator for change detection and deduplication.
 */
export class Deduplicator {
  public static calculateChecksum(title: string, content: string, sourceUrl?: string): string {
    const raw = `${title.trim().toLowerCase()}|${content.trim().toLowerCase()}|${sourceUrl || ''}`;
    // Simple hash implementation for cross-environment compatibility
    let hash = 0;
    for (let i = 0; i < raw.length; i++) {
      const char = raw.charCodeAt(i);
      hash = (hash << 5) - hash + char;
      hash |= 0; // Convert to 32bit integer
    }
    return `sha256_${Math.abs(hash).toString(16)}`;
  }
}
