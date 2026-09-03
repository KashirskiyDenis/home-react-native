import { createNativeStackNavigator } from "@react-navigation/native-stack";
import HomeScreen from "../screens/HomeScreen";
import DeviceDetailScreen from "../screens/DeviceDetailScreen";
import JournalScreen from "../screens/JournalScreen";
import SensorsScreen from "../screens/SensorsScreen";

const Stack = createNativeStackNavigator();

function AppStack() {
  return (
    <Stack.Navigator
      initialRouteName="Home"
      screenOptions={{
        headerBackTitleVisible: false,
        orientation: "portrait",
        contentStyle: {
          backgroundColor: "#ffffff",
        },
      }}
    >
      <Stack.Screen
        name="Home"
        component={HomeScreen}
        options={{
          title: "Устройства",
        }}
      />
      <Stack.Screen
        name="DeviceDetail"
        component={DeviceDetailScreen}
        options={({ route }) => ({
          title: route.params?.device.name || "Устройство",
        })}
      />
      <Stack.Screen
        name="Journal"
        component={JournalScreen}
        options={{
          title: "Журнал",
        }}
      />
      <Stack.Screen
        name="Sensors"
        component={SensorsScreen}
        options={{
          title: "Сенсоры",
        }}
      />
    </Stack.Navigator>
  );
}

export default AppStack;
