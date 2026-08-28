import { View, TouchableOpacity } from "react-native";
import BoolProperty from "./BoolProperty";
import StringProperty from "./StringProperty";
import ValueProperty from "./ValueProperty";
import { COLOR_ACCENT } from "../constants/colors";

function WaterValveController({ navigation, properties, onToggleProperty }) {
  let names = [];
  for (let i = 0; i < properties.length; i++) {
    if (properties[i].code.includes("names")) {
      names.push(...properties[i].value.split(";"));
    }
  }

  return (
    <View>
      {properties.map((item, index) => {
        if (item.code === "use_time") {
          return (
            <ValueProperty
              key={index}
              code={"Время уборки"}
              value={item.value}
            />
          );
        } else if (item.code === "alarm" || item.code === "cleaning") {
          let code = item.code === "alarm" ? "Тревога" : "Уборка";
          return (
            <BoolProperty
              key={index}
              code={code}
              value={item.value}
              onValueChange={(newValue) => {
                onToggleProperty?.(item.code, newValue);
              }}
            />
          );
        } else if (item.code === "journal") {
          return (
            <TouchableOpacity
              key=""
              onPress={() =>
                navigation.navigate("Journal", { journal: item.value })
              }
            >
              <StringProperty
                key={index}
                code={"Журнал"}
                value="&#9654;"
                style={{ color: COLOR_ACCENT }}
              />
            </TouchableOpacity>
          );
        } else if (item.code === "sensors") {
          let sensors = item.value.match(/.{1,4}/g);

          return sensors.map((sensor, i) => {
            return sensor !== "@~~;" ? (
              <StringProperty key={i} code={names[i]} value={sensor} />
            ) : null;
          });
        }

        return null;
      })}
    </View>
  );
}

export default WaterValveController;
