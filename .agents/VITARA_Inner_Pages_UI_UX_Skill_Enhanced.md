# VITARA Inner Pages UI/UX Skill (Enhanced Edition)

## Purpose

This skill defines how to design and refine the **inner application pages** of VITARA / Campus 1 based on warm editorial SaaS dashboards. It is meant for student, mentor, admin, AI, roadmap, analytics, and knowledge-base screens.

The visual direction combines:
- warm editorial SaaS dashboards with soft beige / ivory surfaces
- restrained institutional indigo and sand accents
- vertical icon navigation rail with active indicator states
- right-side personal profile and context panel
- pastel information cards with low saturation fills
- large rounded containers and strong spacing rhythm
- compact, expressive data visualizations and clean grotesque typography

---

# 1. Core Visual Personality

Use these adjectives as a design test:

**calm, intelligent, soft, structured, modern, academic, premium, warm, approachable**

Avoid:
- harsh corporate blue dashboards
- excessive glassmorphism or neon gradients
- dark-heavy UI or tiny text everywhere
- cards floating with no hierarchy or inconsistent border radii
- excessive borders or more than 1 strong accent local color

---

# 2. Page Composition & Layout Shell

## 2.1 Main App Frame

Every inner page should follow an asymmetric **12-column grid** layout combined with a persistent vertical icon rail and an optional right-side context panel.

```css
max-width: 1600px;
margin: 0 auto;
padding: 24px 28px 32px;
display: grid;
grid-template-columns: repeat(12, minmax(0, 1fr));
gap: 16px;
```

## 2.2 Recommended Width Logic

- **Left Navigation Rail:** Fixed narrow icon panel (`76px`) with active background states (`--indigo-950`).
- **Main Content Area:** 8-9 columns for hero progress cards, schedule grids, feature cards, tables, and primary workflows.
- **Right Context/Profile Panel:** 3-4 columns for user profile, stats summary, peer connections, notifications, and secondary context.

The right panel is optional on focused workflows. Do not force a profile sidebar onto screens where it reduces usable workspace.

---

# 3. Color System

## 3.1 Base Surfaces

```css
--canvas: #F4F0E8;
--canvas-soft: #F8F5EF;
--surface: #FFFCF7;
--surface-strong: #FFFFFF;
--surface-muted: #EEE8DE;
```

**Rule:** Use `--canvas` for app backgrounds and `--surface` for cards. Avoid pure white as the dominant background.

## 3.2 Indigo System

```css
--indigo-950: #201A3D;
--indigo-900: #29204E;
--indigo-800: #352A63;
--indigo-700: #47387C;
--indigo-600: #5B49A0;
--indigo-500: #7462B8;
--indigo-300: #B9AFE0;
--indigo-200: #D6D0EC;
--indigo-100: #EEEAF8;
```

**Rule:** Use indigo for active navigation items, primary buttons, selected tabs, graph highlights, and key metric emphasis.

Do not use indigo as a large decorative background across every section. It should remain an intentional interaction and emphasis color.

## 3.3 Beige & Sand Accents

```css
--sand-500: #C9A86A;
--sand-400: #D6B982;
--sand-300: #E4CFA7;
--sand-200: #EEE1C7;
--sand-100: #F6EFE2;
```

Use sand for secondary highlights, progress accents, subtle dividers, badges, and warm data visualization elements.

## 3.4 Pastel Semantic Card Accents

```css
--pastel-rose: #F3C1C2;
--pastel-peach: #F4D5AD;
--pastel-lilac: #D5D0F5;
--pastel-mint: #BFE7D6;
--pastel-yellow: #F1DE9D;
```

**Rule:** Use pastel fills only for highlighted feature/status cards such as project countdowns, upcoming notices, milestones, recommendations, and important states.

Pair pastel surfaces with dark neutral text (`--text-primary`). Never use white text on light pastel backgrounds.

## 3.5 Text Colors

```css
--text-primary: #17151D;
--text-secondary: #5D5965;
--text-muted: #8B8792;
--text-faint: #AAA5AF;
```

---

# 4. Typography

```css
--font-ui: "Plus Jakarta Sans", "Inter", sans-serif;
--font-display: "Outfit", "Plus Jakarta Sans", sans-serif;
```

## 4.1 Weight & Scale Hierarchy

- **400:** body text, descriptions, metadata
- **500:** labels, tabs, buttons, navigation text
- **600:** card titles, section headings, important UI headings
- **700:** critical numbers and high-priority metric emphasis only
- Avoid heavy `800` / `900` weights for standard UI text.

### Page Title
- Size: `clamp(32px, 3vw, 52px)`
- Line-height: `1.02`
- Weight: `500`
- Tracking: `-0.035em`

### Section Heading
- Size: `18px`
- Line-height: `1.25`
- Weight: `600`

### Primary Body
- Size: `14px`
- Line-height: `1.55`
- Weight: `400`

### Small UI Text
- Size: `12px`
- Line-height: `1.4`
- Weight: `500` for labels and `400` for supporting metadata

Never compensate for poor hierarchy by making everything bold.

---

# 5. Cards, Borders & Density

VITARA cards are compact, calm, and information-dense with minimal shadows and soft neutral borders.

## 5.1 Card Specifications

### Standard Card

```css
background: #FFFCF7;
border: 1px solid #E7E2D9;
border-radius: 20px;
padding: 16px 20px;
box-shadow: 0 1px 3px rgba(30, 30, 30, 0.04);
```

### Compact Metric Card

```css
background: #FFFCF7;
border: 1px solid #E7E2D9;
border-radius: 18px;
padding: 16px;
box-shadow: 0 1px 3px rgba(30, 30, 30, 0.035);
```

### Major Feature Card

```css
background: #FFFCF7;
border: 1px solid #E7E2D9;
border-radius: 24px;
padding: 20px 24px;
box-shadow: 0 2px 8px rgba(30, 30, 30, 0.04);
```

## 5.2 Card Rules

- Use soft neutral borders such as `border-[#E7E2D9]` rather than heavy shadows.
- Keep internal padding tight, generally `p-4` to `p-5`.
- Avoid oversized padding such as `p-8`, `p-10`, or `p-12` inside normal dashboard cards.
- Use `p-3.5` to `p-4` for compact metric cards.
- Use `p-5` to `p-6` only for genuinely large feature content.
- Prefer `gap-2`, `gap-3`, and `gap-4` for internal spacing.
- One card should contain one clear idea with closely grouped metadata.
- Do not create cards inside cards unless there is a strong information architecture reason.
- The border should provide most of the card separation.
- Cards should appear almost flat by default.

## 5.3 Shadow Rules

Preferred:

```css
box-shadow: 0 1px 3px rgba(30, 30, 30, 0.04);
box-shadow: 0 2px 8px rgba(30, 30, 30, 0.04);
```

Tailwind equivalents may use:

```text
shadow-sm
shadow-[0_1px_3px_rgba(30,30,30,0.04)]
shadow-[0_2px_8px_rgba(30,30,30,0.04)]
```

Do not use:
- `shadow-xl`
- `shadow-2xl`
- large dark drop shadows
- colored/glowing card shadows
- strong floating-card effects

Slightly stronger elevation is reserved for genuinely floating elements such as dropdowns, popovers, dialogs, command palettes, and the floating AI assistant.

## 5.4 Card Density Test

When reviewing a card, ask:

> Can I remove 15-20% of this card's padding without making it cramped?

If yes, reduce it.

Then ask:

> Does the card still look separated if I almost remove the shadow?

If no, strengthen the border or surface contrast instead of increasing the shadow.

The intended result is:

**soft + compact + editorial + premium**

not:

**oversized + floating + heavily decorated**

---

# 6. Navigation & Side Rails

## 6.1 Vertical Icon Navigation Rail

- **Width:** `76px`
- **Radius:** `22px`
- **Background:** `rgba(255, 252, 247, 0.88)`
- **Icon buttons:** `44x44px`
- **Icon button radius:** `14px`

### Active State

```css
background: var(--indigo-950);
color: white;
```

The active state should be visually obvious but compact.

### Inactive State

```css
background: transparent;
color: var(--text-secondary);
```

Use Lucide icons consistently. Do not mix unrelated icon families.

## 6.2 Navigation Grouping

Group related destinations with breathing room instead of adding many divider lines.

Recommended pattern:

```text
Primary
  Home
  Academics
  Roadmap
  Skills

Work
  Assignments
  Mentoring
  Opportunities

System
  AI Assistant
  Notifications
  Settings
```

The exact groups may differ by role, but the visual principle remains the same.

## 6.3 Top Page Header / Tabs

Use pill-style tabs where appropriate:

```css
height: 38px;
border-radius: 999px;
```

Inactive state:

```css
background: rgba(32, 26, 61, 0.04);
color: var(--text-secondary);
```

Active state can use `--indigo-950` with white text or a restrained indigo-tinted surface depending on context.

Do not turn every navigation element into a pill. Pills are for compact switching controls, filters, and tabs.

---

# 7. Right-Side Context & Profile Panel Pattern

The right-side panel is a secondary information surface. It should not compete with the primary workflow.

Use it for:

1. **User Profile Card**
   - avatar
   - name
   - role / academic identity
   - optional badge
   - friend / peer / mentee connectivity
   - small overlapping avatars

2. **Academic Health / Activity Widget**
   - CGPA
   - attendance
   - activity hours
   - roadmap progress
   - compact bar, ring, or mini-chart

3. **Quick Status / Notification Summary**
   - high-potential indicators
   - deadlines
   - intervention prompts
   - upcoming meetings
   - action-needed states

The panel may be sticky on desktop when useful, but it should disappear or move below the primary content on smaller screens.

---

# 8. Data Visualization & Metrics

- Keep charts integrated inside cards.
- Use minimal axis lines and very low-opacity grid lines.
- Use one primary indigo series.
- Use warm sand and pastel series as secondary data.
- Avoid rainbow palettes.
- Always provide a human-readable metric header above the chart.

Example:

```text
Attendance Rate
91.4%

[ compact attendance chart ]
```

Charts should answer a question, not simply occupy visual space.

Use compact visualization patterns:
- mini line charts
- compact bar charts
- progress rings
- segmented progress bars
- small trend indicators
- timeline markers

Avoid large decorative charts when the underlying metric can be understood more clearly through a compact visualization.

---

# 9. Buttons, Inputs & Controls

## Primary Button

```css
background: var(--indigo-950);
color: #FFFFFF;
border-radius: 12px;
height: 40px;
padding: 0 16px;
font-size: 13px;
font-weight: 500;
```

Primary buttons should be visually confident but not oversized.

## Secondary Button

Use an ivory or transparent surface with a soft neutral border.

```css
background: var(--surface);
border: 1px solid #E7E2D9;
color: var(--text-primary);
border-radius: 12px;
```

## Inputs

Inputs should use:
- `40-44px` height
- soft ivory/white surface
- `#E7E2D9` border
- `12px` radius
- clear focus ring using restrained indigo

Avoid heavy outlined form controls.

---

# 10. Page-Specific Composition Patterns

## Student Dashboard

Prioritize:

```text
Page heading
↓
Readiness / academic overview
↓
Today's priority + next best action
↓
Roadmap / skill progress
↓
Assignments / opportunities / mentoring
```

Use the right panel for:
- profile
- academic health
- upcoming activity
- compact progress

## Mentor Dashboard

Prioritize:

```text
Page heading
↓
Attention radar / mentee health
↓
Students requiring action
↓
Upcoming meetings
↓
Assignments / interventions
```

High-risk information should use subtle semantic accents rather than large red warning blocks.

## Admin Dashboard

Prioritize:

```text
Page heading
↓
System health metrics
↓
ERP / AI / RAG operational status
↓
User and department management
↓
Audit / security activity
```

Admin pages can be denser than student pages, but must retain the same typography, border, radius, and shadow system.

---

# 11. AI UI Pattern

AI should feel integrated into the product rather than visually detached from it.

Use:
- pale indigo surfaces
- subtle indigo border
- compact AI status indicators
- evidence/source labels
- confidence indicators
- clear recommended actions
- small "Why this recommendation?" affordances

Avoid:
- giant purple gradients
- glowing AI cards
- excessive sparkle icons
- huge chat containers dominating every page

For VITARA's AI features, recommendation cards should make the reasoning and evidence easy to inspect.

---

# 12. Responsive Behavior

### Desktop
Use the full three-part structure where appropriate:

```text
[76px rail] [8-9 column main workspace] [3-4 column context panel]
```

### Tablet
- collapse or narrow the left rail
- move the right context panel below primary content
- reduce grid complexity
- preserve card density

### Mobile
- replace the vertical rail with a compact bottom or top navigation
- single-column content
- cards remain compact
- avoid excessively large mobile headings
- stack chart + metric combinations vertically
- keep primary actions easy to reach

Do not simply shrink the desktop layout. Recompose it.

---

# 13. Glassmorphism Usage

The existing VITARA system supports glass surfaces, but the reference direction should be treated as the stronger rule for inner application pages.

Use glass selectively for:
- floating AI assistant
- modal overlays
- command palettes
- dropdowns
- sticky floating controls
- temporary contextual surfaces

Do not make every dashboard card glass.

Normal inner-page cards should primarily use:

```text
warm canvas
→ ivory surface
→ soft neutral border
→ minimal shadow
```

This keeps complex screens readable and prevents visual fatigue.

---

# 14. Spacing Rhythm

Use a consistent spacing scale:

```text
4px
8px
12px
16px
20px
24px
32px
40px
48px
```

Common usage:

- icon-to-label: `8px`
- metadata groups: `8-12px`
- card internal groups: `12-16px`
- card-to-card: `16px`
- section spacing: `24-32px`
- major page sections: `32-48px`

Avoid random spacing values unless they solve a specific alignment problem.

---

# 15. Visual Hierarchy Rules

Every screen should have a clear hierarchy:

```text
Page identity
↓
Primary metric / decision
↓
Main workflow
↓
Supporting information
↓
Secondary context
```

Do not give equal visual weight to every component.

A useful test:

> If everything looks important, nothing looks important.

Use size, position, typography, surface tone, and indigo emphasis to establish priority.

---

# 16. UI Review Checklist

Before finishing any screen design, verify:

- [ ] Is the app background warm beige (`#F4F0E8`) instead of pure white?
- [ ] Are cards ivory (`#FFFCF7`) with soft neutral borders (`#E7E2D9`)?
- [ ] Is the vertical icon navigation rail present where the page architecture benefits from it?
- [ ] Is the right-side profile/stats panel used when secondary context genuinely helps?
- [ ] Are indigo accents restricted mainly to active items, primary buttons, selected states, and key highlights?
- [ ] Are pastel accent cards used sparingly for meaningful highlights?
- [ ] Is card padding compact (`p-4` to `p-5`)?
- [ ] Are shadows extremely light and secondary to borders?
- [ ] Are there no unnecessary `shadow-xl` / `shadow-2xl` cards?
- [ ] Are borders soft and neutral rather than dark?
- [ ] Are card radii consistent?
- [ ] Are typography weights restrained?
- [ ] Is there a clear primary action or decision on the page?
- [ ] Does the page remain information-dense without becoming cramped?
- [ ] Does the design still look good if most shadows are removed?
- [ ] Are AI components integrated into the same visual language?
- [ ] Does the responsive layout recompose rather than merely shrink?

---

# 17. Design North Star

The final VITARA inner-page experience should feel like:

**a warm academic operating system for a student or institution**

It should combine the calm visual language of modern editorial SaaS products with the information density required by an academic ERP.

The key principles are:

**Warm canvas.  
Ivory surfaces.  
Indigo interaction.  
Soft neutral borders.  
Minimal shadows.  
Compact cards.  
Clear hierarchy.  
Useful data density.  
Selective pastel accents.  
Intelligent AI surfaces.**

When uncertain, choose **less decoration, tighter spacing, softer separation, and clearer information hierarchy**.
