import styles from './ActiveState.module.css';

function ActiveState({ activeStates, isPlaying, onPause, isPaused }) {
    if (!activeStates || activeStates.length === 0) return null;

    const primaryState = activeStates[0];

    return (
        <div
            className={styles.container}
            style={{ '--active-color': primaryState.color }}
            onClick={onPause}
            role="button"
            aria-label={isPaused ? 'Resume sound' : 'Pause sound'}
            tabIndex={0}
            onKeyDown={e => {
                if (e.key === 'Enter' || e.key === ' ') onPause()
            }}
            >
            <div className={`${styles.ring} ${isPlaying ? styles.ringActive : ''}`} />
            <div className={styles.inner}>
                <span className={styles.name}>{primaryState.name}</span>
                <span className={styles.type}>{isPaused ? '⏸' : primaryState.sound.type}</span>
            </div>
        </div>
    );
}

export default ActiveState;
