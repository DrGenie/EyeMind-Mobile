import React, { useState, useRef, useContext } from 'react';
import { View, Text, Button, StyleSheet, PanResponder } from 'react-native';
import { AppContext } from '../App';

export default function GazeScreen({ navigation }) {
  const { setGazeStats, awardBadge } = useContext(AppContext);
  const [calibrated, setCalibrated] = useState([false,false,false,false]);
  const [isCalibrated, setIsCalibrated] = useState(false);
  const [tracking, setTracking] = useState(false);
  const positions = useRef([]);

  const handleCal = idx => {
    const arr = [...calibrated]; arr[idx] = true; setCalibrated(arr);
    if (arr.every(v=>v)) setIsCalibrated(true);
  };

  const pan = useRef(PanResponder.create({
    onStartShouldSetPanResponder:()=>tracking,
    onPanResponderGrant: e => positions.current.push({x:e.nativeEvent.locationX, t:Date.now()}),
    onPanResponderMove:  e => positions.current.push({x:e.nativeEvent.locationX, t:Date.now()})
  })).current;

  const startTracking = () => { positions.current=[]; setTracking(true); };
  const stopTracking = () => {
    setTracking(false);
    const fix = positions.current.filter((p,i,a)=>a.filter(x=>Math.abs(x.x-p.x)<20).length>3);
    setGazeStats({points:positions.current.length, fixations:fix.length});
    awardBadge('Gaze Tracked');
    navigation.navigate('DCE');
  };

  return (
    <View style={styles.container} {...pan.panHandlers}>
      <Text style={styles.title}>Gaze Engagement Calibration</Text>
      <Text>Tap each corner:</Text>
      <View style={styles.calArea}>
        {[0,1,2,3].map(i=>(
          <Button key={i}
            title={calibrated[i]?'✓':''}
            onPress={()=>handleCal(i)}
            color={calibrated[i]?'green':'#007bff'}
            style={[styles.dot, styles[`dot${i}`]]}
          />
        ))}
      </View>
      {isCalibrated && <>
        <Button title={tracking?'Tracking…':'Start Tracking'} onPress={startTracking} disabled={tracking}/>
        <Button title="Stop & Continue" onPress={stopTracking} disabled={!tracking}/>
      </>}
    </View>
  );
}

const styles = StyleSheet.create({
  container:{flex:1,padding:16,backgroundColor:'#f8f9fa'},
  title:{fontSize:20,marginBottom:12,fontWeight:'500'},
  calArea:{height:200,background:'#ddd',marginVertical:16,position:'relative'},
  dot:{position:'absolute',width:30,height:30,borderRadius:15},
  dot0:{top:0,left:0}, dot1:{top:0,right:0},
  dot2:{bottom:0,right:0}, dot3:{bottom:0,left:0}
});
