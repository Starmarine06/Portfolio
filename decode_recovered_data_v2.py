from playwright.sync_api import sync_playwright
import json

def run():
    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True)
        page = browser.new_page()

        # Read the data
        with open("spline_data.txt", "r") as f:
            data_str = f.read()

        # Convert comma separated string to list of ints
        data = [int(x.strip()) for x in data_str.split(",") if x.strip()]

        # Load a dummy page with the Spline runtime
        page.set_content("""
            <html>
                <body>
                    <canvas id="canvas"></canvas>
                    <script type="module">
                        import { Application } from 'https://unpkg.com/@splinetool/runtime@1.12.51/build/runtime.js';
                        window.Application = Application;
                    </script>
                </body>
            </html>
        """)

        # Wait for Application to be available
        page.wait_for_function("window.Application !== undefined")

        # Decode and get objects
        objects = page.evaluate("""
            async (data) => {
                const canvas = document.getElementById('canvas');
                const app = new window.Application(canvas);
                await app.decode(data);
                return app.getAllObjects().map(o => ({
                    name: o.name,
                    id: o.id,
                    type: o.type
                }));
            }
        """, data)

        print(f"Found {len(objects)} objects.")
        with open("spline_objects_recovered.json", "w") as f:
            json.dump(objects, f, indent=2)

        # Print interesting objects
        for obj in objects:
            if obj['type'] not in ['Shape', 'Path', 'Point', 'Group']:
                 print(f"- {obj['name']} ({obj['type']})")
            elif obj['type'] == 'Group' and obj['name'] != 'Group':
                 print(f"- {obj['name']} ({obj['type']})")

        browser.close()

if __name__ == "__main__":
    run()
