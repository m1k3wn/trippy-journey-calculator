import React from "react";

export default function PassengerCounter({ value, onChange }) {
  const increment = () => {
    onChange({ target: { name: "passengers", value: Number(value) + 1 } });
  };

  const decrement = () => {
    if (Number(value) > 0) {
      onChange({ target: { name: "passengers", value: Number(value) - 1 } });
    }
  };

  return (
    <div className="passenger-counter">
      <button
        type="button"
        onClick={decrement}
        className="counter-btn"
        disabled={Number(value) <= 0}
      >
        -
      </button>
      <span className="counter-value">{value}</span>
      <button type="button" onClick={increment} className="counter-btn">
        +
      </button>
    </div>
  );
}
