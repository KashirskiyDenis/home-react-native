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
import { DEVICE_PROPERTY_LABELS } from "../constants/const";
import WaterValveController from "../components/WaterValveController";
import commonStyles from "../styles/commonStyles";
import BoolRow from "../components/BoolRow";
import ValueRow from "../components/ValueRow";
import PromptModal from "../components/PromptModal";
import { checkResponse } from "../utils/utils";

const DeviceDetailScreen = ({ navigation, route }) => {
  const device = route.params?.device;
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
      const response = await checkResponse(
        await fetch(BASE_URL + "device-detail", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "X-API-Key": API_KEY,
          },
          body: JSON.stringify({
            deviceId: device.id,
          }),
          signal: controller.signal,
        }),
      );

      setProperties(response.properties);
    } catch (error) {
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
    } finally {
      clearTimeout(timeoutId);
      if (isMountedRef.current && controllerRef.current === controller) {
        setRefreshing(false);
      }
    }
  }, []);

  const updateStatus = (code, value) => {
    setStatuses((statuses) =>
      statuses.map((item) =>
        item.code === code ? { ...item, value: value } : item,
      ),
    );
  };

  const updateProperty = (code, value) => {
    setProperties((properties) =>
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

  const onJournalPress = (journal) => {
    navigation.navigate("Journal", { journal: journal });
  };

  const onSensorPress = (map) => {
    navigation.navigate("Sensors", { sensors: [...map] });
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
            onRefresh={fetchDeviceProperties}
          />
        }
      >
        <View style={commonStyles.listItem}>
          <Text style={[commonStyles.listItemSubheaders]}>
            Общая информация
          </Text>
        </View>

        <ValueRow label={"Название"} value={device.name} />
        <ValueRow label={"Название продукта"} value={device.product_name} />
        <ValueRow
          label={"Интернет статус"}
          value={device.online ? "Online" : "Offline"}
          valueStyle={[
            styles.textBold,
            device.online ? styles.stateOnline : styles.stateOffline,
          ]}
        />
        <ValueRow label={"Категория"} value={device.category_title} />
        <View style={commonStyles.listItem}>
          <Text style={[commonStyles.listItemSubheaders]}>Статусы</Text>
        </View>
        {statuses.map((status) => {
          if (typeof status.value === "number") {
            return (
              <ValueRow
                key={status.code}
                label={DEVICE_PROPERTY_LABELS[status.code] ?? status.code}
                value={status.value}
                valueStyle={[styles.textBold]}
                accessory="edit"
                onPress={openModal}
              />
            );
          } else if (typeof status.value === "boolean") {
            return (
              <BoolRow
                key={status.code}
                label={DEVICE_PROPERTY_LABELS[status.code] ?? status.code}
                value={status.value}
                onValueChange={(newValue) => {
                  updateStatus(status.code, newValue);
                }}
              />
            );
          } else if (typeof status.value === "string") {
            return (
              <ValueRow
                key={status.code}
                label={DEVICE_PROPERTY_LABELS[status.code] ?? status.code}
                value={status.value}
                valueStyle={styles.textBold}
              />
            );
          }
        })}
        <View style={commonStyles.listItem}>
          <Text style={[commonStyles.listItemSubheaders]}>Свойства</Text>
        </View>
        <WaterValveController
          properties={properties}
          onPropertyChange={updateProperty}
          onEditPress={openModal}
          onSensorPress={onSensorPress}
          onJournalPress={onJournalPress}
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
