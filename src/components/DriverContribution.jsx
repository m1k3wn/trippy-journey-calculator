import React from "react";

export default function DriverContribution({
  driverContributes,
  driverContributionPercentage,
  onChange,
  passengers,
}) {
  const handleToggleChange = (e) => {
    onChange({
      target: {
        name: "driverContributes",
        type: "checkbox",
        checked: e.target.checked,
      },
    });
  };

  const handleSliderChange = (e) => {
    onChange({
      target: {
        name: "driverContributionPercentage",
        value: e.target.value,
      },
    });
  };

  // Disable controls if there are no passengers
  const isDisabled = passengers <= 0;

  return (
    <div className="driver-contribution">
      <div className="toggle-container">
        <label className="toggle-label">
          <input
            type="checkbox"
            checked={driverContributes}
            onChange={handleToggleChange}
            disabled={isDisabled}
          />
          <span className="toggle-text">Driver contributes to costs</span>
        </label>
      </div>

      {driverContributes && !isDisabled && (
        <div className="slider-container">
          <input
            type="range"
            min="1"
            max="100"
            value={driverContributionPercentage}
            onChange={handleSliderChange}
            className="percentage-slider"
          />
          <span className="percentage-display">
            {driverContributionPercentage}%
          </span>
        </div>
      )}

      {isDisabled && (
        <p className="contribution-note">
          Add passengers to enable cost sharing
        </p>
      )}
    </div>
  );
}
