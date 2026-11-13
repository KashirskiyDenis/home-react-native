import { View } from "react-native";
import BoolRow from "../BoolRow";
import ValueRow from "../ValueRow";
import { DEVICE_PROPERTY_LABELS } from "../../constants/labels";
import commonStyles from "../../styles/commonStyles";
import { parseSensors } from "../../utils/utils";

const PROPERTY_CONFIG = {
  use_time: { type: "value" },
  alarm: { type: "bool" },
  cleaning: { type: "bool" },
  journal: { type: "navigate", action: "journal" },
  sensors: { type: "navigate", action: "sensors" },
};

const WaterValveController = ({
  properties,
  onPropertyChange,
  onEditPress,
  onSensorPress,
  onJournalPress,
}) => {
  const actions = {
    journal: (property) => onJournalPress?.(property.value),
    sensors: () => onSensorPress?.(parseSensors(properties)),
  };

  return (
    <View>
      {properties.map((property) => {
        const config = PROPERTY_CONFIG[property.code];

        if (!config) return null;

        const label = DEVICE_PROPERTY_LABELS[property.code] ?? property.code;

        if (config.type === "value") {
          return (
            <ValueRow
              key={property.code}
              label={label}
              value={property.value}
              valueStyle={commonStyles.textBold}
              accessory="edit"
              onPress={onEditPress}
            />
          );
        }
        if (config.type === "navigate") {
          return (
            <ValueRow
              key={property.code}
              label={label}
              accessory="navigate"
              onPress={actions[property.code]}
            />
          );
        }
        if (config.type === "bool") {
          return (
            <BoolRow
              key={property.code}
              label={label}
              value={property.value}
              onValueChange={(newValue) => {
                onPropertyChange?.(property.code, newValue);
              }}
            />
          );
        }
      })}
    </View>
  );
};

export default WaterValveController;
