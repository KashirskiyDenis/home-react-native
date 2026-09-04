import { StatusBar } from "react-native";
import { NavigationContainer } from "@react-navigation/native";
import AppStack from "./navigation/AppStack";

const App = () => {
  return (
    <>
      <StatusBar barStyle="dark-content" />
      <NavigationContainer>
        <AppStack />
      </NavigationContainer>
    </>
  );
};

export default App;
