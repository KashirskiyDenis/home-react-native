import { StyleSheet } from "react-native";
import { COLOR_ACCENT } from "../constants/colors";

const commonStyles = StyleSheet.create({
  container: {
    paddingTop: 8,
  },
  listItem: {
    paddingHorizontal: 16,
    height: 48,
    borderBottomWidth: 1,
    borderColor: "#e0e0e0",
    justifyContent: "center",
  },
  listItemFlexRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  listItemText: {
    fontSize: 16,
  },
  symbols: {
    fontSize: 24,
    fontWeight: "600",
    paddingRight: 3,
    color: COLOR_ACCENT,
  },
});

export default commonStyles;
