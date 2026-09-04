import { View, StyleSheet } from "react-native";
import BoolRow from "./BoolRow";
import ValueRow from "./ValueRow";

function WaterValveController({
  navigation,
  properties,
  onToggleProperty,
  onPressAction,
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
              code={property.code}
              value={property.value}
              valueStyle={[styles.textBold]}
              accessory={"edit"}
              onPress={onPressAction}
            />
          );
        } else if (property.code === "alarm" || property.code === "cleaning") {
          let code = property.code === "alarm" ? "Тревога" : "Уборка";
          return (
            <BoolRow
              key={index}
              code={code}
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
              code={"Журнал"}
              accessory={"triangle"}
              onPress={() =>
                navigation.navigate("Journal", { journal: property.value })
              }
            />
          );
        } else if (property.code === "sensors") {
          return (
            <ValueRow
              key={index}
              code={"Сенсоры"}
              accessory={"triangle"}
              onPress={() =>
                navigation.navigate("Sensors", {
                  sensors: property.value.match(/.{1,4}/g),
                  names,
                })
              }
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
