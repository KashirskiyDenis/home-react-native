import { useCallback, useState, useEffect, useRef } from "react";
import {
  Alert,
  RefreshControl,
  ScrollView,
  StyleSheet,
  Text,
  Switch,
  View,
} from "react-native";
import { API_KEY, BASE_URL } from "../constants/home";
import WaterValveController from "../components/WaterValveController";
import commonStyles from "../styles/commonStyles";
import BoolField from "../components/BoolField";
import StringField from "../components/StringField";
import ValueField from "../components/ValueField";

const DeviceDetailScreen = ({ navigation, route }) => {
  const [refreshing, setRefreshing] = useState(false);
  const [statuses, setStatuses] = useState(route.params?.device.status);
  const [properties, setProperties] = useState([]);
  const controllerRef = useRef(null);
  const isMountedRef = useRef(true);

  const getPropertiesOfDevice = useCallback(async () => {
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
      const response = await fetch(BASE_URL + "device-detail", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "X-API-Key": API_KEY,
        },
        body: JSON.stringify({
          deviceId: route.params?.device.id,
        }),
        signal: controller.signal,
      });

      setProperties((await response.json()).properties);
    } catch (error) {
      if (isTimeout) {
        Alert.alert("Ошибка", "Ошибка сети, проверьте доступ к Tuya Cloud", [
          { text: "OK" },
        ]);
      }
    } finally {
      clearTimeout(timeoutId);
      if (isMountedRef.current && controllerRef.current === controller) {
        setRefreshing(false);
      }
    }
  }, []);

  const toggleStatus = (newValue, code) => {
    setStatuses(
      statuses.map((item) =>
        item.code === code ? { ...item, value: newValue } : item,
      ),
    );
  };

  const togglePropertyValue = (newValue, code) => {
    setProperties(
      properties.map((property) => {
        return property.code === code
          ? { ...property, value: newValue }
          : property;
      }),
    );
  };

  useEffect(() => {
    isMountedRef.current = true;

    getPropertiesOfDevice();
    return () => {
      isMountedRef.current = false;
      controllerRef.current?.abort();
    };
  }, [getPropertiesOfDevice]);

  return (
    <ScrollView
      style={commonStyles.container}
      refreshControl={
        <RefreshControl
          refreshing={refreshing}
          onRefresh={() => getPropertiesOfDevice()}
        />
      }
    >
      <StringField code={"Название"} value={route.params?.device.name} />
      <StringField
        code={"Название продукта"}
        value={route.params?.device.product_name}
      />
      <StringField
        code={"Интернет статус"}
        value={route.params?.device.online ? "Online" : "Offline"}
        styleValue={[
          styles.textBold,
          route.params?.device.online
            ? styles.stateOnline
            : styles.stateOffline,
        ]}
      />
      <StringField
        code={"Категория"}
        value={route.params?.device.category_title}
      />
      {statuses.map((states, indexStatus) => {
        if (states.code == "switch") {
          return (
            <View style={commonStyles.listItem} key={indexStatus}>
              <View style={commonStyles.listItemFlexRow}>
                <View>
                  <Text style={commonStyles.listItemText}>
                    Закрыто / Открыто:
                  </Text>
                </View>
                <View>
                  <Switch
                    onValueChange={(newValue) => {
                      toggleStatus(newValue, states.code);
                    }}
                    value={states.value}
                  />
                </View>
              </View>
            </View>
          );
        }
      })}
      <WaterValveController
        properties={properties}
        navigation={navigation}
        onToggleProperty={togglePropertyValue}
      />
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  stateOnline: {
    color: "#00ff00",
  },
  stateOffline: {
    color: "#ff0000",
  },
  textBold: {
    fontWeight: "600",
  },
});

export default DeviceDetailScreen;
