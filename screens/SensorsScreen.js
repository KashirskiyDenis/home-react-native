import { ScrollView, Text, View } from "react-native";
import commonStyles from "../styles/commonStyles";
import ValueRow from "../components/ValueRow";

const SensorsScreen = ({ route }) => {
  const sensors = route.params?.sensors ?? [];
  const names = route.params?.names ?? [];

  return (
    <ScrollView style={commonStyles.container}>
      {sensors.map((sensor, index) => {
        return sensor !== "@~~;" ? (
          <ValueRow key={index} code={names[index]} value={sensor} />
        ) : null;
      })}
    </ScrollView>
  );
};

export default SensorsScreen;
