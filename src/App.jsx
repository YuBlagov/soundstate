import { useState } from 'react';
import { defaultStates } from './data/defaultStates';
import StateCard from './components/StateCard/StateCard';
import styles from './App.module.css';

function App() {
  const [states, setStates] = useState(defaultStates);
  const [activeId, setActiveId] = useState(1);

  const handleCardClick = (id) => {
    setActiveId(id);
  };

  return (
    <>
      <div>
          <h1>SoundState</h1>
          <div className={styles.cardContainer}>
            {states.map((state) => (
              <StateCard
                key={state.id}
                state={state}
                isActive={state.id === activeId}
                onClick={handleCardClick}
              />
            ))}
          </div>
      </div>
    </>
  )
}

export default App
