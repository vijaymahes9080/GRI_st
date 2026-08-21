"""
GRI Scrapy Spider — Bulk Content Crawler
Production-ready spider for https://ruraluniv.ac.in

Run with:
    scrapy crawl gri_spider -O research/data_collection/data/scrapy_output.json

Author  : Vijay Mahes
Version : 1.0.0
"""

import re
import scrapy
from datetime import datetime, timezone
from urllib.parse import urljoin


class GRISpider(scrapy.Spider):
    """Scrapy spider to crawl all major public sections of ruraluniv.ac.in"""

    name = "gri_spider"
    allowed_domains = ["ruraluniv.ac.in"]
    start_urls = ["https://ruraluniv.ac.in/home.php"]

    # Discovered target URLs from sitemap analysis
    SECTION_URLS = [
        # About GRI
        "https://ruraluniv.ac.in/aboutgri?content=vm",
        "https://ruraluniv.ac.in/aboutgri?content=profile",
        "https://ruraluniv.ac.in/aboutgri?content=campus",
        # Academics
        "https://ruraluniv.ac.in/academics?content=CBCSsystem",
        "https://ruraluniv.ac.in/academics?content=programmes",
        "https://ruraluniv.ac.in/academics?content=faculties",
        "https://ruraluniv.ac.in/academics?content=womensstudies",
        "https://ruraluniv.ac.in/academics?content=geoinformatics",
        "https://ruraluniv.ac.in/academics?content=Home",
        "https://ruraluniv.ac.in/academics?content=calendar",
        # Admissions
        "https://ruraluniv.ac.in/admissions?content=MPhil_Regulations",
        "https://ruraluniv.ac.in/admissions?content=PhD_Regulations",
        "https://ruraluniv.ac.in/admissions?content=Dsc_Regulations",
        "https://ruraluniv.ac.in/admn1?content=Refund",
        "https://ruraluniv.ac.in/admn1?content=Hostel_fee",
        # Examination
        "https://ruraluniv.ac.in/examination?content=ExaminationSystem",
        # Governance
        "https://ruraluniv.ac.in/Governance?content=System",
        "https://ruraluniv.ac.in/Governance?content=BOM_Constitution",
        "https://ruraluniv.ac.in/Governance?content=PlanningAndMonitoring_Constitution",
        "https://ruraluniv.ac.in/Governance?content=FinanceCommittee_Composition",
        "https://ruraluniv.ac.in/Governance?content=AcademicCouncil_Composition",
        # Administration
        "https://ruraluniv.ac.in/administration?content=chancellor",
        "https://ruraluniv.ac.in/administration?content=vc",
        "https://ruraluniv.ac.in/administration?content=registrar",
        "https://ruraluniv.ac.in/administration?content=coe",
        "https://ruraluniv.ac.in/administration?content=financeofficer",
        "https://ruraluniv.ac.in/administration?content=deans",
        "https://ruraluniv.ac.in/administration?content=hod",
        "https://ruraluniv.ac.in/administration?content=officers",
        # Facilities
        "https://ruraluniv.ac.in/facilities?content=library",
        "https://ruraluniv.ac.in/facilities?content=phyedu",
        "https://ruraluniv.ac.in/facilities?content=About_NANO_Facility",
        "https://ruraluniv.ac.in/facilities?content=museum",
        "https://ruraluniv.ac.in/facilities?content=SEAWEED_1",
        # Infrastructure
        "https://ruraluniv.ac.in/infrastructure?content=AboutHostel",
        "https://ruraluniv.ac.in/infrastructure?content=guesthouse",
        "https://ruraluniv.ac.in/infrastructure?content=AboutHealthCentre",
        "https://ruraluniv.ac.in/infrastructure?content=ExamHall",
        # e-News
        "https://ruraluniv.ac.in/includes/enews/2k26",
        "https://ruraluniv.ac.in/includes/enews/2k25",
        "https://ruraluniv.ac.in/includes/enews/2k24",
    ]

    custom_settings = {
        "ROBOTSTXT_OBEY": True,
        "DOWNLOAD_DELAY": 1.5,              # Polite crawl: 1.5s between requests
        "CONCURRENT_REQUESTS_PER_DOMAIN": 2,
        "AUTOTHROTTLE_ENABLED": True,
        "AUTOTHROTTLE_START_DELAY": 1,
        "AUTOTHROTTLE_MAX_DELAY": 10,
        "DUPEFILTER_CLASS": "scrapy.dupefilters.RFPDupeFilter",
        "HTTPCACHE_ENABLED": True,
        "HTTPCACHE_EXPIRATION_SECS": 86400,  # 24-hour page cache
        "USER_AGENT": (
            "GRI-DataBot/1.0 (official GRI mobile application; "
            "contact: Vijaypradhap2004@gmail.com)"
        ),
        "DEFAULT_REQUEST_HEADERS": {
            "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
            "Accept-Language": "en-US,en;q=0.9,ta;q=0.8",
        },
    }

    def start_requests(self):
        """Yield requests for all pre-mapped section URLs."""
        for url in self.SECTION_URLS:
            yield scrapy.Request(url, callback=self.parse_section, meta={"source_url": url})

    def parse(self, response):
        """Parse the homepage and extract gallery data and notices."""
        yield from self._extract_gallery(response)
        yield from self._extract_homepage_notices(response)

    def parse_section(self, response):
        """Generic section parser — extracts text content, links, tables, and PDFs."""
        url = response.meta.get("source_url", response.url)
        section = self._detect_section(url)

        # Extract all PDF links
        pdf_links = response.css("a[href$='.pdf']::attr(href)").getall()
        pdf_urls = [urljoin(url, href) for href in pdf_links]

        # Extract main text content area
        content_div = (
            response.css("#content_area") or
            response.css(".content_area") or
            response.css("td[valign='top']")
        )
        text_content = " ".join(content_div.css("*::text").getall()).strip() if content_div else ""

        # Extract all images in the content area
        images = []
        for img in content_div.css("img"):
            src = img.attrib.get("src", "")
            if src:
                images.append(urljoin(url, src))

        # Extract table data (committees, personnel lists, fee structures)
        tables = []
        for table in response.css("table"):
            headers = [th.css("::text").get("").strip() for th in table.css("th")]
            rows = []
            for tr in table.css("tr"):
                row = [td.css("::text").get("").strip() for td in tr.css("td")]
                if any(row):
                    rows.append(row)
            if rows:
                tables.append({"headers": headers, "rows": rows})

        yield {
            "section":      section,
            "source_url":   url,
            "title":        response.css("title::text").get("").strip(),
            "text_content": text_content[:5000],    # Limit to 5000 chars
            "pdf_links":    pdf_urls,
            "images":       images,
            "tables":       tables,
            "scraped_at":   datetime.now(timezone.utc).isoformat(),
        }

    def _extract_gallery(self, response):
        """Extract homepage photo gallery slides."""
        for div in response.css("div[data-src]"):
            src = div.attrib.get("data-src", "")
            if not src:
                continue
            remote_url = urljoin(response.url, src)
            caption = div.css("emp::text, p::text").get("").strip()
            filename = src.split("/")[-1]

            event_date = None
            try:
                date_str = filename[:8]
                datetime.strptime(date_str, "%Y%m%d")
                event_date = f"{date_str[:4]}-{date_str[4:6]}-{date_str[6:8]}"
            except ValueError:
                pass

            yield {
                "section":    "gallery",
                "type":       "gallery_image",
                "filename":   filename,
                "caption":    caption,
                "event_date": event_date,
                "remote_url": remote_url,
                "scraped_at": datetime.now(timezone.utc).isoformat(),
            }

    def _extract_homepage_notices(self, response):
        """Extract scrolling notices from the homepage marquee."""
        for tag in response.css("marquee a, marquee font"):
            link = tag.css("a")
            title = tag.css("::text").get("").strip()
            href = link.attrib.get("href", "") if link else ""
            full_url = urljoin(response.url, href) if href else ""

            if title and len(title) > 5:
                yield {
                    "section":    "notices",
                    "type":       "notice",
                    "title":      title,
                    "url":        full_url,
                    "scraped_at": datetime.now(timezone.utc).isoformat(),
                }

    def _detect_section(self, url: str) -> str:
        """Classify the section from the URL content parameter."""
        section_map = {
            "aboutgri":       "about",
            "academics":      "academics",
            "admissions":     "admissions",
            "admn1":          "admissions",
            "examination":    "examination",
            "Governance":     "governance",
            "administration": "administration",
            "facilities":     "facilities",
            "infrastructure": "infrastructure",
            "enews":          "news",
        }
        for key, section in section_map.items():
            if key in url:
                return section
        return "general"
