import { StyleSheet, Text, View } from "react-native";
import commonStyles from "../styles/commonStyles";

function StringField({
  code,
  value,
  styleValue,
  edit = false,
  newScreen = false,
  onPressAction,
}) {
  return (
    <View style={commonStyles.listItem}>
      <View style={[commonStyles.listItemFlexRow]}>
        <Text style={commonStyles.listItemText}>
          {code}
          <>
            <Text style={commonStyles.listItemText}>: </Text>
            <Text style={[commonStyles.listItemText, styleValue]}>{value}</Text>
          </>
        </Text>
        {edit && (
          <Text
            style={[commonStyles.listItemText, commonStyles.symbols]}
            accessibilityRole="button"
            accessibilityLabel={`Введите новое значение для свойства ${code}`}
            onPress={onPressAction}
          >
            &#9998;
          </Text>
        )}
        {newScreen && (
          <Text style={[commonStyles.listItemText, commonStyles.symbols]}>
            &#9655;
          </Text>
        )}
      </View>
    </View>
  );
}

export default StringField;
