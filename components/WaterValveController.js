import { View, TouchableOpacity } from "react-native";
import BoolField from "./BoolField";
import StringField from "./StringField";
import ValueField from "./ValueField";

function WaterValveController({
  navigation,
  properties,
  onToggleProperty,
  onPressAction,
}) {
  let names = [];
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
            <ValueField
              key={index}
              code={"Время уборки"}
              value={`${property.value} мин.`}
            />
          );
        } else if (property.code === "alarm" || property.code === "cleaning") {
          let code = property.code === "alarm" ? "Тревога" : "Уборка";
          return (
            <BoolField
              key={index}
              code={code}
              value={property.value}
              onValueChange={(newValue) => {
                onToggleProperty?.(newValue, property.code);
              }}
            />
          );
        } else if (property.code === "journal") {
          return (
            <TouchableOpacity
              key={index}
              onPress={() =>
                navigation.navigate("Journal", { journal: property.value })
              }
            >
              <StringField code={"Журнал"} newScreen={true} />
            </TouchableOpacity>
          );
        } else if (property.code === "sensors") {
          return (
            <TouchableOpacity
              key={index}
              onPress={() =>
                navigation.navigate("Sensors", {
                  sensors: property.value.match(/.{1,4}/g),
                  names,
                })
              }
            >
              <StringField code={"Сенсоры"} newScreen={true} />
            </TouchableOpacity>
          );
        }
      })}
    </View>
  );
}

export default WaterValveController;
