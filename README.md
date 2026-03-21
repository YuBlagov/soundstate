# SOUNDSTATE

A generative ambient sound app built with React. Create, customize and mix sound states - each card generates a unique sound using the Web Audio API.

🔗 [Live Demo](https://soundstate.netlify.app)
🔗 [API](https://afisha-api.onrender.com/api/sounds)

## About

Soundstate lets you explore and mix ambient sound environments. Each sound state is fully customizable - adjust frequency, volume, tone and breathing to create your own unique sound.

Sound states are loaded from a custom REST API built with Node.js, Express and MongoDB.

## Features

- **Add, edit, delete** sound states
- **Real-time sound preview** when editing parameters
- **Pause/resume** by clicking the center
- **Particle visualizer** that reacts to sound
- **REST API** with loading and error states
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

- **Frequency** - pitch (40–400Hz)
- **Volume** - loudness (0–100%)
- **Tone** - brightness via lowpass filter (200–4000Hz)
- **Breathing** - LFO speed (0–2Hz)

## API

Sound states are loaded from [afisha-api](https://github.com/YuBlagov/afisha-api) - a custom REST API built with Node.js, Express and MongoDB Atlas.

## Tech Stack

- React + Vite
- Web Audio API - no external audio libraries
- Canvas API - particle visualizer
- CSS Modules

## Run Locally
```bash
npm install
npm run dev
```