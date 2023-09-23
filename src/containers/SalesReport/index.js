import React, { useContext, useState, useEffect } from 'react'
import { View, Text, ScrollView, Pressable, Alert, FlatList, Image, Modal } from 'react-native'
import styles from './styles'
import { Header, SalesReportModal } from '@components';
import { BackgroundView, TextField, Spinner } from '@common';
import { Fonts, Colors, Images } from '@Themes';
import { LanguageContext } from '@context/lang-context';
import { UserContext } from "@context/user-context";
import DateTimePickerModal from "react-native-modal-datetime-picker";
import moment from "moment";
import services from "@services";
import constants from "@constants";
import { Chase } from 'react-native-animated-spinkit';
import { useNavigation } from '@react-navigation/native';
var isListEnd = false
export default function SalesReport() {
    const { user, setUser } = useContext(UserContext);
    const { lang, setLang } = useContext(LanguageContext);
    const [isFromDatePickerVisible, setFromDatePickerVisibility] = useState(false);
    const [isToDatePickerVisible, setToDatePickerVisibility] = useState(false);
    const [fromDate, setFromDate] = useState(null);
    const [toDate, setToDate] = useState(null);
    const [spinner, setSpinner] = useState(true)
    const [loading, setLoading] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [invoiceList, setInvoiceList] = useState([]);
    const [offset, setOffset] = useState(0);
    // const [isListEnd, setIsListEnd] = useState(false);
    const [refreshing, setRefreshing] = useState(false);
    const [totalPrice, setTotalPrice] = useState(0);
    const [selectedItem, setSelectedItem] = useState(null);
    const [modalVisible, setModalVisible] = useState(false);
    const [customers, setCustomers] = useState([]);
    const navigation = useNavigation();
    const hideFromDatePicker = () => {
        setFromDatePickerVisibility(false);
    };

    const onConfirmFromDate = (date) => {
        // console.warn("A date has been picked: ", moment(date).format('DD-MM-YYYY'));
        setFromDate(date)
        hideFromDatePicker();
    };

    const hideToDatePicker = () => {
        setToDatePickerVisibility(false);
    };

    const onConfirmToDate = (date) => {
        // console.warn("A date has been picked: ", moment(date).format('DD-MM-YYYY'));
        setToDate(date)
        hideToDatePicker();
    };
    useEffect(() => {
        if (user.usertype === 4) {
            fetchCustomers()
        } else {
            fetchData()
        }
        // console.log(isListEnd, "ssssssss")
    }, []);
    function fetchCustomers() {
        services(constants.API_BASE_URL + "/users?code=" + user.c_code).then((response) => {
            // console.log(".....", response)
            if (response && response.length > 0) {
                setCustomers(response)
                setSpinner(false)

            } else {

                setSpinner(false)


            }
        });
    }
    function onSearch() {

        if (user.usertype === 4 && !selectedItem) {
            Alert.alert(
                lang["KTP"],
                lang["Please select customer"],
                [

                    { text: lang["Ok"], }
                ]
            );
        } else {
            if (!fromDate) {
                Alert.alert(
                    lang["KTP"],
                    lang["Please select from date"],
                    [

                        { text: lang["Ok"], }
                    ]
                );
            } else if (!toDate) {
                Alert.alert(
                    lang["KTP"],
                    lang["Please select to date"],
                    [

                        { text: lang["Ok"], }
                    ]
                );
            } else {
                setLoading(false)
                // setIsListEnd(false);
                isListEnd = false
                setOffset(0);
                setIsLoading(true)
                // console.log(isListEnd, "isListEndisListEnd")
                fetchData()
            }
        }

    }
    const fetchData = () => {
        // console.log("object----")
        var type = ""
        if (user.usertype === 4) {
            type = "2"
        } else {
            type = "1"
        }
        var body = {
            "id": user.usertype === 4 ? selectedItem.id.toString() : user.id.toString(),
            // "id": "14",
            "page": offset,
            "type": type,
            "from_date": fromDate ? moment(fromDate).format('DD-MM-YYYY') : "",
            "to_date": toDate ? moment(toDate).format('DD-MM-YYYY') : ""
        }
        console.log(loading, isListEnd, offset, "body======")
        setLoading(true)
        if (!loading && !isListEnd) {
            // console.log("....bodybody.", body)
            services(constants.API_BASE_URL + "/invoices", body, "POST").then((response) => {
                //  console.log("....response.", response)
                if (response && response.length > 0) {

                    setOffset(offset + 1);
                    setInvoiceList([...invoiceList, ...response]);
                    setRefreshing(false);
                    calculateTotal()
                    setSpinner(false)
                    setLoading(false)
                    setIsLoading(false)
                } else {
                    isListEnd = true
                    // setIsListEnd(true);
                    setRefreshing(false);
                    setSpinner(false)
                    setLoading(false)
                    setIsLoading(false)
                }
            });
        } else {
            setRefreshing(false);
            setSpinner(false);
            setLoading(false);
            // setIsListEnd(true);
            isListEnd = true
            setIsLoading(false)
        }
    };
    function calculateTotal() {
        var total = 0
        if (invoiceList && invoiceList.length > 0) {
            invoiceList.map((res, key) => {
                total += parseFloat(res.I_NET)
            })
        } else {
            total = 0
        }

        // console.log(total, "totaltotal")
        setTotalPrice(total)
    }
    function _renderItem({ item, index }) {
        return (
            <View style={styles.rowData}>
                <View style={styles.invoiceNo}>
                    <Text style={styles.rowText}>{item.I_INVNO}</Text>
                </View>
                <View style={styles.invoiceDate}>
                    <Text style={styles.rowText}>{moment(item.I_DATE).format('YYYY-MM-DD')}</Text>
                </View>
                <View style={styles.netAmnt}>
                    <Text style={styles.rowText}>{parseFloat(item.I_NET).toFixed(2)}</Text>
                </View>
            </View>
        )
    }
    function _renderHeader({ item, index }) {
        return (
            <View style={styles.listHeader}>
                <View style={styles.invoiceNo}>
                    <Text style={styles.rowHeader}>{lang["Invoice No."]}</Text>
                </View>
                <View style={styles.invoiceDate}>
                    <Text style={styles.rowHeader}>{lang["Invoice Date"]}</Text>
                </View>
                <View style={styles.netAmnt}>
                    <Text style={styles.rowHeader}>{lang["Net Amount"]}</Text>
                </View>
            </View>
        )
    }
    const renderFooter = () => {
        return (
            // Footer View with Loader

            loading ? (
                <View style={styles.footerListView}>
                    <Chase size={30} color={Colors.theme} />

                </View>
            ) : null

        );
    };
    function getData(getItem) {
        setSelectedItem(getItem)
        setModalVisible(false)
    }
    function onBackPress() {
        isListEnd = false
        navigation.pop()
    }
    return (
        <View style={styles.container} >
            <View style={styles.headerView}>
                <Header onBack={() => onBackPress()} />
            </View>
            <View style={styles.content}>
                <BackgroundView />

                <View style={styles.contentView}>
                    {spinner ? (
                        <Spinner initialLoad />
                    ) : (
                        <ScrollView>
                            <View style={styles.subContent}>
                                <Text style={styles.headerText}>{lang["Sales"]}</Text>
                                {user.usertype === 4 ? (
                                    <View style={styles.dataView}>
                                        <Text style={styles.customerCodeText}>{lang["Customer Code"]}</Text>
                                        <Pressable
                                            onPress={() => setModalVisible(true)}
                                            style={styles.codeView}>
                                            <View style={styles.selectedView}>
                                                {selectedItem ? (
                                                    <Text style={styles.codeText}>{selectedItem.c_code}</Text>
                                                ) : (
                                                    <Text style={styles.codeText}>{lang["Select Code"]}</Text>
                                                )}
                                            </View>
                                            <View style={styles.downArrowView}>
                                                <Image source={Images.icons.downArrow} style={styles.arrow} />
                                            </View>
                                        </Pressable>
                                    </View>
                                ) : (
                                    null
                                )}

                                <View style={styles.dateContainer}>
                                    <View style={styles.dateView}>
                                        <Text style={styles.date}>{lang["From Date"]}</Text>
                                        <Pressable
                                            style={styles.pickerView}
                                            onPress={() => setFromDatePickerVisibility(true)}
                                        >
                                            <Text style={styles.dateText}>
                                                {fromDate ? moment(fromDate).format('DD-MM-YYYY') : "dd-mm-yyyy"}
                                            </Text>
                                        </Pressable>
                                    </View>
                                    <View style={styles.emptyView} />
                                    <View style={styles.dateView}>
                                        <Text style={styles.date}>{lang["To Date"]}</Text>
                                        <Pressable
                                            style={styles.pickerView}
                                            onPress={() => setToDatePickerVisibility(true)}
                                        >
                                            <Text style={styles.dateText}>
                                                {toDate ? moment(toDate).format('DD-MM-YYYY') : "dd-mm-yyyy"}
                                            </Text>
                                        </Pressable>
                                    </View>
                                    <View style={styles.emptyView} />
                                    <View style={styles.searchView}>
                                        <Pressable
                                            style={styles.buttonView}
                                            onPress={() => onSearch()}
                                        >
                                            <Text style={styles.getText}>
                                                {lang["GET"]}</Text>
                                        </Pressable>
                                    </View>
                                </View>
                                <View style={styles.view}>
                                    <Text style={styles.text}>{lang["Customer Name"]}</Text>
                                    <Text style={styles.text}>{user.fullname}</Text>
                                </View>
                                {invoiceList && invoiceList.length > 0 ? (
                                    <FlatList
                                        data={invoiceList}
                                        renderItem={_renderItem}
                                        keyExtractor={item => item.id}
                                        ListHeaderComponent={_renderHeader}
                                        ListFooterComponent={() => renderFooter()}
                                        onEndReached={() => fetchData()}
                                        onEndReachedThreshold={0.5}
                                        removeClippedSubviews={true}
                                        extraData={invoiceList}
                                        initialNumToRender={20}
                                        style={styles.flatlist}
                                    />

                                ) : (
                                    <Text style={styles.noData}>{lang["No Data Found"]}</Text>
                                )}
                            </View>
                        </ScrollView>)}
                </View>

            </View>
            {!spinner && invoiceList && invoiceList.length > 0 ? (
                <View style={styles.bottomView}>
                    <Text style={styles.total}>{lang["Total Amount"]} : {parseFloat(totalPrice).toFixed(2)} </Text>
                </View>
            ) : (
                null
            )}

            <DateTimePickerModal
                isVisible={isFromDatePickerVisible}
                mode="date"
                onConfirm={onConfirmFromDate}
                onCancel={hideFromDatePicker}
            />
            <DateTimePickerModal
                isVisible={isToDatePickerVisible}
                mode="date"
                onConfirm={onConfirmToDate}
                onCancel={hideToDatePicker}
                minimumDate={new Date(fromDate)}
            />

            <Modal
                animationType="slide"
                transparent={true}
                visible={modalVisible}
            >
                <SalesReportModal
                    onClose={() => setModalVisible(false)}
                    getData={getData}
                    customers={customers} />
            </Modal>
            {isLoading && <Spinner />}
        </View>
    )
}
