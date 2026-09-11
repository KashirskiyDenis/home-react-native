import { View } from "react-native";
import BoolRow from "./BoolRow";
import ValueRow from "./ValueRow";
import { DEVICE_PROPERTY_LABELS } from "../constants/labels";
import commonStyles from "../styles/commonStyles";
import { parseSensors } from "../utils/utils";

const WaterValveController = ({
  properties,
  onPropertyChange,
  onEditPress,
  onSensorPress,
  onJournalPress,
}) => {
  return (
    <View>
      {properties.map((property) => {
        if (property.code === "use_time") {
          return (
            <ValueRow
              key={property.code}
              label={DEVICE_PROPERTY_LABELS[property.code] ?? property.code}
              value={property.value}
              valueStyle={commonStyles.textBold}
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
};

export default WaterValveController;
