from PIL import Image, ImageDraw, ImageFont
import textwrap
import requests
from io import BytesIO

def generate_story_image(background_url, text, output_path='story_output.png'):
    # تحميل الصورة الخلفية
    response = requests.get(background_url)
    bg = Image.open(BytesIO(response.content)).convert('RGBA')

    # حجم الصورة (نفترض 1080x1920)
    width, height = bg.size

    # إعداد الخطوط
    font_path = 'arial.ttf'  # ممكن تغيره حسب الخط المتوفر عندك
    font_title = ImageFont.truetype(font_path, 60)
    font_text = ImageFont.truetype(font_path, 48)

    # إنشاء طبقة للكتابة
    txt = Image.new('RGBA', bg.size, (255,255,255,0))
    d = ImageDraw.Draw(txt)

    # نص العنوان
    title = "🔥 المسرب يقول:"
    d.text((50, 50), title, font=font_title, fill=(255,0,0,255))

    # لف النص
    lines = textwrap.wrap(text, width=30)
    y_text = 150
    for line in lines:
        d.text((50, y_text), line, font=font_text, fill=(255,255,255,255))
        y_text += font_text.getsize(line)[1] + 10

    # دمج الصورة مع النص
    combined = Image.alpha_composite(bg, txt)
    combined.save(output_path)
    print(f"Story image saved to {output_path}")

if __name__ == '__main__':
    example_text = "هذه ترجمة التغريدة: الذكاء الاصطناعي هو المستقبل."
    background = "https://images.unsplash.com/photo-1506744038136-46273834b3fb?ixlib=rb-4.0.3&auto=format&fit=crop&w=1080&q=80"
    generate_story_image(background, example_text)
