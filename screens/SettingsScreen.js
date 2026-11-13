import { useCallback, useEffect, useRef, useState } from "react";
import {
  RefreshControl,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import commonStyles from "../styles/commonStyles";

const SettingsScreen = ({ navigation }) => {
  const onInfoPress = () => {
    navigation.navigate("Settings");
  };

  return (
    <View style={commonStyles.container}>
      <ScrollView>
        <ValueRow
          label="Информация об устройстве"
          accessory="navigate"
          onPress={onInfoPress}
        />
      </ScrollView>
    </View>
  );
};

export default SettingsScreen;
