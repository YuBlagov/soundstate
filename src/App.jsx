import { useState, useEffect } from 'react';
import { fetchSoundStates } from './api/soundsApi';
import Wheel from './components/Wheel/Wheel';
import StateForm from './components/StateForm/StateForm';
import useAudioEngine from './hooks/useAudioEngine';
import styles from './App.module.css';

function App() {
  const [states, setStates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeIds, setActiveIds] = useState([]);
  const [rotation, setRotation] = useState(0);
  const [showForm, setShowForm] = useState(false);
  const [editState, setEditState] = useState(null);

  useEffect(() => {
    const loadStates = async () => {
      try {
        const data = await fetchSoundStates()
        setStates(data)
        setActiveIds([data[0].id])
        setLoading(false)
      } catch (err) {
        setError(err.message)
        setLoading(false)
      }
    }
    loadStates()
  }, [])
  const activeStates = states.filter(state => activeIds.includes(state.id))
  const audioState = (showForm || editState) ? null : activeStates[0]

  const analyser = useAudioEngine(audioState);

  const handleCardClick = (id) => {
    const total = states.length;
    const index = states.findIndex((state) => state.id === id);
    const angle = -(index / total) * 360;
    setRotation(angle);
    setActiveIds([id]);
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

  if (loading) return (
    <div className="app">
      <h1 className={styles.title}>SOUNDSTATE</h1>
      <p className={styles.loading}>Loading sound states...</p>
    </div>
  )

  if (error) return (
    <div className="app" role="alert">
      <h1 className={styles.title}>SOUNDSTATE</h1>
      <p className={styles.error}>Failed to load: {error}</p>
      <button className={styles.retryBtn} onClick={() => window.location.reload()}>Retry</button>
    </div>
  )
  
  return (
    <div className="app">
      <h1 className={styles.title}>SOUNDSTATE</h1>

      {/* show form button */}
      <button
        className={styles.addBtn}
        onClick={() => setShowForm(true)}
        aria-label="Add new sound state"
      > +
      </button>

      <Wheel
        states={states}
        activeIds={activeIds}
        onCardClick={handleCardClick}
        rotation={rotation}
        onEdit={handleEdit}
        onDelete={handleDelete}
        analyser={analyser}
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
