// simulate API response delay
const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms))

export const fetchSoundStates = async () => {
    await delay(1000)  // simulate network request

    //simulate network error
    //throw new Error('Network error')

    // simulate API response
    return [
        {
            id: 1,
            name: 'DRIFT',
            color: '#7C9EB2',
            sound: {
                type: 'drone',
                frequency: 50,
                lfoSpeed: 0.1,
                volume: 0.3,
                filterFreq: 400,
                lfoSpeed: 0.1,
            }
        },
        {
            id: 2,
            name: 'PULSE',
            color: '#E8865A',
            sound: {
                type: 'rhythm',
                frequency: 100,
                lfoSpeed: 0.5,
                filterFreq: 300,
                volume: 0.4,
                speed: 1.2,
            }
        },
        {
            id: 3,
            name: 'NOISE',
            color: '#A8B5A2',
            sound: {
                type: 'noise',
                frequency: 200,
                filterFreq: 350,
                volume: 0.1
            }
        },
        {
            id: 4,
            name: 'STILL',
            color: '#C4B8D4',
            sound: {
                type: 'silence',
                frequency: 60,
                volume: 0.15,
                filterFreq: 800,
                lfoSpeed: 0.3
            }
        },
        {
            id: 5,
            name: 'ECHO',
            color: '#89B4A8',
            sound: {
                type: 'echo',
                frequency: 150,
                volume: 0.2,
                filterFreq: 800,
                delayTime: 0.6
            }
        },
        {
            id: 6,
            name: 'STATIC',
            color: '#8B8B8B',
            sound: {
                type: 'static',
                intensity: 0.3,
                volume: 0.3,
                filterFreq: 3000
            }
        },
    ]
}
