import { Alert } from "react-native";
import { API_KEY, API_BASE_URL } from "../constants/api";
import { ERROR_LABELS, TUYA_ERRORS } from "../constants/labels";

export const parseSensors = (properties) => {
  const sensors = [];
  const names = [];
  const result = [];

  for (let i = 0; i < properties.length; i++) {
    if (properties[i].code.includes("sensors")) {
      sensors.push(...(properties[i].value.match(/.{1,4}/g) ?? []));
    }
    if (properties[i].code.includes("names")) {
      names.push(
        ...properties[i].value.replace(/;$/, "").split(";").filter(Boolean),
      );
    }
  }

  for (let i = 0; i < sensors.length; i++) {
    result.push({ name: names[i], value: sensors[i] });
  }

  return result;
};

function throwError(name, message) {
  const error = new Error(message);
  error.name = name;
  throw error;
}

export const checkResponse = async (response) => {
  const data = await response.json();

  if (!response.ok) {
    throwError(data.error, data.message);
  }

  return data;
};

export const apiRequest = async ({ endpoint = "", body, signal }) => {
  const response = await checkResponse(
    await fetch(API_BASE_URL + endpoint, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-API-Key": API_KEY,
      },
      body: JSON.stringify(body),
      signal,
    }),
  );

  return response;
};

export const handleError = (error, isTimeout) => {
  if (error.name === "AbortError" && !isTimeout) return;

  Alert.alert(
    "Ошибка",
    isTimeout
      ? ERROR_LABELS.AbortError
      : error.name === "TuyaError"
        ? TUYA_ERRORS[`errorCode_${error.message}`].ErrorMessage
        : (ERROR_LABELS[error.name] ?? ERROR_LABELS.NetworkError),
    [{ text: "OK" }],
  );
};
