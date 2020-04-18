import * as React from "react";

export default function withI18n(Component, options) {
    const {forwardRef = false} = options || {};

    class Wrapper extends React.Component {
        i18n = (id) => {
            return this.props.intl.messages[id] || ("{" + id + "}");
        };

        formatMessage = (msgId, values = {}) => {
            return this.props.intl.formatMessage({id: msgId}, values);
        };

        render() {
            return <Component
                i18n={this.i18n}
                formatMessage={this.formatMessage}
                locale={this.props.intl.locale}
                ref={forwardRef ? this.props.forwardedRef : null}
                {...this.props}
            />;
        }
    }

    if (forwardRef) {
        return React.forwardRef((props, ref) =>
            <Wrapper {...props} forwardedRef={ref}/>
        )
    }

    return Wrapper;
}
