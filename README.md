# Birthday Website

A birthday page built with Next.js. Most of the personalized text and birthday
details are in `lib/config.ts`.

## Run the site locally

Install dependencies and start the development server:

```bash
npm install
npm run dev
```

Open the local URL printed by Next.js. To check the project before publishing:

```bash
npm run lint
npm run typecheck
npm run build
```

## Change the page content

Edit `siteConfig` in `lib/config.ts`:

- `birthday.month` and `birthday.day`: birthday date. Use a **1-based month**
  (January is `1`, October is `10`). The countdown picks the next occurrence
  automatically.
- `birthday.year`: birth year. When set, the age is derived automatically from it
  (see the top-level exports below) and only rolls over after the birthday has
  passed. Leave it out to fall back to `manualAge`.
- `hero.headline`, `hero.subtitle`, and `hero.ctaText`: main hero text and
  surprise button label.
- `wishes`: list of birthday wish cards. Each item has an `id`, `title`, and
  `content`; add, remove, or edit items in this array.
- `memories`: bento-grid entries with an `id`, `image`, and `caption`. The grid
  renders five tiles (the first is a large 2x2 feature tile) and currently shows
  the image filename as a placeholder rather than rendering the photo. On small
  screens there is no slider — the grid is wider than the viewport and GSAP pans
  it horizontally as you scroll until the last tile is in view, then the page
  resumes scrolling normally. To add actual photo display, update
  `components/sections/Memories.tsx` as well as adding image files under `public/`.
- `surprise.title` and `surprise.message`: title and message in the surprise
  dialog.
- `footer.credit`: footer attribution text. The `replayText` field is currently
  unused by the rendered footer.
- `mascot.label` and `mascot.size`: screen-reader label and default mascot size.

`lib/config.ts` also has a few top-level exports that sit alongside `siteConfig`:

- `BIRTHDAY_NAME`: birthday person's name, used by `siteConfig.name`, section
  headings, and the page title.
- `manualAge`: fallback age, used only when `birthday.year` is missing.
- `age`: the age derived by `calculateAge()` from `birthday.year`, evaluated when
  the module loads and rolling over only after the birthday has passed. Don't
  edit this directly — set `birthday.year` (or `manualAge` when no birth year is
  configured) instead. The birthday cake in the surprise dialog renders one
  candle per year of `age`.

Some decorative content is intentionally defined alongside its component rather
than in `siteConfig`. For example, the hero floating emojis are in
`components/sections/Hero.tsx`, and the surprise dialog's floating emojis are
in `components/sections/Surprise.tsx`. The surprise dialog's birthday cake lives
in `components/birthday/birthday-cake.tsx` with its styles in
`app/birthday-cake.scss`, and it picks a random palette from `utils/cakePalette.ts`
each time the dialog opens.

## Change the mascot character

The mascot uses the `page-mascot` package and needs **two matching sprite sheets**:

1. A directions sheet containing the character looking in nine directions.
2. A reactions sheet containing the character's nine expressions.

Each sheet must be a 3-by-3 grid, and the character's scale, framing, and
alignment must match between the two sheets. The pointer changes the direction;
clicking the mascot briefly shows a reaction.

To replace the current character:

1. Obtain or create both sprite sheets for the same character.
2. Put the files in `public/mascots/`, for example:
   `public/mascots/new-character-directions.webp` and
   `public/mascots/new-character-reactions.webp`.
3. Update `siteConfig.mascot.directions` and `siteConfig.mascot.reactions` in
   `lib/config.ts` to the corresponding public paths, such as
   `"/mascots/new-character-directions.webp"`.
4. Adjust `siteConfig.mascot.size` if the character needs a different default
   size. The hero uses a separate size override in `app/page.tsx`; adjust it
   there if the new character should be larger or smaller in the hero.
5. Check the character at desktop and mobile sizes. Its positions are controlled
   by `components/mascot.tsx`, while responsive hero layout is controlled by
   `components/sections/Hero.tsx`.

The `page-mascot` package documents the sprite-sheet format and options in its
[README](https://github.com/nilbuild/page-mascot).
