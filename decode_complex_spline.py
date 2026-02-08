import base64

def decode_spline():
    with open("spline_data_raw.txt", "r") as f:
        data_str = f.read()

    # data_str is like "102, 98, 82, 116, ..."
    byte_values = [int(x.strip()) for x in data_str.split(",") if x.strip()]

    # Convert byte values to characters
    b64_chars = "".join(chr(b) for b in byte_values)
    print(f"Base64 string sample: {b64_chars[:100]}...")

    # Decode Base64
    try:
        binary_data = base64.b64decode(b64_chars)
        with open("spline_real_binary.bin", "wb") as f:
            f.write(binary_data)
        print(f"Successfully decoded Base64. Resulting binary is {len(binary_data)} bytes.")

        # Check for strings in the real binary
        import subprocess
        result = subprocess.run(["strings", "spline_real_binary.bin"], capture_output=True, text=True)
        with open("spline_real_strings.txt", "w") as f:
            f.write(result.stdout)
        print("Strings extracted to spline_real_strings.txt")

    except Exception as e:
        print(f"Error decoding Base64: {e}")

if __name__ == "__main__":
    decode_spline()
