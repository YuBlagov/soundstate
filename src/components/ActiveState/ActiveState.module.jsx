import styles from './ActiveState.module.css';

function ActiveState({ activeState }) {
    if (!activeState) return null;

    return (
        <div
            className={styles.container}
            style={{ '--activecolor': activeState.color }}>
            <div className={styles.ring} />
            <div className={styles.inner}>
                <span className={styles.name}>{activeState.name}</span>
                <span className={styles.type}>{activeState.sound.type}</span>
            </div>
        </div>
    );
}

export default ActiveState;
