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
        const oscillator = ctx.createOscillator();
        const gainNode = ctx.createGain();

        oscillator.connect(gainNode);
        gainNode.connect(ctx.destination);

        oscillator.frequency.value = sound.frequency;
        oscillator.type = 'sine';
        gainNode.gain.value = 0.3;

        oscillator.start();
        nodesRef.current.push(oscillator);
    }

    const playRhythm = (ctx, sound) => {
        const oscillator = ctx.createOscillator();
        const gainNode = ctx.createGain();

        oscillator.connect(gainNode);
        gainNode.connect(ctx.destination);

        oscillator.frequency.value = sound.frequency;
        oscillator.type = 'square';
        gainNode.gain.value = 0;

        oscillator.start();

        // rhythm through gainNode
        const interval = setInterval(() => {
            const now = ctx.currentTime;
            gainNode.gain.setValueAtTime(0.3, now);
            gainNode.gain.setValueAtTime(0, now + 0.1);
        }, 1000 / sound.speed);

        //save oscillator and cleanup function
        nodesRef.current.push(oscillator);
        nodesRef.current.push(() => clearInterval(interval));

        return () => clearInterval(interval);
    }

    const playNoise = (ctx, sound) => {
        const bufferSize = ctx.sampleRate * 2;
        const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
        const data = buffer.getChannelData(0);

        for (let i = 0; i < bufferSize; i++) {
            data[i] = Math.random() * 2 - 1;
        }

        const source = ctx.createBufferSource();
        const filter = ctx.createBiquadFilter();
        const gainNode = ctx.createGain();

        source.buffer = buffer;
        source.loop = true;

        filter.type = 'lowpass';
        filter.frequency.value = sound.filterFreq;

        source.connect(filter);
        filter.connect(gainNode);
        gainNode.connect(ctx.destination);

        gainNode.gain.value = 0.3;
        source.start();

        nodesRef.current.push(source);
    }

    const playStill = (ctx, sound) => {
        const oscillator = ctx.createOscillator()
        const gainNode = ctx.createGain()

        oscillator.connect(gainNode)
        gainNode.connect(ctx.destination)

        oscillator.frequency.value = sound.frequency
        oscillator.type = 'sine'
        gainNode.gain.value = sound.volume

        oscillator.start()
        nodesRef.current.push(oscillator)
    }

    const playEcho = (ctx, sound) => {
        const oscillator = ctx.createOscillator()
        const gainNode = ctx.createGain()
        const delay = ctx.createDelay()
        const feedbackGain = ctx.createGain()

        delay.delayTime.value = sound.delayTime
        feedbackGain.gain.value = 0.4

        oscillator.connect(gainNode)
        gainNode.connect(delay)
        gainNode.connect(ctx.destination)
        delay.connect(feedbackGain)
        feedbackGain.connect(delay)
        feedbackGain.connect(ctx.destination)

        oscillator.frequency.value = sound.frequency
        oscillator.type = 'sine'
        gainNode.gain.value = 0.2

        oscillator.start()
        nodesRef.current.push(oscillator)
    }

    const playStatic = (ctx, sound) => {
        const bufferSize = ctx.sampleRate * 2
        const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate)
        const data = buffer.getChannelData(0)

        for (let i = 0; i < bufferSize; i++) {
            data[i] = (Math.random() * 2 - 1) * sound.intensity
        }

        const source = ctx.createBufferSource()
        const gainNode = ctx.createGain()

        source.buffer = buffer
        source.loop = true

        source.connect(gainNode)
        gainNode.connect(ctx.destination)

        gainNode.gain.value = 0.4
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