import "../styles/Dashboard.css";
import DashboardItem from "./DashboardItem";

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
      {/* <h2 id="trip-summary"> {journeyName || "Trip"} Summary </h2> */}

      <div className="dash-fields">
        <div className="main-trip-dash">
          <DashboardItem label="Journey" value={journeyName} />
          <DashboardItem label="Driver" value={driverName} />
          <DashboardItem label="Passengers" value={passengers || 0} />
          <DashboardItem
            label="Total Travellers"
            value={passengers + 1 || 0}
            highlight={true}
          />
        </div>

        <div className="distance-cost-dash">
          <DashboardItem label="Distance" value={`${distance || 0} miles`} />
          <DashboardItem label="Average MPG" value={mpg || 0} />
          <DashboardItem label="Fuel Price" value={`£${fuelCost || 0}/L`} />
          <DashboardItem
            label="Total Fuel Cost"
            value={`£${totalFuelCost.toFixed(2) || 0}`}
            highlight={true}
          />
        </div>

        <div className="other-costs-dash">
          {/* First component for breakdown */}
          {otherCosts.length > 0 ? (
            <div className="dash-item other-costs-breakdown">
              <span className="dash-item-label">Cost Breakdown</span>
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
            </div>
          ) : (
            <div className="dash-item other-costs-breakdown">
              <span className="dash-item-label">Cost Breakdown</span>
              <span className="dash-item-value empty-text">
                No additional costs
              </span>
            </div>
          )}

          {/* Second component for total */}
          <DashboardItem
            label="Other Costs Total"
            value={`£${totalOtherCosts.toFixed(2)}`}
            highlight={true}
          />
        </div>

        <div className="trip-totals-dash">
          <div className="per-person-costs">
            {/* Conditional rendering based on cost sharing setup */}
            {!hasCustomCostSharing &&
              parseInt(passengers) > 0 &&
              driverContributes && (
                <DashboardItem
                  label="Cost Per Person"
                  value={`£${costPerPerson.toFixed(2)}`}
                />
              )}
            {/* Show driver cost if no contribution or custom percentage */}
            {(hasCustomCostSharing || !driverContributes) && (
              <DashboardItem
                label="Driver Pays"
                value={`£${driverCost.toFixed(2)}`}
              />
            )}
            {/* Show passenger cost if custom contribution */}
            {(hasCustomCostSharing || !driverContributes) &&
              parseInt(passengers) > 0 && (
                <DashboardItem
                  label="Passengers Pay"
                  value={`£${passengerCost.toFixed(2)}`}
                />
              )}
            {/* If driver doesn't contribute
          {!driverContributes && parseInt(passengers) > 0 && (
            <DashboardItem
              label="Driver Contribution"
              value="Not contributing"
            />
          )} */}
            {/* If no passengers */}
            {parseInt(passengers) === 0 && (
              <DashboardItem
                label="Cost Distribution"
                value="Driver pays full amount"
              />
            )}
          </div>
          <div className="total-cost-container">
            <DashboardItem
              label="Total Trip Cost"
              value={`£${totalTripCost.toFixed(2)}`}
              highlight={true}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
