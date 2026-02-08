from playwright.sync_api import sync_playwright

def run():
    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True)
        page = browser.new_page()

        spline_url = "https://my.spline.design/skillskeyboard-jVDuxaTuaIbrR4WL6hRBQmSb/"
        print(f"Navigating to {spline_url}...")

        splinecode_url = None

        def handle_request(request):
            nonlocal splinecode_url
            if ".splinecode" in request.url:
                print(f"Found splinecode: {request.url}")
                splinecode_url = request.url

        page.on("request", handle_request)

        try:
            page.goto(spline_url, timeout=60000)
            page.wait_for_timeout(5000) # Wait for loads
        except Exception as e:
            print(f"Error: {e}")
        finally:
            browser.close()

        if splinecode_url:
            with open("splinecode_url.txt", "w") as f:
                f.write(splinecode_url)

if __name__ == "__main__":
    run()
