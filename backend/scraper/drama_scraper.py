pip install playwright
playwright install

from playwright.async_api import async_playwright
import asyncio
from bs4 import BeautifulSoup
import re
import csv

async def get_drama_links(page_num):
    url = f"https://mydramalist.com/search?adv=titles&ty=68&co=3&st=3&page={page_num}"
    async with async_playwright() as p:
        browser = await p.chromium.launch(headless=True)
        context = await browser.new_context(user_agent="Mozilla/5.0")
        page = await context.new_page()
        await page.goto(url, timeout=60000, wait_until='domcontentloaded')
        await page.wait_for_selector("h6.title a", timeout=10000)
        content = await page.content()
        soup = BeautifulSoup(content, 'html.parser')
        await browser.close()

        # Extract drama links
        links = []
        for title in soup.select("h6.title a[href^='/']"):
            href = title.get("href")
            if not href.startswith('/search'):
                links.append("https://mydramalist.com" + href)
        return links

async def get_drama_details(url):
    try:
        async with async_playwright() as p:
            browser = await p.chromium.launch(headless=True)
            context = await browser.new_context(user_agent="Mozilla/5.0")
            page = await context.new_page()
            await page.goto(url, timeout=60000, wait_until='domcontentloaded')
            content = await page.content()
            soup = BeautifulSoup(content, 'html.parser')
            await browser.close()

            def safe_get_text(element, selector, default=""):
                found = element.select_one(selector)
                return found.get_text(strip=True) if found else default

            # Extract title
            title = safe_get_text(soup, "h1.film-title")

            details_box = soup.select_one("div.box-body.light-b")

            # Extract year
            year_element = soup.select_one("span.release-year") or soup.select_one("div.film-subtitle")
            year_text = year_element.get_text(strip=True) if year_element else ""

            # Extract the year using regular expression
            year_match = re.search(r'(\d{4})(?!.*\d)', year_text)  # Finds last 4-digit number
            year = year_match.group(1) if year_match else ""

            # Extract aired date
            aired_text = safe_get_text(details_box, "li.list-item:has(b:contains('Aired'))")
            aired_match = re.search(r'(\w+\s+\d{1,2},\s+\d{4})\s*-\s*(\w+\s+\d{1,2},\s+\d{4})?', aired_text)
            start_date = aired_match.group(1) if aired_match else ""
            end_date = aired_match.group(2) if aired_match and aired_match.group(2) else ""

            # Extract original network
            network = safe_get_text(details_box, "li.list-item:has(b:contains('Original Network'))").replace("Original Network:", "").strip()

            # Extract aired on
            aired_on = safe_get_text(details_box, "li.list-item:has(b:contains('Aired On'))").replace("Aired On:", "").strip()

            # Extract number of episodes
            episodes = safe_get_text(details_box, "li.list-item:has(b:contains('Episodes'))").replace("Episodes:", "").strip()

            # Extract duration
            duration = safe_get_text(details_box, "li.list-item:has(b:contains('Duration'))").replace("Duration:", "").strip()

            # Extract content rating
            content_rating = safe_get_text(details_box, "li.list-item:has(b:contains('Content Rating'))").replace("Content Rating:", "").strip()

            # Extract rating
            rating = safe_get_text(soup, "div.hfs > b")

            # Extract rating (score)
            score = safe_get_text(details_box, "li.list-item:has(b:contains('Score'))").replace("Score:", "").strip()

            # Extract genres
            genres = [g.get_text(strip=True) for g in soup.select("li.list-item a[href*='/search?adv=titles&ge=']")] if soup.select("li.list-item a[href*='/search?adv=titles&ge=']") else []

            # Extract tags
            tags = [t.get_text(strip=True) for t in soup.select("li.show-tags a[href*='/search?adv=titles&th=']")] if soup.select("li.show-tags a[href*='/search?adv=titles&th=']") else []

            # Extract synopsis
            synopsis = safe_get_text(soup, "div.show-synopsis")

            # Extract statistics
            ranked = safe_get_text(details_box, "li.list-item:has(b:contains('Ranked'))").replace("Ranked:", "").strip()
            popularity = safe_get_text(details_box, "li.list-item:has(b:contains('Popularity'))").replace("Popularity:", "").strip()
            watchers = safe_get_text(details_box, "li.list-item:has(b:contains('Watchers'))").replace("Watchers:", "").strip()

            # Extract directors
            directors = [d.get_text(strip=True) for d in soup.select("li.list-item:has(b:contains('Director')) a.text-primary")] if soup.select("li.list-item:has(b:contains('Director')) a.text-primary") else []

            # Extract screenwriters
            screenwriters = [w.get_text(strip=True) for w in soup.select("li.list-item:has(b:contains('Screenwriter')) a.text-primary")] if soup.select("li.list-item:has(b:contains('Screenwriter')) a.text-primary") else []

            # Extract main actors and their character names from Cast & Crew section
            main_actors = []
            cast_elements = soup.select("ul.credits li.list-item")[:4] if soup.select("ul.credits li.list-item") else []
            for cast in cast_elements:
                actor_name = safe_get_text(cast, "b[itemprop='name']")
                character_element = cast.select_one("small a.text-primary") or cast.select_one("small")
                character_name = character_element.get_text(strip=True) if character_element else ""
                role_type = "Main Role" if "Main Role" in cast.get_text(strip=True) else "Supporting Role"
                main_actors.append({
                    "name": actor_name,
                    "character": character_name,
                    "role_type": role_type
                })

            return {
                "title": title,
                "year": year,
                "start_date": start_date,
                "end_date": end_date,
                "original_network": network,
                "aired_on": aired_on,
                "number_of_episodes": episodes,
                "duration": duration,
                "content_rating": content_rating,
                "rating": rating,
                "genres": genres,
                "tags": tags,
                "synopsis": synopsis,
                "statistics": {
                    "score": score,
                    "ranked": ranked,
                    "popularity": popularity,
                    "watchers": watchers
                },
                "directors": directors,
                "screenwriters": screenwriters,
                "main_actors": main_actors,
                "url": url
            }
    except Exception as e:
        print(f"Failed to fetch {url}: {str(e)}")
        return None

async def get_drama_details(url):
    try:
        async with async_playwright() as p:
            browser = await p.chromium.launch(headless=True)
            context = await browser.new_context(user_agent="Mozilla/5.0")
            page = await context.new_page()
            await page.goto(url, timeout=60000, wait_until='domcontentloaded')
            content = await page.content()
            soup = BeautifulSoup(content, 'html.parser')
            await browser.close()

            def safe_get_text(element, selector, default=""):
                found = element.select_one(selector)
                return found.get_text(strip=True) if found else default

            # Extract fields with safe handling
            title = safe_get_text(soup, "h1.film-title")

            # Extract year from film-subtitle if release-year not found
            year_element = soup.select_one("span.release-year") or soup.select_one("div.film-subtitle")
            year_text = year_element.get_text(strip=True) if year_element else ""

            # Extract the year using regular expression
            year_match = re.search(r'(\d{4})(?!.*\d)', year_text)  # Finds last 4-digit number
            year = year_match.group(1) if year_match else ""

            rating = safe_get_text(soup, "div.hfs > b")

            # Extract genres
            genres = [g.get_text(strip=True) for g in soup.select("li.list-item a[href*='/search?adv=titles&ge=']")] if soup.select("li.list-item a[href*='/search?adv=titles&ge=']") else []

            # Extract tags
            tags = [t.get_text(strip=True) for t in soup.select("li.show-tags a[href*='/search?adv=titles&th=']")] if soup.select("li.show-tags a[href*='/search?adv=titles&th=']") else []

            # Extract synopsis
            synopsis = safe_get_text(soup, "div.show-synopsis")

            # Extract statistics
            stats_box = soup.select_one("div.box-body.light-b")
            score = safe_get_text(stats_box, "li.list-item:has(b:contains('Score'))", "").replace("Score", "").strip()
            ranked = safe_get_text(stats_box, "li.list-item:has(b:contains('Ranked'))", "").replace("Ranked", "").strip()
            popularity = safe_get_text(stats_box, "li.list-item:has(b:contains('Popularity'))", "").replace("Popularity", "").strip()
            watchers = safe_get_text(stats_box, "li.list-item:has(b:contains('Watchers'))", "").replace("Watchers", "").strip()

            # Extract directors
            directors = [d.get_text(strip=True) for d in soup.select("li.list-item:has(b:contains('Director')) a.text-primary")] if soup.select("li.list-item:has(b:contains('Director')) a.text-primary") else []

            # Extract screenwriters
            screenwriters = [w.get_text(strip=True) for w in soup.select("li.list-item:has(b:contains('Screenwriter')) a.text-primary")] if soup.select("li.list-item:has(b:contains('Screenwriter')) a.text-primary") else []

            # Extract main actors (top 4 listed in cast section)
            main_actors = []
            actor_elements = soup.select("ul.credits li.list-item")[:4] if soup.select("ul.credits li.list-item") else []
            for actor in actor_elements:
                actor_name = safe_get_text(actor, "b[itemprop='name']")
                character_element = actor.select_one("small a.text-primary") or actor.select_one("small")
                character_name = character_element.get_text(strip=True) if character_element else ""
                main_actors.append({
                    "name": actor_name,
                    "character": character_name
                })

            return {
                "title": title,
                "year": year,
                "rating": rating,
                "genres": genres,
                "tags": tags,
                "synopsis": synopsis,
                "statistics": {
                    "score": score,
                    "ranked": ranked,
                    "popularity": popularity,
                    "watchers": watchers
                },
                "directors": directors,
                "screenwriters": screenwriters,
                "main_actors": main_actors,
                "url": url
            }
    except Exception as e:
        print(f"Failed to fetch {url}: {str(e)}")
        return None

async def main():
    all_data = []

    for page_num in range(1, 204):  # Scrape first 1 pages
        print(f"Scraping page {page_num}...")
        url = f"https://mydramalist.com/search?adv=titles&ty=68,77,83,86&co=3&st=3&so=top&page={page_num}"
        drama_links = await get_drama_links(url)

        for link in drama_links:
            data = await get_drama_details(link)
            if data:  # Only append if data was successfully scraped
                all_data.append(data)

    # Only save to CSV if we have data
    if all_data:
        keys = all_data[0].keys()
        with open('drama_dataset.csv', 'w', newline='', encoding='utf-8') as f:
            dict_writer = csv.DictWriter(f, keys)
            dict_writer.writeheader()
            dict_writer.writerows(all_data)
        print("Data saved to drama_dataset.csv")
    else:
        print("No data was scraped successfully")

# For Jupyter or Colab
import nest_asyncio
import asyncio

nest_asyncio.apply()  # Patch the running event loop

await main()

