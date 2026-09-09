import { ScrollView } from "react-native";
import commonStyles from "../styles/commonStyles";
import ValueRow from "../components/ValueRow";

const SensorsScreen = ({ route }) => {
  return (
    <ScrollView style={commonStyles.container}>
      {route.params?.sensors?.map((sensor) => {
        return sensor.value !== "@~~;" ? (
          <ValueRow key={sensor.name} label={sensor.name} value={sensor.value} />
        ) : null;
      })}
    </ScrollView>
  );
};

export default SensorsScreen;
