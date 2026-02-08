def to_binary():
    with open("spline_data_raw.txt", "r") as f:
        data_str = f.read()
    data = [int(x.strip()) for x in data_str.split(",") if x.strip()]
    with open("spline_binary.bin", "wb") as f:
        f.write(bytes(data))

if __name__ == "__main__":
    to_binary()
