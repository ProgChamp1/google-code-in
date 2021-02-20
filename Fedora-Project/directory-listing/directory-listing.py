from bs4 import BeautifulSoup as bs
import requests as r
from urllib.parse import urljoin


def get_soup(url):
    page = r.get(url)
    soup = bs(page.text, "html.parser")
    return soup


def get_links(soup: bs) -> list:
    ret = []
    tr = soup.find_all("tr")[1:]  # dont include name/last modified/description etc
    for i in tr:
        ret.extend(i.find_all("a"))
    return ret


def absolute_url(relative, base):
    return urljoin(base, relative)


def get_links_raw(soup: bs) -> list:
    print("Couldn't find index <table>...looking for all <a> tags")
    title = soup.title
    text = ""
    if title:
        text = title.text
    if "indexof" in text.lower().replace(" ", ""):
        return soup.find_all("a")
    return []


def scrape(url=None):
    if url is None:
        url = input("enter URL:")
    print("Scraping URL:", url)
    soup = get_soup(url)
    links = get_links(soup) or get_links_raw(soup)
    if links:
        print("Links Found:")
        for i, link in enumerate(links):
            href = absolute_url(link.attrs.get("href"), url)
            print(f"{i+1}. {href}")
    else:
        print("No Links found, check the page again")


if __name__ == "__main__":
    import sys

    arg = None
    if len(sys.argv) > 1:
        arg = sys.argv[1]
    scrape(arg)
