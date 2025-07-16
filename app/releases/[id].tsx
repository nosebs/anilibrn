import { Card } from "@/components/ui/card";
import { Heading } from "@/components/ui/heading";
import { Image } from "@/components/ui/image";
import { Pressable } from "@/components/ui/pressable";
import { Text } from "@/components/ui/text";
import { fetcher } from "@/utils/fetcher";
import { ANLIB_API_BASE, ANLIB_BASE } from "@/utils/s";
import { router, useGlobalSearchParams } from "expo-router";
import * as SecureStore from 'expo-secure-store';
import { Suspense } from "react";
import { ScrollView } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import useSWR from "swr";

export default function Release() {
  const { id } = useGlobalSearchParams()
  const { data, error, isLoading } = useSWR(
	  ANLIB_API_BASE + "/anime/releases/" + id,
	  fetcher
	);
  if(isLoading) return <Text>Loading</Text>
  if(error) {
    if(error.status == 404) return <Text>Релиз не найден</Text> 
    return <Text>{error.message}</Text>
  }

  function secondsToMMSS(seconds: number) {
    const minutes = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${minutes}:${secs < 10 ? '0' : ''}${secs}`;
  }
  
  return (
    <SafeAreaView edges={['left', 'right']}>
      <ScrollView>
        <Image
          source={{
            uri: ANLIB_BASE + data.poster.src,
          }}
          alt={data.name.main}
          className="h-[455px] w-full max-w-[650px]"
        />
        <Card size="md" variant="elevated" className="m-1">
          <Text size="2xl">{data.name.main} {data.is_ongoing && <Heading>Онгоинг</Heading>}</Text>
          <Text>{data.description}</Text>

          <Heading>Жанры: <Text>{data.genres.map((v) => v.name).join(", ")}</Text></Heading>
          <Heading>Год выхода: <Text>{data.year}</Text></Heading>
        </Card>
        {data.episodes.length > 0 &&
          <Card size="md" variant="elevated" className="m-1">
              {
                data.episodes.map((v) => (
                  <Pressable className="m-1"  key={v.id} onPress={() => router.navigate("/player/" + v.id)}>
                    <Text>{v.ordinal} - {v.name}</Text>
                    <Text>Обновлено {new Date(v.updated_at).toString()}</Text>
                    <Suspense>
                      {
                        SecureStore.getItemAsync(`ep_ct_${v.id}`).then((value) => {
                          if(value) {
                            return <Text>Продолжить с {secondsToMMSS(parseFloat(value))} сек</Text>
                          }
                        })
                      }
                    </Suspense>
                  </Pressable>
                ))
              }
          </Card>
        }
      </ScrollView>
    </SafeAreaView>
    
  )
}