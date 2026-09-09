import { Pressable, Text, View } from "react-native";
import commonStyles from "../styles/commonStyles";
import { ACCESSORY_CONFIG } from "../constants/const";

function ValueRow({ label, value, accessory, valueStyle, onPress }) {
  return (
    <View style={commonStyles.listItem}>
      <View style={commonStyles.listItemFlexRow}>
        <Text style={commonStyles.listItemText}>
          {label}
          <>
            <Text style={commonStyles.listItemText}>: </Text>
            <Text style={[commonStyles.listItemText, valueStyle]}>{value}</Text>
          </>
        </Text>
        {accessory && (
          <Pressable
            accessibilityRole="button"
            accessibilityLabel={`${ACCESSORY_CONFIG[accessory].accessibilityLabel} ${label}`}
            onPress={onPress}
          >
            <Text style={[commonStyles.listItemText, commonStyles.symbols]}>
              {ACCESSORY_CONFIG[accessory].symbol}
            </Text>
          </Pressable>
        )}
      </View>
    </View>
  );
}

export default ValueRow;
