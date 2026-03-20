import styles from './StateCard.module.css';

function StateCard({ state, isActive, onClick, onEdit, onDelete }) {
  return (
    <div
      className={`${styles.card} ${isActive ? styles.active : ''}`}
      onClick={() => onClick(state.id)}
      style={{
        backgroundColor: state.color,
        '--card-color': state.color
      }}
      role="button"
      tabIndex={0}
      aria-label={`${state.name} sound state${isActive ? ', active' : ''}`}
      aria-pressed={isActive}
      onKeyDown={e => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault()
          onClick(state.id)
        }
      }}

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
          aria-label={`Edit ${state.name}`}
        >✏️</button>
        <button
          className={styles.deleteBtn}
          onClick={event => {
            event.stopPropagation();
            onDelete(state.id);
          }}
          aria-label={`Delete ${state.name}`}
        >🗑️</button>
      </div>
    </div>
  );
}

export default StateCard;
