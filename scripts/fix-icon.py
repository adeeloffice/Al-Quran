from PIL import Image
import numpy as np

# Load user's icon
img = Image.open('/home/z/my-project/upload/pasted_image_1786449075633.png').convert('RGBA')
data = np.array(img)
h, w = data.shape[:2]

# Make it square (pad shorter side to match)
size = max(h, w)
square = Image.new('RGBA', (size, size), (0, 0, 0, 0))
offset_x = (size - w) // 2
offset_y = (size - h) // 2
square.paste(img, (offset_x, offset_y))
data = np.array(square)
h = w = size

# Find the dominant green color from border areas (not black, not gold, not white)
# Sample the green border region
green_samples = []
for y in range(h):
    for x in range(w):
        r, g, b, a = data[y, x]
        # Greenish pixels that aren't too bright or too dark
        if 5 < r < 60 and 30 < g < 120 and 20 < b < 80 and a > 200:
            green_samples.append((r, g, b))

if green_samples:
    avg_r = int(np.median([s[0] for s in green_samples]))
    avg_g = int(np.median([s[1] for s in green_samples]))
    avg_b = int(np.median([s[2] for s in green_samples]))
    bg_color = np.array([avg_r, avg_g, avg_b, 255])
    print(f"Detected background green: RGB({avg_r},{avg_g},{avg_b})")
else:
    bg_color = np.array([11, 52, 38, 255])

# Replace all dark/blackish pixels with the green background
# Be more aggressive - replace anything very dark
for y in range(h):
    for x in range(w):
        r, g, b, a = data[y, x]
        # Very dark pixels (black areas)
        if r < 20 and g < 55 and b < 45:
            # But not gold/yellowish content
            if not (g > 80 and r > 40):
                data[y, x] = bg_color

result = Image.fromarray(data)
result.save('/home/z/my-project/Al-Quran/public/icon-generated.png')
print(f"Saved square cleaned icon: {result.size}")

# Resize to 512 and 192
icon_512 = result.resize((512, 512), Image.LANCZOS)
icon_192 = result.resize((192, 192), Image.LANCZOS)
icon_512.save('/home/z/my-project/Al-Quran/public/icon-512.png')
icon_192.save('/home/z/my-project/Al-Quran/public/icon-192.png')
print("Saved icon-512.png and icon-192.png")
