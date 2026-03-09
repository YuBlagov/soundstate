import { use, useState } from 'react';
import { defaultStates } from './data/defaultStates';
import Wheel from './components/Wheel/Wheel';
import useAudioEngine from './hooks/useAudioEngine';
import styles from './App.module.css';

function App() {
  const [states, setStates] = useState(defaultStates);
  const [activeId, setActiveId] = useState(1);
  const [rotation, setRotation] = useState(0);

  const activeState = states.find(state => state.id === activeId);
  useAudioEngine(activeState);

  const handleCardClick = (id) => {
    const total = states.length;
    const index = states.findIndex((state) => state.id === id);
    const angle = -(index / total) * 360;
    setRotation(angle);
    setActiveId(id);
  };

  return (
    <div className="app">
      <h1>SOUNDSTATE</h1>
      <Wheel
        states={states}
        activeId={activeId}
        onCardClick={handleCardClick}
        rotation={rotation}
      />
    </div>
  )
}

export default App
