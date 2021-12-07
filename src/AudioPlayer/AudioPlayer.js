import React, { useState, useRef } from "react";
import { Text, View, TouchableOpacity, ActivityIndicator, LayoutAnimation, UIManager, Image } from "react-native";
import { styles } from "./styles";
import Video from "react-native-video";
import Slider from "@react-native-community/slider";
import { toHHMMSS } from "./utils";
import { Images } from "./assets/index";

UIManager.setLayoutAnimationEnabledExperimental &&
  UIManager.setLayoutAnimationEnabledExperimental(true);

const volumeControlTime = 3000;
 
export const AudioPlayer = (props) => {
  const { url, style } = props;
  const [paused, setPaused] = useState(true);

  const videoRef = useRef(null);
  const controlTimer = useRef(0);

  const [totalLength, setTotalLength] = useState(0);
  const [currentPosition, setCurrentPosition] = useState(0);
  const [loading, setLoading] = useState(false);
  const [volume, setVolume] = useState(0.7);
  const [volumeControl, setVolumeControl] = useState(false);
  const [repeat, setRepeat] = useState(false);

  const onSeek = (time) => {
    time = Math.round(time);
    videoRef && videoRef.current.seek(time);
    setCurrentPosition(time);
    setPaused(false);
  };

  const fixDuration = (data) => {
    setLoading(false);
    setTotalLength(Math.floor(data.duration));
  };

  const setTime = (data) => {
    setCurrentPosition(Math.floor(data.currentTime));
  };

  const togglePlay = () => {
    setPaused(!paused);
  };

  const toggleRepeat = () => {
    setRepeat(!repeat);
  };

  const toggleVolumeControl = () => {
    setVolumeTimer(!volumeControl);
    LayoutAnimation.easeInEaseOut();
    setVolumeControl(!volumeControl);
  };

  const setVolumeTimer = (setTimer = true) => {
    clearTimeout(controlTimer.current);
    controlTimer.current = 0;
    if (setTimer) {
      controlTimer.current = setTimeout(() => {
        LayoutAnimation.easeInEaseOut();
        setVolumeControl(false);
      }, volumeControlTime);
    }
  };

  const onVolumeChange = (vol) => {
    setVolumeTimer();
    setVolume(vol);
  };

  const resetAudio = () => {
    if (!repeat) {
      setPaused(true);
    }
    setCurrentPosition(0);
  };

  return (
    <View style={[style && style, {}]}>
      <Video
        source={{ uri: url }}
        ref={videoRef}
        playInBackground={false}
        audioOnly={true}
        playWhenInactive={false}
        paused={paused}
        onEnd={resetAudio}
        onLoad={fixDuration}
        onLoadStart={() => setLoading(true)}
        onProgress={setTime}
        volume={volume}
        repeat={repeat}
        style={{ height: 0, width: 0 }}
      />

      <View>
        <View style={[styles.rowContainer, {flexDirection: 'row'}]}> 
          <View style={{flex:1, maxWidth: 50}}>
            {loading && (
              <View style={{ margin: 18 }}>
                <ActivityIndicator size="large" color="#FFF"/>
              </View>
            ) || (
              <View style={styles.actionsContainer}>
                <TouchableOpacity style={[styles.iconContainer, styles.playBtn]} onPress={togglePlay}>
                  <Image
                    source={paused ? Images.playIcon : Images.pauseIcon}
                    style={styles.playIcon}
                  />
                </TouchableOpacity>
              </View>
            )}
          </View>
          <View style={styles.sliderContainer}>
            <Slider
              style={styles.slider}
              minimumValue={0}
              maximumValue={Math.max(totalLength, 1, currentPosition + 1)}
              minimumTrackTintColor={'#927B5F'}
              maximumTrackTintColor={'#dbcec2'}
              onSlidingComplete={onSeek}
              value={currentPosition}
              thumbTintColor={'#927B5F'}
            />
            <View style={styles.durationContainer}>
              <Text style={styles.timeText}>
                {toHHMMSS(currentPosition)}
              </Text>
              <Text style={styles.timeText}>
                {toHHMMSS(totalLength)}
              </Text>
            </View>
          </View>
        </View>
      </View>
    </View>
  );
};
