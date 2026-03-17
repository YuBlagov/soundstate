import { useRef, useEffect } from 'react';

function useAudioEngine(activeStates) {
    const audioCtxRef = useRef(null);
    const nodesRef = useRef([]);

    const stopAll = () => {
        nodesRef.current.forEach(node => {
            try {
                if (typeof node === 'function') {
                    node() // cleanup interval
                } else {
                    node.stop()
                }
            } catch (error) {
                console.error(error)
            }
        })
        nodesRef.current = [];
    }

    const getAudioContext = () => {
        if (!audioCtxRef.current) {
            audioCtxRef.current = new AudioContext();
        }
        return audioCtxRef.current;
    }

    const playDrone = (ctx, sound) => {
        const filter = ctx.createBiquadFilter();
        // main oscillator
        const oscillator1 = ctx.createOscillator();
        const gainNode1 = ctx.createGain();
        oscillator1.frequency.value = sound.frequency || 60;
        oscillator1.type = 'sine';
        gainNode1.gain.value = sound.volume || 0.3;
        oscillator1.connect(gainNode1);
        //gainNode1.connect(ctx.destination);
        //oscillator1.start();

        // harmonic - octave above, quieter
        const oscillator2 = ctx.createOscillator();
        const gainNode2 = ctx.createGain();
        oscillator2.frequency.value = (sound.frequency || 60) * 1.5;
        oscillator2.type = 'sine';
        gainNode2.gain.value = (sound.volume || 0.3) * 0.3;
        oscillator2.connect(gainNode2);
        //gainNode2.connect(ctx.destination);
        //oscillator2.start();

        // LFO - slowly changes volume (breathing effect)
        const lfo = ctx.createOscillator();
        const lfoGain = ctx.createGain();
        lfo.frequency.value = sound.lfoSpeed || 0.1;
        lfoGain.gain.value = 0.15;
        lfo.connect(lfoGain);
        lfoGain.connect(gainNode1.gain);
        lfo.start();

        // universal filter
        filter.type = 'lowpass';
        filter.frequency.value = sound.filterFreq || 800;
        gainNode1.connect(filter);
        gainNode2.connect(filter);
        filter.connect(ctx.destination);

        oscillator1.start();
        oscillator2.start();

        nodesRef.current.push(oscillator1, oscillator2, lfo);
    }

    const playRhythm = (ctx, sound) => {
        const osc = ctx.createOscillator()
        const gainNode = ctx.createGain()
        const filter = ctx.createBiquadFilter()
        const lfo = ctx.createOscillator()
        const lfoGain = ctx.createGain()

        // warm bass tone
        osc.type = 'sine'
        osc.frequency.value = (sound.frequency || 120) * 0.5 // lower octave
        gainNode.gain.value = 0

        // lowpass for warmth
        filter.type = 'lowpass'
        filter.frequency.value = sound.filterFreq || 300

        // lfo modulates filter frequency — breathing effect on rhythm
        lfo.frequency.value = sound.lfoSpeed || 0.5
        lfoGain.gain.value = 200
        lfo.connect(lfoGain)
        lfoGain.connect(filter.frequency)

        osc.connect(filter)
        filter.connect(gainNode)
        gainNode.connect(ctx.destination)
        osc.start()
        lfo.start()

        const interval = setInterval(() => {
            const now = ctx.currentTime
            gainNode.gain.cancelScheduledValues(now)
            gainNode.gain.setValueAtTime(0, now)
            gainNode.gain.linearRampToValueAtTime(sound.volume || 0.4, now + 0.05)
            gainNode.gain.linearRampToValueAtTime(0, now + 0.4)
        }, 1000 / (sound.speed || 1.2))

        nodesRef.current.push(osc, lfo)
        nodesRef.current.push(() => clearInterval(interval))
    }

    const playNoise = (ctx, sound) => {
        const bufferSize = ctx.sampleRate * 2
        const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate)
        const data = buffer.getChannelData(0)

        for (let i = 0; i < bufferSize; i++) {
            data[i] = Math.random() * 2 - 1
        }

        const source = ctx.createBufferSource()
        const lowpass = ctx.createBiquadFilter()
        const highpass = ctx.createBiquadFilter()
        const gainNode = ctx.createGain()

        // lowpass removes harsh high frequencies
        lowpass.type = 'lowpass'
        lowpass.frequency.value = sound.filterFreq || 400

        // highpass removes low rumble
        highpass.type = 'highpass'
        highpass.frequency.value = 100

        source.buffer = buffer
        source.loop = true

        source.connect(highpass)
        highpass.connect(lowpass)
        lowpass.connect(gainNode)
        gainNode.connect(ctx.destination)

        gainNode.gain.value = sound.volume || 0.2
        source.start()

        nodesRef.current.push(source)
    }

    const playStill = (ctx, sound) => {
        // soft pad — three harmonics
        const frequencies = [
            sound.frequency || 40,
            (sound.frequency || 40) * 2,
            (sound.frequency || 40) * 3
        ]

        const filter = ctx.createBiquadFilter()
        const masterGain = ctx.createGain()
        const lfo = ctx.createOscillator()
        const lfoGain = ctx.createGain()

        filter.type = 'lowpass'
        filter.frequency.value = sound.filterFreq || 800
        filter.connect(masterGain)
        masterGain.connect(ctx.destination)

        // lfo breathes the volume
        lfo.frequency.value = sound.lfoSpeed || 0.3
        lfoGain.gain.value = 0.1
        lfo.connect(lfoGain)
        lfoGain.connect(masterGain.gain)
        lfo.start()

        frequencies.forEach((freq, i) => {
            const osc = ctx.createOscillator()
            const gain = ctx.createGain()

            osc.type = 'sine'
            osc.frequency.value = freq
            gain.gain.value = (sound.volume || 0.15) / (i + 1) // each harmonic quieter

            osc.connect(gain)
            gain.connect(filter)
            osc.start()

            nodesRef.current.push(osc)
        })
        nodesRef.current.push(lfo)
    }

    const playEcho = (ctx, sound) => {
        // main oscillator
        const oscillator = ctx.createOscillator()
        const gainNode = ctx.createGain()

        // delay chain
        const delay = ctx.createDelay()
        const feedbackGain = ctx.createGain()
        const filterNode = ctx.createBiquadFilter()

        oscillator.frequency.value = sound.frequency || 200
        oscillator.type = 'sine'
        gainNode.gain.value = sound.volume || 0.25

        delay.delayTime.value = sound.delayTime || 0.6
        feedbackGain.gain.value = 0.8

        // filter makes echo darker each repeat
        filterNode.type = 'lowpass'
        filterNode.frequency.value = sound.filterFreq || 1200

        // signal chain 
        oscillator.connect(gainNode)
        gainNode.connect(delay)
        gainNode.connect(ctx.destination)
        delay.connect(filterNode)
        filterNode.connect(feedbackGain)
        feedbackGain.connect(delay)
        feedbackGain.connect(ctx.destination)

        oscillator.start()
        nodesRef.current.push(oscillator)
        // disconnect all nodes on stop
        nodesRef.current.push(() => {
            gainNode.disconnect()
            delay.disconnect()
            feedbackGain.disconnect()
            filterNode.disconnect()
        })

    }

    const playStatic = (ctx, sound) => {
        const bufferSize = ctx.sampleRate * 2
        const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate)
        const data = buffer.getChannelData(0)

        // vinyl crackle — rare clicks in silence
        for (let i = 0; i < bufferSize; i++) {
            if (Math.random() < 0.001) {
                data[i] = (Math.random() * 2 - 1) * (sound.intensity || 0.3)
            } else {
                data[i] = (Math.random() * 2 - 1) * 0.003 // very quiet hiss
            }
        }

        const source = ctx.createBufferSource()
        const gainNode = ctx.createGain()
        const filter = ctx.createBiquadFilter()

        filter.type = 'bandpass'
        filter.frequency.value = sound.filterFreq || 3000
        filter.Q.value = 0.5

        source.buffer = buffer
        source.loop = true

        source.connect(filter)
        filter.connect(gainNode)
        gainNode.connect(ctx.destination)

        gainNode.gain.value = sound.volume || 0.3
        source.start()

        nodesRef.current.push(source)
    }

    useEffect(() => {
        if (!activeStates || activeStates.length === 0) {
            stopAll();
            return;
        }
        stopAll();
        const ctx = getAudioContext();
        ctx.resume();

        //play each active state
        activeStates.forEach(state => {
            switch (state.sound.type) {
                case 'drone':
                    playDrone(ctx, state.sound);
                    break;
                case 'rhythm':
                    playRhythm(ctx, state.sound);
                    break;
                case 'noise':
                    playNoise(ctx, state.sound);
                    break;
                case 'silence':
                    playStill(ctx, state.sound);
                    break;
                case 'echo':
                    playEcho(ctx, state.sound);
                    break;
                case 'static':
                    playStatic(ctx, state.sound);
                    break;
            }
        })
        return () => stopAll()
    }, [activeStates])

}

export default useAudioEngine;