import { Text, View } from "react-native";
import commonStyles from "../styles/commonStyles";
import { ACCESSORY_SYMBOL } from "../constants/const";

function ValueRow({ label, value, accessory, valueStyle, onPress }) {
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
            accessibilityLabel={`${ACCESSORY_SYMBOL[accessory].accessibilityLabel} ${label}`}
            onPress={onPress}
          >
            {ACCESSORY_SYMBOL[accessory].sysmbol}
          </Text>
        )}
      </View>
    </View>
  );
}

export default ValueRow;
