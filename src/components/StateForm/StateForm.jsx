import { useState } from 'react';
import styles from './StateForm.module.css';

function StateForm({ onSubmit, onCancel, initialData }) {
    const [name, setName] = useState(initialData?.name || '');
    const [color, setColor] = useState(initialData?.color || '#7C9EB2');
    const [soundType, setSoundType] = useState(initialData?.sound.type || 'drone');

    const handleSubmit = () => {
        // basic validation
        if (!name.trim()) {
            return;
        }
        onSubmit({
            name: name.toUpperCase(),
            color,
            sound: { type: soundType }
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