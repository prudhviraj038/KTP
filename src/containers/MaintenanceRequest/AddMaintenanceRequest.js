import React, { useContext, useState, useEffect } from 'react'
import { View, Text, Pressable, FlatList, Image, Dimensions, ScrollView, Alert, StyleSheet } from 'react-native'
import { BackgroundView, TextField, Spinner } from '@common';
import { Header } from '@components'
import { LanguageContext } from '@context/lang-context';
import { Fonts, Colors, Images } from '@Themes';
import DateTimePickerModal from "react-native-modal-datetime-picker";
import moment from "moment";
import services from "@services";
import constants from "@constants";
import { UserContext } from "@context/user-context";
import { useNavigation } from '@react-navigation/native';
const { width, height } = Dimensions.get("window");
import {
    responsiveHeight as rh,
    responsiveWidth as rw,
    responsiveFontSize as rf
} from "react-native-responsive-dimensions";

export default function AddMaintenanceRequest({ route }) {
    const navigation = useNavigation();
    const { lang, setLang } = useContext(LanguageContext);
    const [selectedDate, setSelectedDate] = useState(null)
    const [isDatePickerVisible, setDatePickerVisibility] = useState(false);
    const { user, setUser } = useContext(UserContext);
    const [spinner, setSpinner] = useState(true);
    const [technicians, setTechnicians] = useState([]);
    const [selectedTech, setSelectedTech] = useState(null);
    const [loading, setLoading] = useState(false)
    useEffect(() => {

        fetchTechnicianList()


    }, []);
    const fetchTechnicianList = () => {

        services(constants.API_BASE_URL + "/technicians/" + user.city).then((response) => {
            if (response && response.length > 0) {
                console.log(".....", response)

                setTechnicians(response)
                setSpinner(false)

            } else {
                setSpinner(false)
            }
        });
    };
    const hideDatePicker = () => {
        setDatePickerVisibility(false);
    };

    const handleConfirm = (date) => {
        // console.warn("A date has been picked: ", date);
        setSelectedDate(date)
        hideDatePicker();
    };
    function onSubmit() {
        if (!selectedDate) {
            Alert.alert(
                "KTP",
                "Please select date",
                [

                    { text: "OK", }
                ]
            );
        } else if (!selectedTech) {
            Alert.alert(
                "KTP",
                "Please select technician",
                [

                    { text: "OK", }
                ]
            );
        } else {
            setLoading(true)
            onSubmitTech()
        }
    }
    function onSubmitTech() {
        var body = {
            "member_id": user.id.toString(),
            "technician_id": selectedTech.id.toString(),
            "date": moment(selectedDate).format('DD-MM-YYYY'),
            "time": moment(selectedDate).format('hh:mm a'),
        }
        // console.log(body)
        services(constants.API_BASE_URL + "/technician_request", body, "POST").then((response) => {
            if (response && response.status === "Success") {
                // console.log(".....", response)

                // setTechnicians(response)
                Alert.alert(
                    lang["KTP"],
                    response.message,
                    [

                        {
                            text: lang["Ok"], onPress: () => {
                                // route.params.onNavigatingBack()
                                navigation.pop()
                            }
                        }
                    ]
                );
                setLoading(false)

            } else {
                setLoading(false)
            }
        });
    }
    function _renderItem({ item, index }) {

        return (
            selectedTech && selectedTech.id === item.id ? (
                <View style={{ flex: 1 / 2 }}>
                    {_renderData(item, index)}
                </View>
            ) : (
                <Pressable onPress={() => setSelectedTech(item)} style={{
                    flex: 1 / 2
                }}>

                    {_renderData(item, index)}

                </Pressable>
            )

        )
    }
    function _renderData(item, index) {
        return (

            <View style={[styles.rowView, {


                marginLeft: index % 2 === 0 ? 0 : 10,
            }]}>
                {selectedTech && selectedTech.id === item.id ? (
                    <Image source={Images.icons.check} style={styles.icon} />
                ) : (
                    <Image source={Images.icons.unCheck} style={styles.icon} />
                )}

                <Text style={styles.title}>
                    {item.fullname}
                </Text>
            </View>

        )
    }
    function _renderHeader({ item, index }) {

        return (
            <View
                style={styles.listHeaderView}
            >
                <Text style={styles.listHeaderText}>
                    {lang["Select Available Technician"]}
                </Text>
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
                    {spinner ? (
                        <Spinner initialLoad />
                    ) : (
                        <ScrollView>
                            <View style={styles.subContent}>
                                <Text style={styles.headerText}>{lang["Maintenance Request"]}</Text>
                                <View style={styles.borderView} />
                                <View style={styles.textView}>
                                    <Text style={styles.name}>{lang["Name"]}</Text>

                                    <Text style={styles.nameText}>
                                        {user.fullname}</Text>

                                </View>
                                <View style={styles.borderView} />
                                <View style={{ marginTop: 5 }}>
                                    <Text style={styles.dateText}>{lang["Select Date"]}</Text>
                                    <Pressable
                                        style={styles.pickerView}
                                        onPress={() => setDatePickerVisibility(true)}
                                    >
                                        <Text style={styles.date}>
                                            {selectedDate ? moment(selectedDate).format('DD-MM-YYYY') : "dd-mm-yyyy"}
                                        </Text>
                                    </Pressable>
                                </View>
                                {technicians && technicians.length > 0 ? (
                                    <FlatList
                                        data={technicians}
                                        renderItem={_renderItem}
                                        keyExtractor={item => item.id}
                                        ListHeaderComponent={_renderHeader}
                                        numColumns={2}
                                        style={{ marginTop: 10 }}
                                    // extraData={selectedId}
                                    />
                                ) : (
                                    <Text style={styles.noData}>{lang["No Data Found"]}</Text>
                                )}

                                <View style={styles.buttonView}>
                                    <Pressable
                                        style={styles.submitView}
                                        onPress={onSubmit}
                                    >
                                        <Text style={styles.buttonText}>{lang["Submit"]}</Text>
                                    </Pressable>
                                </View>
                            </View>
                        </ScrollView>
                    )}
                </View>
            </View>
            <DateTimePickerModal
                isVisible={isDatePickerVisible}
                mode="datetime"
                onConfirm={handleConfirm}
                onCancel={hideDatePicker}
            />
            {loading && <Spinner />}
        </View>
    )
}
const styles = StyleSheet.create({
    container: {
        flex: 1, backgroundColor: "white"
    },
    headerView: { flex: 0.1 },
    content: { flex: 0.9 },
    contentView: { position: "absolute", top: 0, bottom: 0, left: 0, right: 0, backgroundColor: Colors.overlayWhite },
    subContent: { marginHorizontal: 15 },
    headerText: {
        fontSize: rf(2), fontFamily: Fonts.medium, textAlign: 'center',
        marginBottom: 5,
    },
    borderView: { borderBottomWidth: 0.5, borderColor: 'lightgrey', marginVertical: 5 },
    textView: { flexDirection: "row", justifyContent: 'space-between', alignItems: 'center', },
    name: {
        fontSize: rf(1.6), fontFamily: Fonts.regular, color: Colors.lightblack
    },
    nameText: { color: Colors.lightblack, fontFamily: Fonts.regular, fontSize: rf(1.6), paddingHorizontal: 10, paddingVertical: 8 },
    dateText: {
        fontSize: rf(1.5), fontFamily: Fonts.regular, color: Colors.lightblack, textAlign: "left"
    },
    pickerView: {
        justifyContent: 'center', alignItems: 'flex-start',
        backgroundColor: Colors.f2f2f2, borderRadius: 5,
        borderWidth: 1, borderColor: "#cbcbcb",
        height: rh(4.4), marginTop: 10, width: "100%", paddingLeft: 10
    },
    date: { color: Colors.lightblack, fontFamily: Fonts.medium, fontSize: rf(1.5), },
    noData: {
        fontSize: rf(1.8), fontFamily: Fonts.medium, textAlign: 'center',
        marginTop: 15,

    },
    buttonView: { alignItems: "flex-start", marginTop: 10 },
    submitView: {
        justifyContent: 'center', alignItems: 'center', backgroundColor: Colors.theme, borderRadius: 5, width: "30%"

    },
    buttonText: { color: "white", fontFamily: Fonts.medium, fontSize: rf(1.5), paddingHorizontal: rh(1.3), paddingVertical: rh(0.8) },
    listHeaderView: {
        justifyContent: 'center', alignItems: 'center',
        backgroundColor: Colors.f2f2f2,
        //  borderRadius: 5,
        // borderWidth: 1, borderColor: "#cbcbcb",
        height: rh(4.4),
        // marginTop: 10, 
        width: "100%",
        // paddingLeft: 10
    },
    listHeaderText: { color: Colors.lightblack, fontFamily: Fonts.medium, fontSize: rf(1.5), },
    rowView: {
        marginTop: rh(1.3), padding: rh(1.3), borderRadius: 5, borderWidth: 1,
        borderColor: "lightgrey", backgroundColor: 'white', flexDirection: 'row',
        alignItems: 'center',
    },
    title: { color: Colors.lightblack, fontFamily: Fonts.medium, fontSize: rf(1.5), marginLeft: 5 },
    icon: {
        height: rh(1.7), width: rh(1.7)
    }
})
