import { Dimensions, StyleSheet } from "react-native";
import { Colors, Fonts } from "@Themes";
const { height, width } = Dimensions.get("window");
import {
  responsiveHeight as rh,
  responsiveWidth as rw,
  responsiveFontSize as rf,
} from "react-native-responsive-dimensions";
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "white",
  },
  headerView: { flex: 0.1 },
  subHeader: { flex: 0.05, alignItems: "center" },
  headerText: {
    fontSize: rf(2),
    fontFamily: Fonts.medium,
    textAlign: "center",
    marginBottom: 5,
  },
  content: { flex: 0.85 },
});
export default styles;
