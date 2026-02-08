from playwright.sync_api import sync_playwright
import json
import time

def run():
    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True)
        page = browser.new_page()

        spline_url = "https://my.spline.design/skillskeyboard-jVDuxaTuaIbrR4WL6hRBQmSb/"
        print(f"Navigating to {spline_url}...")

        page.goto(spline_url)
        print("Waiting 30s for scene to load...")
        time.sleep(30)

        # Try to find the app instance
        objects = page.evaluate("""
            async () => {
                // Try to find Application instance in global variables
                let app = null;
                for (let key in window) {
                    try {
                        if (window[key] && typeof window[key].getAllObjects === 'function') {
                            app = window[key];
                            console.log('Found app in window.' + key);
                            break;
                        }
                    } catch (e) {}
                }

                if (!app) {
                    // Try to find it via some common Spline patterns or just wait and hope
                    // Alternatively, we can try to re-import and decode
                    const scripts = Array.from(document.querySelectorAll('script'));
                    const script = scripts.find(s => s.textContent.includes('app.decode'));
                    if (script) {
                        const match = script.textContent.match(/app\.decode\(\[([^\]]+)\]\)/);
                        if (match) {
                            const data = match[1].split(',').map(Number);
                            const { Application } = await import('https://unpkg.com/@splinetool/runtime@1.12.51/build/runtime.js');
                            const canvas = document.createElement('canvas');
                            app = new Application(canvas);
                            await app.decode(data);
                        }
                    }
                }

                if (app) {
                    return app.getAllObjects().map(o => ({
                        name: o.name,
                        id: o.id,
                        type: o.type
                    }));
                }
                return { error: 'App not found' };
            }
        """)

        if isinstance(objects, dict) and "error" in objects:
            print(f"Error: {objects['error']}")
        else:
            print(f"Found {len(objects)} objects.")
            with open("spline_objects_final_try.json", "w") as f:
                json.dump(objects, f, indent=2)
            for obj in objects:
                if obj['type'] != 'Shape': # Filter a bit
                    print(f"- {obj['name']} ({obj['type']})")

        browser.close()

if __name__ == "__main__":
    run()
