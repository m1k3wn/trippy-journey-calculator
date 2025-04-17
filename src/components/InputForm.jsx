import React from "react";
import "../styles/InputForm.css";
import OtherCosts from "./OtherCosts";
import PassengerCounter from "./PassengerCounter.jsx";
import DriverContribution from "./DriverContribution";
import VehicleSelector from "./VehicleSelector";

export default function InputForm({
  tripDetails,
  onInputChange,
  currentOtherCost,
  setCurrentOtherCost,
  addOtherCost,
  removeOtherCost,
  resetForm,
}) {
  // Basic form validation
  const isFormValid = () => {
    return (
      tripDetails.journeyName &&
      tripDetails.fuelCost > 0 &&
      tripDetails.mpg > 0 &&
      tripDetails.distance > 0 &&
      tripDetails.passengers > 0
    );
  };

  const handleMpgFromVehicle = (mpgData) => {
    if (mpgData && mpgData.cityMPG) {
      onInputChange({
        target: {
          name: "mpg",
          value: mpgData.cityMPG,
          type: "number",
        },
      });
    }
  };

  return (
    <div className="form-container">
      <h2> Input Trip Info </h2>
      <form className="form-fields">
        <div className="form-group">
          <label htmlFor="destination" className="form-label">
            Journey name :
          </label>
          <input
            type="text"
            id="journey-name"
            name="journeyName"
            value={tripDetails.journeyName}
            onChange={onInputChange}
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="driverName" className="form-label">
            Driver :
          </label>
          <input
            type="text"
            id="driver-name"
            name="driverName"
            value={tripDetails.driverName}
            onChange={onInputChange}
            required
          />
        </div>
        <div className="form-group driver-contribution-group">
          <DriverContribution
            driverContributes={tripDetails.driverContributes}
            driverContributionPercentage={
              tripDetails.driverContributionPercentage
            }
            onChange={onInputChange}
            passengers={Number(tripDetails.passengers)}
          />
        </div>
        <div className="form-group">
          <label htmlFor="fuelCost" className="form-label">
            Fuel Cost (£/litre):
          </label>
          <input
            type="number"
            id="fuel-cost"
            name="fuelCost"
            min="0"
            step="0.01"
            value={tripDetails.fuelCost}
            onChange={onInputChange}
            required
          />
        </div>
        {/* WIP API call for vehicle MPG */}
        {/* <div className="form-group">
          <label className="form-label">Select Vehicle to Autofill MPG:</label>
          <VehicleSelector onMpgRetrieved={handleMpgFromVehicle} />
        </div> */}

        <div className="form-group">
          <label htmlFor="mpg" className="form-label">
            Vehicle's MPG (miles/gallon):
          </label>
          <input
            type="number"
            id="mpg"
            name="mpg"
            min="0"
            step="0.01"
            value={tripDetails.mpg}
            onChange={onInputChange}
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="distance" className="form-label">
            Trip Distance (miles):
          </label>
          <input
            type="number"
            id="distance"
            name="distance"
            min="0"
            step="0.01"
            value={tripDetails.distance}
            onChange={onInputChange}
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="passengers" className="form-label">
            Number of passengers :
          </label>
          <PassengerCounter
            value={tripDetails.passengers}
            onChange={onInputChange}
          />
        </div>
        <OtherCosts
          otherCosts={tripDetails.otherCosts}
          currentOtherCost={currentOtherCost}
          setCurrentOtherCost={setCurrentOtherCost}
          addOtherCost={addOtherCost}
          removeOtherCost={removeOtherCost}
        />

        <button type="reset" className="reset-button" onClick={resetForm}>
          Reset
        </button>
      </form>
    </div>
  );
}
