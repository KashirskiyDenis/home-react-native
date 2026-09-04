import { useCallback, useState, useEffect, useRef } from "react";
import {
  Alert,
  RefreshControl,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { API_KEY, BASE_URL } from "../constants/api";
import WaterValveController from "../components/WaterValveController";
import commonStyles from "../styles/commonStyles";
import BoolRow from "../components/BoolRow";
import ValueRow from "../components/ValueRow";
import PromptModal from "../components/PromptModal";

const DeviceDetailScreen = ({ navigation, route }) => {
  const [promptModalVisible, setPromptModalVisible] = useState(false);
  const [promptText, setPromptText] = useState("");

  const [refreshing, setRefreshing] = useState(false);
  const [statuses, setStatuses] = useState(route.params?.device.status);
  const [properties, setProperties] = useState([]);
  const controllerRef = useRef(null);
  const isMountedRef = useRef(true);

  const fetchDeviceProperties = useCallback(async () => {
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

  const updateStatus = (code, value) => {
    setStatuses(
      statuses.map((item) =>
        item.code === code ? { ...item, value: value } : item,
      ),
    );
  };

  const updateProperty = (code, value) => {
    setProperties(
      properties.map((property) => {
        return property.code === code
          ? { ...property, value: value }
          : property;
      }),
    );
  };

  const openModal = () => {
    setPromptText("");
    setPromptModalVisible(true);
  };

  const promptSubmit = () => {
    if (promptText.trim().length === 0) {
      return;
    }
    setPromptModalVisible(false);
  };

  useEffect(() => {
    isMountedRef.current = true;

    fetchDeviceProperties();
    return () => {
      isMountedRef.current = false;
      controllerRef.current?.abort();
    };
  }, [fetchDeviceProperties]);

  return (
    <>
      <PromptModal
        visible={promptModalVisible}
        onClose={() => setPromptModalVisible(false)}
        text={promptText}
        onChangeText={setPromptText}
        onSubmit={promptSubmit}
      />
      <ScrollView
        style={commonStyles.container}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={() => fetchDeviceProperties()}
          />
        }
      >
        <View style={commonStyles.listItem}>
          <Text style={[commonStyles.listItemSubheaders]}>
            Общая информация
          </Text>
        </View>

        <ValueRow code={"Название"} value={route.params?.device.name} />
        <ValueRow
          code={"Название продукта"}
          value={route.params?.device.product_name}
        />
        <ValueRow
          code={"Интернет статус"}
          value={route.params?.device.online ? "Online" : "Offline"}
          valueStyle={[
            styles.textBold,
            route.params?.device.online
              ? styles.stateOnline
              : styles.stateOffline,
          ]}
        />
        <ValueRow
          code={"Категория"}
          value={route.params?.device.category_title}
        />
        <View style={commonStyles.listItem}>
          <Text style={[commonStyles.listItemSubheaders]}>Статусы</Text>
        </View>
        {statuses.map((status, index) => {
          if (typeof status.value === "number") {
            return (
              <ValueRow
                key={index}
                code={status.code}
                value={status.value}
                valueStyle={[styles.textBold]}
                accessory={"edit"}
                onPress={openModal}
              />
            );
          } else if (typeof status.value === "boolean") {
            return (
              <BoolRow
                key={index}
                code={"Закрыто / Открыто:"}
                value={status.value}
                onValueChange={(newValue) => {
                  updateStatus(status.code, newValue);
                }}
                onPressAction={promptSubmit}
              />
            );
          } else if (typeof status.value === "string") {
            return (
              <ValueRow
                key={index}
                code={status.code}
                value={status.value}
                valueStyle={[styles.textBold]}
              />
            );
          }
        })}
        <View style={commonStyles.listItem}>
          <Text style={[commonStyles.listItemSubheaders]}>Свойства</Text>
        </View>
        <WaterValveController
          properties={properties}
          navigation={navigation}
          onToggleProperty={updateProperty}
          onPressAction={openModal}
        />
      </ScrollView>
    </>
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
