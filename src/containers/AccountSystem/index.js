import React, { useEffect, useState, useContext } from 'react'
import { View, Text, Modal, Pressable, Image, Alert, ScrollView, useWindowDimensions, I18nManager, FlatList } from 'react-native'
import { UserContext } from "@context/user-context";
import { BackgroundView, TextField, Spinner } from '@common';
import { Header } from '@components'
import { useNavigation } from '@react-navigation/native';
import { Fonts, Colors } from '@Themes'
import services from "@services";
import constants from "@constants";
import moment from "moment";
import styles from "./styles";
import DateTimePickerModal from "react-native-modal-datetime-picker";
import { LanguageContext } from '@context/lang-context';
const DATA = [
    {
        id: 'bd7acbea-c1b1-46c2-aed5-3ad53abb28ba',
        title: 'First Item',
    },
    {
        id: '3ac68afc-c605-48d3-a4f8-fbd91aa97f63',
        title: 'Second Item',
    },
    {
        id: '58694a0f-3da1-471f-bd96-145571e29d72',
        title: 'Third Item',
    },
];
export default function AccountSystem() {
    const navigation = useNavigation();
    const [spinner, setSpinner] = useState(false);
    const { user, setUser } = useContext(UserContext);
    const { lang, setLang } = useContext(LanguageContext);
    const [isFromDatePickerVisible, setFromDatePickerVisibility] = useState(false);
    const [isToDatePickerVisible, setToDatePickerVisibility] = useState(false);
    const [fromDate, setFromDate] = useState(null);
    const [toDate, setToDate] = useState(null);
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
    function _renderItem({ item, index }) {
        return (
            <View style={[styles.rowView, { borderBottomWidth: 1, borderColor: "#cbcbcb", }]}>
                <Text style={styles.text}>jhjkhj</Text>
                <Text style={styles.text}>jhjkhj</Text>
            </View>
        )
    }
    function _renderFooter() {
        return (
            <View style={styles.rowView}>
                <Text style={styles.header}>{lang["Net Amount"]}</Text>
                <Text style={styles.header}>SAR 200000</Text>
            </View>
        )
    }
    return (
        <View style={styles.container}>
            <View style={styles.headerView}>
                <Header />
            </View>
            <View style={styles.content}>
                <BackgroundView />

                <View style={styles.contentView}>
                    <ScrollView>
                        <View style={{ marginHorizontal: 15 }}>
                            <Text style={styles.headerText}>{lang["Accounting System"]}</Text>

                            <View style={styles.dateView}>
                                <View style={styles.fromDateView}>
                                    <Text style={styles.fromDateText}>{lang["From Date"]}</Text>
                                    <Pressable
                                        style={styles.buttonView}
                                        onPress={() => setFromDatePickerVisibility(true)}
                                    >
                                        <Text style={styles.dateText}>
                                            {fromDate ? moment(fromDate).format('DD-MM-YYYY') : "dd-mm-yyyy"}
                                        </Text>
                                    </Pressable>
                                </View>
                                <View style={styles.emptyView} />
                                <View style={styles.fromDateView}>
                                    <Text style={styles.fromDateText}>{lang["To Date"]}</Text>
                                    <Pressable
                                        style={styles.buttonView}
                                        onPress={() => setToDatePickerVisibility(true)}
                                    >
                                        <Text style={styles.dateText}>
                                            {toDate ? moment(toDate).format('DD-MM-YYYY') : "dd-mm-yyyy"}
                                        </Text>
                                    </Pressable>
                                </View>
                                <View style={styles.emptyView} />
                                <View style={styles.getButtonView}>
                                    <Pressable
                                        style={styles.getButton}
                                        onPress={() => onSearch()}
                                    >
                                        <Text style={styles.getText}>
                                            {lang["GET"]}</Text>
                                    </Pressable>
                                </View>
                            </View>
                            <FlatList
                                data={DATA}
                                renderItem={_renderItem}
                                keyExtractor={item => item.id}
                                ListFooterComponent={_renderFooter}
                                style={styles.listView}
                            // horizontal
                            />
                        </View>
                    </ScrollView>
                </View>
            </View>
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
        </View>
    )
}
