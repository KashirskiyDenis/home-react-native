import { View, StyleSheet } from "react-native";
import BoolRow from "./BoolRow";
import ValueRow from "./ValueRow";
import { LABELS } from "../constants/const";
import { parsSensor } from "../utils/utils";

function WaterValveController({
  properties,
  onToggleProperty,
  onPressAction,
  onSensorPress,
  onJournalPress,
}) {
  const names = [];
  for (let i = 0; i < properties.length; i++) {
    if (properties[i].code.includes("names")) {
      names.push(...properties[i].value.split(";"));
    }
  }

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
              onPress={onPressAction}
            />
          );
        } else if (property.code === "alarm" || property.code === "cleaning") {
          let code = LABELS[property.code];
          return (
            <BoolRow
              key={index}
              label={code}
              value={property.value}
              onValueChange={(newValue) => {
                onToggleProperty?.(property.code, newValue);
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
                onSensorPress(parsSensor(properties));
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
