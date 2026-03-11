import { useRef, useEffect } from 'react';

function useAudioEngine(activeState) {
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
        // main oscillator
        const oscillator1 = ctx.createOscillator();
        const gainNode1 = ctx.createGain();
        oscillator1.frequency.value = sound.frequency;
        oscillator1.type = 'sine';
        gainNode1.gain.value = 0.3;
        oscillator1.connect(gainNode1);
        gainNode1.connect(ctx.destination);
        oscillator1.start();

        // harmonic - octave above, quieter
        const oscillator2 = ctx.createOscillator();
        const gainNode2 = ctx.createGain();
        oscillator2.frequency.value = sound.frequency * 1.5;
        oscillator2.type = 'sine';
        gainNode2.gain.value = 0.1;
        oscillator2.connect(gainNode2);
        gainNode2.connect(ctx.destination);
        oscillator2.start();

        // LFO - slowly changes volume (breathing effect)
        const lfo = ctx.createOscillator();
        const lfoGain = ctx.createGain();
        lfo.frequency.value = sound.lfoSpeed;
        lfoGain.gain.value = 0.15;
        lfo.connect(lfoGain);
        lfoGain.connect(gainNode1.gain);
        lfo.start();

        nodesRef.current.push(oscillator1, oscillator2, lfo);
    }

    const playRhythm = (ctx, sound) => {
        const osc = ctx.createOscillator()
        const gainNode = ctx.createGain()
        const filter = ctx.createBiquadFilter()

        // warm bass tone
        osc.type = 'sine'
        osc.frequency.value = sound.frequency * 0.5 // lower octave
        gainNode.gain.value = 0

        // lowpass for warmth
        filter.type = 'lowpass'
        filter.frequency.value = 300

        osc.connect(filter)
        filter.connect(gainNode)
        gainNode.connect(ctx.destination)
        osc.start()

        const interval = setInterval(() => {
            const now = ctx.currentTime
            gainNode.gain.cancelScheduledValues(now)
            gainNode.gain.setValueAtTime(0, now)
            gainNode.gain.linearRampToValueAtTime(0.4, now + 0.05)
            gainNode.gain.linearRampToValueAtTime(0, now + 0.4)
        }, 1000 / sound.speed)

        nodesRef.current.push(osc)
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
        lowpass.frequency.value = 400

        // highpass removes low rumble
        highpass.type = 'highpass'
        highpass.frequency.value = 100

        source.buffer = buffer
        source.loop = true

        source.connect(highpass)
        highpass.connect(lowpass)
        lowpass.connect(gainNode)
        gainNode.connect(ctx.destination)

        gainNode.gain.value = 0.2
        source.start()

        nodesRef.current.push(source)
    }

    const playStill = (ctx, sound) => {
        // soft pad — three harmonics
        const frequencies = [sound.frequency, sound.frequency * 2, sound.frequency * 3]

        frequencies.forEach((freq, i) => {
            const osc = ctx.createOscillator()
            const gain = ctx.createGain()

            osc.type = 'sine'
            osc.frequency.value = freq
            gain.gain.value = 0.15 / (i + 1) // each harmonic quieter

            osc.connect(gain)
            gain.connect(ctx.destination)
            osc.start()

            nodesRef.current.push(osc)
        })
    }

    const playEcho = (ctx, sound) => {
        // main oscillator
        const oscillator = ctx.createOscillator()
        const gainNode = ctx.createGain()

        // delay chain
        const delay = ctx.createDelay()
        const feedbackGain = ctx.createGain()
        const filterNode = ctx.createBiquadFilter()

        oscillator.frequency.value = sound.frequency
        oscillator.type = 'sine'
        gainNode.gain.value = 0.25

        delay.delayTime.value = sound.delayTime
        feedbackGain.gain.value = 0.8

        // filter makes echo darker each repeat
        filterNode.type = 'lowpass'
        filterNode.frequency.value = 1200

        // signal chain 
        oscillator.connect(gainNode)
        gainNode.connect(delay)
        gainNode.connect(ctx.destination)
        delay.connect(feedbackGain)
        feedbackGain.connect(delay)
        feedbackGain.connect(ctx.destination)

        oscillator.start()
        nodesRef.current.push(oscillator)
        // disconnect all nodes on stop
        nodesRef.current.push(() => {
            oscillator.stop()
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
                data[i] = (Math.random() * 2 - 1) * sound.intensity
            } else {
                data[i] = (Math.random() * 2 - 1) * 0.003 // very quiet hiss
            }
        }

        const source = ctx.createBufferSource()
        const gainNode = ctx.createGain()
        const filter = ctx.createBiquadFilter()

        filter.type = 'bandpass'
        filter.frequency.value = 3000
        filter.Q.value = 0.5

        source.buffer = buffer
        source.loop = true

        source.connect(filter)
        filter.connect(gainNode)
        gainNode.connect(ctx.destination)

        gainNode.gain.value = 0.3
        source.start()

        nodesRef.current.push(source)
    }

    useEffect(() => {
        if (!activeState) return
        stopAll();
        const ctx = getAudioContext();
        ctx.resume();

        switch (activeState.sound.type) {
            case 'drone':
                playDrone(ctx, activeState.sound);
                break;
            case 'rhythm':
                playRhythm(ctx, activeState.sound);
                break;
            case 'noise':
                playNoise(ctx, activeState.sound);
                break;
            case 'silence':
                playStill(ctx, activeState.sound);
                break;
            case 'echo':
                playEcho(ctx, activeState.sound);
                break;
            case 'static':
                playStatic(ctx, activeState.sound);
                break;
        }

        return () =>
            stopAll();
    }, [activeState])
}

export default useAudioEngine;