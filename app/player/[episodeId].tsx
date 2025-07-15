import { Text } from "@/components/ui/text";
import { fetcher } from "@/utils/fetcher";
import { ANLIB_API_BASE } from "@/utils/s";
import { useGlobalSearchParams } from "expo-router";
import { useVideoPlayer, VideoView } from 'expo-video';
import { useEffect, useState } from "react";
import { StyleSheet, View } from "react-native";
import useSWR from "swr";

export default function Player() {
    const { episodeId } = useGlobalSearchParams()
    const { data, error, isLoading } = useSWR(
	  ANLIB_API_BASE + "/anime/releases/episodes/" + episodeId,
	  fetcher,
      { refreshInterval: 0 }
	);

    const [currentSource, setCurrentSource] = useState("");
    const player = useVideoPlayer(currentSource, (player) => {
        player.play();
    });

    useEffect(() => {
        console.log(data)
        if(data) setCurrentSource(data.hls_1080)
    }, [data])

    if(isLoading) return <Text>Loading</Text>
    if(error) {
        if(error.status == 404) return <Text>Эпизод не найден</Text> 
        return <Text>{error.message}</Text>
    }
    
    return (
        <View style={styles.contentContainer}>
            <VideoView style={styles.video} player={player} allowsFullscreen allowsPictureInPicture />
        </View>
    )
}

const styles = StyleSheet.create({
  contentContainer: {
    flex: 1,
    padding: 10,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 50,
  },
  video: {
    width: 350,
    height: 275,
  }
});