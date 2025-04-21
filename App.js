import React, { useState, useEffect, createContext } from 'react';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import AsyncStorage from '@react-native-async-storage/async-storage';

import LoginScreen      from './screens/LoginScreen';
import AIRiskScreen     from './screens/AIRiskScreen';
import GazeScreen       from './screens/GazeScreen';
import DCEScreen        from './screens/DCEScreen';
import Recommendations  from './screens/RecommendationsScreen';
import SummaryScreen    from './screens/SummaryScreen';

export const AuthContext = createContext();
export const AppContext  = createContext();

const Stack = createNativeStackNavigator();

export default function App() {
  const [token,      setToken]      = useState(null);
  const [riskResult, setRiskResult] = useState('');
  const [gazeStats,  setGazeStats]  = useState(null);
  const [dcePrefs,   setDcePrefs]   = useState(null);
  const [recs,       setRecs]       = useState([]);
  const [reminders,  setReminders]  = useState([]);
  const [badges,     setBadges]     = useState([]);

  const authContext = {
    login: async t => {
      setToken(t);
      await AsyncStorage.setItem('userToken', t);
    },
    logout: async () => {
      setToken(null);
      await AsyncStorage.removeItem('userToken');
    }
  };

  useEffect(() => {
    AsyncStorage.getItem('userToken').then(t => {
      if (t) setToken(t);
    });
  }, []);

  const appContext = {
    riskResult,    setRiskResult,
    gazeStats,     setGazeStats,
    dcePrefs,      setDcePrefs,
    recs,          setRecs,
    reminders,     setReminders,
    badges,        setBadges,
    awardBadge: n  => setBadges(b => b.includes(n) ? b : [...b, n])
  };

  return (
    <GestureHandlerRootView style={{flex:1}}>
      <AuthContext.Provider value={authContext}>
        <AppContext.Provider value={appContext}>
          <NavigationContainer>
            <Stack.Navigator>
              {!token
                ? <Stack.Screen name="Login" component={LoginScreen} options={{headerShown:false}}/>
                : <>
                    <Stack.Screen name="AI Risk" component={AIRiskScreen}/>
                    <Stack.Screen name="Gaze Engagement" component={GazeScreen}/>
                    <Stack.Screen name="DCE" component={DCEScreen}/>
                    <Stack.Screen name="Recommendations" component={Recommendations}/>
                    <Stack.Screen name="Summary" component={SummaryScreen}/>
                  </>
              }
            </Stack.Navigator>
          </NavigationContainer>
        </AppContext.Provider>
      </AuthContext.Provider>
    </GestureHandlerRootView>
  );
}
