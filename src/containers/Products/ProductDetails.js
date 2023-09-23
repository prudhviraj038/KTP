import React from 'react'
import { View, Text, Dimensions, I18nManager } from 'react-native'
import { Header, StockContainer, StockListView } from '@components';
import AutoHeightImage from 'react-native-auto-height-image';
import { Fonts, Colors, Images } from '@Themes';
import {
    responsiveHeight as rh,
    responsiveWidth as rw,
    responsiveFontSize as rf
} from "react-native-responsive-dimensions";
import HTML from "react-native-render-html";
const { height, width } = Dimensions.get("window")
export default function ProductDetails({ route }) {
    const { item } = route.params
    return (
        <View style={{ flex: 1, backgroundColor: 'white' }}>
            <View style={{ flex: 0.1 }}>
                <Header routing="ProductDetails" />
            </View>
            <View style={{ flex: 0.9, paddingHorizontal: 15 }}>
                <AutoHeightImage source={{ uri: item.image }} width={width / 1.1} style={{ alignSelf: "center", borderWidth: 1, borderColor: "lightgrey", borderRadius: 5 }} />
                <View style={{ flexDirection: "row", justifyContent: 'space-between', marginVertical: 10, }}>
                    <Text style={{
                        fontSize: rf(2), fontFamily: Fonts.medium, textAlign: 'center',


                    }}>{I18nManager.isRTL ? item.title_ar : item.title}</Text>
                    <Text style={{
                        fontSize: rf(2), fontFamily: Fonts.medium, textAlign: 'center',


                    }}>{item.price} SAR</Text>
                </View>
                <HTML tagsStyles={{
                    p: { fontFamily: Fonts.regular, fontSize: rf(1.5), textAlign: "left" },
                    div: {
                        fontFamily: Fonts.regular, fontSize: rf(1.5), textAlign: "left"
                    }
                }}
                    source={{ html: I18nManager.isRTL ? item.description_ar : item.description }}
                // html={data || '<p></p>'}
                />
            </View>
        </View>
    )
}
