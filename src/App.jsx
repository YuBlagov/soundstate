import { useState } from 'react';
import { defaultStates } from './data/defaultStates';
import Wheel from './components/Wheel/Wheel';
import StateForm from './components/StateForm/StateForm';
import useAudioEngine from './hooks/useAudioEngine';
import styles from './App.module.css';

function App() {
  const [states, setStates] = useState(defaultStates);
  const [activeIds, setActiveIds] = useState([1]);
  const [rotation, setRotation] = useState(0);
  const [showForm, setShowForm] = useState(false);
  const [editState, setEditState] = useState(null);

  const activeStates = states.filter(state => activeIds.includes(state.id));
  const audioStates = (showForm || editState) ? [] : activeStates
  useAudioEngine(audioStates);

  const handleCardClick = (id) => {
    const index = states.findIndex(state => state.id === id);
    const angle = -(index / states.length) * 360;
    setRotation(angle);
    setActiveIds(prev => {
      if (prev.includes(id)) {
        if (prev.length === 1) return prev; // min 1 active state
        return prev.filter(i => i !== id);
      }
      // if 2 already active - replace oldest
      if (prev.length >= 2) {
        return [prev[1], id]
      }
      // add to active
      return [...prev, id];
    })
  };

  const handleAdd = (newStateData) => {
    const newState = {
      ...newStateData, // spread the new state data
      id: Date.now(), // unique id
    }
    setStates([...states, newState]);
    setActiveIds([newState.id]); // set new state as active
    setShowForm(false);
  }

  const handleEdit = (state) => {
    setEditState(state);
  }

  const handleDelete = (id) => {
    const newStates = states.filter(state => state.id !== id);
    setStates(newStates);

    //if deleted card was active - switch to the first card
    if (activeIds.includes(id)) {
      setActiveIds(newStates[0]?.id.filter(Boolean));
    }
  }

  const handleEditSubmit = (updatedData) => {
    setStates(states.map(state =>
      state.id === editState.id
        ? { ...state, ...updatedData, id: editState.id }
        : state
    ));
    setEditState(null);
  }

  return (
    <div className="app">
      <h1 className={styles.title}>SOUNDSTATE</h1>

      {/* show form button */}
      <button
        className={styles.addBtn}
        onClick={() => setShowForm(true)}
      > +
      </button>

      <Wheel
        states={states}
        activeIds={activeIds}
        onCardClick={handleCardClick}
        rotation={rotation}
        onEdit={handleEdit}
        onDelete={handleDelete}
      />

      {/* show form only when showForm = true */}
      {showForm && (
        <StateForm
          initialData={null}
          onCancel={() => setShowForm(false)}
          onSubmit={handleAdd}
        />
      )}

      {/* Edit Form */}
      {editState && (
        <StateForm
          initialData={editState}
          onCancel={() => setEditState(null)}
          onSubmit={handleEditSubmit}
        />
      )}
    </div>
  )
}

export default App
