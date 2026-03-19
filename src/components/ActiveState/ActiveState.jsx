import styles from './ActiveState.module.css';

function ActiveState({ activeStates }) {
    if (!activeStates || activeStates.length === 0) return null;

    const primaryState = activeStates[0];

    return (
        <div
            className={styles.container}
            style={{ '--active-color': primaryState.color }}>
            <div className={styles.ring} />
            <div className={styles.inner}>
                <span className={styles.name}>{primaryState.name}</span>
                <span className={styles.type}>{primaryState.sound.type}</span>
            </div>
        </div>
    );
}

export default ActiveState;
