# Handoff: make the solar video photorealistic

The cartoon SVG version is done and committed. Next step is to swap the drawn
scenes for a **real generated photo** with cinematic motion. This was blocked in
the original session because the Higgsfield CDN host was not on the network-egress
allowlist; that host has since been allowed, so a **fresh web session** can now
download the asset.

## The generated asset (already paid for, ~2 Higgsfield credits)

- Model: `nano_banana_pro` (nano_banana_2), 16:9, 1k
- Prompt: photorealistic cinematic wide establishing shot of a solar farm at golden
  hour, glossy dark-blue PV panels to the horizon, warm low sun + gentle lens flare,
  a modern house with rooftop solar in the mid-distance.
- Job id: `77f9f28e-a7ab-4d33-96f8-3304d960183c`
- Direct URL:
  https://d8j0ntlcm91z4.cloudfront.net/user_3EI3phEx25pzVtCMDzfPdvg2Wdg/hf_20260806_073018_77f9f28e-a7ab-4d33-96f8-3304d960183c.png
- If that URL is gone, re-fetch it from the Higgsfield library via `show_medias`
  (type: image), or regenerate with the prompt above.

## Steps

1. Download the image:
   ```bash
   cd solar-video
   mkdir -p public
   curl -sSL -o public/solar-hero.png "<URL above>"
   file public/solar-hero.png   # confirm it's a PNG, not an error page
   ```
2. Replace the drawn scenes (`src/solar/Sky.tsx`, `Sun.tsx`, `SolarPanels.tsx`,
   `House.tsx`) with a photo-backed composition:
   - Full-frame `<Img src={staticFile("solar-hero.png")}>` (from `remotion`) as the base.
   - Slow **cinematic push-in** (scale 1.00 → ~1.10 over 300 frames) via
     `interpolate(frame, ...)` on the `scale` style (use `output: 'perceptual-scale'`).
   - Subtle warm grade + a bottom/top gradient scrim (`<AbsoluteFill>` with a
     `linear-gradient`) so captions stay legible.
   - Keep the three text beats and timings:
     - 0–3.2s: "Harness the Sun" + "The power of solar"
     - 3.2–6.6s: "Panels turn sunlight into clean electricity"
     - 6.6–10s: "Renewable energy, powering tomorrow"
   - Optional: a soft cross-dissolve is unnecessary since it's one continuous shot;
     just fade the captions in/out.
   - Composition stays 1920x1080, 30fps, 300 frames (id `SolarPanels`).
3. Typecheck + render (browser download is blocked; use the preinstalled headless shell):
   ```bash
   npx tsc --noEmit
   npx remotion render SolarPanels out/solar-panels-realistic.mp4 \
     --browser-executable=/opt/pw-browsers/chromium_headless_shell-1194/chrome-linux/headless_shell
   ```
   (If that path differs, find it with:
   `find /opt/pw-browsers -name headless_shell -type f`.)
4. QA a couple of stills with `npx remotion still ...`, then send the MP4 and commit.

## Notes
- The Remotion renderer cannot download Chromium (blocked host); always pass
  `--browser-executable` to the `headless_shell` binary.
- `public/` is NOT git-ignored, so the downloaded image will be committed with the
  project — good for reproducibility.
