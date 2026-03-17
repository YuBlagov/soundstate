import styles from './ActiveState.module.css';

function ActiveState({ activeStates }) {
    if (!activeStates || activeStates.length === 0) return null;

    const primary = activeStates[0];
    const secondary = activeStates[1];

    return (
        <div
            className={styles.container}
            style={{ '--active-color': primary.color }}>
            <div className={styles.ring} />
            <div className={styles.inner}>
                <span className={styles.name}>
                    {secondary ? `${primary.name} + ${secondary.name}` : primary.name}
                </span>
                <span className={styles.type}>
                    {secondary ? `${primary.sound.type} + ${secondary.sound.type}` : primary.sound.type}
                </span>
            </div>
        </div>
    );
}

export default ActiveState;
