const baseUrl = "https://www.fueleconomy.gov/ws/rest";

// Simple XML parser using the browser's DOMParser
const parseXML = (xmlText) => {
  const parser = new DOMParser();
  const xmlDoc = parser.parseFromString(xmlText, "application/xml");

  const getValues = (tag) => {
    const elements = xmlDoc.getElementsByTagName(tag);
    return Array.from(elements).map((el) => el.textContent);
  };

  return { xmlDoc, getValues };
};

// Fetch makes
export const getMakes = async () => {
  const res = await fetch(`${baseUrl}/vehicle/menu/make`, {
    headers: { Accept: "application/xml" },
  });
  const xml = await res.text();
  const { getValues } = parseXML(xml);
  return getValues("value");
};

// Fetch models for selected make
export const getModels = async (make) => {
  const res = await fetch(`${baseUrl}/vehicle/menu/model?make=${make}`, {
    headers: { Accept: "application/xml" },
  });
  const xml = await res.text();
  const { getValues } = parseXML(xml);
  return getValues("value");
};

// Fetch years for selected make + model
export const getYears = async (make, model) => {
  const res = await fetch(
    `${baseUrl}/vehicle/menu/year?make=${make}&model=${model}`,
    {
      headers: { Accept: "application/xml" },
    }
  );
  const xml = await res.text();
  const { getValues } = parseXML(xml);
  return getValues("value");
};

// Fetch vehicle ID from selected year + make + model
export const getVehicleId = async (year, make, model) => {
  const res = await fetch(
    `${baseUrl}/vehicle/menu/options?year=${year}&make=${make}&model=${model}`,
    {
      headers: { Accept: "application/xml" },
    }
  );
  const xml = await res.text();
  const { getValues } = parseXML(xml);
  return getValues("value")[0] || null; // first matching vehicle ID
};

// Fetch MPG info from vehicle ID
export const getMPG = async (vehicleId) => {
  const res = await fetch(`${baseUrl}/vehicle/${vehicleId}`, {
    headers: { Accept: "application/xml" },
  });
  const xml = await res.text();
  const { xmlDoc } = parseXML(xml);

  const cityMPG = xmlDoc.getElementsByTagName("city08")[0]?.textContent;
  const highwayMPG = xmlDoc.getElementsByTagName("highway08")[0]?.textContent;

  return { cityMPG, highwayMPG };
};
