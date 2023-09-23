import React, { useState, useEffect, useContext } from 'react'
import {
    View, Text,
    FlatList, SafeAreaView,
    Image, TouchableOpacity,
    StyleSheet,
    TextInput,
    ActivityIndicator,
    RefreshControl,
    Dimensions,
    I18nManager,
    Platform,
    Pressable,
    Alert
} from 'react-native'
import { Fonts, Colors, Images } from '@Themes';
import { BackgroundView, TextField, Spinner } from '@common';
import services from "@services";
import constants from "@constants";
import { Chase } from 'react-native-animated-spinkit';
import RowData from "./RowData";
import { LanguageContext } from '@context/lang-context';
import {
    responsiveHeight as rh,
    responsiveWidth as rw,
    responsiveFontSize as rf
} from "react-native-responsive-dimensions";
const { height, width } = Dimensions.get("window")
var offset = 0
export default function StockModal({ onClose, getData, }) {
    const { lang, setLang } = useContext(LanguageContext);
    const [spinner, setSpinner] = useState(true);
    const [loading, setLoading] = useState(false);
    const [stock, setStock] = useState([]);
    const [stockSearch, setStockSearch] = useState([]);

    // const [offset, setOffset] = useState(0);
    const [isListEnd, setIsListEnd] = useState(false);
    const [refreshing, setRefreshing] = useState(false);
    const [searchText, setSearchText] = useState("");
    const [isSearch, setIsSearch] = useState(false)
    useEffect(() => {

        fetchStock()
        // console.log(selectedStock, "selectedStockselectedStockselectedStock")

    }, []);

    const _onRefresh = () => {
        setRefreshing(true);
        fetchStock();
    };
    const fetchStock = () => {
        setLoading(true)
        if (!loading && !isListEnd) {
            // console.log(constants.API_BASE_URL + "/stock?limit=" + offset)

            // console.log(uri, "uriuriuri")
            services(constants.API_BASE_URL + "/stock?limit=" + offset).then((response) => {
                // console.log(response, "responseresponseresponse")
                if (response) {
                    if (response.length > 0) {
                        // setOffset(offset + 1);

                        offset = offset + 1
                        // fetchPages()
                        // console.log(offset, "offsetoffsetoffsetoffset")
                        setStock([...stock, ...response]);
                        setRefreshing(false);
                        setSpinner(false)
                        setLoading(false)


                    }
                } else {
                    setIsListEnd(true);
                    // setStock([]);
                    setRefreshing(false);
                    setSpinner(false)
                    setLoading(false)
                }
            });
        } else {
            setRefreshing(false);
            setSpinner(false);
        }
    };
    const fetchSearchStock = (text) => {
        setLoading(true)
        setIsListEnd(false)
        // console.log(loading, isListEnd, "-----------texttext")
        if (!loading && !isListEnd) {
            // console.log(constants.API_BASE_URL + "/stock?limit=" + offset)
            // var uri = ""

            // console.log(constants.API_BASE_URL + "/stock?limit=" + offset + "&search=" + text, "uriuriuri")
            services(constants.API_BASE_URL + "/stock?limit=" + offset + "&search=" + text).then((response) => {
                // console.log(response, "responseresponseresponse")
                if (response) {
                    if (response.length > 0) {
                        // setOffset(offset + 1);


                        offset = offset + 1
                        setStockSearch([...stockSearch, ...response]);
                        setSpinner(false);
                        setLoading(false);
                        // console.log(loading, "looooooooooo")
                        // setRefreshing(false);


                    }
                } else {
                    setIsListEnd(true);
                    // setStock([]);
                    setRefreshing(false);
                    setSpinner(false)
                    setLoading(false)
                }
            });
        } else {
            setIsListEnd(true);
            setRefreshing(false);
            setSpinner(false);
            setLoading(false);
        }
    };
    function getItem(data) {
        offset = 0
        getData(data)
    }
    const _renderItem = ({ item, index }) => {
        return (
            <RowData item={item} getData={getItem} />
        )
    };

    const renderFooter = () => {
        return (
            // Footer View with Loader

            loading ? (
                <View style={{ marginTop: 20, alignItems: 'center', }}>
                    <Chase size={30} color={Colors.theme} />

                </View>
            ) : null

        );
    };
    function onSearching() {
        // setSearchText(text)
        if (!searchText) {
            Alert.alert(
                lang["KTP"],
                lang["Please enter text"],
                [

                    { text: lang["Ok"] }
                ]
            );
        }
        else {
            // console.log(text, "texttexttext")
            // setOffset(0)
            setIsSearch(true)
            offset = 0
            setIsListEnd(false)
            setLoading(false);
            setSpinner(true)

            fetchSearchStock(searchText)

        }
    }
    // if (spinner) {
    //     return (
    //         <SafeAreaView style={{ flex: 1 }}>
    //             <View style={styles.spinnerView}>
    //                 <Spinner initialLoad />
    //             </View>
    //         </SafeAreaView>
    //     )
    // } else {
    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.contentView}>
                <TouchableOpacity onPress={() => {
                    // setStock([])
                    offset = 0
                    onClose()
                }} style={{ alignItems: 'flex-end', }}>
                    <Image source={Images.icons.cancel} style={styles.icon} />
                </TouchableOpacity>
                <View style={styles.searchInput}>
                    <View style={{ flex: 0.9 }}>
                        <TextInput
                            placeholder={lang["Type Here"]}
                            style={styles.inputStyle}
                            value={searchText}
                            onChangeText={(text) => {
                                setSearchText(text);
                                if (text.length === 0) {
                                    setIsSearch(false)
                                }
                            }}
                            returnKeyType="done"
                            onSubmitEditing={() => {
                                if (searchText.length > 0) {
                                    onSearching()
                                } else {
                                    setIsSearch(false)
                                }
                            }} />
                    </View>
                    <View style={{ flex: 0.1, alignItems: 'center', }}>
                        <Pressable onPress={() => onSearching()}>
                            <Image source={Images.icons.search} style={{ height: 15, width: 15 }} />
                        </Pressable>
                    </View>
                </View>
                {spinner ? (
                    <Spinner initialLoad />
                ) : isSearch ? (
                    <FlatList
                        data={stockSearch}
                        renderItem={_renderItem}
                        keyExtractor={item => item.id}
                        // ListHeaderComponent={_renderHeader}
                        style={styles.listView}
                        showsVerticalScrollIndicator={false}
                        // enableEmptySections={true}
                        // ListFooterComponent={renderFooter}
                        ListFooterComponent={() => renderFooter()}
                        onEndReached={() => fetchSearchStock(searchText)}
                        onEndReachedThreshold={0.5}
                        removeClippedSubviews={true}
                        extraData={stockSearch}
                        keyboardShouldPersistTaps="always"
                    // initialNumToRender={20}
                    />
                ) : (
                    <FlatList
                        data={stock}
                        renderItem={_renderItem}
                        keyExtractor={item => item.id}
                        // ListHeaderComponent={_renderHeader}
                        style={styles.listView}
                        showsVerticalScrollIndicator={false}
                        // enableEmptySections={true}
                        // ListFooterComponent={renderFooter}
                        ListFooterComponent={() => renderFooter()}
                        onEndReached={() => fetchStock()}
                        onEndReachedThreshold={0.5}
                        removeClippedSubviews={true}
                        extraData={stock}
                        initialNumToRender={20}
                        keyboardShouldPersistTaps="always"
                    />
                )}

            </View>
            {/* {loading && <Spinner />} */}
        </SafeAreaView>
    )
    // }
}

const styles = StyleSheet.create({

    container: {

        flex: 1,
    },
    spinnerView: {
        // height: height / 1.25, 
        height: Platform.OS === "ios" ? rh(85) : rh(94),
        margin: rh(3),
        backgroundColor: 'white',
        shadowColor: 'grey',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.8,
        shadowRadius: 2,
        elevation: 5,
        borderRadius: 5,
        padding: rh(2.5),

    },
    contentView: {
        flex: 1,
        margin: rh(3),
        backgroundColor: 'white',
        shadowColor: 'grey',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.8,
        shadowRadius: 2,
        elevation: 5,
        borderRadius: 5,
        padding: rh(2),
    },
    icon: { height: rh(3), width: rh(3), tintColor: "red" },
    searchInput: {
        height: rh(4.5),
        // padding: 0, 
        // margin: 0,
        marginTop: 10,
        //  paddingLeft: 6,
        backgroundColor: "#f2f2f2",
        borderWidth: 1,
        borderColor: "#cbcbcb",
        // fontFamily: Fonts.regular,
        borderRadius: 5,
        flexDirection: 'row',
        alignItems: 'center',
        // textAlign: I18nManager.isRTL ? "right" : "left",
        // fontSize: rf(1.8)
    },
    inputStyle: {
        paddingLeft: 6,
        padding: 0,
        margin: 0,
        textAlign: I18nManager.isRTL ? "right" : "left",
        fontSize: rf(1.8),
        fontFamily: Fonts.regular,
    },
    listView: { marginTop: 10 }
});