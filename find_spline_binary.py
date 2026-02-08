from playwright.sync_api import sync_playwright

def run():
    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True)
        page = browser.new_page()

        spline_url = "https://my.spline.design/skillskeyboard-jVDuxaTuaIbrR4WL6hRBQmSb/"
        print(f"Navigating to {spline_url}...")

        target_url = None

        def handle_response(response):
            nonlocal target_url
            if ".splinecode" in response.url:
                print(f"FOUND SPLINECODE: {response.url}")
                target_url = response.url
            elif response.request.resource_type == "fetch" or response.request.resource_type == "xhr":
                # Check content type for spline binary
                ct = response.headers.get("content-type", "")
                if "application/octet-stream" in ct or "spline" in response.url:
                     print(f"Fetch/XHR: {response.url} ({ct})")

        page.on("response", handle_response)

        try:
            page.goto(spline_url, timeout=60000)
            page.wait_for_timeout(10000)
        except Exception as e:
            print(f"Error: {e}")
        finally:
            browser.close()

if __name__ == "__main__":
    run()
