import { I18nManager } from "react-native";
const Fonts = {
  regular: I18nManager.isRTL ? "Cairo-Regular" : "Poppins-Regular",
  medium: I18nManager.isRTL ? "Cairo-Bold" : "Poppins-Medium",
  // medium: "Poppins-Regular",
};

export default Fonts;
