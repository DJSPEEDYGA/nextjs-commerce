# Agent-007 × GOAT Force — Stable Diffusion / Imagine Engine Prompts

Ready-to-paste prompts for generating Agent-007 promo art on your local Codex Draw
(Stable Diffusion WebUI @ http://127.0.0.1:7860) or Grok Imagine Engine.

Recommended: SDXL or SD 1.5 with a cinematic checkpoint (e.g. Juggernaut XL,
RealVisXL, DreamShaper). Steps 30-40, CFG 6-8, sampler DPM++ 2M Karras.

---

## 1. Hero App Icon (square, 1:1)
```
A sleek secret-agent goat mascot, gold and black color scheme, wearing a tuxedo
and bow tie, gold goat horns, standing in a 007 gun-barrel crosshair, dramatic
spotlight, glossy emblem, premium logo design, cinematic lighting, ultra detailed,
vector art style, dark navy background, luxury gold gradient --ar 1:1
Negative: blurry, low quality, watermark, text artifacts, extra limbs
```

## 2. Cinematic Promo Poster (vertical, movie poster)
```
Movie poster, a legendary goat in a black tuxedo holding a golden microphone like
a secret agent, neon gold "007" glowing behind, recording studio with mixing
console, dramatic rim lighting, smoke, Hollywood blockbuster poster style,
8k, hyper detailed, cinematic color grading, teal and orange --ar 2:3
Negative: cartoon, flat, low detail, distorted face
```

## 3. Studio Action Shot (16:9 wide banner)
```
A cool goat secret agent in a high-tech music production studio, multiple monitors
glowing, Universal Audio interface, gold accents, sitting at an SSL mixing desk,
neon GOAT FORCE sign on wall, cinematic wide shot, volumetric lighting, shot on
ARRI Alexa 35, shallow depth of field, 8k --ar 16:9
Negative: blurry, amateur, washed out, text errors
```

## 4. Social Avatar (clean, circular-friendly)
```
Minimalist mascot logo of a goat head with gold horns wearing tiny sunglasses and
earphones, secret agent vibe, flat gold on black, clean vector, centered, sticker
style, bold simple shapes --ar 1:1
Negative: realistic, complex background, clutter
```

## 5. Loading / Splash Screen (16:9)
```
Epic splash screen, golden goat emblem with glowing 007 crosshair, particles of
gold dust, dark cinematic background, "AGENT-007" metallic gold typography,
GOAT ROYALTY FORCE, premium boot screen, lens flare, depth, 4k --ar 16:9
Negative: messy text, low quality, jpeg artifacts
```

## 6. Animated Sequence Frames (for picture-to-video)
Generate these as a batch, then feed into your picture-to-video pipeline
(Stable Video Diffusion / Runway / Unreal) for a logo sting:
```
Frame A: gold goat emblem small, center, black void
Frame B: emblem larger, crosshair rings expanding, gold particles
Frame C: emblem full screen, "AGENT-007" text materializing, lens flare burst
Keep consistent: gold #D4A03C on black, cinematic, same emblem design
```

---

## Picture-to-Video Pipeline Notes
1. Generate a still with SD (above prompts)
2. Feed into **Stable Video Diffusion** (img2vid) locally, OR
3. Use **Unreal Engine + MetaHuman** for full 3D animated intros
4. Render with the Hollywood Camera System presets (DCI 4K / Dolby Vision)
5. Add the logo sting in Movie Studio timeline
