from playwright.sync_api import sync_playwright
import time
import json

def run():
    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True)
        page = browser.new_page()

        page.on("console", lambda msg: print(f"CONSOLE: {msg.text}"))
        page.on("pageerror", lambda exc: print(f"PAGE ERROR: {exc}"))

        print("Navigating to localhost:3000...")
        try:
            page.goto("http://localhost:3000/", timeout=60000)
            print("Page loaded, waiting 60s for Spline and its scene...")

            # Polling with longer wait
            start_time = time.time()
            found = False
            while time.time() - start_time < 60:
                is_ready = page.evaluate("window.spline !== undefined")
                if is_ready:
                    print(f"Spline found after {int(time.time() - start_time)}s!")
                    found = True
                    break
                # Check if the canvas exists at least
                canvas_exists = page.evaluate("document.querySelector('canvas') !== null")
                if canvas_exists:
                    print("Canvas found, but window.spline is still undefined...")
                time.sleep(5)

            if not found:
                print("Spline not found after waiting.")
            else:
                # Get objects
                objects = page.evaluate("""
                    () => {
                        try {
                            if (window.spline) {
                                return window.spline.getAllObjects().map(o => ({
                                    name: o.name,
                                    id: o.id,
                                    type: o.type
                                }));
                            }
                        } catch (e) {
                            return { error: e.toString() };
                        }
                        return null;
                    }
                """)

                if objects and "error" not in objects:
                    print(f"Found {len(objects)} objects.")
                    with open("spline_objects.json", "w") as f:
                        json.dump(objects, f, indent=2)
                elif objects and "error" in objects:
                    print(f"Error getting objects: {objects['error']}")
                else:
                    print("No objects returned.")

            page.screenshot(path="debug_spline_v2.png")
        except Exception as e:
            print(f"Error: {e}")
        finally:
            browser.close()

if __name__ == "__main__":
    run()
