import React, { useEffect, useState } from "react";
import {
  getMakes,
  getModels,
  getYears,
  getVehicleId,
  getMPG,
} from "../api/vehicleApi";

const VehicleSelector = ({ onMpgRetrieved }) => {
  const [makes, setMakes] = useState([]);
  const [models, setModels] = useState([]);
  const [years, setYears] = useState([]);
  const [selected, setSelected] = useState({ make: "", model: "", year: "" });
  const [mpg, setMpg] = useState(null);

  useEffect(() => {
    getMakes().then(setMakes);
  }, []);

  useEffect(() => {
    if (selected.make) {
      setModels([]);
      getModels(selected.make).then(setModels);
    }
  }, [selected.make]);

  useEffect(() => {
    if (selected.make && selected.model) {
      setYears([]);
      getYears(selected.make, selected.model).then(setYears);
    }
  }, [selected.model]);

  const handleSelectChange = (e) => {
    const { name, value } = e.target;
    setSelected((prev) => ({ ...prev, [name]: value }));
  };

  const handleFetchMPG = async () => {
    const { year, make, model } = selected;
    if (!year || !make || !model) return;

    const vehicleId = await getVehicleId(year, make, model);
    if (!vehicleId) return;

    const mpgData = await getMPG(vehicleId);
    setMpg(mpgData);
    onMpgRetrieved?.(mpgData); // optional callback to parent
  };

  return (
    <div className="p-4 space-y-3">
      <select name="make" onChange={handleSelectChange} value={selected.make}>
        <option value="">Select Make</option>
        {makes.map((make) => (
          <option key={make} value={make}>
            {make}
          </option>
        ))}
      </select>

      {models.length > 0 && (
        <select
          name="model"
          onChange={handleSelectChange}
          value={selected.model}
        >
          <option value="">Select Model</option>
          {models.map((model) => (
            <option key={model} value={model}>
              {model}
            </option>
          ))}
        </select>
      )}

      {years.length > 0 && (
        <select name="year" onChange={handleSelectChange} value={selected.year}>
          <option value="">Select Year</option>
          {years.map((year) => (
            <option key={year} value={year}>
              {year}
            </option>
          ))}
        </select>
      )}

      <button
        onClick={handleFetchMPG}
        className="bg-blue-600 text-white px-4 py-2 rounded"
      >
        Get MPG
      </button>

      {mpg && (
        <div className="pt-2">
          <p>City MPG: {mpg.cityMPG}</p>
          <p>Highway MPG: {mpg.highwayMPG}</p>
        </div>
      )}
    </div>
  );
};

export default VehicleSelector;
