import React, { useContext, useState, useEffect } from "react";
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  Modal,
  StyleSheet,
  Pressable,
  I18nManager,
} from "react-native";
import { Images, Colors, Fonts } from "@Themes";
import { useNavigation } from "@react-navigation/native";
import { UserContext } from "@context/user-context";
import { ModalView, Spinner } from "@common";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { SelectLanguageContext } from "@context/selectLang-context";
import RNRestart from "react-native-restart";
import { LanguageContext } from "@context/lang-context";
import { TokenContext } from "@context/token-context";
import services from "@services";
import constants from "@constants";
export default function SideBar(props) {
  const { selectLang, setSelectLang } = useContext(SelectLanguageContext);
  const { lang, setLang } = useContext(LanguageContext);
  const { user, setUser } = useContext(UserContext);
  const [modalVisible, setModalVisible] = useState(false);
  const [modalVisibleLang, setModalVisibleLang] = useState(false);
  const { deviceInfo, setDeviceInfo } = useContext(TokenContext);
  const navigation = useNavigation();
  const [spinner, setSpinner] = useState(false);
  function onNavigation(params) {
    props.navigation.closeDrawer();
    navigation.push(params);
  }
  useEffect(() => {}, [deviceInfo]);
  const onLogout = async () => {
    // try {
    //     await AsyncStorage.clear();
    //     setUser(null)
    //     // console.log('Done');
    // } catch (error) {
    //     console.log(error);
    // }
    try {
      await AsyncStorage.removeItem("@USERID");
      setUser("");
      setSpinner(true);
      onRegisterDevice("-1");
      return true;
    } catch (exception) {
      return false;
    }
  };
  async function onOk() {
    const getLang = await AsyncStorage.getItem("@LANGUAGE");
    const value = JSON.parse(getLang);
    if (value === "English") {
      AsyncStorage.setItem("@LANGUAGE", JSON.stringify("Arabic"));
      I18nManager.forceRTL(true);
      setSelectLang("Arabic");
    } else {
      AsyncStorage.setItem("@LANGUAGE", JSON.stringify("English"));
      I18nManager.forceRTL(false);
      setSelectLang("English");
    }
    RNRestart.Restart();
  }
  function onRegisterDevice(userId) {
    // console.log(constants.API_BASE_URL + "/members/" + userId, "====")
    if (deviceInfo) {
      var data = {
        device_token: deviceInfo.device_token,
        device_id: deviceInfo.device_id,
        device_type: deviceInfo.device_type,
        member_id: userId.toString(),
      };
      services(constants.API_BASE_URL + "/token_register", data, "POST")
        .then((response) => {
          // if (response.status === "Success") {
          // console.log(response, "response=====token_registertoken_register")
          // setUser(response[0]);
          setSpinner(false);
          // navigation.pop()
          // } else {
          //     setLoading(false)
          //     navigation.pop()
          // }
        })
        .catch((error) => {
          // console.log(error, "eerrrrrppppp")
        });
    } else {
      setSpinner(false);
      // navigation.pop()
    }
  }

  return (
    <View style={{ flex: 1 }}>
      <View
        style={{ flex: 0.15, alignItems: "center", justifyContent: "center" }}
      >
        <Image
          source={Images.logo}
          style={{ height: 154 / 2.8, width: 400 / 2.8 }}
        />
      </View>
      <View style={{ flex: 0.85 }}>
        {user ? null : (
          <View style={{ flexDirection: "row" }}>
            <View style={{ flex: 0.5, alignItems: "center" }}>
              <TouchableOpacity
                onPress={() => onNavigation("Login")}
                style={{
                  justifyContent: "center",
                  alignItems: "center",
                  height: 35,
                  width: 120,
                  backgroundColor: Colors.theme,
                  borderRadius: 5,
                }}
              >
                <Text
                  style={{
                    color: "white",
                    fontFamily: Fonts.regular,
                    fontSize: 12,
                  }}
                >
                  {lang["Login"]}
                </Text>
              </TouchableOpacity>
            </View>
            <View style={{ flex: 0.5, alignItems: "center" }}>
              <TouchableOpacity
                onPress={() => onNavigation("SignUp")}
                style={{
                  justifyContent: "center",
                  alignItems: "center",
                  height: 35,
                  width: 120,
                  backgroundColor: Colors.theme,
                  borderRadius: 5,
                }}
              >
                <Text
                  style={{
                    color: "white",
                    fontFamily: Fonts.regular,
                    fontSize: 12,
                  }}
                >
                  {lang["Signup"]}
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        )}
        <TouchableOpacity
          onPress={() => setModalVisibleLang(!modalVisibleLang)}
        >
          <Text
            style={{
              color: "black",
              marginLeft: 15,
              fontFamily: Fonts.regular,
              marginTop: user ? 0 : 20,
              textAlign: "left",
            }}
          >
            {selectLang === "English" ? "Arabic" : "English"}
          </Text>
        </TouchableOpacity>
        {user ? (
          <TouchableOpacity onPress={() => setModalVisible(!modalVisible)}>
            <Text
              style={{
                color: "black",
                marginLeft: 15,
                fontFamily: Fonts.regular,
                marginTop: 15,
                textAlign: "left",
              }}
            >
              {lang["Logout"]}
            </Text>
          </TouchableOpacity>
        ) : null}
      </View>
      {/* <View style={{ flex: 0.05 }}>
                <Text style={{ color: 'black', marginLeft: 10, fontFamily: Fonts.regular }}>Arabic</Text>
            </View>
            <View style={{ flex: 0.7 }}>
                <Text style={{ color: 'black', marginLeft: 10, fontFamily: Fonts.regular }}>Arabic</Text>
            </View> */}
      <Modal animationType="fade" transparent={true} visible={modalVisible}>
        <ModalView
          title={lang["KTP"]}
          subTitle={lang["Are you sure you want to logout?"]}
          leftButtonText={lang["Ok"]}
          rightButtonText={lang["Cancel"]}
          onRightPress={() => {
            setModalVisible(false);
            //  props.navigation.push("CartScreen");
          }}
          onLeftPress={() => {
            setModalVisible(false);
            onLogout();
            //  props.navigation.goBack();
          }}
          onClose={() => setModalVisible(false)}
        />
      </Modal>
      <Modal animationType="fade" transparent={true} visible={modalVisibleLang}>
        <ModalView
          title={lang["KTP"]}
          subTitle={lang["Are you sure you want to change language?"]}
          leftButtonText={lang["Ok"]}
          rightButtonText={lang["Cancel"]}
          onRightPress={() => {
            setModalVisibleLang(false);
            //  props.navigation.push("CartScreen");
          }}
          onLeftPress={() => {
            setModalVisibleLang(false);
            onOk();
            //  props.navigation.goBack();
          }}
          onClose={() => setModalVisibleLang(false)}
        />
      </Modal>
      {spinner && <Spinner />}
    </View>
  );
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
