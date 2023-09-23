import React, { useContext } from 'react'
import { View, Text, FlatList, StyleSheet, Image, I18nManager, Pressable } from 'react-native'
import { Fonts, Colors } from '@Themes';
import HTML from "react-native-render-html";
import { LanguageContext } from '@context/lang-context';
import { useNavigation } from '@react-navigation/native';
import {
    responsiveHeight as rh,
    responsiveWidth as rw,
    responsiveFontSize as rf
} from "react-native-responsive-dimensions";
export default function OurProducts({ products }) {
    const { lang, setLang } = useContext(LanguageContext);
    const navigation = useNavigation();
    const renderItem = ({ item }) => {
        return (
            <Pressable style={styles.itemView} onPress={() => navigation.push("ProductDetails", { item })}>
                <View style={styles.imageView}>
                    <View style={styles.imgBorder}>
                        <Image source={{ uri: item.image }} style={styles.img} />
                    </View>
                </View>
                <View style={styles.titleView}>
                    <Text style={styles.text}>{I18nManager.isRTL ? item.title_ar : item.title}</Text>
                </View>
                <View style={styles.descView}>
                    {/* <Text style={{ fontFamily: Fonts.regular, fontSize: 13 }}>{item.description}</Text> */}
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
            </Pressable>
        )
    };
    const _renderHeader = ({ item }) => {
        return (
            <View style={styles.row}>
                <View style={styles.imageView}>
                    <Text style={styles.header}>{lang["Image"]}</Text>
                </View>
                <View style={styles.titleView}>
                    <Text style={styles.header}>{lang["Item"]}</Text>
                </View>
                <View style={styles.descView}>
                    <Text style={styles.header}>{lang["Description"]}</Text>
                </View>
            </View>
        )
    }
    return (
        <View style={styles.container}>

            <View style={styles.content} >
                {products && products.length > 0 ? (
                    <FlatList
                        data={products}
                        renderItem={renderItem}
                        keyExtractor={item => item.id}
                        ListHeaderComponent={_renderHeader}
                    />
                ) : (<Text style={styles.noData}>{lang["No Data Found"]}</Text>)}

            </View>
        </View>
    )
}
const styles = StyleSheet.create({
    container: { flex: 1, },
    content: { flex: 0.9 },
    itemView: {
        // flex: 1,
        flexDirection: 'row',
        marginTop: 10
    },
    header: { fontFamily: Fonts.medium, fontSize: rf(1.8), textAlign: 'left' },
    text: { fontFamily: Fonts.regular, fontSize: rf(1.5), textAlign: 'left' },
    row: { flex: 1, flexDirection: 'row' },
    imageView: { flex: 0.25, justifyContent: 'center', alignItems: 'center', },
    titleView: { flex: 0.35, justifyContent: 'center', },
    descView: { flex: 0.4, justifyContent: 'center', },
    imgBorder: { height: rh(8), width: rh(8), borderRadius: 5, borderWidth: 1, borderColor: 'lightgrey', justifyContent: 'center', alignItems: 'center', },
    img: { height: rh(4), width: rh(4) },
    noData: { fontFamily: Fonts.medium, fontSize: rf(1.8), textAlign: 'center', marginTop: 20 }
})
