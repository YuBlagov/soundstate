import styles from './StateCard.module.css';

function StateCard({ state, isActive, onClick, onEdit, onDelete }) {
  return (
    <div
      className={`${styles.card} ${isActive ? styles.active : ''}`}
      onClick={() => onClick(state.id)}
      style={{ backgroundColor: state.color }}
    >
      <span className={styles.name}>{state.name}</span>

      {/* edit and delete buttons on hover */}
      <div className={styles.actions}>
        <button 
          className={styles.editBtn}
          onClick={event => {
            event.stopPropagation();
            onEdit(state);
          }}
          >✏️</button>
        <button 
          className={styles.deleteBtn}
          onClick={event => {
            event.stopPropagation();
            onDelete(state.id);
          }}
        >🗑️</button>
      </div>
    </div>
  );
}

export default StateCard;
