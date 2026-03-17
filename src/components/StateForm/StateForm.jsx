import { useState } from 'react';
import useAudioEngine from '../../hooks/useAudioEngine';
import styles from './StateForm.module.css';

function StateForm({ onSubmit, onCancel, initialData }) {
    const [name, setName] = useState(initialData?.name || '');
    const [color, setColor] = useState(initialData?.color || '#7C9EB2');
    const [soundType, setSoundType] = useState(initialData?.sound.type || 'drone');
    const [frequency, setFrequency] = useState(initialData?.sound.frequency || 80);
    const [volume, setVolume] = useState(initialData?.sound.volume || 0.3);
    const [filterFrequency, setFilterFrequency] = useState(initialData?.sound.filterFreq || 800);
    const [lfoSpeed, setLfoSpeed] = useState(initialData?.sound.lfoSpeed || 0.5);
    const previewState = {
        id: 'preview', 
        name: name,
        color: color,
        sound: {
            type: soundType,
            frequency,
            volume,
            filterFreq: filterFrequency,
            lfoSpeed
        }
    }
    useAudioEngine([previewState]);

    const handleSubmit = () => {
        // basic validation
        if (!name.trim()) {
            return;
        }
        onSubmit({
            name: name.toUpperCase(),
            color,
            sound: {
                type: soundType,
                frequency,
                volume,
                filterFreq: filterFrequency,
                lfoSpeed
            }
        });
    }
    return (
        <div className={styles.overlay}>
            <div className={styles.form}>
                <h2 className={styles.title}>
                    {initialData ? 'Edit State' : 'New State'}
                </h2>

                {/* name input */}
                <div className={styles.field}>
                    <label className={styles.label}>Name</label>
                    <input
                        className={styles.input}
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder="DREAM"
                        maxLength={8}
                    />
                </div>

                {/* color picker */}
                <div className={styles.field}>
                    <label className={styles.label}>Color</label>
                    <input
                        type="color"
                        className={styles.colorPicker}
                        value={color}
                        onChange={(e) => setColor(e.target.value)}
                    />
                </div>

                {/* sound type */}
                <div className={styles.field}>
                    <label className={styles.label}>Sound Type</label>
                    <select
                        className={styles.select}
                        value={soundType}
                        onChange={(e) => setSoundType(e.target.value)}
                    >
                        <option value="drone">Drone — slow hum</option>
                        <option value="rhythm">Rhythm — pulse beat</option>
                        <option value="noise">Noise — ocean waves</option>
                        <option value="silence">Silence — almost nothing</option>
                        <option value="echo">Echo — repeating tone</option>
                        <option value="static">Static — interference</option>
                    </select>
                </div>

                {/* frequency */}
                <div className={styles.field}>
                    <label className={styles.label}>Frequency - {frequency} Hz</label>
                    <input
                        type="range"
                        className={styles.slider}
                        value={frequency}
                        onChange={(e) => setFrequency(Number(e.target.value))}
                        min={40}
                        max={400}
                    />
                </div>

                {/* volume */}
                <div className={styles.field}>
                    <label className={styles.label}>Volume - {Math.round(volume * 100)}%</label>
                    <input
                        type="range"
                        className={styles.slider}
                        value={volume}
                        onChange={(e) => setVolume(Number(e.target.value))}
                        min={0}
                        max={1}
                        step={0.01}
                    />
                </div>

                {/* filter */}
                <div className={styles.field}>
                    <label className={styles.label}>Tone - {filterFrequency} Hz</label>
                    <input
                        type="range"
                        className={styles.slider}
                        value={filterFrequency}
                        onChange={(e) => setFilterFrequency(Number(e.target.value))}
                        min={200}
                        max={4000}
                    />
                </div>

                {/* lfo */}
                <div className={styles.field}>
                    <label className={styles.label}>Breathing - {lfoSpeed}</label>
                    <input
                        type="range"
                        className={styles.slider}
                        value={lfoSpeed}
                        onChange={(e) => setLfoSpeed(Number(e.target.value))}
                        min={0}
                        max={2}
                        step={0.1}
                    />
                </div>

                {/* actions */}
                <div className={styles.actions}>
                    <button className={styles.cancelBtn} onClick={onCancel}>
                        Cancel
                    </button>
                    <button className={styles.submitBtn} onClick={handleSubmit}>
                        {initialData ? 'Save' : 'Add'}
                    </button>
                </div>
            </div>
        </div>
    )
}

export default StateForm;