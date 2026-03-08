import StateCard from "../StateCard/StateCard";
import styles from './Wheel.module.css';

function Wheel({ states, activeId, onCardClick, rotation }) {
    const getCardStyle = (index) => {
        const total = states.length;
        const angle = (index / total) * 360;
        const radius = 200;

        const x = Math.sin((angle * Math.PI) / 180) * radius;
        const y = -Math.cos((angle * Math.PI) / 180) * radius;

        return {
            transform: `translate(${x}px, ${y}px) rotate(${-rotation}deg)`,
        }
    }

    return (
        <div className={styles.wheel}
            style={{ transform: `rotate(${rotation}deg)` }}
        >
            <div className={styles.center}
            style={{ transform: `rotate(${-rotation}deg)` }}
            >
                <span className={styles.activeName}>
                    {states.find((state) => state.id === activeId)?.name}
                </span>
            </div>
            {states.map((state, index) => (
                <div
                    key={state.id}
                    className={styles.cardWrapper}
                    style={getCardStyle(index)}
                >
                    <StateCard
                        state={state}
                        isActive={state.id === activeId}
                        onClick={onCardClick}
                    />
                </div>
            ))}
        </div>
    )
}

export default Wheel;
