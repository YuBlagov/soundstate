# SOUNDSTATE

A generative audio app built with React. Create and mix ambient sound states — each card generates a unique sound using the Web Audio API.

🔗 [Live Demo](https://soundstate.netlify.app)

## Sound States

| State | Type | Description |
|-------|------|-------------|
| DRIFT | Drone | Slow ambient hum with breathing LFO |
| PULSE | Rhythm | Deep bass pulse with filter sweep |
| NOISE | Noise | Ocean-like filtered white noise |
| STILL | Pad | Soft harmonic pad with three overtones |
| ECHO | Echo | Melodic tone with delay feedback loop |
| STATIC | Static | Vinyl crackle and quiet hiss |

## Sound Parameters

Each card can be customized with:

- **Frequency** — pitch of the tone (40–400Hz)
- **Volume** — loudness (0–100%)
- **Tone** — brightness via lowpass filter (200–4000Hz)
- **Breathing** — LFO speed, modulates volume or filter (0–2Hz)

## Features

- Add, edit, and delete sound states
- Real-time sound preview when editing parameters
- Rotating wheel UI with smooth animations
- Fully responsive — works on mobile

## Built With

- React + Vite
- Web Audio API — no external audio libraries
- CSS Modules

## Run Locally
```bash
npm install
npm run dev
```
