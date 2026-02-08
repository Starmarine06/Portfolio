from playwright.sync_api import sync_playwright
import json

def run():
    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True)
        page = browser.new_page()

        spline_url = "https://my.spline.design/skillskeyboard-jVDuxaTuaIbrR4WL6hRBQmSb/"
        print(f"Navigating to {spline_url}...")

        page.goto(spline_url)

        # Inject script to capture objects
        objects = page.evaluate("""
            async () => {
                // Find the Application class
                const runtimeUrl = 'https://unpkg.com/@splinetool/runtime@1.12.51/build/runtime.js';
                const { Application } = await import(runtimeUrl);

                // Get the data from the page's script (we'll extract it from the HTML)
                // Actually, let's just use the array we found.
                // Since we are on the same page, we can just find the script tag.
                const scripts = Array.from(document.querySelectorAll('script'));
                const scriptWithData = scripts.find(s => s.innerText.includes('app.decode'));
                if (!scriptWithData) return { error: 'Script not found' };

                const dataMatch = scriptWithData.innerText.match(/app\.decode\(\[([^\]]+)\]\)/);
                if (!dataMatch) return { error: 'Data not found' };

                const data = dataMatch[1].split(',').map(Number);

                const canvas = document.createElement('canvas');
                const app = new Application(canvas);
                await app.decode(data);

                return app.getAllObjects().map(o => ({
                    name: o.name,
                    id: o.id,
                    type: o.type
                }));
            }
        """)

        if isinstance(objects, dict) and "error" in objects:
            print(f"Error: {objects['error']}")
        else:
            print(f"Found {len(objects)} objects.")
            with open("spline_objects_from_page.json", "w") as f:
                json.dump(objects, f, indent=2)
            for obj in objects:
                print(f"- {obj['name']} ({obj['type']})")

        browser.close()

if __name__ == "__main__":
    run()
