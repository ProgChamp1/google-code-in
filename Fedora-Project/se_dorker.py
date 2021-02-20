from urllib.parse import quote_plus
import requests
from bs4 import BeautifulSoup as bs

basic_headers = {
    "accept": "text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.9",
    "accept-encoding": "gzip, deflate, br",
    "accept-language": "en-GB,en-US;q=0.9,en;q=0.8",
    "upgrade-insecure-requests": "1",
    "user-agent": "Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/80.0.3970.5 Safari/537.36",
}


def scrape_google(query: str, pages=1) -> list:
    if pages >= 100:
        raise ValueError(
            "Google does not show more than (usually)900 responses for a query"
        )
    start = 0
    _urls = []
    for j in range(pages):
        i = j + 1
        if i == 1:
            google_base = "https://www.google.com/search?q={q}&oq={q}&ie=UTF-8".format(
                q=quote_plus(query)
            )
        else:
            start += 10
            google_base = "https://www.google.com/search?q={q}&oq={q}&ie=UTF-8&start={start}".format(
                q=quote_plus(query), start=start
            )
        _urls.append(google_base)

    results = []
    sess = requests.Session()
    for url in _urls:
        page = sess.get(url, headers=basic_headers)
        _results_class = "rc"
        soup = bs(page.text, "html.parser")
        _results = soup.find_all(attrs={"class": _results_class})
        for res in _results:
            _link = res.findChild("a", attrs={"href": True, "ping": True})
            if _link is None:
                _link = res.findChild("cite")
                if _link is None:
                    raise Exception("No Links Found on page 1 of search results")
                link = _link.text
                page_title = link
            else:
                link = _link.attrs.get("href")
                page_title = _link.string
            results.append({"link": link, "page_title": page_title})
    return results


def scrape_bing(query, pages=1):
    results = []
    start = 0
    _urls = []
    for j in range(pages):
        i = j + 1
        if i == 1:
            bing_base = "https://www.bing.com/search?q={q}".format(q=quote_plus(query))
        else:
            start += 10
            bing_base = "https://www.bing.com/search?q={q}&first={start}".format(
                q=quote_plus(query), start=start
            )
        _urls.append(bing_base)

    _results_class = "b_algo"
    sess = requests.Session()
    for url in _urls:
        page = sess.get(url, headers=basic_headers)
        soup = bs(page.text, "html.parser")
        _results = soup.find_all(attrs={"class": _results_class})
        for res in _results:
            _link = (
                res.findChild("a") if res.findChild("a").parent.name[0] == "h" else None
            )
            if _link is None:
                _link = res.findChild("cite")
                if _link is None:
                    raise Exception("No Links Found on page 1 of search results")
                link = _link.text
                heading = link
            else:
                link = _link.attrs.get("href")
                heading = _link.text
            results.append({"link": link, "heading": heading})
    return results


def print_res(resp: list):
    for i, d in enumerate(resp):
        link = d.get("link")
        page_title = d.get("page_title")
        print(f"{i+1}. URL: {link}\n{show_title_if_exists(page_title)}")


def show_results(*args, **kwargs):
    print("---GOOGLE---")
    resp = scrape_google(*args, **kwargs)
    print_res(resp)
    print("\n\n---BING---")
    resp_bing = scrape_bing(*args, **kwargs)
    print_res(resp_bing)


def show_title_if_exists(page_title):
    if page_title:
        return f"\ttitle: {page_title}"
    return ""


if __name__ == "__main__":
    from argparse import ArgumentParser

    parser = ArgumentParser(description="Search engine dork scanner")
    parser.add_argument("term", metavar="Search term", type=str, nargs="+")
    parser.add_argument(
        "-p", type=int, metavar="page count - number of pages to scrape"
    )
    args = parser.parse_args()
    term = args.term[0]
    pages = args.p or 1
    print(f"Searching for {term}.\nScanning through {pages} page(s).")
    show_results(term, pages=pages)
