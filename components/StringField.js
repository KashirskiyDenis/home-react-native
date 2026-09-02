import { StyleSheet, Text, View } from "react-native";
import commonStyles from "../styles/commonStyles";

function StringField({
  code,
  value,
  styleValue,
  edit = false,
  newScreen = false,
}) {
  return (
    <View style={commonStyles.listItem}>
      <View style={[commonStyles.listItemFlexRow]}>
        <Text style={commonStyles.listItemText}>
          {code}
          {!newScreen && !edit && (
            <>
              <Text style={commonStyles.listItemText}>: </Text>
              <Text style={[commonStyles.listItemText, styleValue]}>
                {value}
              </Text>
            </>
          )}
        </Text>
        {edit && <Text style={[commonStyles.listItemText]}>{value}</Text>}
        {newScreen && (
          <Text style={[commonStyles.listItemText, commonStyles.symbols]}>
            {value}
          </Text>
        )}
      </View>
    </View>
  );
}

export default StringField;
