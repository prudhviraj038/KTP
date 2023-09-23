import React, { useState, useEffect, useContext } from "react";
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  Alert,
  I18nManager,
  Pressable,
} from "react-native";
import { Header, StockContainer, StockListView } from "@components";
import { BackgroundView, TextField, Spinner } from "@common";
import { Fonts, Colors, Images } from "@Themes";
import { UserContext } from "@context/user-context";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import moment from "moment";
import { SettingsContext } from "@context/settings-context";
import services from "@services";
import constants from "@constants";
import RNPickerSelect from "react-native-picker-select";
import { useNavigation } from "@react-navigation/native";
import { LanguageContext } from "@context/lang-context";
import {
  responsiveHeight as rh,
  responsiveWidth as rw,
  responsiveFontSize as rf,
} from "react-native-responsive-dimensions";
var selectedArray = [];
function OrderStatus({ user, item }) {
  const { lang, setLang } = useContext(LanguageContext);
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
    if (item.cur_status === 1) {
      status = lang["Approved"];
      color = Colors.green;
    } else if (item.cur_status === 2) {
      status = lang["Rejected"];
      color = Colors.reject;
    } else {
      status = lang["Pending"];
      color = Colors.orange;
    }
  }
  return (
    <View
      style={{
        flexDirection: "row",
        justifyContent: "space-between",
        marginTop: 20,
      }}
    >
      <Text
        style={{
          fontSize: 12,
          fontFamily: Fonts.medium,
        }}
      >
        {lang["Order Status"]}
      </Text>
      <Text style={{ color: color, fontSize: 12, fontFamily: Fonts.medium }}>
        {status}
      </Text>
    </View>
  );
}
export default function NotificationsRequest({ route }) {
  const { lang, setLang } = useContext(LanguageContext);
  const { settings, setSettings } = useContext(SettingsContext);
  const [quotationData, setQuotationData] = useState([]);
  const [spinner, setSpinner] = useState(true);
  const [selectQuotation, setSelectQuotation] = useState(null);
  const { user, setUser } = useContext(UserContext);
  const [selectedItem, setSelectedItem] = useState(null);
  const [selectedStock, setSelectedStock] = useState([]);
  const [discountPrice, setDiscountPrice] = useState(0);
  const [vatPrice, setVatPrice] = useState(0);
  const [finalPrice, setFinalPrice] = useState(0);
  const [loading, setLoading] = useState(false);
  const [qty, setQty] = useState("1");
  const navigation = useNavigation();
  const placeholder = {
    label: lang["Select Quotation No."],
    value: null,
    color: "grey",
    fontFamily: Fonts.medium,
  };
  // console.log("-------", route.params.routingFrom)
  useEffect(() => {
    fetchQuotations();
  }, []);
  function getSelectedItem(item) {
    setSelectedItem(item);
    // setModalVisible(false)
    // console.log(item, "itemitem")
  }
  function calculationPercentage(total, percent) {
    return (parseFloat(total) * parseFloat(percent)) / 100;
  }
  function calculation() {
    var total = 0;

    selectedArray.map((res, key) => {
      total += parseFloat(res.total);
    });
    // console.log(total, "totaltotal")
    var discount = calculationPercentage(total, settings.discount);
    var vat_Price = calculationPercentage(total, settings.vat);
    setDiscountPrice(parseFloat(discount).toFixed(2));

    setVatPrice(parseFloat(vat_Price).toFixed(2));
    // console.log(discount, "discountdiscountdiscount")
    setFinalPrice(
      (
        parseFloat(total) -
        parseFloat(discount) +
        parseFloat(vat_Price)
      ).toFixed(2)
    );
  }
  function onAddItem() {
    if (selectedItem) {
      var obj = {
        id: selectedItem.S_ITEM,
        qty: qty,
        price: selectedItem.S_UPRC.toString(),
        total: (parseInt(qty) * parseFloat(selectedItem.S_UPRC)).toString(),
        title: selectedItem.S_ENAME,
        title_ar: selectedItem.S_ANAME,
      };
      selectedArray.push(obj);

      setSelectedStock([...selectedArray]);
      setSelectedItem(null);
      setQty("1");
      calculation();
      // setTotalPrice(parseFloat(total).toFixed(2))
    } else {
      Alert.alert(lang["KTP"], lang["Please select product and quantity"], [
        { text: lang["Ok"] },
      ]);
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
        { text: lang["Ok"], onPress: () => onOk(item, index) },
      ]
    );
  }
  function onOk(item, index) {
    selectedArray.splice(index, 1);
    setSelectedStock([...selectedArray]);
    calculation();
  }
  function getQty(text) {
    setQty(text);
  }
  function onApproveRequest() {
    // console.log(selectedStock, "selectedStockselectedStockselectedStock")
    var data = {
      products: selectedStock,
      sales_person: user.id.toString(),
      total: finalPrice.toString(),
      vat: vatPrice.toString(),
      discount: discountPrice.toString(),
      request_id: quotationData.id.toString(),
    };
    // console.log(data, "datadatadata")
    services(
      constants.API_BASE_URL + "/order_request_update",
      data,
      "POST"
    ).then((response) => {
      if (response.status === "Failed") {
        alert(response.message);
        setLoading(false);
      } else {
        setLoading(false);

        Alert.alert(response.message, "", [
          { text: "OK", onPress: () => onClearData() },
        ]);
      }
    });
  }
  function onSubmitStock(value) {
    setLoading(true);
    var data = {};
    var requestName = "";
    if (user.usertype === 1) {
      requestName = "order_request_approve";
      data = {
        products: selectedStock,
        sales_manager: user.id.toString(),
        total: finalPrice.toString(),
        vat: vatPrice.toString(),
        discount: discountPrice.toString(),
        request_id: quotationData.id.toString(),
        status: value.toString(),
      };
    } else {
      requestName = "order_request_coord_approve";
      data = {
        products: selectedStock,
        sales_coordinator: user.id.toString(),
        total: finalPrice.toString(),
        vat: vatPrice.toString(),
        discount: discountPrice.toString(),
        request_id: quotationData.id.toString(),
        status: value.toString(),
      };
    }
    // console.log(data, "datadatadata")
    services(constants.API_BASE_URL + "/" + requestName, data, "POST").then(
      (response) => {
        if (response.status === "Failed") {
          alert(response.message);
          setLoading(false);
        } else {
          setLoading(false);

          Alert.alert(response.message, "", [
            { text: lang["Ok"], onPress: () => onClearData() },
          ]);
        }
      }
    );
  }
  function onSubmit() {
    if (selectedStock && selectedStock.length > 0) {
      setLoading(true);
      if (route.params && route.params.routingFrom) {
        onApproveRequest();
      } else {
        onOrderRequest();
      }
    } else {
      Alert.alert(lang["KTP"], lang["Please select atleast 1 product"], [
        { text: lang["Ok"] },
      ]);
    }
  }
  function onOrderRequest() {
    var data = {
      products: selectedStock,
      member_id: user.id.toString(),
      total: finalPrice.toString(),
      vat: vatPrice.toString(),
      discount: discountPrice.toString(),
    };
    // console.log(data, "datadatadata")
    services(constants.API_BASE_URL + "/order_request", data, "POST").then(
      (response) => {
        if (response.status === "Failed") {
          alert(response.message);
          setLoading(false);
        } else {
          setLoading(false);

          Alert.alert(
            lang["KTP"],
            lang["Order Request Submitted Successfully. Order ID:"] +
              response.id,
            "",
            [{ text: lang["Ok"], onPress: () => onClearData() }]
          );
        }
      }
    );
  }
  function onClearData() {
    selectedArray = [];
    setSelectedStock([]);
    setDiscountPrice(0);
    setVatPrice(0);
    setFinalPrice(0);
    setLoading(false);
    navigation.popToTop();
    // if (route.params && route.params.routingFrom) {
    //     navigation.popToTop()
    // } else {
    //     navigation.pop()
    // }
  }

  const fetchQuotations = () => {
    var type = "";
    if (user.usertype === 5) {
      type = "1";
    } else if (user.usertype === 1) {
      type = "2";
    } else {
      type = "3";
    }
    selectedArray = [];
    services(
      constants.API_BASE_URL +
        "/order_requests?order_id=" +
        route.params.quotationId +
        "&type=" +
        type
    ).then((response) => {
      if (response) {
        // fetchPages()
        console.log(
          response[0].customer_products.products.length,
          "order_requests"
        );
        setQuotationData(response[0]);
        formatQuotations(response[0].customer_products.products);
        // setSpinner(false)
        // getCountry();
      }
    });
  };
  function formatQuotations(products) {
    // console.log(getQuotation.json.products, "getQuotationgetQuotation")
    if (products && products.length > 0) {
      products.map((res, key) => {
        var obj = {
          id: res.id,
          qty: res.qty,
          price: res.price.toString(),
          total: res.total.toString(),
          title: res.title,
          title_ar: res.title_ar,
        };
        selectedArray.push(obj);
      });
      setSelectedStock([...selectedArray]);
      setSpinner(false);
    }
  }
  function onBackPress() {
    selectedArray = [];
    navigation.popToTop();
  }
  function buttonsView() {
    return (user.usertype === 1 &&
      quotationData.sales_manager_approved === 0) ||
      (user.usertype === 12 && quotationData.cur_status === 0) ? (
      <View style={styles.buttonsView}>
        <Pressable style={styles.btnStyle} onPress={() => onSubmitStock("1")}>
          <Text style={styles.btnText}>{lang["Approve"]}</Text>
        </Pressable>
        <Pressable
          style={[
            styles.btnStyle,
            {
              marginLeft: 10,
            },
          ]}
          onPress={() => onSubmitStock("2")}
        >
          <Text style={styles.btnText}>{lang["Reject"]}</Text>
        </Pressable>
      </View>
    ) : user.usertype === 5 ? (
      <Pressable
        style={[
          styles.btnStyle,
          {
            alignSelf: "center",
          },
        ]}
        onPress={() => onSubmit()}
      >
        <Text style={styles.btnText}>{lang["Approve"]}</Text>
      </Pressable>
    ) : user.usertype === 12 ? (
      <Pressable style={styles.sendBtn} onPress={() => onSubmitStock("1")}>
        <Text style={styles.sendBtnText}>
          {lang["Send"]} {lang["Email"]}
        </Text>
      </Pressable>
    ) : null;
  }
  if (spinner) {
    return <Spinner initialLoad />;
  } else {
    return (
      <View style={styles.container}>
        <View style={styles.headerView}>
          <Header onBack={() => onBackPress()} />
        </View>
        <View style={styles.contentView}>
          <BackgroundView />

          <View style={styles.content}>
            <KeyboardAwareScrollView>
              <Text style={styles.headerText}>{lang["Order Request"]}</Text>

              <View style={styles.subContent}>
                <Text style={styles.textHead}>{lang["Select an Order"]}</Text>

                <View>
                  <View style={styles.pickerView}>
                    <Text style={styles.codeText}>{quotationData.code}</Text>
                    {/* <Image source={Images.icons.downArrow} style={{ height: 15, width: 15, tintColor: "grey", }} /> */}
                  </View>
                  <OrderStatus user={user} item={quotationData} />
                </View>

                <Text style={styles.newOrderText}>{lang["New Order"]}</Text>
                {user.usertype === 1 || user.usertype === 12 ? (
                  <StockListView selectedStock={selectedStock} />
                ) : (
                  <StockContainer
                    onAddItem={onAddItem}
                    getSelectedItem={getSelectedItem}
                    selectedStock={selectedStock}
                    selectedItem={selectedItem}
                    getQty={getQty}
                    onDeleteItem={onDeleteItem}
                    title="OrderRequest"
                  />
                )}

                {route.params && route.params.routingFrom ? (
                  buttonsView()
                ) : (
                  <Pressable
                    style={styles.buttonStyle}
                    onPress={() => onSubmit()}
                  >
                    <Text style={styles.buttonText}>{lang["Submit"]}</Text>
                  </Pressable>
                )}
                {/* {user.usertype === 12 ? (<Text style={{
                                    textDecorationLine: "underline", fontSize: 18, fontFamily: Fonts.medium, color: Colors.theme, textAlign: 'center', marginTop: 20
                                }}>{lang["Send"]} {lang["Email"]}</Text>) : (null)} */}
              </View>
            </KeyboardAwareScrollView>
          </View>
        </View>
        {loading && <Spinner />}
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "white",
  },
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
  headerText: {
    fontSize: rf(2),
    fontFamily: Fonts.medium,
    textAlign: "center",
    marginBottom: 5,
  },
  subContent: { marginHorizontal: 15 },
  textHead: {
    fontSize: rf(1.5),
    fontFamily: Fonts.medium,
    color: "#303030",
    marginTop: 20,
    textAlign: "left",
  },
  pickerView: {
    borderWidth: 1,
    borderColor: "#cbcbcb",
    borderRadius: 5,
    marginTop: 10,
    height: rf(4.5),
    justifyContent: "space-between",
    paddingHorizontal: 10,
    backgroundColor: Colors.e6e6e6,
    flexDirection: "row",
    alignItems: "center",
  },
  codeText: { textAlign: "left", fontFamily: Fonts.regular, fontSize: rf(1.7) },
  downArrowIcon: { height: rh(2), width: rh(2), tintColor: "grey" },
  buttonStyle: {
    height: rh(4.5),
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: Colors.theme,
    borderRadius: 5,
    marginVertical: 20,
    // marginBottom:20
  },
  buttonText: {
    fontSize: rf(1.7),
    fontFamily: Fonts.regular,
    color: "white",
  },
  newOrderText: {
    fontSize: rf(1.5),
    fontFamily: Fonts.medium,
    color: "#303030",
    marginTop: 20,
    textAlign: "left",
  },
  buttonsView: { flexDirection: "row", justifyContent: "center" },
  btnStyle: {
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: Colors.theme,
    borderRadius: 5,
    marginVertical: 20,
    height: rh(4.5),
    marginRight: 10,
    width: rw(20),
  },
  btnText: {
    fontSize: rf(1.7),
    fontFamily: Fonts.regular,
    color: "white",
  },
  sendBtn: {
    height: rh(4.5),
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: Colors.theme,
    borderRadius: 5,
    marginVertical: 20,
    // width: 100,

    alignSelf: "center",
    // marginBottom:20
  },
  sendBtnText: {
    fontSize: rf(1.7),
    fontFamily: Fonts.regular,
    color: "white",
    paddingHorizontal: 20,
  },
});
