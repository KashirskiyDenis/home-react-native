import { StyleSheet } from "react-native";

const commonStyles = StyleSheet.create({
  container: {
    paddingTop: 8,
  },
  listElement: {
    paddingHorizontal: 16,
    height: 48,
    borderBottomWidth: 1,
    borderColor: "#e0e0e0",
    justifyContent: "center",
  },
  listText: {
    fontSize: 16,
  },
  rowSwitch: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
});

export default commonStyles;
