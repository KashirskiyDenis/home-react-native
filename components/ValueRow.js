import { StyleSheet, Text, View } from "react-native";
import commonStyles from "../styles/commonStyles";
import { ACCESSORY_SYMBOL } from "../constants/const";

function OtherRow({ label, value, accessory, valueStyle, onPress }) {
  return (
    <View style={commonStyles.listItem}>
      <View style={[commonStyles.listItemFlexRow]}>
        <Text style={commonStyles.listItemText}>
          {label}
          <>
            <Text style={commonStyles.listItemText}>: </Text>
            <Text style={[commonStyles.listItemText, valueStyle]}>{value}</Text>
          </>
        </Text>
        {accessory && (
          <Text
            style={[commonStyles.listItemText, commonStyles.symbols]}
            accessibilityRole="button"
            accessibilityLabel={`Введите новое значение для свойства ${label}`}
            onPress={onPress}
          >
            {ACCESSORY_SYMBOL[accessory]}
          </Text>
        )}
      </View>
    </View>
  );
}

export default OtherRow;
