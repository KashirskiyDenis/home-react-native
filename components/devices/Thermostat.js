import { View } from "react-native";
import BoolRow from "../BoolRow";
import ValueRow from "../ValueRow";
import { DEVICE_PROPERTY_LABELS } from "../../constants/labels";
import commonStyles from "../../styles/commonStyles";

const string = (value) => value;
const tenths = (value) => `${value / 10}°C`;
const integer = (value) => `${value}°C`;

const PROPERTY_CONFIG = {
  mode: { type: "value", format: string },
  sensor_choose: { type: "value", format: string },
  temp_set: { type: "value", format: tenths },
  temp_correction: { type: "value", format: tenths },
  temp_current: { type: "value", format: tenths, editable: false },
  upper_temp: { type: "value", format: integer },
  lower_temp: { type: "value", format: integer },
  Temp_dif: { type: "value", format: integer },
  frost: { type: "bool" },
  child_lock: { type: "bool" },
  switch: { type: "bool" },
};

const Thermostat = ({ properties, onPropertyChange, onEditPress }) => {
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
              value={config.format(property.value)}
              valueStyle={commonStyles.textBold}
              {...(config.editable !== false && {
                accessory: "edit",
                onPress: onEditPress,
              })}
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

        return null;
      })}
    </View>
  );
};

export default Thermostat;
