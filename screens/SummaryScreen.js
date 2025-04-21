import React, { useContext } from 'react';
import { View, Text, Button, StyleSheet } from 'react-native';
import { AppContext } from '../App';

export default function SummaryScreen({ navigation }) {
  const {
    riskResult, dcePrefs,
    recs, badges, reminders
  } = useContext(AppContext);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Summary Report</Text>

      <Text style={styles.heading}>Risk Level</Text>
      <Text>{riskResult}</Text>

      <Text style={styles.heading}>Preferences</Text>
      <Text>{JSON.stringify(dcePrefs)}</Text>

      <Text style={styles.heading}>Recommendations</Text>
      {recs.map((r,i)=><Text key={i}>• {r}</Text>)}

      <Text style={styles.heading}>Badges Earned</Text>
      <Text>{badges.join(', ')}</Text>

      <Text style={styles.heading}>Reminders</Text>
      {reminders.map((r,i)=><Text key={i}>• {r}</Text>)}

      <Button title="Done" onPress={()=>navigation.popToTop()} />
    </View>
  );
}

const styles = StyleSheet.create({
  container:{flex:1,padding:16,backgroundColor:'#f8f9fa'},
  title:{fontSize:20,marginBottom:16,fontWeight:'500'},
  heading:{marginTop:12,fontWeight:'600'}
});
