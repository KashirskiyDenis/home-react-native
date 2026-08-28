import { StyleSheet, Switch, Text, View } from "react-native";
import commonStyles from "../styles/commonStyles";

function BoolProperty({ code, value, onValueChange }) {
  return (
    <View style={commonStyles.listElement}>
      <View style={commonStyles.rowSwitch}>
        <View>
          <Text style={commonStyles.listText}>{code}</Text>
        </View>
        <View>
          <Switch onValueChange={onValueChange} value={value} />
        </View>
      </View>
    </View>
  );
}

export default BoolProperty;
