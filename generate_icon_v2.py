#!/usr/bin/env python3
"""
「吃什么」App 图标 v2 - 更好看的版本
"""

from PIL import Image, ImageDraw, ImageFont
import math
import os

def create_gradient(size, color1, color2, direction='vertical'):
    """创建渐变背景"""
    img = Image.new('RGB', (size, size))
    draw = ImageDraw.Draw(img)
    
    for i in range(size):
        ratio = i / size
        r = int(color1[0] * (1 - ratio) + color2[0] * ratio)
        g = int(color1[1] * (1 - ratio) + color2[1] * ratio)
        b = int(color1[2] * (1 - ratio) + color2[2] * ratio)
        
        if direction == 'vertical':
            draw.line([(0, i), (size, i)], fill=(r, g, b))
        else:
            draw.line([(i, 0), (i, size)], fill=(r, g, b))
    
    return img

def icon_style_1(size=1024):
    """风格1: 大emoji + 渐变背景"""
    # 橙红渐变
    img = create_gradient(size, (255, 140, 90), (255, 90, 80))
    draw = ImageDraw.Draw(img)
    
    # 尝试加载支持 emoji 的字体
    try:
        # 在 Linux 上尝试不同的字体
        font_paths = [
            "/usr/share/fonts/truetype/noto/NotoColorEmoji.ttf",
            "/usr/share/fonts/google-noto-emoji/NotoColorEmoji.ttf",
            "/System/Library/Fonts/Apple Color Emoji.ttc",
        ]
        font = None
        for fp in font_paths:
            if os.path.exists(fp):
                font = ImageFont.truetype(fp, int(size * 0.5))
                break
    except:
        font = None
    
    # 画一个大碗的简笔画
    cx, cy = size // 2, size // 2 + size * 0.05
    
    # 碗 - 用粗线条
    bowl_width = size * 0.55
    bowl_height = size * 0.28
    line_width = int(size * 0.045)
    
    # 碗身弧线
    draw.arc(
        [cx - bowl_width/2, cy - bowl_height*0.3, cx + bowl_width/2, cy + bowl_height*1.2],
        0, 180,
        fill='white',
        width=line_width
    )
    
    # 碗口椭圆
    draw.ellipse(
        [cx - bowl_width/2, cy - bowl_height*0.35, cx + bowl_width/2, cy + bowl_height*0.35],
        outline='white',
        width=line_width
    )
    
    # 碗里的食物 - 几个圆点
    food_y = cy - size * 0.02
    for dx in [-0.12, 0, 0.12]:
        fx = cx + size * dx
        r = size * 0.045
        draw.ellipse([fx-r, food_y-r, fx+r, food_y+r], fill='white')
    
    # 热气
    for i, dx in enumerate([-0.08, 0, 0.08]):
        start_x = cx + size * dx
        start_y = cy - size * 0.22
        points = []
        for t in range(12):
            x = start_x + math.sin(t * 0.6 + i * 1.5) * size * 0.025
            y = start_y - t * size * 0.018
            points.append((x, y))
        draw.line(points, fill='white', width=int(size * 0.025))
    
    # 问号
    try:
        q_font = ImageFont.truetype("/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf", int(size * 0.15))
        draw.text((cx - size*0.045, cy + size*0.18), "?", fill='white', font=q_font)
    except:
        pass
    
    return img

def icon_style_2(size=1024):
    """风格2: 简约文字风格 - 吃?"""
    # 珊瑚橙渐变
    img = create_gradient(size, (255, 127, 102), (255, 95, 87))
    draw = ImageDraw.Draw(img)
    
    cx, cy = size // 2, size // 2
    
    # 大圆形白色背景
    circle_r = size * 0.38
    draw.ellipse(
        [cx - circle_r, cy - circle_r, cx + circle_r, cy + circle_r],
        fill='white'
    )
    
    # 文字 "吃?"
    try:
        # 尝试中文字体
        font_paths = [
            "/usr/share/fonts/truetype/wqy/wqy-zenhei.ttc",
            "/usr/share/fonts/wqy-zenhei/wqy-zenhei.ttc",
            "/usr/share/fonts/truetype/droid/DroidSansFallbackFull.ttf",
            "/usr/share/fonts/opentype/noto/NotoSansCJK-Regular.ttc",
        ]
        font = None
        for fp in font_paths:
            if os.path.exists(fp):
                font = ImageFont.truetype(fp, int(size * 0.28))
                break
        
        if font:
            text = "吃?"
            bbox = draw.textbbox((0, 0), text, font=font)
            tw = bbox[2] - bbox[0]
            th = bbox[3] - bbox[1]
            draw.text((cx - tw//2, cy - th//2 - size*0.02), text, fill=(255, 95, 87), font=font)
        else:
            # 没有中文字体，画一个叉子勺子图案
            draw_utensils(draw, cx, cy, size * 0.5, (255, 95, 87))
    except Exception as e:
        print(f"字体错误: {e}")
        draw_utensils(draw, cx, cy, size * 0.5, (255, 95, 87))
    
    return img

def draw_utensils(draw, cx, cy, size, color):
    """画餐具图标"""
    lw = int(size * 0.08)
    
    # 叉子
    fx = cx - size * 0.15
    draw.line([(fx, cy - size*0.25), (fx, cy + size*0.25)], fill=color, width=lw)
    draw.line([(fx - size*0.08, cy - size*0.25), (fx - size*0.08, cy - size*0.1)], fill=color, width=lw)
    draw.line([(fx + size*0.08, cy - size*0.25), (fx + size*0.08, cy - size*0.1)], fill=color, width=lw)
    
    # 勺子
    sx = cx + size * 0.15
    draw.line([(sx, cy), (sx, cy + size*0.25)], fill=color, width=lw)
    draw.ellipse([sx - size*0.1, cy - size*0.25, sx + size*0.1, cy + size*0.05], fill=color)

def icon_style_3(size=1024):
    """风格3: 可爱饭团风格"""
    # 奶油橙背景
    img = create_gradient(size, (255, 180, 120), (255, 130, 100))
    draw = ImageDraw.Draw(img)
    
    cx, cy = size // 2, size // 2
    
    # 饭团身体 (三角形圆角)
    triangle_size = size * 0.6
    
    # 用多边形+圆形模拟圆角三角形
    # 白色大三角
    points = [
        (cx, cy - triangle_size * 0.4),  # 顶点
        (cx - triangle_size * 0.45, cy + triangle_size * 0.35),  # 左下
        (cx + triangle_size * 0.45, cy + triangle_size * 0.35),  # 右下
    ]
    draw.polygon(points, fill='white')
    
    # 圆角处理 - 在三个角画圆
    corner_r = size * 0.08
    # 顶部圆角
    draw.ellipse([cx - corner_r, cy - triangle_size*0.4 - corner_r*0.3, 
                  cx + corner_r, cy - triangle_size*0.4 + corner_r*1.2], fill='white')
    # 左下圆角
    draw.ellipse([cx - triangle_size*0.45 - corner_r*0.5, cy + triangle_size*0.35 - corner_r,
                  cx - triangle_size*0.45 + corner_r*1.5, cy + triangle_size*0.35 + corner_r], fill='white')
    # 右下圆角
    draw.ellipse([cx + triangle_size*0.45 - corner_r*1.5, cy + triangle_size*0.35 - corner_r,
                  cx + triangle_size*0.45 + corner_r*0.5, cy + triangle_size*0.35 + corner_r], fill='white')
    
    # 海苔 (底部黑色区域)
    nori_points = [
        (cx - triangle_size * 0.35, cy + triangle_size * 0.1),
        (cx + triangle_size * 0.35, cy + triangle_size * 0.1),
        (cx + triangle_size * 0.42, cy + triangle_size * 0.35),
        (cx - triangle_size * 0.42, cy + triangle_size * 0.35),
    ]
    draw.polygon(nori_points, fill=(50, 50, 50))
    
    # 可爱的表情 - 眼睛
    eye_y = cy - size * 0.02
    eye_r = size * 0.035
    # 左眼
    draw.ellipse([cx - size*0.1 - eye_r, eye_y - eye_r, 
                  cx - size*0.1 + eye_r, eye_y + eye_r], fill=(50, 50, 50))
    # 右眼
    draw.ellipse([cx + size*0.1 - eye_r, eye_y - eye_r, 
                  cx + size*0.1 + eye_r, eye_y + eye_r], fill=(50, 50, 50))
    
    # 腮红
    blush_r = size * 0.045
    blush_color = (255, 180, 180)
    draw.ellipse([cx - size*0.18 - blush_r, eye_y + size*0.05 - blush_r,
                  cx - size*0.18 + blush_r, eye_y + size*0.05 + blush_r], fill=blush_color)
    draw.ellipse([cx + size*0.18 - blush_r, eye_y + size*0.05 - blush_r,
                  cx + size*0.18 + blush_r, eye_y + size*0.05 + blush_r], fill=blush_color)
    
    # 问号在头顶
    try:
        q_font = ImageFont.truetype("/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf", int(size * 0.12))
        draw.text((cx + size*0.12, cy - size*0.38), "?", fill='white', font=q_font)
    except:
        pass
    
    return img

def icon_style_4(size=1024):
    """风格4: 极简圆形碗"""
    # 纯色背景
    bg_color = (255, 107, 107)  # 温暖红
    img = Image.new('RGB', (size, size), bg_color)
    draw = ImageDraw.Draw(img)
    
    cx, cy = size // 2, size // 2 + size * 0.02
    
    # 碗 - 简单的半圆 + 椭圆
    bowl_w = size * 0.5
    bowl_h = size * 0.25
    
    # 碗身 (填充白色半圆)
    draw.pieslice(
        [cx - bowl_w/2, cy - bowl_h/2, cx + bowl_w/2, cy + bowl_h*1.5],
        0, 180,
        fill='white'
    )
    
    # 碗口
    draw.ellipse(
        [cx - bowl_w/2, cy - bowl_h/2, cx + bowl_w/2, cy + bowl_h/2],
        fill=(255, 240, 230)
    )
    
    # 碗内阴影
    inner_w = bowl_w * 0.85
    inner_h = bowl_h * 0.7
    draw.ellipse(
        [cx - inner_w/2, cy - inner_h/2 + size*0.01, cx + inner_w/2, cy + inner_h/2 + size*0.01],
        fill=(255, 230, 220)
    )
    
    # 食物小球
    colors = [(255, 180, 100), (255, 140, 140), (180, 220, 140)]
    positions = [(-0.1, -0.01), (0.05, -0.03), (0.1, 0.02), (-0.02, 0.04)]
    for i, (dx, dy) in enumerate(positions):
        fx = cx + size * dx
        fy = cy + size * dy
        r = size * 0.04
        draw.ellipse([fx-r, fy-r, fx+r, fy+r], fill=colors[i % len(colors)])
    
    # 筷子
    chop_color = (180, 140, 100)
    lw = int(size * 0.025)
    # 左筷子
    draw.line([(cx - size*0.22, cy - size*0.32), (cx - size*0.05, cy + size*0.05)], 
              fill=chop_color, width=lw)
    # 右筷子  
    draw.line([(cx + size*0.22, cy - size*0.32), (cx + size*0.05, cy + size*0.05)], 
              fill=chop_color, width=lw)
    
    # 问号
    try:
        q_font = ImageFont.truetype("/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf", int(size * 0.2))
        draw.text((cx - size*0.06, cy - size*0.35), "?", fill='white', font=q_font)
    except:
        pass
    
    return img

def icon_style_5(size=1024):
    """风格5: 现代扁平风"""
    # 渐变背景
    img = create_gradient(size, (255, 154, 86), (255, 111, 86))
    draw = ImageDraw.Draw(img)
    
    cx, cy = size // 2, size // 2
    
    # 大圆盘
    plate_r = size * 0.36
    draw.ellipse([cx-plate_r, cy-plate_r+size*0.03, cx+plate_r, cy+plate_r+size*0.03], 
                 fill='white')
    
    # 盘子内圈
    inner_r = size * 0.30
    draw.ellipse([cx-inner_r, cy-inner_r+size*0.03, cx+inner_r, cy+inner_r+size*0.03], 
                 fill=(255, 250, 245))
    
    # 中间的问号 (大)
    try:
        q_font = ImageFont.truetype("/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf", int(size * 0.35))
        bbox = draw.textbbox((0, 0), "?", font=q_font)
        tw = bbox[2] - bbox[0]
        th = bbox[3] - bbox[1]
        draw.text((cx - tw//2, cy - th//2 - size*0.02), "?", fill=(255, 111, 86), font=q_font)
    except:
        pass
    
    # 装饰：叉子和勺子在两侧
    utensil_color = (255, 255, 255, 200)
    lw = int(size * 0.02)
    
    # 左边叉子
    fx = cx - size * 0.42
    fy = cy
    draw.line([(fx, fy - size*0.2), (fx, fy + size*0.2)], fill='white', width=lw)
    for dy in [-0.2, -0.15, -0.1]:
        draw.line([(fx, fy + size*dy), (fx, fy + size*(dy+0.08))], fill='white', width=lw)
    
    # 右边勺子
    sx = cx + size * 0.42
    draw.line([(sx, fy - size*0.05), (sx, fy + size*0.2)], fill='white', width=lw)
    draw.ellipse([sx - size*0.04, fy - size*0.2, sx + size*0.04, fy - size*0.05], 
                 outline='white', width=lw)
    
    return img

if __name__ == '__main__':
    os.makedirs('/root/what-to-eat/assets', exist_ok=True)
    
    styles = [
        (icon_style_1, "icon_v2_1.png", "简笔碗+热气"),
        (icon_style_3, "icon_v2_2.png", "可爱饭团"),
        (icon_style_4, "icon_v2_3.png", "极简碗筷"),
        (icon_style_5, "icon_v2_4.png", "现代扁平"),
    ]
    
    print("正在生成新版图标...")
    for func, filename, desc in styles:
        icon = func(1024)
        path = f'/root/what-to-eat/assets/{filename}'
        icon.save(path, 'PNG')
        print(f"✅ {desc}: {filename}")
    
    # 复制到 public
    os.system('cp /root/what-to-eat/assets/*.png /root/what-to-eat/public/assets/')
    print("\n✅ 已复制到 public/assets/")
    print("刷新预览页面查看新图标")
