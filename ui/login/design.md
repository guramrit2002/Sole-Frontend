# Sole Login Screen — Assets & Design Documentation

## Overview

This screen is designed as a premium sneaker-focused onboarding experience with:

* dark luxury aesthetic
* neon lime accent palette
* minimal distractions
* strong sneaker-first identity
* split layout with product showcase + auth form

The experience should feel:

* premium
* modern
* sneaker-culture oriented
* collectible/fashion inspired
* cinematic rather than corporate

---

# Screen Structure

```txt
-------------------------------------------------
| LEFT SIDE              | RIGHT SIDE           |
|                         |                      |
| Sneaker showcase        | Auth Card            |
| Neon environment        | Email form           |
| Product pedestal        | CTA button           |
| Ambient lighting        | Clean onboarding     |
-------------------------------------------------
```

---

# Asset List

## 1. Main Sneaker Asset

### Recommended Shoe

Nike Air Force 1 Low

### Requirements

* transparent PNG
* high resolution
* side angle + perspective angle
* white leather base
* black swoosh
* neon lime detailing
* premium lighting

### Recommended Dimensions

```txt
2500px x 2500px
```

### Variants Needed

* floating version
* standing version
* angled hero version
* isolated cutout version

---

## 2. Pedestal Asset

### Style

* matte black
* minimal cube pedestal
* subtle neon underglow
* futuristic display platform

### Color

```txt
#0A0A0A
```

Underglow:

```txt
#D9FF00
```

---

## 3. Neon Environment Elements

### Components

* neon rectangular frame
* vertical neon tube lights
* glow fog overlays
* subtle particles
* ambient gradients

### Style Direction

Cyberpunk sneaker photography studio.

---

## 4. Logo

### Logo Style

Minimal text logo.

```txt
⚡ Sole
```

### Colors

White + Neon Lime

---

## 5. Authentication Icons

### Required Icons

* mail icon
* arrow icon
* lock icon
* lightning bolt icon

### Style

* thin outline
* minimal
* neon compatible

Recommended library:

* Lucide React

---

# Color Palette

## Primary Background

```txt
#050505
```

## Secondary Surface

```txt
#0D0D0D
```

## Neon Accent

```txt
#D9FF00
```

## Secondary Neon

```txt
#C4FF1A
```

## Text Primary

```txt
#FFFFFF
```

## Text Secondary

```txt
#9B9B9B
```

## Border

```txt
#1A1A1A
```

---

# Typography

## Heading Font

Recommended:

* Bebas Neue
  OR
* Anton

Used for:

* large hero text
* campaign style typography

---

## Body Font

Recommended:

* Inter
* Satoshi
* General Sans

---

# Layout Specifications

## Desktop Layout

### Left Section

```txt
Width: 55%
```

### Right Section

```txt
Width: 45%
```

---

## Mobile Layout

### Structure

```txt
Top: sneaker image
Bottom: auth form
```

---

# Authentication Flow

## Initial State

### Visible Components

* logo
* sneaker visual
* welcome heading
* email field
* continue button

---

## After Continue

### Transition

Smooth fade + slide animation.

### New Components

* OTP fields
* resend timer
* verify button

---

# UI Design Rules

## Corners

```txt
24px radius
```

---

## Shadows

Use soft neon glow shadows.

Example:

```css
box-shadow: 0 0 40px rgba(217,255,0,0.12);
```

---

## Borders

Subtle 1px borders.

```txt
rgba(255,255,255,0.06)
```

---

## Inputs

### Height

```txt
64px
```

### Background

```txt
#090909
```

### Border Focus

```txt
#D9FF00
```

---

# Suggested Folder Structure

```txt
assets/
├── shoes/
│   ├── airforce-main.png
│   ├── airforce-floating.png
│   └── airforce-side.png
│
├── backgrounds/
│   ├── neon-grid.png
│   ├── glow-overlay.png
│   └── particles.png
│
├── icons/
│   ├── lightning.svg
│   ├── mail.svg
│   └── arrow.svg
│
└── branding/
    └── logo.svg
```

---

# Motion Design

## Recommended Animations

### Sneaker Float

* subtle vertical floating
* slow rotation

### Neon Glow Pulse

* ambient pulse effect

### Form Transition

* opacity fade
* slide upward

### Button Hover

* glow expansion
* slight scale effect

---

# Technical Stack

## Frontend

* React
* Tailwind CSS
* Framer Motion

---

## Export / Share

Later:

* Playwright screenshots
* shareable sneaker cards
* profile previews

---

# Future Expansion

This screen design system should later support:

* profile cards
* sneaker collection pages
* wishlist views
* social sharing cards
* public profiles
* sneaker stats dashboards

Keep the design language consistent across the platform.
