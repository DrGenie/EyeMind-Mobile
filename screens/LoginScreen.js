import React, { useState, useContext } from 'react';
import { View, Text, TextInput, Button, StyleSheet, Alert } from 'react-native';
import { AuthContext } from '../App';

export default function LoginScreen() {
  const [user, setUser] = useState('');
  const [pass, setPass] = useState('');
  const [attempts, setAttempts] = useState(0);
  const { login } = useContext(AuthContext);

  const handleLogin = () => {
    if (!user || !pass) {
      Alert.alert('Error', 'Username and password are required');
      return;
    }
    if (user === 'testuser' && pass === 'welcome123') {
      login('dummy-token');
    } else {
      const at = attempts + 1;
      setAttempts(at);
      if (at >= 5) {
        Alert.alert('Locked', 'Too many failed attempts. Contact support.');
      } else if (at >= 3) {
        Alert.alert('Warning', `Failed ${at}/5 attempts. Possible attack?`);
      } else {
        Alert.alert('Error', `Invalid credentials. ${at}/5 attempts.`);
      }
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>EyeMind Login</Text>
      <TextInput
        style={styles.input}
        placeholder="Username"
        value={user}
        onChangeText={setUser}
        autoCapitalize="none"
      />
      <TextInput
        style={styles.input}
        placeholder="Password"
        value={pass}
        onChangeText={setPass}
        secureTextEntry
      />
      <Button title="Login" onPress={handleLogin}/>
      <View style={styles.tips}>
        <Text style={styles.tipTitle}>Security Tips:</Text>
        <Text style={styles.tip}>• Always use HTTPS.</Text>
        <Text style={styles.tip}>• Use a strong, unique password.</Text>
        <Text style={styles.tip}>• Enable two‑factor authentication.</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container:{flex:1,justifyContent:'center',padding:16,backgroundColor:'#f8f9fa'},
  title:{fontSize:24,marginBottom:16,textAlign:'center',fontWeight:'500'},
  input:{borderWidth:1,borderColor:'#ccc',borderRadius:4,padding:8,marginBottom:12,background:'#fff'},
  tips:{marginTop:20},
  tipTitle:{fontWeight:'600'}, tip:{fontSize:12,marginVertical:2}
});
