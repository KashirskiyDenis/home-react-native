import { useCallback, useState, useEffect, useRef } from "react";
import {
  Alert,
  RefreshControl,
  ScrollView,
  StyleSheet,
  Text,
  Switch,
  TouchableOpacity,
  View,
} from "react-native";
import { API_KEY, BASE_URL } from "../constants/home";
import WaterValveController from "../components/WaterValveController";
import commonStyles from "../styles/commonStyles";

const DeviceDetailScreen = ({ navigation, route }) => {
  const [refreshing, setRefreshing] = useState(false);
  const [status, setStatus] = useState(route.params?.device.status);
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
      if (isMountedRef.current) {
        setRefreshing(false);
      }
    }
  }, []);

  const toggleStatus = (newValue, indexKey) => {
    setStatus(
      status.map((item, index) =>
        index === indexKey ? { ...item, value: newValue } : item,
      ),
    );
  };

  const togglePropertyValue = (newValue, indexProperty) => {
    setProperties(
      properties.map((property, index) => {
        return index === indexProperty
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
      <View style={commonStyles.listElement}>
        <Text style={commonStyles.listText}>
          Название: {route.params?.device.name}
        </Text>
      </View>
      <View style={commonStyles.listElement}>
        <Text style={commonStyles.listText}>
          Название продукта: {route.params?.device.product_name}
        </Text>
      </View>
      <View style={commonStyles.listElement}>
        <Text style={commonStyles.listText}>
          Интернет статус:{" "}
          <Text
            style={[
              route.params?.device.online
                ? styles.stateOnline
                : styles.stateOffline,
              commonStyles.listText,
            ]}
          >
            {route.params?.device.online ? "Online" : "Offline"}
          </Text>
        </Text>
      </View>
      <View style={commonStyles.listElement}>
        <Text style={commonStyles.listText}>
          Категория: {route.params?.device.category_title}
        </Text>
      </View>
      {status.map((item, indexStatus) => {
        if (item.code == "switch") {
          return (
            <View style={commonStyles.listElement} key={indexStatus}>
              <View style={commonStyles.rowSwitch}>
                <View>
                  <Text style={commonStyles.listText}>Закрыто / Открыто:</Text>
                </View>
                <View>
                  <Switch
                    onValueChange={(newValue) => {
                      toggleStatus(newValue, indexStatus);
                    }}
                    value={item.value}
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
});

export default DeviceDetailScreen;
