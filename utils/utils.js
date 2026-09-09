export const parseSensor = (properties) => {
  const sensors = [];
  const names = [];

  for (let i = 0; i < properties.length; i++) {
    if (properties[i].code.includes("sensors")) {
      sensors.push(...properties[i].value.match(/.{1,4}/g));
    }
    if (properties[i].code.includes("names")) {
      names.push(...properties[i].value.replace(/;$/, '').split(";"));
    }
  }

  const map = [];
  for (let i = 0; i < sensors.length; i++) {
    map.push({ name: names[i], value: sensors[i] });
  }

  return map;
};

export const checkResponse = async (response) => {
  if (!response.ok) {
    const error = new Error();
    if (response.status === 401) error.name = "Unauthorized";
    else error.name = "NetworkError";

    throw error;
  }

  return await response.json();
};
