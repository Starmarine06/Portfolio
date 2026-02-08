from playwright.sync_api import sync_playwright

def run():
    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True)
        page = browser.new_page()

        spline_url = "https://my.spline.design/skillskeyboard-jVDuxaTuaIbrR4WL6hRBQmSb/"
        page.goto(spline_url)
        content = page.content()
        with open("page_content.html", "w") as f:
            f.write(content)
        browser.close()

if __name__ == "__main__":
    run()
