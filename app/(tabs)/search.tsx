import ReleaseCard from "@/components/release";
import { Input, InputField } from "@/components/ui/input";
import { Text } from "@/components/ui/text";
import { sendRequest } from "@/utils/fetcher";
import { ANLIB_API_BASE } from "@/utils/s";
import { H1 } from "@expo/html-elements";
import React from "react";
import { FlatList, NativeSyntheticEvent, TextInputSubmitEditingEventData } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import useSWRMutation from 'swr/mutation';
export default function Search() {
    const [inputValue, setInputValue] = React.useState("")

    const { trigger, isMutating, data, error } = useSWRMutation(ANLIB_API_BASE + "/app/search/releases?query=" + inputValue, sendRequest)

    function updateSearchQuery(ev: NativeSyntheticEvent<TextInputSubmitEditingEventData>) {
        setInputValue(inputValue)
        trigger()
    }

    return (
        <SafeAreaView>
            <Input className="my-1" isDisabled={isMutating}>
                <InputField
                    variant="rounded"
                    placeholder="password"
                    value={inputValue}
                    onSubmitEditing={updateSearchQuery}
                    onChangeText={(text) => setInputValue(text)}
                />
            </Input>
            {error && <Text>{error.toString()} {error.status}</Text>}
            {data && !isMutating ? <FlatList data={data} keyExtractor={item => item.id} renderItem={({ item }) => <ReleaseCard release={item}/>}/> : <Text>Loading</Text>}
            <H1>123
                123
                1
                23
                123
                12
                3

            </H1>
        </SafeAreaView>
    )
}