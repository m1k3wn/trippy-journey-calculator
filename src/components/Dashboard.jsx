import "../styles/Dashboard.css";

export default function Dashboard({
  journeyName,
  fuelCost,
  mpg,
  distance,
  passengers,
  driverContributes,
  driverContributionPercentage,
  otherCosts,
  driverName = "?",
  removeOtherCost,
}) {
  // calculate total of otherCosts
  const totalOtherCosts = otherCosts.reduce(
    (sum, cost) => sum + Number(cost.amount),
    0
  );

  let totalFuelCost = 0;
  let totalTripCost = 0;
  let costPerPerson = 0;
  let driverCost = 0;
  let passengerCost = 0;
  let totalPeople = 0;
  let effectiveContributors = 0;

  if (fuelCost && mpg && distance) {
    // Convert miles per gallon to miles per liter
    const milesPerLiter = mpg / 4.54609;
    totalFuelCost = (distance / milesPerLiter) * fuelCost;
    totalTripCost = totalFuelCost + totalOtherCosts;

    // Count driver + passengers for total people
    const numPassengers = parseInt(passengers) || 0;
    totalPeople = 1 + numPassengers;

    // Calculate cost distribution
    if (numPassengers === 0) {
      // If driver is alone, they pay everything
      driverCost = totalTripCost;
      passengerCost = 0;
      costPerPerson = totalTripCost;
    } else {
      // If there are passengers
      if (driverContributes) {
        // Driver contributes partially or fully
        const driverShare = driverContributionPercentage / 100;
        effectiveContributors = numPassengers + driverShare;
        passengerCost = totalTripCost / effectiveContributors;
        driverCost = passengerCost * driverShare;
        costPerPerson = passengerCost; // For display
      } else {
        // Driver doesn't contribute
        driverCost = 0;
        passengerCost = totalTripCost / numPassengers;
        costPerPerson = passengerCost;
      }
    }
  }

  // Determine if custom cost sharing is active
  const hasCustomCostSharing =
    driverContributes &&
    driverContributionPercentage < 100 &&
    driverContributionPercentage > 0 &&
    parseInt(passengers) > 0;

  return (
    <div className="dashboard-container">
      <h2 id="trip-summary"> {journeyName || "Trip"} Summary </h2>
      <div className="dash-fields">
        <div className="dash-item">
          <p>Driver name: {driverName}</p>
        </div>
        <div className="dash-item">
          <p>Number of passengers: {passengers || 0}</p>
        </div>
        <div className="dash-item">
          <p>Total people: {totalPeople}</p>
        </div>
        <div className="dash-item">
          <p>Total Distance: {distance || 0} miles</p>
        </div>
        <div className="dash-item">
          <p>Average MPG: {mpg || 0}</p>
        </div>
        <div className="dash-item">
          <p>Total Fuel Cost: £{totalFuelCost.toFixed(2) || 0}</p>
        </div>
        <div className="dash-item">
          <p>Other costs: £{totalOtherCosts.toFixed(2)}</p>
          {otherCosts.length > 0 && (
            <ul className="costs-breakdown">
              {otherCosts.map((cost, index) => (
                <li key={index}>
                  {cost.description}: £{cost.amount}
                  <button
                    type="button"
                    className="remove-cost-btn"
                    onClick={() => removeOtherCost(index)}
                  >
                    ✕
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>
        <div className="dash-item">
          <p>Total trip cost: £{totalTripCost.toFixed(2)}</p>
        </div>

        {/* Conditional rendering based on cost sharing setup */}
        {!hasCustomCostSharing &&
          parseInt(passengers) > 0 &&
          driverContributes && (
            <div className="dash-item">
              <p>Cost Per Person: £{costPerPerson.toFixed(2)}</p>
            </div>
          )}

        {/* Show driver cost if no contribution or custom percentage */}
        {(hasCustomCostSharing || !driverContributes) && (
          <div className="dash-item highlight-item">
            <p>Driver pays: £{driverCost.toFixed(2)}</p>
          </div>
        )}

        {/* Show passenger cost if custom contribution */}
        {(hasCustomCostSharing || !driverContributes) &&
          parseInt(passengers) > 0 && (
            <div className="dash-item highlight-item">
              <p>Each passenger pays: £{passengerCost.toFixed(2)}</p>
            </div>
          )}

        {/* Show contribution percentage if custom */}
        {hasCustomCostSharing && (
          <div className="dash-item">
            <p>Driver contribution: {driverContributionPercentage}%</p>
          </div>
        )}

        {/* If driver doesn't contribute */}
        {!driverContributes && parseInt(passengers) > 0 && (
          <div className="dash-item">
            <p>Driver is not contributing to costs</p>
          </div>
        )}

        {/* If no passengers */}
        {parseInt(passengers) === 0 && (
          <div className="dash-item">
            <p>Driver pays full amount</p>
          </div>
        )}
      </div>
    </div>
  );
}
