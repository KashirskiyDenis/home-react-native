import { ScrollView } from "react-native";
import commonStyles from "../styles/commonStyles";
import ValueRow from "../components/ValueRow";
import { SENSOR_EMPTY_VALUE } from "../constants/labels"

const SensorsScreen = ({ route }) => {
  return (
    <ScrollView style={commonStyles.container}>
      {route.params?.sensors?.map((sensor) => {
        return sensor.value !== SENSOR_EMPTY_VALUE ? (
          <ValueRow key={sensor.name} label={sensor.name} value={sensor.value} />
        ) : null;
      })}
    </ScrollView>
  );
};

export default SensorsScreen;
