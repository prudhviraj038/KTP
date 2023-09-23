import React, { useContext, useState, useEffect } from 'react'
import { View, Text, Pressable, Image, FlatList, TextInput, Modal, Alert, Platform } from 'react-native'
import styles from './styles'
import { Header, StockModal, StockContainer } from '@components';
import { BackgroundView, TextField, Spinner } from '@common';
import { Fonts, Colors, Images } from '@Themes';
import { UserContext } from "@context/user-context";
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import moment from "moment";
import { SettingsContext } from '@context/settings-context';
import services from "@services";
import constants from "@constants";
import { LanguageContext } from '@context/lang-context';
import { useNavigation } from '@react-navigation/native';
var selectedArray = [];
function TextView({ title, ans }) {

    return (
        <View style={styles.subHeaderView}>
            <Text style={styles.subHeaderText}>{title}</Text>
            <Text style={styles.subHeaderText}>{ans}</Text>
        </View>
    )
}
function PriceView({ title, price }) {

    return (
        <View style={styles.priceContainer}>
            <View style={styles.emptyView} />
            <View style={styles.priceView}>
                <Text style={styles.priceText}>{title}</Text>
                <Text style={styles.priceText}>{price}</Text>
            </View>
        </View>
    )
}

export default function Quotation() {

    const { user, setUser } = useContext(UserContext);
    const { settings, setSettings } = useContext(SettingsContext);
    const { lang, setLang } = useContext(LanguageContext);
    const [qty, setQty] = useState("1");


    const [selectedItem, setSelectedItem] = useState(null);
    const [selectedStock, setSelectedStock] = useState([]);
    const [discountPrice, setDiscountPrice] = useState(0);
    const [vatPrice, setVatPrice] = useState(0);
    const [finalData, setFinalData] = useState(null);
    const [loading, setLoading] = useState(false);
    const navigation = useNavigation();
    useEffect(() => {



    }, [selectedStock]);


    function getSelectedItem(item) {

        setSelectedItem(item)
        // setModalVisible(false)
        // console.log(item, "itemitem")
    }
    function calculationPercentage(total, percent) {
        return parseFloat(total) * parseFloat(percent) / 100
    }
    function calculation() {
        var total = 0

        selectedArray.map((res, key) => {
            total += parseFloat(res.total)
        })
        // console.log(total, "totaltotal")
        var discount = calculationPercentage(total, settings.discount);
        var vat_Price = calculationPercentage(total, settings.vat);
        setDiscountPrice(parseFloat(discount).toFixed(2));

        setVatPrice(parseFloat(vat_Price).toFixed(2))
        // console.log(discount, "discountdiscountdiscount")
        setFinalData({
            totalPrice: parseFloat(total).toFixed(2),
            // discountPrice: parseFloat(discount).toFixed(2),
            subTotal: (parseFloat(total) - parseFloat(discount)).toFixed(2),
            // vat: (parseFloat(vatPrice)).toFixed(2),
            finalPrice: (parseFloat(total) - parseFloat(discount) + parseFloat(vat_Price)).toFixed(2)
        })
    }
    function onAddItem() {
        if (selectedItem) {

            var obj = {
                "id": selectedItem.S_ITEM,
                "qty": qty,
                "price": selectedItem.S_UPRC.toString(),
                "total": (parseInt(qty) * parseFloat(selectedItem.S_UPRC)).toString(),
                "title": selectedItem.S_ENAME,
                "title_ar": selectedItem.S_ANAME
            }
            selectedArray.push(obj)

            setSelectedStock([...selectedArray])
            setSelectedItem(null)
            setQty("1")
            calculation()
            // setTotalPrice(parseFloat(total).toFixed(2))
        } else {
            Alert.alert(
                lang["KTP"],
                lang["Please select product and quantity"],
                [

                    { text: lang["Ok"] }
                ]
            );
        }
    }
    function onDeleteItem(item, index) {
        Alert.alert(
            lang["KTP"],
            lang["Are you sure you want to delete this item"],
            [
                {
                    text: lang["Cancel"],
                    onPress: () => console.log("Cancel Pressed"),
                    // style: "cancel"
                },
                { text: lang["Ok"], onPress: () => onOk(item, index) }
            ]
        );

    }
    function onOk(item, index) {
        selectedArray.splice(index, 1,);
        setSelectedStock([...selectedArray]);
        calculation()
    }
    function getQty(text) {
        setQty(text)
    }
    function onSubmit() {
        if (selectedStock && selectedStock.length > 0) {


            setLoading(true)
            var data = { "products": selectedStock, "member_id": user.id.toString(), "total": finalData.finalPrice, "vat": vatPrice, "discount": discountPrice }
            // console.log(data, "datadatadata")
            services(constants.API_BASE_URL + "/quotation", data, "POST").then((response) => {
                if (response.status === "Failed") {
                    // console.log(response, "onSubmitonSubmit")
                    // setLoading(false)
                    alert(response.message)
                    setLoading(false)
                } else {
                    // console.log(response, "responseresponse")
                    // fetchProfile(response.id)
                    Alert.alert(
                        lang["Quotation Number"] + " : " + response.code,
                        lang["Submitted Successfully"],
                        [

                            { text: lang["Ok"], onPress: () => onClearData() }
                        ]
                    );
                }
            });
        } else {
            Alert.alert(
                lang["KTP"],
                lang["Please select atleast 1 product"],
                [

                    { text: lang["Ok"] }
                ]
            );
        }
    }
    function onClearData() {
        selectedArray = [];
        setSelectedStock([]);
        setDiscountPrice(0);
        setVatPrice(0);
        setFinalData(null)
        setLoading(false)
    }


    function onBackPress() {
        selectedArray = [];
        navigation.pop()
    }
    return (
        <View style={styles.container}>
            <View style={{ flex: 0.1 }}>
                <Header onBack={() => onBackPress()} />
            </View>
            <View style={{ flex: 0.9 }}>
                <BackgroundView />

                <View style={styles.contentView}>
                    <KeyboardAwareScrollView>
                        <View style={{ marginHorizontal: 15, }}>
                            <Text style={styles.headerText}>{lang["Price Check Quotation"]}</Text>

                            <TextView title={lang["Number"]} ans={user.c_code} />
                            <TextView title={lang["Name"]} ans={user.fullname} />
                            <TextView title={lang["Date"]} ans={moment(new Date()).format('DD-MM-YYYY')} />
                            <StockContainer
                                onAddItem={onAddItem}
                                getSelectedItem={getSelectedItem}
                                selectedStock={selectedStock}
                                selectedItem={selectedItem}
                                getQty={getQty}
                                onDeleteItem={onDeleteItem} />


                            <View style={{ marginVertical: 10 }}>
                                <PriceView title={lang["Total Amount"]} price={finalData ? finalData.totalPrice : "0"} />
                                <PriceView title={lang["Discount"] + " (" + settings.discount + "%)"} price={"-" + discountPrice} />
                                <PriceView title={lang["Sub Total"]} price={finalData ? finalData.subTotal : "0"} />
                                <PriceView title={lang["VAT"] + " (" + settings.vat + "%)"} price={"+" + vatPrice} />
                                <PriceView title={lang["Net Amount"]} price={finalData ? finalData.finalPrice : "0"} />
                            </View>
                            <Pressable style={styles.buttonView} onPress={onSubmit}>
                                <Text style={styles.buttonText}>{lang["Submit"]}</Text>
                            </Pressable>
                        </View>
                    </KeyboardAwareScrollView>
                </View>

            </View>
            {/* <Modal
                animationType="slide"
                transparent={true}
                visible={modalVisible}
            >
                <StockModal
                    onClose={() => setModalVisible(false)}
                    getData={getSelectedItem} />
            </Modal> */}
            {loading && <Spinner />}
        </View>
    )

}
