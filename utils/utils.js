export const parsSensor = (properties) => {
  const sensors = [];
  const names = [];

  for (let i = 0; i < properties.length; i++) {
    if (properties[i].code.includes("sensors")) {
      sensors.push(...properties[i].value.match(/.{1,4}/g));
    }
    if (properties[i].code.includes("names")) {
      names.push(...properties[i].value.split(";"));
    }
  }

  const map = new Map();
  for (let i = 0; i < sensors.length; i++) {
    map.set(names[i], sensors[i]);
  }

  return [...map];
};
