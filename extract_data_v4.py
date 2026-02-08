import re

def extract():
    with open("spline_page.html", "r") as f:
        content = f.read()

    # Use regex to find the array content specifically
    # It starts with app.decode([ and ends with ])
    match = re.search(r'app\.decode\(\[([\d,]+)\]\)', content)
    if match:
        data = match.group(1)
        with open("spline_data.txt", "w") as f:
            f.write(data)
        print(f"Extracted {len(data)} characters.")
    else:
        print("Regex match failed. Trying manual find.")
        start_str = "app.decode(["
        start = content.find(start_str)
        if start != -1:
             end = content.find("])", start)
             if end != -1:
                 data = content[start+len(start_str):end]
                 # Clean up data - keep only digits and commas
                 data = "".join(c for c in data if c.isdigit() or c == ",")
                 with open("spline_data.txt", "w") as f:
                     f.write(data)
                 print(f"Extracted manually {len(data)} characters.")
             else:
                 print("End not found")
        else:
            print("Start not found")

if __name__ == "__main__":
    extract()
