import { ScrollView, Text, View } from "react-native";
import commonStyles from "../styles/commonStyles";

const JournalScreen = ({ route }) => {
  let journal =
    route.params?.journal.length === 0 ? [] : route.params?.journal.split(";");

  return (
    <ScrollView style={commonStyles.container}>
      {journal.map((item, index) => {
        return (
          <View style={commonStyles.listItem} key={index}>
            <Text style={commonStyles.listItemText}>{item}</Text>
          </View>
        );
      })}
    </ScrollView>
  );
};

export default JournalScreen;
