import { Image, StyleSheet, Button } from 'react-native';
import { useCallback, useEffect, useState } from 'react';
import Slider from '@react-native-community/slider';
import axios from 'axios';
import { debounce } from "lodash";
import { HelloWave } from '@/components/HelloWave';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import ParallaxScrollView from '@/components/ParallaxScrollView';

const SERVER_URL = "your-ip-here"; 

const HomeScreen = () => {
  const [volume, setVolume] = useState(0);

  useEffect(() => {
    const getVolume = async () => {
      try {
        const response = await axios.get(`${SERVER_URL}/volume`);
        setVolume(response.data.volume);
      } catch (error) {
        console.error("Error getting volume:", error);
      }
    };

    getVolume()
  }, [])

  const updateVolume = useCallback(
    debounce(async (volume) => {
      console.log("Setting volume to:", volume);
      try {
        await axios.post(`${SERVER_URL}/volume`, { volume });
      } catch (error) {
        console.error("Error setting volume:", error);
      }
    }, 500),
    []
  );

  const handleVolumeChange = (value: number) => {
    setVolume(value);
    updateVolume(value);
  };

  return (
    <ParallaxScrollView
      headerBackgroundColor={{ light: '#A1CEDC', dark: '#1D3D47' }}
      headerImage={
        <Image
          source={require('@/assets/images/partial-react-logo.png')}
          style={styles.reactLogo}
        />
      }>
      <ThemedView style={styles.titleContainer}>
        <ThemedText type="title">Welcome!</ThemedText>
        <HelloWave />
      </ThemedView>
      <ThemedView style={styles.stepContainer}>
        <ThemedText type="subtitle">Set your PC volume</ThemedText>
        <ThemedText>
          Scoll it up to{' '}
          <ThemedText type="defaultSemiBold">increase the volume</ThemedText> 
          {' '}or scroll it down to{' '}
          <ThemedText type="defaultSemiBold">decrease the volume</ThemedText> 
        </ThemedText>

        <ThemedText>Volume: {volume}%</ThemedText>
        <Slider
          style={styles.slider}
          minimumValue={0}
          maximumValue={100}
          step={1}
          onValueChange={handleVolumeChange}
          minimumTrackTintColor="#1E90FF"
          maximumTrackTintColor="#D3D3D3"
          thumbTintColor="#1E90FF"
        />
        <Button title="Mute" onPress={() => handleVolumeChange(0)} />
      </ThemedView>
    </ParallaxScrollView>
  );
}

const styles = StyleSheet.create({
  titleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  stepContainer: {
    gap: 8,
    marginBottom: 8,
  },
  reactLogo: {
    height: 178,
    width: 290,
    bottom: 0,
    left: 0,
    position: 'absolute',
  },
  slider: {
    paddingVertical: 16
  }
});

export default HomeScreen;