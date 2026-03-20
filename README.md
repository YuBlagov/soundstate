# SOUNDSTATE

A generative ambient sound app built with React. Create, customize and mix sound states — each card generates a unique sound using the Web Audio API.

🔗 [Live Demo](https://soundstate.netlify.app)

## About

Soundstate lets you explore and mix ambient sound environments. Each sound state is fully customizable — adjust frequency, volume, tone and breathing to create your own unique sound.

## Features

- **Add, edit, delete** sound states
- **Real-time sound preview** when editing parameters
- **Pause/resume** by clicking the center
- **Particle visualizer** that reacts to sound
- **Simulated API** with loading and error states
- Fully responsive — works on mobile

## Sound States

| State | Type | Description |
|-------|------|-------------|
| DRIFT | Drone | Slow ambient hum with LFO breathing |
| PULSE | Rhythm | Deep bass pulse with filter sweep |
| NOISE | Noise | Ocean-like filtered white noise |
| STILL | Pad | Soft harmonic pad with overtones |
| ECHO | Echo | Melodic tone with delay feedback |
| STATIC | Static | Vinyl crackle and quiet hiss |

## Sound Parameters

Each card is customizable:

- **Frequency** — pitch (40–400Hz)
- **Volume** — loudness (0–100%)
- **Tone** — brightness via lowpass filter (200–4000Hz)
- **Breathing** — LFO speed (0–2Hz)

## API

Sound states are loaded via `src/api/soundsApi.js` which simulates an async API request with loading and error states. The architecture mirrors a real REST API — replacing the simulated delay with `fetch()` would connect to a live backend.

## Tech Stack

- React + Vite
- Web Audio API — no external audio libraries
- Canvas API — particle visualizer
- CSS Modules

## Run Locally
```bash
npm install
npm run dev
```
