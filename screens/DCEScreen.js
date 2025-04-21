import React, { useState, useContext } from 'react';
import { View, Text, Button, StyleSheet, TouchableOpacity } from 'react-native';
import { AppContext } from '../App';

export default function DCEScreen({ navigation }) {
  const { setDcePrefs, awardBadge } = useContext(AppContext);
  const [choices, setChoices] = useState({sc1:null,sc2:null,sc3:null});

  const scenarios = [
    {key:'sc1', A:'Weekly in‑person meetup', B:'Daily virtual call'},
    {key:'sc2', A:'Phone call every 2 days', B:'Group video chat weekly'},
    {key:'sc3', A:'Monthly event', B:'Daily app chat'}
  ];

  const select = (k,v) => setChoices(c=>({...c,[k]:v}));
  const submit = () => {
    let v=0,i=0,g=0,h=0,l=0;
    if(choices.sc1==='A'){i++;l++;g++;}else{v++;h++;}
    if(choices.sc2==='A'){g++;h++;}else{g++;l++;}
    if(choices.sc3==='A'){i++;l++;}else{v++;h++;}
    const prefs = {
      mode: v>=i?'Virtual':'In‑Person',
      size: g>=1?'Group':'One‑on‑One',
      freq: h>=l?'Frequent':'Less Frequent'
    };
    setDcePrefs(prefs);
    awardBadge('Preferences Set');
    navigation.navigate('Recommendations');
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Discrete Choice Experiment</Text>
      {scenarios.map(s=>(
        <View key={s.key} style={styles.scenario}>
          <Text style={styles.scTitle}>{s.key.toUpperCase()}</Text>
          <TouchableOpacity onPress={()=>select(s.key,'A')}>
            <Text style={choices[s.key]==='A'?styles.selected:styles.option}>A: {s.A}</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={()=>select(s.key,'B')}>
            <Text style={choices[s.key]==='B'?styles.selected:styles.option}>B: {s.B}</Text>
          </TouchableOpacity>
        </View>
      ))}
      <Button
        title="Submit & Continue"
        onPress={submit}
        disabled={!choices.sc1||!choices.sc2||!choices.sc3}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container:{flex:1,padding:16,backgroundColor:'#f8f9fa'},
  title:{fontSize:20,marginBottom:12,fontWeight:'500'},
  scenario:{background:'#fff',padding:12,marginBottom:8,borderRadius:4},
  scTitle:{fontWeight:'600',marginBottom:8},
  option:{padding:4},
  selected:{padding:4,color:'#007bff',fontWeight:'600'}
});
