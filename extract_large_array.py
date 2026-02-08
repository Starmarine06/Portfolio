import re

def extract():
    with open("spline_page.html", "r") as f:
        content = f.read()

    # Try to find any large array of numbers
    # A large array of numbers look like [102,98,82,...]
    # We look for a pattern of many numbers separated by commas inside brackets
    match = re.search(r'\[(\d+(,\d+){1000,})\]', content)
    if match:
        data = match.group(1)
        with open("spline_data_raw.txt", "w") as f:
            f.write(data)
        print(f"Extracted {len(data)} characters from a large array.")
        return

    print("Large array not found with regex.")

    # Let's try to find it manually by looking for 'app.decode(['
    start_marker = "app.decode(["
    start_pos = content.find(start_marker)
    if start_pos != -1:
        print(f"Found marker at {start_pos}")
        end_pos = content.find("])", start_pos)
        if end_pos != -1:
            data = content[start_pos + len(start_marker) : end_pos]
            with open("spline_data_raw.txt", "w") as f:
                f.write(data)
            print(f"Extracted {len(data)} characters manually.")
        else:
            print("End marker not found.")
    else:
        print("Start marker not found.")

if __name__ == "__main__":
    extract()
