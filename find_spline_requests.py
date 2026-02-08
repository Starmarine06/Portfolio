from playwright.sync_api import sync_playwright

def run():
    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True)
        page = browser.new_page()

        spline_url = "https://my.spline.design/skillskeyboard-jVDuxaTuaIbrR4WL6hRBQmSb/"
        print(f"Navigating to {spline_url}...")

        def handle_request(request):
            if "spline" in request.url.lower():
                 print(f"Request: {request.url}")

        page.on("request", handle_request)

        try:
            page.goto(spline_url, timeout=60000)
            page.wait_for_timeout(10000)
        except Exception as e:
            print(f"Error: {e}")
        finally:
            browser.close()

if __name__ == "__main__":
    run()
