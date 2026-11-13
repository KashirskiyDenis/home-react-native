import { useState, useEffect } from "react";
import {
  Modal,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
} from "react-native";

function PopupModal({
  data,
  select,
  onSelect,
  fontSize = 18,
}) {
  let [visible, setVisible] = useState(false);
  let [selected, setSelected] = useState(
    select?.label ? select.label : undefined,
  );

  useEffect(() => {
    if (select) onSelect(select.value);
  }, []);

  let onItemPress = (item) => {
    setSelected(item.label);
    onSelect(item.value);
    setVisible(false);
  };

  let renderItem = () =>
    data.map((item) => {
      return (
        <TouchableOpacity
          onPress={() => {
            onItemPress(item);
          }}
        >
          <Text style={[styles.item, { fontSize: fontSize }]}>
            {item.label}
          </Text>
        </TouchableOpacity>
      );
    });

  return (
    <Modal
      visible={visible}
      transparent={true}
      animationType="fade"
      onRequestClose={() => {
        setVisible(false);
      }}
    >
      <TouchableOpacity
        onPress={() => {
          setVisible(false);
        }}
        style={styles.centeredView}
      >
        <TouchableWithoutFeedback>
          <View style={styles.modalView}>
            <ScrollView>{renderItem()}</ScrollView>
          </View>
        </TouchableWithoutFeedback>
      </TouchableOpacity>
    </Modal>
  );
}

let styles = StyleSheet.create({
  centeredView: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#0000002a",
  },
  modalView: {
    backgroundColor: "#ffffff",
    padding: 10,
    borderRadius: 7,
    width: "80%",
    maxHeight: 255,
  },
  item: {
    paddingVertical: 5,
  },
});

export default PopupModal;
