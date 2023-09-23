import React from 'react'
import { View, Text } from 'react-native'
import { Chase } from 'react-native-animated-spinkit'
import { Colors } from '@Themes'
export default function Spinner({ initialLoad }) {
    // function renderSpinner() {
    //     return(

    //     )
    // }
    if (initialLoad) {
        return (
            <View style={{
                flex: 1,
                alignItems: 'center',
                justifyContent: 'center',
            }}>
                <Chase size={50} color={Colors.theme} />
            </View>
        )
    } else {


        return (
            <View style={{
                position: "absolute",
                top: 0,
                bottom: 0,
                right: 0,
                left: 0,
                backgroundColor: "#0e0e0e94",
                // backgroundColor: "#ffffff5e",
                alignItems: 'center',
                justifyContent: 'center',
            }}>
                <Chase size={50} color="#FFF" />
            </View>
        )
    }
}
