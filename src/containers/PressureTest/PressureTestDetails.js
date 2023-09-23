import React, { useEffect, useState, useContext } from "react";
import {
  View,
  Text,
  Modal,
  TouchableOpacity,
  Image,
  Alert,
  ScrollView,
  useWindowDimensions,
  StyleSheet,
} from "react-native";
import { UserContext } from "@context/user-context";
import { BackgroundView, TextField, Spinner } from "@common";
import { Header } from "@components";
import { useNavigation } from "@react-navigation/native";
import { Fonts, Colors } from "@Themes";
import services from "@services";
import constants from "@constants";
import Images from "../../Themes/Images";
import HTML from "react-native-render-html";
import styles from "./styles";
import moment from "moment";
import { LanguageContext } from "@context/lang-context";
import AutoHeightImage from "react-native-auto-height-image";
import Pdf from "react-native-pdf";
function ShowText({ name, title }) {
  return (
    <Text style={styles.header}>
      {title} : {name}
    </Text>
  );
}
export default function PressureTestDetails({ route }) {
  const [spinner, setSpinner] = useState(true);
  const { lang, setLang } = useContext(LanguageContext);
  const { user, setUser } = useContext(UserContext);
  const [data, setData] = useState(null);
  const contentWidth = useWindowDimensions().width;
  const [item, setItem] = useState(null);
  // const { item } = route.params;
  const [source, setSource] = useState(null);
  useEffect(() => {
    if (route.params) {
      if (route.params.routingFrom) {
        fetchDetails();
      } else {
        setItem(route.params.item);
        setSource({ uri: route.params.item.file_report, cache: true });
        setSpinner(false);
      }
      // fetchPages()
    }
  }, []);
  const fetchDetails = () => {
    console.log(
      constants.API_BASE_URL + "/pressure_test_info/" + route.params.reportId
    );
    services(
      constants.API_BASE_URL + "/pressure_test_info/" + route.params.reportId
    ).then((response) => {
      if (response) {
        setItem(response);
        setSource({ uri: response.file_report, cache: true });
        setSpinner(false);
      } else {
        setSpinner(false);
      }
    });
  };

  return (
    <View style={styles.container}>
      <View style={styles.headerView}>
        <Header />
      </View>
      <View style={styles.content}>
        <Text style={styles.headerText}>{lang["Pressure Test Details"]}</Text>
        {spinner ? (
          <Spinner initialLoad />
        ) : (
          <View style={styles1.container}>
            <View style={styles1.subContent}>
              {user.usertype === 7 ? (
                <ShowText
                  name={item.customer_id.fullname}
                  title={lang["Customer Name"]}
                />
              ) : user.usertype === 2 || user.usertype === 11 ? (
                <ShowText
                  name={item.technician_id.fullname}
                  title={lang["Technician Name"]}
                />
              ) : (
                <View>
                  <ShowText
                    name={item.technician_id.fullname}
                    title={lang["Technician Name"]}
                  />
                  <View style={styles1.textView}>
                    <ShowText
                      name={item.customer_id.fullname}
                      title={lang["Customer Name"]}
                    />
                  </View>
                </View>
              )}

              <Text style={[styles.header, { marginTop: 10 }]}>
                {lang["Date of Report"]} :{" "}
                {moment(item.now).format("YYYY-MM-DD")}
              </Text>
            </View>
            {item.file_ext === "pdf" ? (
              <View style={styles1.pdfView}>
                <Pdf
                  source={source}
                  onLoadComplete={(numberOfPages, filePath) => {
                    // console.log(`number of pages: ${numberOfPages}`);
                  }}
                  onPageChanged={(page, numberOfPages) => {
                    // console.log(`current page: ${page}`);
                  }}
                  onError={(error) => {
                    console.log(error);
                  }}
                  //page={20}
                  //enablePaging={true}
                  onPressLink={(uri) => {
                    // console.log(`Link presse: ${uri}`)
                  }}
                  style={styles.pdf}
                />
              </View>
            ) : (
              <ScrollView>
                <AutoHeightImage
                  source={{ uri: item.file_report }}
                  width={contentWidth / 1.56}
                  style={{ alignSelf: "center", marginVertical: 20 }}
                />
              </ScrollView>
            )}

            {/* <View style={styles1.buttonView}>
              <Pressable style={styles1.buttonStyle} onPress={onSendEmail}>
                <Text style={styles1.btnText}>
                  {lang["Send"]} {lang["Email"]}
                </Text>
              </Pressable>
            </View> */}
          </View>
        )}
      </View>
    </View>
  );
}
const styles1 = StyleSheet.create({
  container: { flex: 1 },
  subContent: { marginVertical: 10, marginHorizontal: 15 },
  pdfView: { flex: 1, overflow: "hidden" },
  textView: { marginTop: 10 },
  buttonsView: {
    alignItems: "flex-end",
    marginTop: 10,
    flexDirection: "row",
    justifyContent: "flex-end",
  },
  buttonsStyle: {
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: Colors.theme,
    borderRadius: 5,
  },
  btnText: {
    color: "white",
    fontFamily: Fonts.medium,
    fontSize: rf(1.5),
    paddingHorizontal: 10,
    paddingVertical: 8,
  },
});
