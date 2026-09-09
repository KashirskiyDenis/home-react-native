import { View, StyleSheet } from "react-native";
import BoolRow from "./BoolRow";
import ValueRow from "./ValueRow";
import { DEVICE_PROPERTY_LABELS } from "../constants/const";
import { parseSensor } from "../utils/utils";

function WaterValveController({
  properties,
  onPropertyChange,
  onEditPress,
  onSensorPress,
  onJournalPress,
}) {
  return (
    <View>
      {properties.map((property, index) => {
        if (property.code === "use_time") {
          return (
            <ValueRow
              key={index}
              label={property.code}
              value={property.value}
              valueStyle={[styles.textBold]}
              accessory="edit"
              onPress={onEditPress}
            />
          );
        } else if (property.code === "alarm" || property.code === "cleaning") {
          return (
            <BoolRow
              key={index}
              label={DEVICE_PROPERTY_LABELS[property.code]}
              value={property.value}
              onValueChange={(newValue) => {
                onPropertyChange?.(property.code, newValue);
              }}
            />
          );
        } else if (property.code === "journal") {
          return (
            <ValueRow
              key={index}
              label="Журнал"
              accessory="navigate"
              onPress={() => {
                onJournalPress(property.value);
              }}
            />
          );
        } else if (property.code === "sensors") {
          return (
            <ValueRow
              key={index}
              label="Сенсоры"
              accessory="navigate"
              onPress={() => {
                onSensorPress(parseSensor(properties));
              }}
            />
          );
        }
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
