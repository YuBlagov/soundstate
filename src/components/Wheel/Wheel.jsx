import StateCard from "../StateCard/StateCard";
import ActiveState from "../ActiveState/ActiveState";
import Visualizer from "../Visualizer/Visualizer";
import styles from "./Wheel.module.css";

// REVIEW: 9 props is a lot — consider grouping related props into objects (e.g., audioProps = { analyser, isPaused, onPause }) or using context to reduce prop drilling.
function Wheel({
  states,
  activeIds,
  onCardClick,
  rotation,
  onEdit,
  onDelete,
  analyser,
  isPaused,
  onPause,
}) {
  // REVIEW: activeStates is already computed in App.jsx and passed indirectly via other props. This duplicates the filtering logic — consider passing activeStates as a prop instead.
  const activeStates = states.filter((state) => activeIds.includes(state.id));
  const getCardStyle = (index) => {
    const total = states.length;
    const angle = (index / total) * 360 + 90;
    // REVIEW: window.innerWidth is read on every render but does not update on window resize. After resizing the browser, cards will be positioned at the wrong radius until a re-render is triggered. Use a resize event listener or a useMediaQuery hook.
    const radius = window.innerWidth < 600 ? 125 : 240;

    const x = Math.sin((angle * Math.PI) / 180) * radius;
    const y = -Math.cos((angle * Math.PI) / 180) * radius;

    return {
      transform: `translate(${x}px, ${y}px) rotate(${-rotation}deg)`,
      transition: "all 0.6s cubic-bezier(0.34, 1.56, 0.64, 1)",
    };
  };

  return (
    <div
      className={styles.wheel}
      style={{ transform: `rotate(${rotation}deg)` }}
    >
      {/* particles visualizer */}
      <div
        style={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: `translate(-50%, -50%) rotate(${-rotation}deg)`,
          zIndex: 5,
        }}
      >
        <Visualizer analyser={analyser} color={activeStates[0]?.color} />
      </div>

      {/* center - active state */}
      <div
        style={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: `translate(-50%, -50%) rotate(${-rotation}deg)`,
          zIndex: 10,
        }}
      >
        <ActiveState
          activeStates={activeStates}
          isPlaying={!!analyser?.current && !isPaused}
          onPause={onPause}
          isPaused={isPaused}
        />
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
            isActive={activeIds.includes(state.id)}
            onClick={onCardClick}
            onEdit={onEdit}
            onDelete={onDelete}
          />
        </div>
      ))}
    </div>
  );
}

export default Wheel;
