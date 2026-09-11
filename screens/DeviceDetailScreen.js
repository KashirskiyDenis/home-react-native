import { useCallback, useEffect, useRef, useState } from "react";
import {
  Alert,
  RefreshControl,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { COLOR_STATE_ONLINE, COLOR_STATE_OFFLINE } from "../constants/colors";
import { DEVICE_PROPERTY_LABELS, ERROR_LABELS } from "../constants/labels";
import WaterValveController from "../components/WaterValveController";
import BoolRow from "../components/BoolRow";
import ValueRow from "../components/ValueRow";
import PromptModal from "../components/PromptModal";
import commonStyles from "../styles/commonStyles";
import { apiRequest } from "../utils/utils";

const DeviceDetailScreen = ({ navigation, route }) => {
  const device = route.params?.device;
  const deviceId = device?.id;
  const [promptModalVisible, setPromptModalVisible] = useState(false);
  const [promptText, setPromptText] = useState("");

  const [refreshing, setRefreshing] = useState(false);
  const [statuses, setStatuses] = useState(route.params?.device.status ?? []);
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
      const response = await apiRequest({
        endpoint: "device-detail",
        body: {
          deviceId: deviceId,
        },
        signal: controller.signal,
      });

      setProperties(response.properties);
    } catch (error) {
      if (error.name === "AbortError" && !isTimeout) return;

      Alert.alert(
        "Ошибка",
        isTimeout
          ? ERROR_LABELS.AbortError
          : (ERROR_LABELS[error.name] ?? ERROR_LABELS.NetworkError),
        [{ text: "OK" }],
      );
    } finally {
      clearTimeout(timeoutId);
      if (isMountedRef.current && controllerRef.current === controller) {
        setRefreshing(false);
      }
    }
  }, [deviceId]);

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
            commonStyles.textBold,
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
                valueStyle={commonStyles.textBold}
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
                valueStyle={commonStyles.textBold}
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
    color: COLOR_STATE_ONLINE,
  },
  stateOffline: {
    color: COLOR_STATE_OFFLINE,
  },
});

export default DeviceDetailScreen;
