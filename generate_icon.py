#!/usr/bin/env python3
"""
生成「吃什么」App 图标
1024x1024 PNG，适用于 App Store
"""

from PIL import Image, ImageDraw, ImageFont
import math

def create_gradient(size, color1, color2):
    """创建渐变背景"""
    img = Image.new('RGB', (size, size))
    draw = ImageDraw.Draw(img)
    
    for y in range(size):
        # 从上到下的渐变
        ratio = y / size
        r = int(color1[0] * (1 - ratio) + color2[0] * ratio)
        g = int(color1[1] * (1 - ratio) + color2[1] * ratio)
        b = int(color1[2] * (1 - ratio) + color2[2] * ratio)
        draw.line([(0, y), (size, y)], fill=(r, g, b))
    
    return img

def draw_bowl(draw, cx, cy, size):
    """绘制一个简约的碗"""
    # 碗身 - 半椭圆
    bowl_width = size * 0.7
    bowl_height = size * 0.35
    
    # 碗的边框
    draw.arc(
        [cx - bowl_width/2, cy - bowl_height/2, cx + bowl_width/2, cy + bowl_height/2 + bowl_height],
        0, 180,
        fill='white',
        width=int(size * 0.04)
    )
    
    # 碗口
    draw.ellipse(
        [cx - bowl_width/2, cy - bowl_height/4, cx + bowl_width/2, cy + bowl_height/4],
        outline='white',
        width=int(size * 0.04)
    )

def draw_steam(draw, cx, cy, size):
    """绘制蒸汽"""
    steam_color = (255, 255, 255, 200)
    
    # 三条波浪蒸汽线
    for i, offset in enumerate([-size*0.15, 0, size*0.15]):
        points = []
        start_y = cy - size * 0.1
        for t in range(20):
            y = start_y - t * size * 0.015
            x = cx + offset + math.sin(t * 0.5 + i) * size * 0.03
            points.append((x, y))
        
        if len(points) > 1:
            draw.line(points, fill='white', width=int(size * 0.025))

def create_icon(size=1024):
    """创建完整的 App 图标"""
    
    # 温暖的渐变色 - 橙色系
    color_top = (255, 154, 86)      # #ff9a56
    color_bottom = (255, 111, 86)   # #ff6f56
    
    # 创建渐变背景
    img = create_gradient(size, color_top, color_bottom)
    draw = ImageDraw.Draw(img)
    
    cx, cy = size // 2, size // 2 + size * 0.05
    
    # 绘制碗
    draw_bowl(draw, cx, cy, size * 0.6)
    
    # 绘制蒸汽
    draw_steam(draw, cx, cy - size * 0.15, size * 0.5)
    
    # 绘制筷子
    chopstick_color = 'white'
    chopstick_width = int(size * 0.025)
    
    # 左筷子
    x1, y1 = cx - size * 0.08, cy - size * 0.25
    x2, y2 = cx - size * 0.2, cy + size * 0.15
    draw.line([(x1, y1), (x2, y2)], fill=chopstick_color, width=chopstick_width)
    
    # 右筷子
    x1, y1 = cx + size * 0.08, cy - size * 0.25
    x2, y2 = cx + size * 0.2, cy + size * 0.15
    draw.line([(x1, y1), (x2, y2)], fill=chopstick_color, width=chopstick_width)
    
    # 添加问号
    try:
        # 尝试加载系统字体
        font_size = int(size * 0.25)
        try:
            font = ImageFont.truetype("/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf", font_size)
        except:
            try:
                font = ImageFont.truetype("/System/Library/Fonts/Helvetica.ttc", font_size)
            except:
                font = ImageFont.load_default()
        
        # 在碗上方绘制问号
        text = "?"
        bbox = draw.textbbox((0, 0), text, font=font)
        text_width = bbox[2] - bbox[0]
        text_height = bbox[3] - bbox[1]
        
        text_x = cx - text_width // 2
        text_y = cy - size * 0.02 - text_height // 2
        
        draw.text((text_x, text_y), text, fill='white', font=font)
    except Exception as e:
        print(f"字体加载失败: {e}")
    
    return img

def create_simple_icon(size=1024):
    """创建简约版图标 - emoji 风格"""
    
    # 渐变背景
    color_top = (255, 154, 86)
    color_bottom = (255, 111, 86)
    img = create_gradient(size, color_top, color_bottom)
    draw = ImageDraw.Draw(img)
    
    cx, cy = size // 2, size // 2
    
    # 绘制一个大的白色圆形作为盘子
    plate_radius = size * 0.35
    draw.ellipse(
        [cx - plate_radius, cy - plate_radius + size*0.05, 
         cx + plate_radius, cy + plate_radius + size*0.05],
        fill='white'
    )
    
    # 内圈
    inner_radius = size * 0.28
    draw.ellipse(
        [cx - inner_radius, cy - inner_radius + size*0.05, 
         cx + inner_radius, cy + inner_radius + size*0.05],
        fill=(255, 245, 235)
    )
    
    # 绘制食物 emoji 样式的图案
    # 中间画一个可爱的食物符号
    food_color = (255, 111, 86)
    
    # 画一个简单的碗形状在盘子上
    bowl_y = cy + size * 0.02
    draw.arc(
        [cx - size*0.18, bowl_y - size*0.05, cx + size*0.18, bowl_y + size*0.18],
        0, 180,
        fill=food_color,
        width=int(size * 0.035)
    )
    
    # 碗里的内容 - 几个小圆点代表食物
    for dx, dy in [(-0.08, -0.02), (0, -0.04), (0.08, -0.02), (-0.04, 0.02), (0.04, 0.02)]:
        px = cx + size * dx
        py = bowl_y + size * dy
        r = size * 0.025
        draw.ellipse([px-r, py-r, px+r, py+r], fill=food_color)
    
    # 蒸汽
    steam_color = (200, 200, 200)
    for i, offset in enumerate([-0.06, 0, 0.06]):
        sx = cx + size * offset
        sy = cy - size * 0.12
        # 小波浪
        points = []
        for t in range(8):
            x = sx + math.sin(t * 0.8 + i * 2) * size * 0.015
            y = sy - t * size * 0.012
            points.append((x, y))
        if len(points) > 1:
            draw.line(points, fill=steam_color, width=int(size * 0.015))
    
    # 问号在上方
    try:
        font_size = int(size * 0.18)
        try:
            font = ImageFont.truetype("/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf", font_size)
        except:
            font = ImageFont.load_default()
        
        text = "?"
        bbox = draw.textbbox((0, 0), text, font=font)
        text_width = bbox[2] - bbox[0]
        text_x = cx - text_width // 2
        text_y = cy - size * 0.32
        
        # 白色背景圆
        qr = size * 0.12
        draw.ellipse([cx - qr, text_y - size*0.02, cx + qr, text_y + qr*1.5], fill='white')
        draw.text((text_x, text_y), text, fill=food_color, font=font)
    except:
        pass
    
    return img

if __name__ == '__main__':
    import os
    
    # 确保目录存在
    os.makedirs('/root/what-to-eat/assets', exist_ok=True)
    
    # 生成图标
    print("正在生成 App 图标...")
    
    # 方案1: 简约版
    icon1 = create_simple_icon(1024)
    icon1.save('/root/what-to-eat/assets/icon.png', 'PNG')
    print("✅ 已保存: /root/what-to-eat/assets/icon.png (1024x1024)")
    
    # 方案2: 碗筷版
    icon2 = create_icon(1024)
    icon2.save('/root/what-to-eat/assets/icon_alt.png', 'PNG')
    print("✅ 已保存: /root/what-to-eat/assets/icon_alt.png (1024x1024)")
    
    # 生成不同尺寸（可选）
    sizes = [180, 167, 152, 120, 87, 80, 76, 60, 58, 40, 29, 20]
    for s in sizes:
        resized = icon1.resize((s, s), Image.Resampling.LANCZOS)
        resized.save(f'/root/what-to-eat/assets/icon_{s}.png', 'PNG')
    
    print(f"✅ 已生成 {len(sizes)} 个不同尺寸的图标")
    print("\n图标预览路径: /root/what-to-eat/assets/")
