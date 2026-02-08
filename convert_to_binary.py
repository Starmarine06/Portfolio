def convert():
    # Read the file and find the array
    with open("spline_page.html", "r") as f:
        content = f.read()

    start_str = "app.decode(["
    start_idx = content.find(start_str)
    if start_idx == -1:
        print("Start not found")
        return

    end_idx = content.find("])", start_idx)
    if end_idx == -1:
        print("End not found")
        return

    data_str = content[start_idx + len(start_str) : end_idx]
    numbers = [int(x.strip()) for x in data_str.split(",")]

    with open("public/assets/user_model.splinecode", "wb") as f:
        f.write(bytes(numbers))

    print(f"Converted {len(numbers)} bytes to public/assets/user_model.splinecode")

if __name__ == "__main__":
    convert()
