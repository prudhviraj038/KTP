import React, { useState, useContext } from 'react'
import { View, Text, TouchableOpacity, Image, TextInput, Modal, FlatList, StyleSheet, I18nManager, Pressable } from 'react-native'
import { Fonts, Colors, Images } from '@Themes';
import { Header, StockModal, } from '@components';
import ChangeQuantity from './ChangeQuantity';
import { LanguageContext } from '@context/lang-context';
import {
    responsiveHeight as rh,
    responsiveWidth as rw,
    responsiveFontSize as rf
} from "react-native-responsive-dimensions";
export default function StockContainer({ title, onAddItem, getSelectedItem, selectedStock, selectedItem, getQty, onDeleteItem }) {
    const { lang, setLang } = useContext(LanguageContext);
    const [qty, setQty] = useState("1");
    const [modalVisible, setModalVisible] = useState(false);
    const [modalVisibleEdit, setModalVisibleEdit] = useState(false);
    const [editItem, setEditItem] = useState(null)
    function getData(getItem) {
        getSelectedItem(getItem)
        setModalVisible(false)
    }
    function onEdit(item) {
        setEditItem(item)
        setModalVisibleEdit(true)
    }
    function getQuantity(value, item) {
        // console.log(value, item, "kkkkkk")
        item.qty = value;
        item.total = parseFloat(item.price) * parseInt(value)
        setModalVisibleEdit(false)
        // setEditItem()
    }
    const _renderItem = ({ item, index }) => {
        return (
            <View style={styles.rowView} >
                <View style={styles.rowCodeView}>
                    <Text style={styles.text}>{item.id}</Text>
                </View>
                <View style={styles.qtyView}>
                    <Text style={styles.text}>{item.qty}</Text>
                </View>
                <View style={styles.empty} />
                {title ? (
                    <View style={styles.descView}>


                        <Text style={styles.text}>{I18nManager.isRTL ? item.title_ar : item.title}</Text>

                    </View>
                ) : (
                    <View style={[styles.descView, { flexDirection: 'row' }]}>
                        <View style={styles.view}>
                            <Text style={styles.text}>{item.price}</Text>
                        </View>
                        <View style={styles.view}>
                            <Text style={styles.text}>{parseFloat(item.total).toFixed(2)}</Text>
                        </View>
                    </View>)}
                <View style={styles.iconsView}>
                    {title ? (
                        <Pressable onPress={() => onEdit(item)}>
                            <Image source={Images.icons.edit} style={{ height: 13, width: 13, tintColor: Colors.theme }} />
                        </Pressable>
                    ) : (null)}

                </View>
                <View style={styles.iconsView}>
                    <Pressable onPress={() => onDeleteItem(item, index)}>
                        <Image source={Images.icons.trash} style={{ height: 13, width: 13, tintColor: 'red' }} />
                    </Pressable>
                </View>
            </View>
        )
    };
    const _renderHeader = ({ item, index }) => {
        return (
            <View style={styles.rowHeaderView} >
                <View style={styles.rowCodeView}>
                    <Text style={styles.header}>{lang["Code"]}</Text>
                </View>
                <View style={styles.qtyView}>
                    <Text style={styles.header}>{lang["Qty"]}</Text>
                </View>
                <View style={styles.empty} />
                {title ? (
                    <View style={styles.descView}>


                        <Text style={styles.header}>{lang["Description"]}</Text>

                    </View>
                ) : (
                    <View style={[styles.descView, { flexDirection: 'row' }]}>
                        <View style={styles.view}>
                            <Text style={styles.header}>{lang["Price"]}</Text>
                        </View>
                        <View style={styles.view}>
                            <Text style={styles.header}>{lang["Total"]}</Text>
                        </View>
                    </View>
                )}

                <View style={styles.iconsView}>
                    {/* <Image source={Images.icons.downArrow} style={{ height: 10, width: 10, }} /> */}
                </View>
                <View style={styles.iconsView}>
                    {/* <Image source={Images.icons.downArrow} style={{ height: 10, width: 10, }} /> */}
                </View>
            </View>
        )
    };
    return (
        <View>
            <View style={{ flexDirection: "row", marginTop: 10 }}>
                <View style={styles.selectCodeView}>
                    <Pressable
                        onPress={() => setModalVisible(true)}
                        style={styles.codeView}>
                        <View style={styles.selectedView}>
                            {selectedItem ? (
                                <Text style={styles.codeText}>{selectedItem.S_ITEM}</Text>
                            ) : (
                                <Text style={styles.codeText}>{lang["Select Code"]}</Text>
                            )}
                        </View>
                        <View style={styles.downArrowView}>
                            <Image source={Images.icons.downArrow} style={styles.arrow} />
                        </View>
                    </Pressable>
                </View>
                <View style={styles.view1}>
                    <View style={styles.inputView}>
                        <TextInput style={styles.inputStyle}
                            value={qty}
                            onChangeText={(text) => {
                                setQty(text);
                                getQty(text)
                            }}
                            keyboardType="number-pad"
                            returnKeyType="done" />
                    </View>
                </View>
                <View style={styles.view1}>
                    <View style={styles.priceView}>
                        {selectedItem ? (
                            <Text style={styles.text1}>{selectedItem.S_UPRC}</Text>
                        ) : (
                            <Text style={styles.text1}>{lang["Price"]}</Text>
                        )}

                    </View>
                </View>
                <View style={styles.view1}>
                    <View style={styles.totalView}>
                        {
                            selectedItem && qty ? (
                                <Text style={styles.text1}
                                    numberOfLines={1}>{parseFloat(parseInt(qty) * parseFloat(selectedItem.S_UPRC)).toFixed(2)}</Text>
                            ) : (
                                <Text style={styles.text1}>{lang["Total"]}</Text>
                            )
                        }

                    </View>
                </View>
                <View style={styles.plusIconView}>
                    <Pressable style={styles.iconView} onPress={() => {
                        onAddItem();
                        setQty("1");
                    }}>
                        <Image source={Images.icons.plus} style={styles.icon} />
                    </Pressable>
                </View>
            </View>
            {selectedStock && selectedStock.length > 0 ? (
                <FlatList
                    data={selectedStock}
                    renderItem={_renderItem}
                    keyExtractor={item => item.id}
                    ListHeaderComponent={_renderHeader}
                    style={{ marginTop: 20 }}
                // horizontal
                />
            ) : null}
            <Modal
                animationType="slide"
                transparent={true}
                visible={modalVisible}
            >
                <StockModal
                    onClose={() => setModalVisible(false)}
                    getData={getData} />
            </Modal>
            <Modal
                animationType="slide"
                transparent={true}
                visible={modalVisibleEdit}
            >
                <ChangeQuantity
                    editItem={editItem}
                    onClose={() => setModalVisibleEdit(false)}
                    getQty={getQuantity} />
            </Modal>
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
    codeView: {
        // marginRight: 5,
        height: rh(4.5),
        // paddingVertical: rf(1.3),
        flexDirection: 'row', alignItems: 'center',
        justifyContent: 'space-between',
        // paddingHorizontal: 5,
        backgroundColor: Colors.e6e6e6, borderColor: "#cbcbcb",
        borderWidth: 1, borderRadius: 5
    },
    codeText: {
        fontSize: rf(1.3), fontFamily: Fonts.regular, marginLeft: 5, textAlign: "left"
    },
    inputView: {
        height: rh(4.5),
        marginHorizontal: 3,
        // paddingVertical: Platform.OS === "ios" ? 10 : 3,
        flexDirection: 'row', alignItems: 'center', justifyContent: 'center',
        backgroundColor: Colors.white, borderColor: "#cbcbcb", borderWidth: 1, borderRadius: 5,

    },
    inputStyle: {
        fontSize: rf(1.3), fontFamily: Fonts.regular, textAlign: 'center',
        margin: 0, padding: 0,
        width: "100%",
    },
    priceView: {
        marginHorizontal: 3,
        height: rh(4.5),
        // paddingVertical: 10, 
        alignItems: 'center', justifyContent: 'center',
        backgroundColor: Colors.e6e6e6, borderColor: "#cbcbcb", borderWidth: 1, borderRadius: 5
    },
    totalView: {
        marginHorizontal: 3,
        height: rh(4.5),
        // paddingVertical: 10, 
        alignItems: 'center', justifyContent: 'center',
        backgroundColor: Colors.e6e6e6, borderColor: "#cbcbcb", borderWidth: 1, borderRadius: 5
    },
    text1: {
        fontSize: rf(1.3), fontFamily: Fonts.regular,
    },
    iconView: {
        height: rh(4),
        width: rh(4),
        // padding: 5,
        alignItems: 'center', justifyContent: 'center',

        backgroundColor: Colors.theme, borderRadius: rh(2),
    },
    icon: { height: rh(2), width: rh(2), tintColor: 'white' },
    rowView: {
        paddingHorizontal: 5, alignItems: 'center',
        flexDirection: 'row', borderTopWidth: 0, borderWidth: 1,
        borderColor: "#cbcbcb", backgroundColor: "#f2f2f27a",
        paddingVertical: 10
    },
    rowHeaderView: {
        paddingHorizontal: 5, borderTopLeftRadius: 5, borderTopRightRadius: 5,
        alignItems: 'center', height: 40, flexDirection: 'row', borderWidth: 1,
        borderColor: "#cbcbcb", backgroundColor: "#f2f2f27a",
    },
    rowCodeView: { flex: 0.3, },
    qtyView: { flex: 0.15, alignItems: 'center', },
    empty: { flex: 0.05, },
    descView: { flex: 0.4, },
    view: { flex: 0.5, },
    iconsView: { flex: 0.05, alignItems: 'center', },
    selectCodeView: { flex: 0.36, },
    downArrowView: { flex: 0.15, alignItems: 'center', },
    view1: { flex: 0.18, },
    plusIconView: { flex: 0.1, alignItems: 'flex-end', justifyContent: 'center', },
    selectedView: { flex: 0.85 },
    arrow: { height: rh(1.3), width: rh(1.3), }
    // totalView:{ flex: 0.4, flexDirection: 'row', }
})

