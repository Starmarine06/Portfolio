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
                const scripts = Array.from(document.querySelectorAll('script'));
                let foundScript = null;
                for (const s of scripts) {
                    if (s.textContent.indexOf('app.decode') !== -1) {
                        foundScript = s;
                        break;
                    }
                }

                if (!foundScript) {
                     return { error: 'Still not found' };
                }

                const content = foundScript.textContent;
                const start = content.indexOf('app.decode([');
                const end = content.indexOf('])', start);
                if (start === -1 || end === -1) return { error: 'Indices not found' };

                const dataStr = content.substring(start + 12, end);
                const data = dataStr.split(',').map(Number);

                const { Application } = await import('https://unpkg.com/@splinetool/runtime@1.12.51/build/runtime.js');
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
