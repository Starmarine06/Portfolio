def extract():
    with open("spline_page.html", "rb") as f:
        content = f.read()

    start_str = b"app.decode(["
    start_idx = content.find(start_str)
    if start_idx == -1:
        print("Start not found")
        return

    end_idx = content.find(b"])", start_idx)
    if end_idx == -1:
        print("End not found")
        return

    data = content[start_idx + len(start_str) : end_idx]
    with open("spline_data.txt", "wb") as f:
        f.write(data)
    print(f"Extracted {len(data)} bytes of data.")

if __name__ == "__main__":
    extract()
