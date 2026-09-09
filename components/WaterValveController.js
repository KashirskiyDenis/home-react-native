import { StyleSheet, View } from "react-native";
import BoolRow from "./BoolRow";
import ValueRow from "./ValueRow";
import { DEVICE_PROPERTY_LABELS } from "../constants/const";
import { parseSensors } from "../utils/utils";

function WaterValveController({
  properties,
  onPropertyChange,
  onEditPress,
  onSensorPress,
  onJournalPress,
}) {
  return (
    <View>
      {properties.map((property) => {
        if (property.code === "use_time") {
          return (
            <ValueRow
              key={property.code}
              label={DEVICE_PROPERTY_LABELS[property.code] ?? property.code}
              value={property.value}
              valueStyle={styles.textBold}
              accessory="edit"
              onPress={onEditPress}
            />
          );
        }
        if (property.code === "alarm" || property.code === "cleaning") {
          return (
            <BoolRow
              key={property.code}
              label={DEVICE_PROPERTY_LABELS[property.code] ?? property.code}
              value={property.value}
              onValueChange={(newValue) => {
                onPropertyChange?.(property.code, newValue);
              }}
            />
          );
        }
        if (property.code === "journal") {
          return (
            <ValueRow
              key={property.code}
              label={DEVICE_PROPERTY_LABELS[property.code] ?? property.code}
              accessory="navigate"
              onPress={() => {
                onJournalPress(property.value);
              }}
            />
          );
        }
        if (property.code === "sensors") {
          return (
            <ValueRow
              key={property.code}
              label={DEVICE_PROPERTY_LABELS[property.code] ?? property.code}
              accessory="navigate"
              onPress={() => {
                onSensorPress(parseSensors(properties));
              }}
            />
          );
        }
        return null;
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  textBold: {
    fontWeight: "600",
  },
});

export default WaterValveController;
