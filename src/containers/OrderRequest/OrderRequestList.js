import React, { useEffect, useContext, useState } from "react";
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
} from "react-native";
import { Header } from "@components";
import { BackgroundView, TextField, Spinner } from "@common";
import { Fonts, Colors, Images } from "@Themes";
import { UserContext } from "@context/user-context";
import services from "@services";
import constants from "@constants";
import moment from "moment";
import { LanguageContext } from "@context/lang-context";
import { useNavigation } from "@react-navigation/native";
import {
  responsiveHeight as rh,
  responsiveWidth as rw,
  responsiveFontSize as rf,
} from "react-native-responsive-dimensions";
export default function OrderRequestList() {
  const { lang, setLang } = useContext(LanguageContext);
  const { user, setUser } = useContext(UserContext);
  const [orderList, setOrderList] = useState([]);
  const [spinner, setSpinner] = useState(true);
  const navigation = useNavigation();
  useEffect(() => {
    fetchOrderList();
  }, []);
  const fetchOrderList = () => {
    var type = "";
    if (user.usertype === 5) {
      type = "1";
    } else if (user.usertype === 1) {
      type = "2";
    } else {
      type = "3";
    }
    console.log(
      constants.API_BASE_URL +
        "/order_requests?member_id=" +
        user.id +
        "&type=" +
        type,
      "-----Ramaa-------"
    );
    services(
      constants.API_BASE_URL +
        "/order_requests?member_id=" +
        user.id +
        "&type=" +
        type
    ).then((response) => {
      if (response) {
        // fetchPages()
        // console.log(response[0].description, "responsesresponsesresponses")
        setOrderList(response);
        setSpinner(false);
        // getCountry();
      }
    });
  };
  function _renderItem({ item, index }) {
    var status = "";
    var color = "black";
    if (user.usertype === 5) {
      if (item.sales_person_approved === 1) {
        status = lang["Approved"];
        color = Colors.green;
      } else if (item.cur_status === 2) {
        status = lang["Rejected"];
        color = Colors.reject;
      } else {
        status = lang["Pending"];
        color = Colors.orange;
      }
    } else if (user.usertype === 1) {
      if (item.sales_manager_approved === 1) {
        status = lang["Approved"];
        color = Colors.green;
      } else if (item.sales_manager_approved === 2) {
        status = lang["Rejected"];
        color = Colors.reject;
      } else {
        status = lang["Pending"];
        color = Colors.orange;
      }
    } else {
    }
    return (
      <View style={styles.rowData}>
        <View style={styles.view}>
          <Text style={[styles.header, { marginTop: 0 }]}>
            {lang["Date"]} : {moment(item.now).format("YYYY-MM-DD")}
          </Text>
          <Text style={styles.header}>
            {lang["Order No"]} : {item.code}
          </Text>
          <Text style={styles.header}>
            {lang["Name"]} : {item.sales_person_name}
          </Text>
          <Text style={styles.header}>
            {lang["Code"]} : {item.c_code}
          </Text>
        </View>
        <View style={styles.statusView}>
          <Text style={styles.header}>
            {lang["Salesman Name"]} : {item.sales_person_name}
          </Text>
          {user.usertype === 1 || user.usertype === 5 ? (
            <Text style={styles.header}>
              {lang["Status"]} : <Text style={{ color: color }}>{status}</Text>
            </Text>
          ) : null}

          <TouchableOpacity
            // disable={true}
            onPress={() =>
              navigation.push("OrderRequest", {
                routingFrom: "OrderRequestList",
                item,
              })
            }
            style={styles.viewBtn}
          >
            <Text style={styles.viewText}>{lang["View"]}</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }
  return (
    <View style={styles.container}>
      <View style={styles.headerView}>
        <Header />
      </View>
      <View style={styles.contentView}>
        <BackgroundView />

        <View style={styles.content}>
          <Text style={styles.headerText}>{lang["Order Request"]}</Text>
          {spinner ? (
            <Spinner initialLoad />
          ) : orderList ? (
            <FlatList
              data={orderList}
              renderItem={_renderItem}
              keyExtractor={(item) => item.id}
              // numColumns={3}
              style={{ marginTop: 10 }}
            />
          ) : (
            <Text style={styles.noData}>{lang["No Data Found"]}</Text>
          )}
        </View>
      </View>
    </View>
  );
}
const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "white" },
  headerView: { flex: 0.1 },
  contentView: { flex: 0.9 },
  content: {
    position: "absolute",
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: Colors.overlayWhite,
  },

  header: {
    fontSize: rf(1.5),
    fontFamily: Fonts.regular,
    marginTop: 5,
    textAlign: "left",
  },
  headerText: {
    fontSize: rf(2),
    fontFamily: Fonts.medium,
    textAlign: "center",
    marginBottom: 5,
  },
  noData: {
    fontSize: rf(2),
    fontFamily: Fonts.medium,
    textAlign: "center",
    marginTop: 15,
  },
  rowData: {
    borderBottomWidth: 1,
    borderColor: "lightgrey",
    paddingVertical: 20,
    paddingHorizontal: 15,
    flexDirection: "row",
  },
  view: { flex: 0.6 },
  statusView: { flex: 0.4, justifyContent: "center" },
  viewBtn: {
    backgroundColor: Colors.theme,
    marginTop: 5,
    alignItems: "center",
    justifyContent: "center",
    alignSelf: "center",
    borderRadius: 5,
  },
  viewText: {
    fontSize: rf(1.5),
    fontFamily: Fonts.medium,
    color: Colors.white,
    paddingHorizontal: 10,
    paddingVertical: 5,
  },
});
