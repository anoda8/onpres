import React, {useEffect, useState} from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { DefaultTheme, Provider as PaperProvider } from 'react-native-paper';
import * as SecureStore from 'expo-secure-store'

import Login from './screens/auth/Login';
import Register from './screens/auth/Register';
import Activation from './screens/auth/Activation';
import Forgot from './screens/auth/Forgot';
import Resetpass from './screens/auth/Resetpass';

import Settings from './screens/Settings';
import AddEvents from './screens/AddEvents';
import AddAudiences from './screens/AddAudiences';
import DetailEvent from './screens/DetailEvent';
import DetailAudience from './screens/DetailAudience';
import ListEvents from './screens/ListEvents';
import ListAudiences from './screens/ListAudiences';
import Home from './screens/Home';

const theme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    primary: 'tomato',
    accent: 'yellow',
  },
};

const Stack = createNativeStackNavigator();

export default function App() {

  const [loggedIn, setLoggedIn] = useState(false);

  useEffect(async () => {
    let isMounted = true;
    if(isMounted){
      let jwt = null;
      try{
          jwt = await SecureStore.getItemAsync('jwtToken');
      }catch(error){
          console.log(error)
      }
      if(jwt != null){
        setLoggedIn(true);
      }
    }
    return () => {isMounted = false}
  },[])

  return loggedIn ? 
    (    
      <NavigationContainer>
      <Stack.Navigator initialRouteName='Home'>
        <Stack.Screen options={{ headerShown: false }} name="Home" component={Home} />
        <Stack.Screen name="ListEvents" component={ListEvents} />
        <Stack.Screen name="ListAudiences" component={ListAudiences} />
        <Stack.Screen name="AddEvents" component={AddEvents} />
        <Stack.Screen name="AddAudiences" component={AddAudiences} />
        <Stack.Screen name="DetailEvent" component={DetailEvent} />
        <Stack.Screen name="DetailAudience" component={DetailAudience} />
        <Stack.Screen name="Settings" component={Settings} />
      </Stack.Navigator>
    </NavigationContainer>     
    ) : (
      <NavigationContainer>
        <Stack.Navigator initialRouteName='Login'>
          <Stack.Screen options={{ headerShown: false }} name="Login" component={Login} />
          <Stack.Screen options={{ headerShown: false }} name="Register" component={Register} />
          <Stack.Screen options={{ headerShown: false }} name="Activation" component={Activation} />
          <Stack.Screen options={{ headerShown: false }} name="Forgot" component={Forgot} />
          <Stack.Screen options={{ headerShown: false }} name="Resetpass" component={Resetpass} />
        </Stack.Navigator>
      </NavigationContainer>         
    )
}

