from PIL import Image
import os
import sys

if len(sys.argv) not in [3]:
    sys.exit("Usage: python jpeg to jpg.py input_folder output_folder ")

# Parse command-line arguments
input_folder = sys.argv[1]
output_folder = sys.argv[2]
# List all files in the input folder
files = os.listdir(input_folder)

# Create the output folder if it doesn't exist
if not os.path.exists(output_folder):
    os.makedirs(output_folder)

# Iterate through each file in the input folder
for filename in files:
    if filename.endswith(".jpeg") or filename.endswith(".JPEG"):
        # Open the JPEG image
        with Image.open(os.path.join(input_folder, filename)) as img:
            # Change the file extension to ".jpg" and save in the output folder
            img.save(os.path.join(output_folder, os.path.splitext(filename)[0] + ".jpg"))
            img.close()
            print(f"Converted {filename} to {os.path.splitext(filename)[0]}.jpg")
        os.remove(os.path.join(input_folder, filename))

print("Conversion completed.")