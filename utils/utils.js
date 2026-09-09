export const parseSensors = (properties) => {
  const sensors = [];
  const names = [];
  const result = [];

  for (let i = 0; i < properties.length; i++) {
    if (properties[i].code.includes("sensors")) {
      sensors.push(...properties[i].value.match(/.{1,4}/g));
    }
    if (properties[i].code.includes("names")) {
      names.push(...properties[i].value.replace(/;$/, "").split(";"));
    }
  }

  for (let i = 0; i < sensors.length; i++) {
    result.push({ name: names[i], value: sensors[i] });
  }

  return result;
};

export const checkResponse = async (response) => {
  if (!response.ok) {
    const error = new Error();
    if (response.status === 401) error.name = "Unauthorized";
    else if (response.status === 501 || response.status === 503)
      error.name = "ServerError";
    else error.name = "HttpError";

    throw error;
  }

  return await response.json();
};

export const getRequestErrorMessage = (error) => {
  if (error.name === "AbortError" || error.name === "ServerError") {
    if (isTimeout) {
      Alert.alert("Ошибка",
        "Ошибка сети, проверьте доступ к API Yandex.", [
        { text: "OK" },
      ]);
    }
  } else if (error.name === "Unauthorized") {
    Alert.alert("Ошибка",
      "Ошибка авторизации, проверьте ключ доступа.", [
      { text: "OK" },
    ]);
  } else if (error.name === "HttpError") {
    Alert.alert("Ошибка",
      "Ошибка получения данных, попробуйте ещё раз.", [
      { text: "OK" },
    ]);
  } else {
    Alert.alert(
      "Ошибка",
      "Ошибка сети, проверьте подключение с сети Интернет.",
      [{ text: "OK" }],
    );
  }
};
