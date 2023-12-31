import { Dimensions, StyleSheet, I18nManager } from "react-native";
import { Colors, Fonts } from "@Themes";
import {
  responsiveHeight as rh,
  responsiveWidth as rw,
  responsiveFontSize as rf,
} from "react-native-responsive-dimensions";
const { height, width } = Dimensions.get("window");
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "white",
  },
  headerView: { flex: 0.1 },
  content: { flex: 0.9 },
  headerText: {
    fontSize: rf(2),
    fontFamily: Fonts.medium,
    textAlign: "center",
    marginBottom: 5,
  },
  contentView: {
    position: "absolute",
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: Colors.overlayWhite,
  },
  subContent: { flex: 1, marginHorizontal: 15 },
  iconStyle: { height: rh(1.7), width: rh(1.7), tintColor: "grey" },
  inputStyle: {
    paddingLeft: 10,
    padding: 0,
    margin: 0,
    backgroundColor: Colors.f2f2f2,
    borderWidth: 1,
    borderColor: "#cbcbcb",
    fontFamily: Fonts.regular,
    color: "black",
    textAlign: I18nManager.isRTL ? "right" : "left",
    fontSize: rf(1.7),
  },
  inputStyle2: {
    paddingLeft: 10,
    padding: 0,
    margin: 0,
    borderWidth: 1,

    backgroundColor: "#969696",

    borderColor: "#969696",

    fontFamily: Fonts.regular,
    color: "black",
    textAlign: I18nManager.isRTL ? "right" : "left",
    fontSize: rf(1.7),
  },
  inputView: { flexDirection: "row", marginTop: 10 },
  inputHeaderView: { flex: 0.35, justifyContent: "center" },
  title: { fontFamily: Fonts.regular, textAlign: "left", fontSize: rf(1.7) },
  input: { flex: 0.65 },
  inputStyleComment: {
    paddingTop: 5,
    paddingLeft: 10,
    backgroundColor: Colors.f2f2f2,
    borderWidth: 1,
    borderColor: "#cbcbcb",
    fontFamily: Fonts.regular,
    color: "black",
    textAlignVertical: "top",
    textAlign: I18nManager.isRTL ? "right" : "left",
    fontSize: rf(1.7),
  },
  buttonStyle: {
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: Colors.theme,
    borderRadius: 5,
    alignSelf: "flex-end",
    marginVertical: 20,
  },
  btnText: {
    color: "white",
    fontFamily: Fonts.medium,
    fontSize: rf(1.5),
    paddingHorizontal: 10,
    paddingVertical: 8,
  },
  datePicker: {
    paddingLeft: 10,
    padding: 0,
    margin: 0,
    backgroundColor: Colors.f2f2f2,
    borderWidth: 1,
    borderColor: "#cbcbcb",
    fontFamily: Fonts.regular,
    height: rh(5),
    borderRadius: 5,
    justifyContent: "center",
  },
  dateText: {
    color: "black",
    textAlign: "left",
    fontSize: rf(1.7),
  },
  flatlist: {
    backgroundColor: "#f2f2f27a",
    borderWidth: 1,
    borderColor: "lightgrey",
    borderRadius: 5,
    marginVertical: 10,
    // marginHorizontal: 10
  },
  header: {
    fontSize: rf(1.5),
    fontFamily: Fonts.medium,
    textAlign: "left",
  },
  text: {
    fontSize: rf(1.5),
    fontFamily: Fonts.regular,
    textAlign: "left",
    // flexWrap: 'wrap',
    // flex: 1
  },
  requestButton: {
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: Colors.theme,
    borderRadius: 5,
    alignSelf: "flex-end",
    marginVertical: 10,
  },
  requestButtonText: {
    color: "white",
    fontFamily: Fonts.medium,
    fontSize: rf(1.5),
    paddingHorizontal: 10,
    paddingVertical: 8,
  },
  noData: {
    fontSize: rf(1.8),
    fontFamily: Fonts.medium,
    textAlign: "center",
    marginTop: 15,
  },
  rowHeader: {
    flexDirection: "row",
    paddingVertical: 10,
    paddingLeft: 10,
  },
  rowData: {
    flexDirection: "row",
    paddingVertical: 10,
    borderTopWidth: 1,
    borderColor: "lightgrey",
    paddingLeft: 10,
  },
  idView: { flex: 0.25, justifyContent: "center", alignItems: "center" },
  msgView: { flex: 0.4, justifyContent: "center" },
  statusView: { flex: 0.35, justifyContent: "center", marginLeft: 10 },
});
export default styles;
