import re

def extract():
    with open("page_content.html", "r") as f:
        content = f.read()

    match = re.search(r'app\.decode\(\[([^\]]+)\]\)', content)
    if match:
        data = match.group(1)
        with open("spline_data.txt", "w") as f:
            f.write(data)
        print("Data extracted.")
    else:
        # Try searching in the original curl output if playwright output failed
        with open("spline_page.html", "r") as f:
            content = f.read()
        match = re.search(r'app\.decode\(\[([^\]]+)\]\)', content)
        if match:
            data = match.group(1)
            with open("spline_data.txt", "w") as f:
                f.write(data)
            print("Data extracted from curl output.")
        else:
            print("Data NOT found.")

if __name__ == "__main__":
    extract()
