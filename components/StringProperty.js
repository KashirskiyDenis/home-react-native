import { StyleSheet, Text, View } from "react-native";
import commonStyles from "../styles/commonStyles";
import { COLOR_ACCENT } from "../constants/colors";

function StringProperty({ code, value, style = {} }) {
  return (
    <View style={commonStyles.listElement}>
      <View style={commonStyles.rowSwitch}>
        <View>
          <Text style={commonStyles.listText}>{code}:</Text>
        </View>
        <View>
          <Text style={[commonStyles.listText, style]}>{value}</Text>
        </View>
      </View>
    </View>
  );
}

export default StringProperty;
