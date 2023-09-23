import React, { useState, useEffect, useContext } from 'react';
import {
    StyleSheet,
    Text,
    View,
    Image,
    TextInput,
    TouchableOpacity,
    TouchableWithoutFeedback,
    Keyboard,
    ScrollView,
    FlatList,
    Dimensions,
    Alert,
    KeyboardAvoidingView,
    Platform,
    I18nManager
} from 'react-native';
import { BackgroundView, TextField, Spinner } from '@common';
import { Header } from '@components'
import { Colors, Images, Fonts } from '@Themes';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { UserContext } from "@context/user-context";
import styles from "./styles";
import services from "@services";
import constants from "@constants";
const window = Dimensions.get("window");
import { LanguageContext } from '@context/lang-context';
export default function Chat(props) {
    const [keyBoardOpen, setKeyBoardOpen] = useState(false)
    const { user, setUser } = useContext(UserContext);
    const [height, setHeight] = useState(window.width / 6.857142857);
    const { lang, setLang } = useContext(LanguageContext);
    const [spinner, setSpinner] = useState(true);
    const [messages, setMessages] = useState([]);
    const [disable, setDisable] = useState(false)
    const [inputMessage, setInputMessage] = useState('');

    // function getTime(date) {
    //     var hours = date.getHours();
    //     var minutes = date.getMinutes();
    //     var ampm = hours >= 12 ? 'PM' : 'AM';
    //     hours = hours % 12;
    //     hours = hours ? hours : 12;
    //     minutes = minutes < 10 ? '0' + minutes : minutes;
    //     var strTime = hours + ':' + minutes + ' ' + ampm;
    //     return strTime;
    // }

    function sendMessage() {
        setKeyBoardOpen(true)
        Keyboard.dismiss()
        if (!inputMessage) {
            Alert.alert(
                lang["KTP"],
                lang["Please fill the message"],
                [
                    { text: lang["Ok"] }
                ]
            );
        } else {
            setDisable(true)

            var data = {
                "member_id": user.id.toString(),
                "message": inputMessage
            }
            // console.log(data, "data")
            services(constants.API_BASE_URL + "/chat", data, "POST").then((response) => {
                if (response) {
                    console.log(response, "======response")
                    if (response.status === "Success") {
                        setInputMessage("")

                        fetchMsgs()
                    } else {
                        setDisable(false)
                        alert(response.message)
                    }

                }
            });
        }
    }
    useEffect(() => {
        fetchMsgs()
    }, []);
    const fetchMsgs = () => {
        // console.log(constants.API_BASE_URL + "/chats?member_id=" + user.id + "&limit=0", "responsesresponsesresponses")
        services(constants.API_BASE_URL + "/chats?member_id=" + user.id + "&limit=0").then((response) => {
            if (response) {


                // fetchPages()
                // console.log(response[0].description, "responsesresponsesresponses")
                setMessages(response.reverse())
                setSpinner(false)
                setDisable(false)
                // getCountry();
            }
        });
    };
    const renderMentorChatData = ({ item, ind }) => {

        return (
            <View style={[styles.chatFullWidthContainer, { transform: [{ scaleY: -1 }] }]} key={ind}>
                {item.is_reply === 0 ? (
                    <View style={styles.rightView}>
                        {/* <Image source={Images.tabs.user}
                            style={{ height: 40, width: 40, borderRadius: 20, marginLeft: 10 }} /> */}
                        <View style={[styles.rightChatContainer,]}>
                            <View style={{ zIndex: 2 }}>
                                <Text style={[styles.chatTextStyle, { color: "black", textAlign: "right" }]}>{item.message}</Text>
                                {/* <Text style={{ color: "black", textAlign: "right", fontSize: 8, marginTop: 5 }}>{item.time}</Text> */}
                            </View>
                        </View>
                    </View>
                ) : (
                    <View style={styles.leftView}>
                        {/* <Image source={Images.tabs.user}
                            style={{ height: 40, width: 40, borderRadius: 20, marginRight: 10 }} /> */}
                        <View style={[styles.leftChatContainer, {}]}>
                            <View style={{ zIndex: 2 }}>
                                <Text style={[styles.chatTextStyle, { color: "#fff", textAlign: "left" }]}>{item.message}</Text>
                                {/* <Text style={{ color: "#fff", textAlign: "left", fontSize: 8, marginTop: 5 }}>{item.time}</Text> */}
                            </View>

                        </View>
                    </View>
                )}

            </View>
        )
    }

    return (
        <View style={styles.container}>
            <View style={{ flex: 0.1 }}>
                <Header
                    onBack={() => props.onBack()}
                />
            </View>
            {spinner ? (
                <Spinner initialLoad />
            ) : (
                <KeyboardAvoidingView
                    style={{ flex: 1 }}
                    behavior={Platform.OS === "ios" ? "padding" : ""}
                    keyboardVerticalOffset={Platform.OS === "ios" ? window.width / 6.428571429 : 0}>
                    {messages && messages.length > 0 ? (
                        <View style={styles.myListView}>
                            <FlatList
                                data={messages}
                                keyExtractor={(x, i) => i.toString()}
                                showsVerticalScrollIndicator={false}
                                style={{ transform: [{ scaleY: -1 }] }}
                                // inverted={-1}
                                contentContainerStyle={{ justifyContent: "flex-end" }}
                                renderItem={renderMentorChatData}
                            // extraData={this.state}
                            />
                        </View>

                    ) : (
                        <View style={styles.noChatDataView}>
                            <Text style={styles.chatTextStyle}>{lang["You don't have chat yet"]}</Text>
                        </View>
                    )}
                    <View style={[styles.inputTextView, { height: Math.max(35, height) }]}>
                        <View style={styles.inputPlaceHolderView}>
                            <TextInput
                                // {...this.props}
                                // ref={(ref) => { this.inputMessage = ref; }}
                                placeholder={lang["Type Here"] + " ..."}
                                placeholderTextColor={"#a9a9a9"}
                                multiline={true}
                                value={inputMessage}
                                onChangeText={setInputMessage}
                                onSubmitEditing={sendMessage}
                                style={[styles.inputMessageStyle, {}]}
                                blurOnSubmit={keyBoardOpen}
                            />
                        </View>
                        <View style={styles.sendButtonView} pointerEvents={inputMessage === "" ? "none" : "auto"}>
                            <TouchableOpacity disabled={disable} style={styles.sendButtonSubView}
                                onPress={sendMessage}
                            >
                                {/* <Image source={I18nManager.isRTL ? Images.icons.send_ar : Images.icons.send}
                                    style={{ height: 20, width: 20, tintColor: Colors.theme }} /> */}
                                <Text style={styles.send}>{lang["Send"]}</Text>
                                {/* <Icon name="send" size={window.width / 25.71428571} color={this.state.message === "" ? "#ececec" : "black"} /> */}
                            </TouchableOpacity>
                        </View>
                    </View>
                </KeyboardAvoidingView>

            )}


        </View>
    )

}
