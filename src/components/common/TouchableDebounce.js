import React, { PureComponent } from "react";
import { PropTypes, ViewPropTypes, TouchableOpacity } from "react-native";
import { debounce } from "underscore";


//PureComponent handles shouldComponentUpdate for you.
class TouchableDebounce extends React.PureComponent {
    constructor(props) {
        super(props);
    }
    handlePress = () => {
        const { onPress, debounceTime, handleFirstTap } = this.props;
        debounce(onPress, debounceTime, handleFirstTap);
    };
    render() {
        return (
            <TouchableOpacity
                {...this.props}
                onPress={this.handlePress}
            >
                {this.props.children}
            </TouchableOpacity>
        );
    }
}
TouchableDebounce.propTypes = {
    onPress: PropTypes.func.isRequired,
    style: ViewPropTypes.style,
    handleFirstTap: PropTypes.bool,
    debounceTime: PropTypes.number
};
TouchableDebounce.defaultProps = {
    style: {},
    handleFirstTap: true,
    debounceTime: 500
};
export default TouchableDebounce;