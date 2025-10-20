from PIL import Image
import os
import argparse
import struct
from math import sqrt
import numpy as np

GOLDEN_RATiO = (1 + 5 ** 0.5) / 2
IMAGE_WIDTH = 2000
"""
Convert a B/W image to a watertight STL heightmap (with sides and base).
For 3D printing.

scale-x, scale-y: model footprint size (units per pixel).

scale-z: height scaling.

--invert: flip heights (black high, white low).

--max-size: downscale to avoid huge meshes.
"""
class ImageConverter(object):
    def __init__(self,output_folder,input_folder):
        self.output_folder = output_folder
        self.input_folder = input_folder
    
    def black_white(self,filename):
        path = os.path.join(self.output_folder+filename+".jpg")
        img = Image.open(path).convert("L")  # grayscale
        matr = np.asarray(img)
        matr_temp = matr.copy()
        for i in matr:
            for j in i:
                if j < 127:
                    pass
        img.show()
        img.close()

    def web_size(self,filename):
        with Image.open(filename) as img:
            thumbnail_height = int(IMAGE_WIDTH / GOLDEN_RATiO)
            img.thumbnail((IMAGE_WIDTH, thumbnail_height))
            img.save(os.path.join(self.output_folder, os.path.basename(filename)))
            img.close()

    def jpeg_to_jpg(self,filename,remove=True):
        if not os.path.exists(self.output_folder):
            os.makedirs(self.output_folder)
        if filename.endswith(".jpeg") or filename.endswith(".JPEG"):
            with Image.open(filename) as img:
                img.save(os.path.join(self.output_folder, os.path.splitext(filename)[0] + ".jpg"))
                img.close()
            if remove:
                os.remove(filename)

    def SingleImage(self,filename):
        with Image.open(os.path.join(input, filename)) as img:
            thumbnail_height = int(IMAGE_WIDTH / GOLDEN_RATiO)
            img.thumbnail((IMAGE_WIDTH, thumbnail_height))
            img.save(os.path.join(self.output, filename))

    def folder_conversion(self,input_folder,output_folder):
        files = os.listdir(input_folder)
        if not os.path.exists(output_folder):
            os.makedirs(output_folder)
        for filename in files:
            if filename.endswith(".jpg"):
                with Image.open(os.path.join(input_folder, filename)) as img:
                    thumbnail_height = int(IMAGE_WIDTH / GOLDEN_RATiO)
                    img.thumbnail((IMAGE_WIDTH, thumbnail_height))
                    img.save(os.path.join(output_folder, filename))

    def load_image_as_heightmap(path, max_size=None, invert=False):
        im = Image.open(path).convert("L")  # grayscale
        if max_size:
            w, h = im.size
            factor = min(1.0, float(max_size) / max(w, h))
            if factor < 1.0:
                im = im.resize((int(w * factor), int(h * factor)), Image.LANCZOS)
        arr = np.asarray(im, dtype=np.float32) / 255.0  # normalize 0..1
        if invert:
            arr = 1.0 - arr
        return arr  # shape (H, W)

    def build_vertices(heightmap, scale_x=1.0, scale_y=1.0, scale_z=1.0):
        H, W = heightmap.shape
        xs = np.arange(W) * scale_x
        ys = np.arange(H) * scale_y
        # Center the grid around origin
        x0 = -(xs[-1] - xs[0]) / 2.0
        y0 = -(ys[-1] - ys[0]) / 2.0
        verts = np.zeros((H, W, 3), dtype=np.float32)
        for i in range(H):
            for j in range(W):
                verts[i, j, 0] = x0 + xs[j]
                verts[i, j, 1] = y0 + ys[i]
                verts[i, j, 2] = heightmap[i, j] * scale_z
        return verts

    def triangle_normal(self, v1, v2, v3):
        ux, uy, uz = v2 - v1
        vx, vy, vz = v3 - v1
        nx = uy * vz - uz * vy
        ny = uz * vx - ux * vz
        nz = ux * vy - uy * vx
        norm = sqrt(nx * nx + ny * ny + nz * nz)
        if norm == 0.0:
            return np.array([0.0, 0.0, 0.0], dtype=np.float32)
        return np.array([nx / norm, ny / norm, nz / norm], dtype=np.float32)

    def add_surface_triangles(self,verts):
        H, W, _ = verts.shape
        triangles = []
        for i in range(H - 1):
            for j in range(W - 1):
                v00 = verts[i, j]
                v10 = verts[i, j + 1]
                v01 = verts[i + 1, j]
                v11 = verts[i + 1, j + 1]
                # Upper surface (topography)
                nA = self.triangle_normal(v00, v10, v11)
                nB = self.triangle_normal(v00, v11, v01)
                triangles.append((nA, v00, v10, v11))
                triangles.append((nB, v00, v11, v01))
        return triangles

    def add_base_and_walls(self, verts):
        H, W, _ = verts.shape
        triangles = []
        z0 = 0.0
        # Bottom plane
        for i in range(H - 1):
            for j in range(W - 1):
                v00 = verts[i, j].copy(); v00[2] = z0
                v10 = verts[i, j + 1].copy(); v10[2] = z0
                v01 = verts[i + 1, j].copy(); v01[2] = z0
                v11 = verts[i + 1, j + 1].copy(); v11[2] = z0
                # Flip order so normal faces downward
                nA = self.triangle_normal(v00, v11, v10)
                nB = self.triangle_normal(v00, v01, v11)
                triangles.append((nA, v00, v11, v10))
                triangles.append((nB, v00, v01, v11))

        # Side walls (around border)
        def wall_quad(self, vtop1, vtop2):
            vbot1, vbot2 = vtop1.copy(), vtop2.copy()
            vbot1[2] = z0
            vbot2[2] = z0
            n1 = self.triangle_normal(vtop1, vtop2, vbot2)
            n2 = self.triangle_normal(vtop1, vbot2, vbot1)
            return [(n1, vtop1, vtop2, vbot2),
                    (n2, vtop1, vbot2, vbot1)]

        for j in range(W - 1): # Top edge
            triangles += wall_quad(verts[0, j], verts[0, j + 1])  
        for j in range(W - 1):  # Bottom edge
            triangles += wall_quad(verts[H - 1, j + 1], verts[H - 1, j])
        for i in range(H - 1):  # Left edge
            triangles += wall_quad(verts[i + 1, 0], verts[i, 0])
        for i in range(H - 1): # Right edge
            triangles += wall_quad(verts[i, W - 1], verts[i + 1, W - 1])
        return triangles

    def write_binary_stl(self, path, triangles, header=b"Generated by img2stl_solid"):
        hdr = header[:80].ljust(80, b' ')
        with open(path, "wb") as f:
            f.write(hdr)
            f.write(struct.pack("<I", len(triangles)))
            for n, v1, v2, v3 in triangles:
                f.write(struct.pack("<3f", *n))
                f.write(struct.pack("<3f", *v1))
                f.write(struct.pack("<3f", *v2))
                f.write(struct.pack("<3f", *v3))
                f.write(struct.pack("<H", 0))

    def img_to_stl(self, filename, scale_x=1.0,scale_y=1.0,scale_z=5.0, max_size=400, invert="store_true"):
        hm = self.load_image_as_heightmap(filename, max_size=max_size, invert=invert)
        verts = self.build_vertices(hm, scale_x, scale_y, scale_z)
        tris = []
        tris += self.add_surface_triangles(verts)
        tris += self.add_base_and_walls(verts)
        print(f"Writing {len(tris)} triangles to {self.output_folder}")
        self.write_binary_stl(self.output_folder, tris)


if __name__ == "__main__":
    converter = ImageConverter(input_folder="../patata/",output_folder="../patata/")
    converter.black_white("img1")
