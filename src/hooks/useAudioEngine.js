import { useRef, useEffect } from 'react';

function useAudioEngine(activeState) {
    const audioCtxRef = useRef(null);
    const nodesRef = useRef([]);

    const stopAll = () => {
        nodesRef.current.forEach(node => {
            try { node.stop() } catch (error) { console.error(error) }
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

    useEffect(() => {
        if (!activeState) return 
        stopAll();
        const ctx = getAudioContext();

        switch (activeState.sound.type) {
            case 'drone':
                playDrone(ctx, activeState.sound);
                break;
    }

    return () => 
        stopAll();
    }, [activeState])
}

export default useAudioEngine;