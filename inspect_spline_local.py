from playwright.sync_api import sync_playwright
import time
import json

def run():
    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True)
        page = browser.new_page()
        print("Navigating to localhost:3000...")
        try:
            page.goto("http://localhost:3000/", timeout=60000)
            print("Page loaded, waiting for Spline...")

            # Poll for window.spline and window.spline.getAllObjects
            for _ in range(30):
                is_ready = page.evaluate("window.spline !== undefined")
                if is_ready:
                    print("Spline found!")
                    break
                time.sleep(2)
            else:
                print("Spline not found after waiting.")
                browser.close()
                return

            # Get objects
            objects = page.evaluate("""
                () => {
                    if (window.spline) {
                        return window.spline.getAllObjects().map(o => ({
                            name: o.name,
                            id: o.id,
                            type: o.type
                        }));
                    }
                    return null;
                }
            """)

            if objects:
                print(f"Found {len(objects)} objects:")
                for obj in objects:
                    print(f"- {obj['name']} ({obj['type']})")

                with open("spline_objects.json", "w") as f:
                    json.dump(objects, f, indent=2)
            else:
                print("No objects found.")

            page.screenshot(path="debug_spline.png")
        except Exception as e:
            print(f"Error: {e}")
        finally:
            browser.close()

if __name__ == "__main__":
    run()
