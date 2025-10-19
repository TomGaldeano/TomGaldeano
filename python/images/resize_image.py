from PIL import Image
import os
import sys

GOLDEN_RATiO = (1 + 5 ** 0.5) / 2
IMAGE_WIDTH = 2000

def SingleImage():
    with Image.open(os.path.join(input, filename)) as img:
        thumbnail_height = int(IMAGE_WIDTH / GOLDEN_RATiO)
        img.thumbnail((IMAGE_WIDTH, thumbnail_height))
        img.save(os.path.join(output, filename))

def folder_conversion(input_folder,output_folder):
    files = os.listdir(input_folder)
    if not os.path.exists(output_folder):
        os.makedirs(output_folder)
    for filename in files:
        if filename.endswith(".jpg"):
            with Image.open(os.path.join(input_folder, filename)) as img:
                thumbnail_height = int(IMAGE_WIDTH / GOLDEN_RATiO)
                img.thumbnail((IMAGE_WIDTH, thumbnail_height))
                img.save(os.path.join(output_folder, filename))
    print("Conversion completed.")