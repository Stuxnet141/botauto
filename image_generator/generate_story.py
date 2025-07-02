
from PIL import Image, ImageDraw, ImageFont
import textwrap
import requests
from io import BytesIO

def generate_story_image(background_url, text, output_path='story_output.png'):
    response = requests.get(background_url)
    bg = Image.open(BytesIO(response.content)).convert('RGBA')
    width, height = bg.size

    font_path = 'arial.ttf'
    font_title = ImageFont.truetype(font_path, 60)
    font_text = ImageFont.truetype(font_path, 48)

    txt = Image.new('RGBA', bg.size, (255,255,255,0))
    d = ImageDraw.Draw(txt)
    title = "🔥 المسرب يقول:"
    d.text((50, 50), title, font=font_title, fill=(255,0,0,255))

    lines = textwrap.wrap(text, width=30)
    y_text = 150
    for line in lines:
        d.text((50, y_text), line, font=font_text, fill=(255,255,255,255))
        y_text += font_text.getsize(line)[1] + 10

    combined = Image.alpha_composite(bg, txt)
    combined.save(output_path)
    print(f"Story image saved to {output_path}")

if __name__ == '__main__':
    example_text = "هذه ترجمة التغريدة: الذكاء الاصطناعي هو المستقبل."
    background = "https://images.unsplash.com/photo-1506744038136-46273834b3fb"
    generate_story_image(background, example_text)
