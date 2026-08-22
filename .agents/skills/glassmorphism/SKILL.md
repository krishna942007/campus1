---
name: glassmorphism
description: Apply a premium, professional ultra-transparent glassmorphism aesthetic across the UI with 10% fill, 5px subtle backdrop blur, clean subtle borders, and soft depth shadows.
---

# Glassmorphism Design Skill

Apply a **premium, professional ultra-transparent glassmorphism aesthetic** across the UI.

The glass effect should feel **crystal clear and transparent first, softly blurred second, and elevated third**. Avoid making components look like solid white or cloudy white cards.

## Core Glass Specification & Tailwind Utility

The standardized production glassmorphism card container structure:

```tsx
<div className="bg-[#FFFFFF]/10 backdrop-blur-[5px] rounded-3xl p-6 sm:p-5 border border-[#0C2238]/08 shadow-xl shadow-[#0C2238]/05">
  {/* Glass Card Content */}
</div>
```

## Recommended Visual Direction (CSS)

```css
/* Standard Glass Surface */
background: rgba(255, 255, 255, 0.10);
backdrop-filter: blur(5px);
-webkit-backdrop-filter: blur(5px);
border: 1px solid rgba(12, 34, 56, 0.08);
box-shadow: 0 20px 25px -5px rgba(12, 34, 56, 0.05);
```

For light institutional interfaces (e.g. VITARA Cream `#F7F4EE` canvas):

```css
background: rgba(255, 255, 255, 0.10);
backdrop-filter: blur(5px);
-webkit-backdrop-filter: blur(5px);
border: 1px solid rgba(12, 34, 56, 0.08);
box-shadow: 0 20px 25px -5px rgba(12, 34, 56, 0.05);
```

For darker interfaces, keep the glass **mostly transparent** (`rgba(255, 255, 255, 0.05)` to `0.10`) rather than increasing opacity.

## Important Rules

1. **Transparency > Opacity**
   * Use `bg-[#FFFFFF]/10` (10% opacity fill).
   * Avoid solid backgrounds or semi-opaque surfaces like `bg-white`, `/80`, or `/95`.
   * Keep background artwork and elements clearly visible behind the glass.

2. **Controlled Soft Backdrop Blur**
   * Use `backdrop-blur-[5px]` to keep background elements recognizable while establishing subtle depth.
   * Avoid excessive heavy blur that turns background artwork into opaque grey fog.

3. **Subtle Institutional Rim Borders**
   * Use thin `1px` low-opacity borders: `border-[#0C2238]/08`.
   * Border opacity stays around `8%` for clean definition without harsh outlines.

4. **Soft Elevated Depth**
   * Combine standard shadow with soft colored shadow tinting: `shadow-xl shadow-[#0C2238]/05`.
   * Never use heavy black drop shadows.

5. **Layered Glass Hierarchy**
   * Primary containers: `bg-[#FFFFFF]/10 backdrop-blur-[5px] border-[#0C2238]/08`.
   * Secondary nested cards: `bg-[#FFFCF7]/40 hover:bg-[#FFFCF7]/65 backdrop-blur-md border border-[#0C2238]/08`.

6. **Interactions**
   * On hover, slightly elevate position (`-translate-y-1.5`) or increase background fill to `bg-[#FFFCF7]/65`.
   * Use smooth transitions around `200ms - 300ms`.

## Overall Goal

The final UI should look like **premium modern software with real depth**, where the environment behind components is visible through a clean, ultra-transparent, 5px blurred surface.

Think:
**transparent → subtle 5px blur → clean 8% border → soft depth shadow → crisp typography**
