# Design Brief: AidLink Enhanced

## Conceptual Direction
Premium glassmorphic SaaS platform with futuristic, cinematic aesthetic. Deep navy base with neon electric blue, purple, and cyan accents. Frosted glass card layers with backdrop blur create depth illusion. Smooth micro-animations and glow effects establish premium feel. Dark mode default with intentional light mode toggle for flexibility.

## Tone & Differentiation
**Bold glassmorphism** with gradient overlays and neon accents — positioned as sophisticated alternative to flat SaaS. Signature elements: (1) New Volunteers grid with glassmorphic cards, availability badges, and hover glow lift; (2) User profile page with editable settings, activity timeline, and dark/light mode toggle; (3) Smooth 300ms theme transitions across all surfaces. Every interaction feels elevated through lift effects, fade-in transitions, and neon accent highlights.

## Color Palette (OKLCH)

| Token          | Light Mode         | Dark Mode          | Purpose                                    |
| :------------- | :----------------- | :----------------- | :----------------------------------------- |
| Background     | 0.15 0.01 260      | 0.08 0.01 260      | Deep navy page base                        |
| Foreground     | 0.95 0.02 260      | 0.92 0.02 260      | High-contrast text on backgrounds          |
| Card           | 0.20 0.02 260      | 0.12 0.02 260      | Glassmorphic card surfaces                 |
| Primary        | 0.65 0.24 262      | 0.72 0.27 262      | Electric blue CTAs, primary actions        |
| Secondary      | 0.72 0.21 270      | 0.75 0.25 270      | Neon cyan accents, secondary states        |
| Accent         | 0.68 0.23 290      | 0.75 0.26 290      | Neon purple highlights, active focus       |
| Destructive    | 0.65 0.27 15       | 0.68 0.29 15       | Red-pink error states, delete actions      |
| Chart-1        | 0.68 0.23 290      | 0.75 0.26 290      | Purple gradient lines                      |
| Chart-2        | 0.72 0.21 270      | 0.75 0.25 270      | Cyan gradient lines                        |
| Chart-3        | 0.65 0.24 262      | 0.72 0.27 262      | Blue gradient lines                        |

## Typography

| Type      | Font                  | Weight | Size   | Use Case                          |
| :-------- | :-------------------- | :----- | :----- | :-------------------------------- |
| Display   | Bricolage Grotesque   | 700    | 48–64  | Hero titles, dashboard headings   |
| Headline  | Bricolage Grotesque   | 600    | 24–32  | Section titles, card headers      |
| Body      | DM Sans               | 400    | 16    | Paragraph text, descriptions      |
| Body-sm   | DM Sans               | 500    | 14    | Metadata, labels, secondary text  |
| Mono      | Geist Mono            | 400    | 12–14 | Code, timestamps, technical data  |

## Elevation & Depth

| Layer    | Surface           | Border              | Effect                           |
| :------- | :---------------- | :------------------ | :------------------------------- |
| Level 0  | Gradient hero bg  | None                | Full-screen cinematic backdrop   |
| Level 1  | Card bg/20        | Border cyan/20%     | Glassmorphic card base           |
| Level 2  | Card bg/25        | Border cyan/30%     | Elevated glass surface (hover)   |
| Level 3  | Popover           | Border cyan/40%     | Modals, floating panels          |
| Overlay  | Backdrop blur     | Semi-transparent    | Full-screen modals, chat window  |

## Structural Zones

| Zone              | Treatment                                                      | Spacing   |
| :---------------- | :------------------------------------------------------------- | :-------- |
| Hero              | Gradient hero bg + floating particles + neon buttons           | 2rem gaps |
| Header            | Glass bar with dark/light toggle icon, bottom border glow      | Symmetry  |
| Volunteers Grid   | 4-col desktop, 2-col tablet, 1-col mobile; hover lift + glow   | 6 units   |
| Profile Sidebar   | Glass nav (Profile, Activity, Tasks, Saved, Security) sticky   | 4 units   |
| Profile Content   | Editable form cards, activity timeline, glass sections          | Equal     |
| Map               | Full-screen 100vh with glass overlay panels, radar glow        | 4 units   |
| Chatbot           | Floating button (60px), expandable glass window (360px)        | Fixed     |
| Footer            | Glass bar, subtle border-top glow, centered text               | 4 units   |

## Component Patterns

| Pattern             | Application                                                     |
| :------------------ | :-------------------------------------------------------------- |
| Glass Card          | All content cards, dashboard tiles, request panels              |
| Volunteer Badge     | Green "Available", gray "Unavailable" status indicators          |
| Availability Icon   | Pin + location text, task count, gradient accent overlay         |
| Profile Form        | Editable sections with text/email/phone inputs, save button      |
| Activity Timeline   | Vertical connector with gradient, glow markers, date/action text |
| Glow Button         | Primary CTA, hover state triggers glow halo shadow              |
| Gradient Text       | Hero headline, accent emphasis words                            |
| Hover Lift          | Cards, buttons — `translateY(-8px)` + shadow elevation          |
| Backdrop Blur       | Modals, overlay panels, floating glass surfaces                 |
| Theme Toggle        | Sun/moon icon in header, smooth 300ms transition                |

## Motion & Micro-Animation

| Animation        | Duration | Curve           | Trigger          | Usage                                 |
| :--------------- | :------- | :-------------- | :--------------- | :------------------------------------ |
| Fade-in          | 0.5s     | ease-out        | Page load        | Hero text, card entrance              |
| Slide-up         | 0.4s     | ease-out        | Profile sections | Volunteer cards, form sections        |
| Float            | 3s       | ease-in-out     | Continuous       | Particles, decoration elements        |
| Pulse-glow       | 2s       | ease-in-out     | Attention draw   | Chatbot button, radar markers         |
| Hover lift       | 0.3s     | cubic-bezier    | Card hover       | +8px translateY with glow shadow      |
| Theme transition | 0.3s     | cubic-bezier    | Mode toggle      | All surface transitions on dark/light |
| Scroll fade      | Trigger  | ease-out        | Scroll 20%+      | Section entries fade in               |
| Shimmer          | 2s       | Linear          | Loading state    | Skeleton screens, placeholders        |

## Spacing & Rhythm

- **Grid base**: 6 units (24px) between cards
- **Container padding**: 2rem sides, 4rem vertical
- **Card internal**: 2rem padding, 1rem gap between elements
- **Equal heights**: All cards in grid use minimum height or grid row span
- **Symmetry**: Centered content, balanced columns, aligned edges

## Constraints & Technical Rules

- **No arbitrary colors**: Use `primary`, `secondary`, `accent`, `destructive`, `chart-*` tokens only
- **Glass always layered**: backdrop-blur + border/20% + bg/20% minimum
- **Neon accents sparingly**: Use on hover, active, focus states; not default
- **Shadows match brand**: Glow shadows use primary/accent colors, not black
- **Dark mode preferred**: Both modes designed, dark emphasizes glassmorphism
- **Mobile responsive**: Cards stack at `md:`, maintain 6-unit gap
- **No bouncy animations**: Smooth easing only; max 3s duration for continuous loops

## Signature Details

1. **Layered glass depth**: Multi-opacity card layers with backdrop blur create "frosted glass" illusion
2. **Neon glow halos**: Hover states trigger color-matched glow shadows (primary blue, accent purple, cyan)
3. **Floating particles**: Hero page background animation with subtle particle drift
4. **Radar-style map markers**: Concentric glow circles pulsing on map command center
5. **Persistent floating chatbot**: Always-on bottom-right button with pulse animation, glass chat window overlay

## Light & Dark Mode

**Dark Mode (default):** Deep navy base (0.08 L) emphasizing glassmorphic card layers. Neon accents at full chroma. Glows brighter for same visual pop. Used on dark surfaces.

**Light Mode:** Soft white/near-white background (0.98 L) with dark navy text (0.15 L). Reduced neon saturation. Card surfaces lighten to 0.96 L. Smooth 300ms transition via CSS theme-transition class. Header shows sun/moon toggle icon.

**Status Badge Colors:**
- Available: Green oklch(0.68 0.22 155) with 20% opacity background
- Unavailable: Muted oklch(0.4 0.02 260) with 30% opacity background
- Active: Cyan oklch(0.72 0.21 270) with 20% opacity background
