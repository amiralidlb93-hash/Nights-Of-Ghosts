# 👻 شب ارواح | Night of Ghosts

یک بازی هالووینی فارسی که داخل مرورگر اجرا می‌شه. توی قبرستونی تاریک، با فانوست ارواح رو پیدا کن و شکارشون کن!

A Persian (RTL) Halloween browser game. Hunt ghosts in a dark graveyard using only your lantern light.

👉 **[enter the live demo!](https://amiralidlb93-hash.github.io/amirali-hq/)**

## ویژگی‌ها

- فانوستی که دنبال موس یا انگشت می‌آد؛ ارواح فقط داخل نورش دیده می‌شن
- ۴۵ ثانیه وقت برای شکار، با ۵ ثانیه‌ی اضافه به‌ازای هر مرحله
- مرحله‌ها: هر ۱۰ امتیاز یک مرحله بالاتر، با نور کمتر و سرعت بیشتر
- غول‌های مختلف:
  - **روح معمولی**: ۱ امتیاز
  - **روح طلایی**: ۵ امتیاز
  - **جمجمه** (از مرحله‌ی ۲): سریع و موج‌دار، ۲ امتیاز
  - **شیطان** (از مرحله‌ی ۳): دو ضربه لازمه، ۳ امتیاز
- خفاش‌ها، رعد و برق و جلوه‌های صوتی (Web Audio)
- ذخیره‌ی بهترین امتیاز در مرورگر (`localStorage`)
- ساخت دعوت‌نامه‌ی مهمونی هالووین و کپی متنش
- سازگار با موبایل و دسکتاپ

## ساختار پروژه

```
├── index.html   # ساختار صفحه (منو، HUD، دعوت‌نامه)
├── style.css    # استایل‌ها
└── script.js    # منطق بازی (Canvas + Web Audio)
```

## نحوه‌ی بازی

| ورودی | کار |
|---|---|
| حرکت موس / کشیدن انگشت | جابه‌جا کردن فانوس |
| کلیک / تپ | شلیک به روح زیر نشانه |

## English

**Night of Ghosts** is a Persian (RTL) Halloween browser game. Explore a dark graveyard with only your lantern and hunt down the ghosts hiding in the shadows.

### Features

- A lantern that follows your mouse or finger; ghosts are only visible inside its light
- 45 seconds on the clock, with +5 seconds for every level you clear
- Levels: every 10 points moves you up a level, with a dimmer lantern and faster enemies
- Different monsters:
  - **Ghost**: 1 point
  - **Golden ghost**: 5 points
  - **Skull** (from level 2): fast and wavy, 2 points
  - **Demon** (from level 3): takes two hits, 3 points
- Bats, lightning and sound effects (Web Audio API)
- Best score saved in the browser (`localStorage`)
- Halloween party invitation builder with a copy button
- Works on mobile and desktop

### Project structure

```
├── index.html   # page structure (menu, HUD, invitation)
├── style.css    # styles
└── script.js    # game logic (Canvas + Web Audio)
```

### Controls

| Input | Action |
|---|---|
| Move mouse / drag finger | Move the lantern |
| Click / tap | Shoot the ghost under the crosshair |

> The Vazirmatn font is loaded from Google Fonts. The game works offline too, but with a fallback font.

## لایسنس / License

این پروژه تحت لایسنس MIT منتشر شده؛ جزئیات در فایل [LICENSE](LICENSE).

Released under the MIT License. See [LICENSE](LICENSE) for details.
