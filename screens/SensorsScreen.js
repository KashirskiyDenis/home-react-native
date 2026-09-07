import { ScrollView, Text, View } from "react-native";
import commonStyles from "../styles/commonStyles";
import ValueRow from "../components/ValueRow";

const SensorsScreen = ({ route }) => {
  return (
    <ScrollView style={commonStyles.container}>
      {route.params?.sensors?.map((sensor, index) => {
        return sensor[1] !== "@~~;" ? (
          <ValueRow key={index} label={sensor[0]} value={sensor[1]} />
        ) : null;
      })}
    </ScrollView>
  );
};

export default SensorsScreen;
