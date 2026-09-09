import { useCallback, useState, useEffect, useRef } from "react";
import {
  Alert,
  RefreshControl,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { API_KEY, API_BASE_URL } from "../constants/api";
import { ERROR_LABELS } from "../constants/const";
import commonStyles from "../styles/commonStyles";
import { checkResponse } from "../utils/utils";

const HomeScreen = ({ navigation }) => {
  const [refreshing, setRefreshing] = useState(false);
  const [devices, setDevices] = useState([]);
  const controllerRef = useRef(null);
  const isMountedRef = useRef(true);

  const fetchDevices = useCallback(async () => {
    controllerRef.current?.abort();

    const controller = new AbortController();
    controllerRef.current = controller;

    const timeoutId = setTimeout(() => {
      controller.abort();
    }, 15000);

    if (isMountedRef.current) setRefreshing(true);

    try {
      const response = await checkResponse(
        await fetch(API_BASE_URL, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "X-API-Key": API_KEY,
          },
          signal: controller.signal,
        }),
      );

      setDevices(response.listDevices);
    } catch (error) {
      Alert.alert(
        "Ошибка",
        ERROR_LABELS[error.name] ??
          "Ошибка сети, проверьте подключение с сети Интернет.",
        [{ text: "OK" }],
      );
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
          <RefreshControl refreshing={refreshing} onRefresh={fetchDevices} />
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
