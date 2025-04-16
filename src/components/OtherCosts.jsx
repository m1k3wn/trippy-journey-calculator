import React from "react";

export default function OtherCosts({
  currentOtherCost,
  setCurrentOtherCost,
  addOtherCost,
  removeOtherCost,
  otherCosts,
}) {
  return (
    <>
      <div className="form-group-other-costs-section">
        <h3>Other Costs</h3>
        <div className="other-costs-inputs">
          <input
            type="text"
            placeholder="Description (e.g., Parking, Tolls)"
            value={currentOtherCost.description}
            onChange={(e) =>
              setCurrentOtherCost({
                ...currentOtherCost,
                description: e.target.value,
              })
            }
          />
          <input
            type="number"
            placeholder="Amount (£)"
            value={currentOtherCost.amount}
            onChange={(e) =>
              setCurrentOtherCost({
                ...currentOtherCost,
                amount: e.target.value,
              })
            }
          />
          <button
            type="button"
            onClick={addOtherCost}
            disabled={!currentOtherCost.description || !currentOtherCost.amount}
          >
            Add Cost
          </button>
        </div>
      </div>

      {otherCosts.length > 0 && (
        <div className="costs-summary">
          <h4>Added Costs:</h4>
          <ul className="other-costs-list">
            {otherCosts.map((cost, index) => (
              <li key={index}>
                <span className="cost-description">{cost.description}</span>
                <span className="cost-amount">£{cost.amount}</span>
                <button type="button" onClick={() => removeOtherCost(index)}>
                  ✕
                </button>
              </li>
            ))}
          </ul>
        </div>
      )}
    </>
  );
}
