"""
GRI Playwright Crawler — Dynamic & Authenticated Page Scraper
For JS-rendered pages and authenticated portals (exam timetable, PhD tracking)

Run with:
    python scrapers/gri_playwright_spider.py

Author  : Vijay Mahes
Version : 1.0.0
"""

import asyncio
import json
import logging
import os
from datetime import datetime, timezone
from playwright.async_api import async_playwright, Page, Browser

logging.basicConfig(level=logging.INFO, format="%(asctime)s [%(levelname)s] %(message)s")
logger = logging.getLogger(__name__)

OUTPUT_DIR = "research/data_collection/data"
os.makedirs(OUTPUT_DIR, exist_ok=True)


async def scrape_exam_timetable(page: Page) -> list[dict]:
    """Scrape the ESE exam timetable from the dynamic timetable page."""
    url = "http://ruraluniv.ac.in/examtt"
    logger.info(f"[PLAYWRIGHT] Navigating to exam timetable: {url}")

    await page.goto(url, wait_until="networkidle", timeout=30000)
    await page.wait_for_timeout(2000)   # Wait for JS render

    timetable = []
    try:
        rows = await page.query_selector_all("table tr")
        for row in rows:
            cells = await row.query_selector_all("td, th")
            row_data = []
            for cell in cells:
                text = await cell.inner_text()
                row_data.append(text.strip())
            if row_data:
                timetable.append({
                    "row":        row_data,
                    "scraped_at": datetime.now(timezone.utc).isoformat(),
                })
    except Exception as exc:
        logger.error(f"[EXAM TT ERROR] {exc}")

    logger.info(f"[EXAM TT] Extracted {len(timetable)} rows")
    return timetable


async def scrape_admissions_portal(page: Page) -> list[dict]:
    """Scrape the 2026 Admissions portal."""
    url = "https://ruraluniv.ac.in/adm/index.html"
    logger.info(f"[PLAYWRIGHT] Navigating to admissions portal: {url}")

    await page.goto(url, wait_until="domcontentloaded", timeout=30000)
    await page.wait_for_timeout(2000)

    data = []
    try:
        # Extract programme-wise intake from the admissions page
        links = await page.query_selector_all("a")
        for link in links:
            text = await link.inner_text()
            href = await link.get_attribute("href")
            text = text.strip()
            if href and text and len(text) > 5:
                data.append({
                    "type":       "admission_link",
                    "title":      text,
                    "url":        href,
                    "scraped_at": datetime.now(timezone.utc).isoformat(),
                })
    except Exception as exc:
        logger.error(f"[ADMISSIONS ERROR] {exc}")

    logger.info(f"[ADMISSIONS] Extracted {len(data)} links")
    return data


async def scrape_campus_map(page: Page) -> dict:
    """Capture a screenshot of the interactive campus map."""
    url = "http://ruraluniv.ac.in/includes/aboutgri/map/map.html"
    logger.info(f"[PLAYWRIGHT] Capturing campus map: {url}")

    map_data = {"url": url, "screenshot": None, "scraped_at": datetime.now(timezone.utc).isoformat()}

    try:
        await page.goto(url, wait_until="domcontentloaded", timeout=30000)
        await page.wait_for_timeout(3000)
        screenshot_path = f"{OUTPUT_DIR}/campus_map_screenshot.png"
        await page.screenshot(path=screenshot_path, full_page=True)
        map_data["screenshot"] = screenshot_path
        logger.info(f"[MAP] Screenshot saved to {screenshot_path}")
    except Exception as exc:
        logger.error(f"[MAP ERROR] {exc}")

    return map_data


async def scrape_enews_pages(page: Page) -> list[dict]:
    """Scrape e-news pages that may require JS rendering."""
    years = ["2k26", "2k25", "2k24", "2k23"]
    all_news = []

    for year in years:
        url = f"https://ruraluniv.ac.in/includes/enews/{year}"
        logger.info(f"[PLAYWRIGHT] Scraping e-News {year}: {url}")
        try:
            await page.goto(url, wait_until="domcontentloaded", timeout=30000)
            await page.wait_for_timeout(1500)

            # Extract news links and titles
            links = await page.query_selector_all("a")
            for link in links:
                text = await link.inner_text()
                href = await link.get_attribute("href") or ""
                text = text.strip()
                if text and len(text) > 10 and (href.endswith(".pdf") or "enews" in href or "news" in href.lower()):
                    all_news.append({
                        "type":       "news",
                        "year":       year,
                        "title":      text[:500],
                        "url":        href,
                        "scraped_at": datetime.now(timezone.utc).isoformat(),
                    })
        except Exception as exc:
            logger.error(f"[ENEWS {year} ERROR] {exc}")

    logger.info(f"[ENEWS] Extracted {len(all_news)} news items across {len(years)} years")
    return all_news


def save_json(data, filename: str):
    """Save data to a JSON file."""
    path = f"{OUTPUT_DIR}/{filename}"
    with open(path, "w", encoding="utf-8") as f:
        json.dump(data if isinstance(data, list) else [data], f, ensure_ascii=False, indent=2)
    logger.info(f"[SAVED] {path}")


async def main():
    """Main async runner for all Playwright scrapers."""
    logger.info("═" * 55)
    logger.info("GRI Data Collection — Playwright Dynamic Spider")
    logger.info("═" * 55)

    async with async_playwright() as pw:
        browser: Browser = await pw.chromium.launch(
            headless=True,
            args=["--disable-blink-features=AutomationControlled"]
        )
        context = await browser.new_context(
            user_agent=(
                "Mozilla/5.0 (Windows NT 10.0; Win64; x64) "
                "AppleWebKit/537.36 (KHTML, like Gecko) "
                "Chrome/126.0.0.0 Safari/537.36"
            ),
            locale="en-IN",
            viewport={"width": 1280, "height": 900},
        )
        page = await context.new_page()

        # Run all scrapers
        timetable = await scrape_exam_timetable(page)
        admissions = await scrape_admissions_portal(page)
        map_data   = await scrape_campus_map(page)
        enews      = await scrape_enews_pages(page)

        # Save outputs
        save_json(timetable,  "exam_timetable.json")
        save_json(admissions, "admissions_portal.json")
        save_json([map_data], "campus_map.json")
        save_json(enews,      "enews.json")

        await browser.close()

    logger.info("✅ Playwright scraping completed.")


if __name__ == "__main__":
    asyncio.run(main())
