import { useCallback, useState, useEffect, useRef } from "react";
import {
  RefreshControl,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { API_KEY, BASE_URL } from "../constants/api";
import commonStyles from "../styles/commonStyles";

const HomeScreen = ({ navigation }) => {
  const [refreshing, setRefreshing] = useState(false);
  const [devices, setDevices] = useState([]);
  const controllerRef = useRef(null);
  const isMountedRef = useRef(true);

  const fetchDevices = useCallback(async () => {
    controllerRef.current?.abort();

    const controller = new AbortController();
    controllerRef.current = controller;
    let isTimeout = false;

    const timeoutId = setTimeout(() => {
      isTimeout = true;
      controller.abort();
    }, 15000);

    if (isMountedRef.current) setRefreshing(true);

    try {
      const response = await fetch(BASE_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "X-API-Key": API_KEY,
        },
        signal: controller.signal,
      });

      const listDevices = (await response.json()).listDevices;
      setDevices(listDevices);
    } catch (error) {
      if (error.name === "AbortError") {
        if (isTimeout) {
          Alert.alert("Ошибка", "Ошибка сети, проверьте доступ к Tuya Cloud", [
            { text: "OK" },
          ]);
        }
      } else if (error.name === "Unauthorized") {
        Alert.alert("Ошибка", "Ключ доступа не найден", [{ text: "OK" }]);
      } else {
        Alert.alert(
          "Ошибка",
          "Ошибка сети, проверьте подключение с сети Интернет.",
          [{ text: "OK" }],
        );
      }
    } finally {
      clearTimeout(timeoutId);
      if (isMountedRef.current && controllerRef.current === controller) {
        setRefreshing(false);
      }
    }
  }, []);

  useEffect(() => {
    isMountedRef.current = true;

    fetchDevices();

    return () => {
      isMountedRef.current = false;
      controllerRef.current?.abort();
    };
  }, [fetchDevices]);

  return (
    <View style={commonStyles.container}>
      <ScrollView
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={() => fetchDevices()}
          />
        }
      >
        {devices.map((device) => {
          return (
            <TouchableOpacity
              key={device.id}
              onPress={() =>
                navigation.navigate("DeviceDetail", {
                  device,
                })
              }
              style={commonStyles.listItem}
            >
              <Text style={commonStyles.listItemText}>{device.name}</Text>
            </TouchableOpacity>
          );
        })}
      </ScrollView>
    </View>
  );
};

export default HomeScreen;
