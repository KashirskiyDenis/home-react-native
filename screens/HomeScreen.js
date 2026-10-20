import { useCallback, useEffect, useRef, useState } from "react";
import {
  RefreshControl,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { ENDPOINTS, ABORT_TIMEOUT_MS } from "../constants/api";
import commonStyles from "../styles/commonStyles";
import { apiRequest, handleError } from "../utils/utils";

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
    }, ABORT_TIMEOUT_MS);

    if (isMountedRef.current) setRefreshing(true);

    try {
      const response = await apiRequest({
        endpoint: ENDPOINTS.deviceList,
        signal: controller.signal,
      });

      setDevices(response);
    } catch (error) {
      handleError(error, isTimeout);
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
