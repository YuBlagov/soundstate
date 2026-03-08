export const defaultStates = [
    {
    id: 1,
    name: 'DRIFT',
    color: '#7C9EB2',
    sound: {
      type: 'drone',
      frequency: 60,
      lfoSpeed: 0.1,
      reverb: 0.8,
    }
  },
  {
    id: 2,
    name: 'PULSE',
    color: '#E8865A',
    sound: {
      type: 'rhythm',
      frequency: 120,
      speed: 1.2,
      reverb: 0.3,
    }
  },
  {
    id: 3,
    name: 'NOISE',
    color: '#A8B5A2',
    sound: {
      type: 'noise',
      filterFreq: 800,
      reverb: 0.5,
    }
  },
  {
    id: 4,
    name: 'STILL',
    color: '#C4B8D4',
    sound: {
      type: 'silence',
      frequency: 40,
      volume: 0.05,
      reverb: 0.9,
    }
  },
  {
    id: 5,
    name: 'ECHO',
    color: '#89B4A8',
    sound: {
      type: 'echo',
      frequency: 200,
      delayTime: 0.6,
      reverb: 0.7,
    }
  },
  {
    id: 6,
    name: 'STATIC',
    color: '#8B8B8B',
    sound: {
      type: 'static',
      intensity: 0.6,
      reverb: 0.2,
    }
  },
]