import { Text } from "@/components/ui/text";
import { fetcher } from "@/utils/fetcher";
import { ANLIB_API_BASE } from "@/utils/s";
import { useGlobalSearchParams } from "expo-router";
import * as ScreenOrientation from 'expo-screen-orientation';
import * as SecureStore from 'expo-secure-store';
import React, { useEffect } from "react";
import { StyleSheet } from "react-native";
import Video, { VideoRef } from 'react-native-video';
import useSWR from "swr";

export default function Player() {
    const { episodeId } = useGlobalSearchParams()
    const videoRef = React.useRef<VideoRef>(null);
    const [startSeek, setStartSeek] = React.useState<string>("0");
    
    const { data, error, isLoading } = useSWR(
      ANLIB_API_BASE + "/anime/releases/episodes/" + episodeId,
      fetcher,
        { refreshInterval: 0 }
	  );

    useEffect(() => {
      if(!data) return;
      SecureStore.getItemAsync(`ep_ct_${data.id}`).then((value) => {
        console.log("Start seek value:", value);
        if(value) {
          setStartSeek(value);
        }
      });
    }, [data]);

    if(isLoading) return <Text>Loading</Text>
    if(error) {
        if(error.status == 404) return <Text>Эпизод не найден</Text> 
        return <Text>{error.message}</Text>
    }

    

    return (
        <>
            <Video
                ref={videoRef}
                source={{
                  uri: data.hls_1080 ? data.hls_1080 : data.hls_720 ? data.hls_720 : data.hls_480,
                  metadata: {
                    title: data.name,
                    imageUri: data.preview ? ANLIB_API_BASE + data.preview.src : undefined
                  }
                }}
                style={{ width: '100%', height: '30%' }}
                controls
                poster={{
                  source: { uri: ANLIB_API_BASE + data.preview.src },
                  resizeMode: "cover",
                }}
                onFullscreenPlayerDidPresent={async () => await ScreenOrientation.lockAsync(ScreenOrientation.OrientationLock.LANDSCAPE)}
                onFullscreenPlayerDidDismiss={async () => await ScreenOrientation.unlockAsync()}
                resizeMode={'contain'}
                showNotificationControls={true}
                playInBackground={true}
                enterPictureInPictureOnLeave={true}
                chapters={[
                  data.opening && { title: "op", startTime: data.opening.start, endTime: data.opening.stop },
                  data.ending && { title: "end", startTime: data.ending.start, endTime: data.ending.stop }
                ]}
                progressUpdateInterval={1000}
                onLoad={() => {
                  if(videoRef.current && startSeek) {
                    videoRef.current.seek(parseFloat(startSeek));
                  }
                }}
                onProgress={async (progress) => {
                  if (progress.currentTime >= data.opening.start && progress.currentTime <= data.opening.stop) {
                    videoRef.current?.seek(data.opening.stop);
                  } else if (progress.currentTime >= data.ending.start && progress.currentTime <= data.ending.stop) {
                    videoRef.current?.seek(data.ending.stop);
                  }
                  await SecureStore.setItemAsync(`ep_ct_${data.id}`, progress.currentTime.toFixed(3));
                }}
            />
        </>
    )
}

const styles = StyleSheet.create({
  fullScreen: {
    position: 'absolute',
    top: 0,
    left: 0,
    bottom: 0,
    right: 0,
  }
});