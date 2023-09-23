import React, { useContext } from 'react'
import { View, Text, FlatList, TouchableOpacity, I18nManager, StyleSheet } from 'react-native'
import { Fonts, Colors, Images } from '@Themes';
import { LanguageContext } from '@context/lang-context';
import AutoHeightImage from 'react-native-auto-height-image';
import {
    responsiveHeight as rh,
    responsiveWidth as rw,
    responsiveFontSize as rf
} from "react-native-responsive-dimensions";
export default function StockListView({ selectedStock }) {
    const { lang, setLang } = useContext(LanguageContext);
    const _renderItem = ({ item, index }) => {
        return (
            <View style={styles.rowData} >
                <View style={styles.codeView}>
                    <Text style={styles.text}>{item.id}</Text>
                </View>
                <View style={styles.descView}>


                    <Text style={styles.text}>{I18nManager.isRTL ? item.title_ar : item.title}</Text>

                </View>

                <View style={styles.emptyView} />

                <View style={styles.qtyView}>
                    <Text style={styles.text}>{item.qty}</Text>
                </View>


            </View>
        )
    };
    const _renderHeader = ({ item, index }) => {
        return (
            <View style={styles.rowHeader} >
                <View style={styles.codeView}>
                    <Text style={styles.header}>{lang["Code"]}</Text>
                </View>
                <View style={styles.descView}>


                    <Text style={styles.header}>{lang["Description"]}</Text>

                </View>
                <View style={styles.emptyView} />


                <View style={styles.qtyView}>
                    <Text style={styles.header}>{lang["Qty"]}</Text>
                </View>



            </View>
        )
    };
    return (
        <View>
            {selectedStock && selectedStock.length > 0 ? (
                <FlatList
                    data={selectedStock}
                    renderItem={_renderItem}
                    keyExtractor={item => item.id}
                    ListHeaderComponent={_renderHeader}
                    style={styles.listView}
                // horizontal
                />
            ) : null}
        </View>
    )
}
const styles = StyleSheet.create({
    header: {
        fontSize: rf(1.5), fontFamily: Fonts.medium, textAlign: 'left'
    },
    text: {
        fontSize: rf(1.5), fontFamily: Fonts.regular, textAlign: 'left'
    },
    rowHeader: {
        paddingHorizontal: 5,
        // borderTopLeftRadius: 5, borderTopRightRadius: 5,
        alignItems: 'center',
        height: rf(4.5),
        flexDirection: 'row',
        //   borderWidth: 1,
        // borderColor: "#cbcbcb", 

    },
    rowData: {
        paddingHorizontal: 5, alignItems: 'center',
        flexDirection: 'row', borderTopWidth: 1,
        // borderWidth: 1,
        borderColor: "#cbcbcb",
        paddingVertical: 10
    },
    codeView: { flex: 0.3, },
    descView: { flex: 0.5, },
    emptyView: { flex: 0.05, },
    qtyView: { flex: 0.15, alignItems: 'center', },
    listView: { marginTop: 20, borderColor: "#cbcbcb", borderWidth: 1, borderRadius: 5, backgroundColor: "#f2f2f27a", }
})
