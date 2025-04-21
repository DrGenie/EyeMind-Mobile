import React, { useContext, useState, useEffect } from 'react';
import { View, Text, Button, StyleSheet, TextInput, FlatList, Alert } from 'react-native';
import { Audio } from 'expo-av';
import * as Print from 'expo-print';
import * as Sharing from 'expo-sharing';
import { AppContext } from '../App';

export default function RecommendationsScreen({ navigation }) {
  const {
    riskResult, dcePrefs, recs, setRecs,
    reminders, setReminders, badges, awardBadge
  } = useContext(AppContext);
  const [soundURI, setSoundURI] = useState('');
  const [reminderText, setReminderText] = useState('');

  useEffect(()=>{
    const list = [];
    if (riskResult.includes('High')) {
      list.push(dcePrefs.mode==='Virtual'
        ? 'Join a daily online support group.'
        : 'Attend a weekly local meetup.');
    } else {
      list.push('Keep up your social routines.');
    }
    setRecs(list);
    awardBadge('Recommendations Viewed');
  },[]);

  const startRecording = async () => {
    const { status } = await Audio.requestPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Permission needed','Microphone permission is required');
      return;
    }
    const rec = new Audio.Recording();
    await rec.prepareToRecordAsync(Audio.RECORDING_OPTIONS_PRESET_HIGH_QUALITY);
    await rec.startAsync();
    rec.setOnRecordingStatusUpdate(st => {
      if (st.isDoneRecording) {
        rec.getURI().then(uri => {
          setSoundURI(uri);
          awardBadge('Audio Express');
        });
      }
    });
  };

  const stopRecording = async () => {
    await Audio.Recording.stopAndUnloadAsync();
  };

  const addReminder = () => {
    if (!reminderText) return;
    setReminders([...reminders, reminderText]);
    awardBadge('Planner');
    setReminderText('');
  };

  const exportPDF = async () => {
    const html = `
      <h1>EyeMind Summary</h1>
      <p><strong>Risk:</strong> ${riskResult}</p>
      <p><strong>Preferences:</strong> ${JSON.stringify(dcePrefs)}</p>
      <p><strong>Badges:</strong> ${badges.join(', ')}</p>
      <p><strong>Reminders:</strong> ${reminders.join(', ')}</p>
    `;
    const { uri } = await Print.printToFileAsync({ html });
    await Sharing.shareAsync(uri);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Personalized Recommendations</Text>
      <FlatList
        data={recs}
        keyExtractor={(_,i)=>i.toString()}
        renderItem={({item})=> <Text>• {item}</Text>}
      />

      <Text style={styles.subtitle}>Audio Journal</Text>
      <Button title="Start Recording" onPress={startRecording}/>
      <Button title="Stop & Play" onPress={stopRecording}/>
      {soundURI
        ? <Audio.Sound source={{uri:soundURI}} shouldPlay useNativeControls/>
        : null}

      <Text style={styles.subtitle}>Set Reminder</Text>
      <TextInput
        style={styles.input}
        placeholder="YYYY-MM-DD hh:mm"
        value={reminderText}
        onChangeText={setReminderText}
      />
      <Button title="Add Reminder" onPress={addReminder}/>
      <FlatList
        data={reminders}
        keyExtractor={(_,i)=>i.toString()}
        renderItem={({item})=> <Text>• {item}</Text>}
      />

      <Text style={styles.subtitle}>Export Summary</Text>
      <Button title="Share as PDF" onPress={exportPDF}/>
      <Button title="Next: Summary" onPress={()=>navigation.navigate('Summary')} />
    </View>
  );
}

const styles = StyleSheet.create({
  container:{flex:1,padding:16,backgroundColor:'#f8f9fa'},
  title:{fontSize:20,marginBottom:12,fontWeight:'500'},
  subtitle:{marginTop:16,fontWeight:'600'},
  input:{borderWidth:1,borderColor:'#ccc',padding:8,background:'#fff',marginBottom:8}
});
