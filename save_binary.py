def to_binary():
    with open("spline_data_raw.txt", "r") as f:
        data_str = f.read()

    # Filter out anything that is not a digit or comma
    # Just in case there's some extra text
    data_str = "".join(c for c in data_str if c.isdigit() or c == ",")

    data = [int(x.strip()) for x in data_str.split(",") if x.strip()]
    with open("public/assets/iphone_new.splinecode", "wb") as f:
        f.write(bytes(data))
    print(f"Saved {len(data)} bytes to public/assets/iphone_new.splinecode")

if __name__ == "__main__":
    to_binary()
