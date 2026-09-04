import { StyleSheet, Switch, Text, View } from "react-native";
import commonStyles from "../styles/commonStyles";

function BoolRow({ code, value, onValueChange }) {
  return (
    <View style={commonStyles.listItem}>
      <View style={commonStyles.listItemFlexRow}>
        <Text style={commonStyles.listItemText}>{code}</Text>
        <Switch onValueChange={onValueChange} value={value} />
      </View>
    </View>
  );
}

export default BoolRow;
