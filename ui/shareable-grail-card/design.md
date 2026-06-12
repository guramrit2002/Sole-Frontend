# Shareable Grail Story Card

## Goal

Create a shareable Instagram Story card for a Sole grail. Users should be able to export or share a polished 1080 x 1920 image that shows the grail name, total shoes, total worth, tags, and highlighted shoes.

The share card should feel like a collectible poster: dark, neon, sneaker-first, and instantly recognizable as Sole.

## Reference Files

- Visual mockup: `frontend/ui/shareable-grail-card/story-card-mockup.svg`
- Optional PNG export target: `frontend/ui/shareable-grail-card/story-card-mockup.png`
- Existing wrapper: `frontend/src/components/ShareableCard.jsx`
- Current pages:
  - `frontend/src/pages/Grails.jsx`
  - `frontend/src/pages/GrailDetail.jsx`

## Format

- Canvas: `1080px x 1920px`
- Aspect ratio: `9:16`
- Export target: Instagram Story
- Pixel ratio: `2` when generating from DOM
- Safe margin: `72px` from screen edges
- Corner radius: `44px` outer card

## Visual Direction

Use the existing Sole theme:

- Background: `#050505`
- Surface: `#101010`
- Accent: `#D9FF3F`
- Text: `#FFFFFF`
- Muted text: `#A1A1AA`
- Border: `#1F1F1F`
- Danger/error colors should not appear on this card

The card should use neon accent strokes, graffiti/noise texture overlays, and large editorial typography. Avoid a plain dashboard look.

## Layout

### 1. Background

Full canvas background:

- Base: `#050505`
- Subtle radial neon glow behind shoe area:
  - center around `50% 36%`
  - color `rgba(217, 255, 63, 0.22)`
- Optional graffiti texture layer:
  - use existing graffiti assets with low opacity
  - blend mode: `screen` or `lighten`

### 2. Top Brand Row

Position:

- `top: 72px`
- `left/right: 72px`

Content:

- Sole logo block: small accent square with `Zap` icon
- Text: `SOLE`
- Right label: `GRAIL DROP`

Typography:

- Brand text: `Space Grotesk`, `28px`, `700`
- Label: `Space Grotesk`, `22px`, `700`, uppercase, accent color

### 3. Grail Title Section

Position:

- Starts around `top: 165px`
- Left/right padding: `72px`

Content:

- Eyebrow: `MY GRAIL`
- Main title: grail name, uppercase
- Description: optional, max 2 lines

Typography:

- Eyebrow: `Space Grotesk`, `22px`, `700`, letter spacing `3px`, accent
- Title: `Bebas Neue`, `112px`, line-height `0.9`, uppercase
- Description: `Space Grotesk`, `28px`, line-height `1.35`, muted

Behavior:

- If title is long, clamp to 2 lines and reduce font size down to `82px`.
- If no description, move stats section up slightly.

### 4. Hero Shoe

Position:

- Main shoe image centered between `top: 520px` and `top: 990px`

Style:

- White/off-white image stage behind shoe:
  - `border-radius: 36px`
  - background `#F3F3EF`
  - subtle accent border
- Shoe image:
  - `object-fit: contain`
  - use biggest/most visually strong shoe in grail
  - drop shadow `0 36px 80px rgba(0,0,0,0.45)`

Fallback:

- If no shoe image, show `Footprints` icon with text `NO SHOES YET`.

### 5. Stats Row

Position:

- Around `top: 1030px`
- Left/right: `72px`
- Two large stat cards side by side

Stats:

- Total shoes
- Total worth

Style:

- Background: `rgba(255,255,255,0.045)`
- Border: `1px solid rgba(217,255,63,0.18)`
- Radius: `24px`
- Padding: `28px`

Typography:

- Label: `Space Grotesk`, `18px`, uppercase, muted
- Value: `Bebas Neue`, `72px`, white/accent

Format:

- Total shoes: integer, e.g. `12`
- Total worth: currency, e.g. `$4,850`

### 6. Highlighted Shoes

Position:

- Around `top: 1220px`
- Left/right: `72px`

Content:

- Section label: `FEATURED PAIRS`
- Up to 3 shoes
- Each row: small thumbnail, shoe name, price

Style:

- Row background: `#111111`
- Border: `1px solid #1F1F1F`
- Radius: `18px`
- Thumbnail background: `#F3F3EF`, radius `12px`

Typography:

- Label: `Space Grotesk`, `18px`, uppercase, muted
- Shoe name: `Space Grotesk`, `24px`, `700`
- Price: `Space Grotesk`, `22px`, accent

### 7. Tags

Position:

- Below featured shoes, above footer

Style:

- Accent chips
- Background: `#D9FF3F`
- Text: `#000000`
- Radius: `10px`
- Padding: `8px 18px`

Show max 4 tags. If more exist, show `+N`.

### 8. Footer

Position:

- Bottom safe area around `bottom: 72px`
- Left/right: `72px`

Content:

- Left: `Built on Sole`
- Right: app URL or handle, e.g. `sole.app`

Style:

- Top border: `1px solid rgba(255,255,255,0.08)`
- Text: `Space Grotesk`, `22px`, muted

## React Component Recommendation

Create a new component:

`frontend/src/components/GrailStoryCard.jsx`

Suggested props:

```jsx
export default function GrailStoryCard({
  grail,
  username = '@sole',
  appUrl = 'sole.app',
})
```

Expected `grail` shape:

```js
{
  id: 1,
  name: 'Jordan Grails',
  description: 'Pairs I waited years to own.',
  tags: ['Jordan', 'Retro', 'Grails'],
  total_shoes: 12,
  total_worth: 4850,
  shoes: [
    {
      id: 10,
      name: 'Air Jordan 1 High Bred Toe',
      price: '1445.00',
      image: 'https://...',
      url: 'https://...',
    }
  ]
}
```

Implementation notes:

- Keep component dimensions fixed at `width: 1080px; height: 1920px`.
- Render it in a hidden/offscreen export area or modal preview.
- Use `html-to-image` already installed in the project.
- Export with `toPng(node, { pixelRatio: 2, cacheBust: true })`.
- For native sharing, convert data URL to Blob and call `navigator.share({ files: [file], title, text })` when supported.
- Fallback to download PNG.

## Share Flow

From the grail cards and grail detail page:

1. User taps share icon.
2. Popover opens:
   - `Share Story Card`
   - `Copy Public Link`
   - `Instagram`
3. If `Share Story Card`:
   - render `GrailStoryCard`
   - export PNG
   - use Web Share API with image file if supported
   - otherwise download PNG with filename `sole-grail-{id}.png`
4. If `Instagram`:
   - use Web Share API with the exported PNG when supported
   - otherwise download PNG and show helper text: `Open Instagram and add this image to your story.`

## Empty State

If grail has no shoes:

- Keep the same layout
- Replace hero image with `Footprints`
- Stat cards show `0` and `$0`
- Featured section text: `Add shoes to build this grail.`

## Copy

Recommended labels:

- `MY GRAIL`
- `GRAIL DROP`
- `FEATURED PAIRS`
- `TOTAL SHOES`
- `TOTAL WORTH`
- `Built on Sole`

Avoid the word `collection` in user-facing text.
