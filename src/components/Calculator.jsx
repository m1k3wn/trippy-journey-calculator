import { useState } from "react";
import Dashboard from "./Dashboard";
import InputForm from "./InputForm";
import "../styles/Calculator.css";

export default function Calculator() {
  // State
  const [tripDetails, setTripDetails] = useState({
    journeyName: "",
    driverName: "",
    fuelCost: "1.5",
    mpg: "",
    distance: "",
    passengers: 0,
    driverContributes: true,
    driverContributionPercentage: 100,
    otherCosts: [],
  });

  // Reset form function
  const resetForm = () => {
    setTripDetails({
      journeyName: "",
      driverName: "",
      fuelCost: "",
      mpg: "",
      distance: "",
      passengers: 0,
      otherCosts: [],
    });
    setCurrentOtherCost({ description: "", amount: "" });
  };

  //   Other costs handlers
  const [currentOtherCost, setCurrentOtherCost] = useState({
    description: "",
    amount: "",
  });
  //    Add cost
  const addOtherCost = () => {
    if (currentOtherCost.description && currentOtherCost.amount) {
      setTripDetails({
        ...tripDetails,
        otherCosts: [...tripDetails.otherCosts, currentOtherCost],
      });
      setCurrentOtherCost({ description: "", amount: "" });
    }
  };
  //   Remove cost
  const removeOtherCost = (index) => {
    const updatedCosts = [...tripDetails.otherCosts];
    updatedCosts.splice(index, 1);
    setTripDetails({
      ...tripDetails,
      otherCosts: updatedCosts,
    });
  };

  //    Event Handler
  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;

    // Handle checkbox input separately
    if (type === "checkbox") {
      setTripDetails({
        ...tripDetails,
        [name]: checked,
      });
    } else {
      setTripDetails({
        ...tripDetails,
        [name]: value,
      });
    }
  };

  return (
    <div className="calculator-container">
      <Dashboard {...tripDetails} removeOtherCost={removeOtherCost} />
      <InputForm
        tripDetails={tripDetails}
        onInputChange={handleInputChange}
        // onSubmit={handleSubmit}
        currentOtherCost={currentOtherCost}
        setCurrentOtherCost={setCurrentOtherCost}
        addOtherCost={addOtherCost}
        removeOtherCost={removeOtherCost}
        resetForm={resetForm}
      />
    </div>
  );
}
