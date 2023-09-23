import React from 'react'
import { Dimensions } from 'react-native'
import { View, Text, Image } from 'react-native'
import { Images } from '@Themes'
const { height, width } = Dimensions.get("window")
export default function SplashScreen() {
    return (
        <View style={{ flex: 1 }}>
            <Image source={Images.splash} style={{ height: "100%", width: "100%" }} />
        </View>
    )
}
