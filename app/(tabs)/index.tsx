import ReleaseCard from "@/components/release";
import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Text } from "@/components/ui/text";
import { fetcher } from "@/utils/fetcher";
import { ANLIB_API_BASE } from "@/utils/s";
import { FlatList } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import useSWR from 'swr';

export default function Index() {
  
  const { data, error, isLoading } = useSWR(
	  ANLIB_API_BASE + "/anime/releases/latest?limit=42",
	  fetcher
	);
  if(isLoading) return (
    <SafeAreaView>
      <FlatList data={Array.from({ length: 42 })} keyExtractor={(_, index) => index.toString()} renderItem={({ index }) => (
        <Card key={index} size="md" variant="elevated" className="m-1 p-0">
          <Skeleton className="h-[70px]" />
        </Card>
      )} />
    </SafeAreaView>
  )
  if(error) return <Text>{error.message}</Text>
  return (
    <SafeAreaView>
      <FlatList data={data} keyExtractor={item => item.id} renderItem={({ item }) => <ReleaseCard release={item}/>}/>
    </SafeAreaView>
  );
}
