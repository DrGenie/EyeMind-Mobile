import React, { useState, useContext } from 'react';
import { View, Text, Button, StyleSheet } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { AppContext } from '../App';

export default function AIRiskScreen({ navigation }) {
  const [q1, setQ1] = useState('0');
  const [q2, setQ2] = useState('0');
  const { setRiskResult, awardBadge } = useContext(AppContext);

  const calcRisk = () => {
    const score = parseInt(q1) + parseInt(q2);
    const level = score <= 1 ? 'Low' : score <= 2 ? 'Moderate' : 'High';
    const text = `Loneliness risk: ${level} (Score ${score}/4)`;
    setRiskResult(text);
    awardBadge('Risk Assessed');
    navigation.navigate('Gaze Engagement');
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Loneliness Risk Assessment</Text>
      <Text>How often do you feel left out?</Text>
      <Picker selectedValue={q1} onValueChange={setQ1} style={styles.picker}>
        <Picker.Item label="Never" value="0"/>
        <Picker.Item label="Sometimes" value="1"/>
        <Picker.Item label="Often" value="2"/>
      </Picker>
      <Text>How often do you lack companionship?</Text>
      <Picker selectedValue={q2} onValueChange={setQ2} style={styles.picker}>
        <Picker.Item label="Never" value="0"/>
        <Picker.Item label="Sometimes" value="1"/>
        <Picker.Item label="Often" value="2"/>
      </Picker>
      <Button title="Calculate Risk & Continue" onPress={calcRisk}/>
    </View>
  );
}

const styles = StyleSheet.create({
  container:{flex:1,padding:16,backgroundColor:'#f8f9fa'},
  title:{fontSize:20,marginBottom:16,fontWeight:'500'},
  picker:{background:'#fff',marginBottom:16}
});
