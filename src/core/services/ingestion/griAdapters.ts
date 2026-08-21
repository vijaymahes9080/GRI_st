import { ContentEntity } from '../../types/content';
import { HtmlNormalizer, Deduplicator } from './htmlNormalizer';

export interface IngestionResult {
  adapterName: string;
  sourceUrl: string;
  itemsFetched: number;
  entities: Partial<ContentEntity>[];
  timestamp: string;
}

export abstract class BaseGriAdapter {
  abstract readonly adapterName: string;
  abstract readonly targetUrl: string;

  abstract parse(rawHtml: string): Partial<ContentEntity>[];

  protected createBaseEntity(
    type: ContentEntity['entityType'],
    title: string,
    rawContent: string,
    sourceUrl: string,
    category: string = 'General'
  ): Partial<ContentEntity> {
    const cleanTitle = HtmlNormalizer.stripTags(title);
    const cleanContent = HtmlNormalizer.stripTags(rawContent);
    const absUrl = HtmlNormalizer.toAbsoluteUrl(sourceUrl);
    const checksum = Deduplicator.calculateChecksum(cleanTitle, cleanContent, absUrl);

    return {
      entityType: type,
      title: cleanTitle,
      description: cleanContent.substring(0, 300),
      contentHtml: rawContent,
      category,
      status: 'published',
      sourceUrl: absUrl,
      checksum,
      publishedAt: new Date().toISOString(),
      attachments: absUrl.endsWith('.pdf')
        ? [{ title: cleanTitle, url: absUrl, mimeType: 'application/pdf' }]
        : [],
      metadata: {
        adapter: this.adapterName,
        ingestedAt: new Date().toISOString(),
      },
    };
  }
}

export class NewsAdapter extends BaseGriAdapter {
  readonly adapterName = 'NewsAdapter';
  readonly targetUrl = 'https://ruraluniv.ac.in/site/';

  parse(rawHtml: string): Partial<ContentEntity>[] {
    const entities: Partial<ContentEntity>[] = [];
    const tickerRegex = /<a[^>]+href=["']([^"']+)["'][^>]*>(.*?)<\/a>/gi;
    let match;

    while ((match = tickerRegex.exec(rawHtml)) !== null) {
      const link = match[1];
      const text = match[2];
      if (text && text.trim().length > 10 && !link.includes('javascript')) {
        entities.push(
          this.createBaseEntity('news', text, text, link, 'Circular')
        );
      }
    }

    return entities;
  }
}

export class EventsAdapter extends BaseGriAdapter {
  readonly adapterName = 'EventsAdapter';
  readonly targetUrl = 'https://ruraluniv.ac.in/site/events';

  parse(rawHtml: string): Partial<ContentEntity>[] {
    const entities: Partial<ContentEntity>[] = [];
    const eventRegex = /<div[^>]*class=["'][^"']*event[^"']*["'][^>]*>(.*?)<\/div>/gis;
    let match;

    while ((match = eventRegex.exec(rawHtml)) !== null) {
      const content = match[1];
      const titleMatch = /<h[1-6][^>]*>(.*?)<\/h[1-6]>/i.exec(content);
      const linkMatch = /href=["']([^"']+)["']/i.exec(content);

      if (titleMatch && titleMatch[1]) {
        entities.push(
          this.createBaseEntity(
            'event',
            titleMatch[1],
            content,
            linkMatch ? linkMatch[1] : this.targetUrl,
            'Event'
          )
        );
      }
    }

    return entities;
  }
}

export class DepartmentsAdapter extends BaseGriAdapter {
  readonly adapterName = 'DepartmentsAdapter';
  readonly targetUrl = 'https://ruraluniv.ac.in/site/departments';

  parse(rawHtml: string): Partial<ContentEntity>[] {
    const entities: Partial<ContentEntity>[] = [];
    const deptRegex = /<a[^>]+href=["']([^"']*dept[^"']*)["'][^>]*>(.*?)<\/a>/gi;
    let match;

    while ((match = deptRegex.exec(rawHtml)) !== null) {
      const link = match[1];
      const name = match[2];
      if (name && name.trim().length > 3) {
        entities.push(
          this.createBaseEntity('department', name, `Department of ${name}`, link, 'Academics')
        );
      }
    }

    return entities;
  }
}

export class AdmissionsAdapter extends BaseGriAdapter {
  readonly adapterName = 'AdmissionsAdapter';
  readonly targetUrl = 'https://ruraluniv.ac.in/site/admissions';

  parse(rawHtml: string): Partial<ContentEntity>[] {
    const entities: Partial<ContentEntity>[] = [];
    const admRegex = /<a[^>]+href=["']([^"']*)["'][^>]*>(.*?admission.*?)<\/a>/gi;
    let match;

    while ((match = admRegex.exec(rawHtml)) !== null) {
      const link = match[1];
      const title = match[2];
      if (title && title.trim().length > 5) {
        entities.push(
          this.createBaseEntity('admission', title, title, link, 'Admissions')
        );
      }
    }

    return entities;
  }
}

export class ExaminationAdapter extends BaseGriAdapter {
  readonly adapterName = 'ExaminationAdapter';
  readonly targetUrl = 'https://ruraluniv.ac.in/site/examinations';

  parse(rawHtml: string): Partial<ContentEntity>[] {
    const entities: Partial<ContentEntity>[] = [];
    const examRegex = /<a[^>]+href=["']([^"']*)["'][^>]*>(.*?(?:exam|result|timetable|hall ticket).*?)<\/a>/gi;
    let match;

    while ((match = examRegex.exec(rawHtml)) !== null) {
      const link = match[1];
      const title = match[2];
      if (title && title.trim().length > 5) {
        entities.push(
          this.createBaseEntity('exam', title, title, link, 'Examinations')
        );
      }
    }

    return entities;
  }
}
