import { StyleSheet, Text, View } from "react-native";
import commonStyles from "../styles/commonStyles";

function ValueField({ code, value }) {
  return (
    <View style={commonStyles.listItem}>
      <View style={[commonStyles.listItemFlexRow]}>
        <Text style={commonStyles.listItemText}>
          {code}: <Text style={styles.textBold}>{value}</Text>
        </Text>
        <Text
          style={[
            commonStyles.listItemText,
            commonStyles.symbolsColor,
            commonStyles.symbols,
          ]}
          onPress={() => {}}
          accessibilityRole="button"
          accessibilityLabel="Изменить"
        >
          &#9998;
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  textBold: {
    fontWeight: "600",
  },
});

export default ValueField;
