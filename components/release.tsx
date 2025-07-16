import { ANLIB_BASE } from "@/utils/s";
import { useRouter } from "expo-router";
import { Card } from "./ui/card";
import { Heading } from "./ui/heading";
import { Image } from "./ui/image";
import { Pressable } from "./ui/pressable";
import { Text } from "./ui/text";
import { VStack } from "./ui/vstack";

export default function ReleaseCard({ release }: any) {
  const router = useRouter();
  return (
    <Pressable onPress={() => router.navigate(`/releases/${release.id}`)}>
      <Card key={release.id} size="md" variant="elevated" className="m-1 p-0">
        <Image
          className="absolute w-full h-full opacity-20"
          alt={release.name.main}
          source={{ uri: ANLIB_BASE + release.poster.src }}
        />
        <VStack className="justify-center p-2">
          <Heading size="md" className="mb-1">
            {release.name.main}
          </Heading>
          <Text size="sm">
            {release.description && release.description.slice(0, 100)}...
          </Text>
        </VStack>
      </Card>
    </Pressable>
  );
}
