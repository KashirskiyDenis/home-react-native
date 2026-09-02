import { ScrollView, Text, View } from "react-native";
import commonStyles from "../styles/commonStyles";
import StringField from "../components/StringField";

const SensorsScreen = ({ route }) => {
  console.log(route.params);

  return (
    <ScrollView style={commonStyles.container}>
      {route.params?.sensors.map((sensor, index) => {
        return sensor !== "@~~;" ? (
          <StringField
            key={index}
            code={route.params?.names[index]}
            value={sensor}
          />
        ) : null;
      })}
    </ScrollView>
  );
};

export default SensorsScreen;
