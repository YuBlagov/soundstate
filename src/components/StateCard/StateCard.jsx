import styles from './StateCard.module.css';

function StateCard({ state, isActive, onClick }) {
  return (
    <div
      className={`${styles.card} ${isActive ? styles.active : ''}`}
      onClick={() => onClick(state.id)}
      style={{ backgroundColor: state.color }}
    >
      <span className={styles.name}>{state.name}</span>
    </div>
  );
}

export default StateCard;
