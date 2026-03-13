import { useState } from 'react';
import { defaultStates } from './data/defaultStates';
import Wheel from './components/Wheel/Wheel';
import StateForm from './components/StateForm/StateForm';
import useAudioEngine from './hooks/useAudioEngine';
import styles from './App.module.css';

function App() {
  const [states, setStates] = useState(defaultStates);
  const [activeId, setActiveId] = useState(1);
  const [rotation, setRotation] = useState(0);
  const [showForm, setShowForm] = useState(false); 
  const [editState, setEditState] = useState(null);

  const activeState = states.find(state => state.id === activeId);
  const audioState = (showForm || editState) ? null : activeState;
  useAudioEngine(audioState);

  const handleCardClick = (id) => {
    const total = states.length;
    const index = states.findIndex((state) => state.id === id);
    const angle = -(index / total) * 360;
    setRotation(angle);
    setActiveId(id);
  };

  const handleAdd = (newStateData) => {
    const newState = {
      ...newStateData, // spread the new state data
      id: Date.now(), // unique id
    }
    setStates([...states, newState]); 
    setShowForm(false);
  }

  const handleEdit = (state) => {
    setEditState(state);
  }

  const handleDelete = (id) => {
    setStates(states.filter(state => state.id !== id));
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
        activeId={activeId}
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
