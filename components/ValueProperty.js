import { StyleSheet, Text, View } from "react-native";
import commonStyles from "../styles/commonStyles";

function ValueProperty({ code, value }) {
  return (
    <View style={commonStyles.listElement}>
      <View style={commonStyles.rowSwitch}>
        <View>
          <Text style={commonStyles.listText}>{code}:</Text>
        </View>
        <View>
          <Text style={commonStyles.listText}>{value}</Text>
        </View>
      </View>
    </View>
  );
}

export default ValueProperty;
