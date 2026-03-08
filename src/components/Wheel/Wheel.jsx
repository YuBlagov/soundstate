import StateCard from "../StateCard/StateCard";
import ActiveState from "../ActiveState/ActiveState.module";
import styles from './Wheel.module.css';

function Wheel({ states, activeId, onCardClick, rotation }) {
    const activeState = states.find(state => state.id === activeId);
    const getCardStyle = (index) => {
        const total = states.length;
        const angle = (index / total) * 360 + 90;
        const radius = 200;

        const x = Math.sin((angle * Math.PI) / 180) * radius;
        const y = -Math.cos((angle * Math.PI) / 180) * radius;

        return {
            transform: `translate(${x}px, ${y}px) rotate(${-rotation}deg)`,
            transition: 'all 0.6s cubic-bezier(0.34, 1.56, 0.64, 1)',
        }
    }

    return (
        <div 
            className={styles.wheel}
            style={{ transform: `rotate(${rotation}deg)` }}
        >
            {/* center - active state */}
            <div style={{ transform: `rotate(${rotation}deg)`, 
                position: 'absolute', 
                top: '50%',
                left: '50%',
                transform: `translate(-50%, -50%) rotate(${-rotation}deg)`,
                zIndex: 10 }}>
                <ActiveState activeState={activeState} />
            </div>
            {/* 6 cards around */}
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
        ))
    }
        </div >
    )
}

export default Wheel;
