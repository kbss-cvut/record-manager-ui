'use strict';

import React from "react";
import ReactDOM from "react-dom";
import {FormLabel, FormGroup, FormControl, FormText, FormCheck} from "react-bootstrap";
import PropTypes from "prop-types";

export default class Input extends React.Component {
    static propTypes = {
        type: PropTypes.string,
        label: PropTypes.string,
        value: PropTypes.any,
        onChange: PropTypes.func,
        help: PropTypes.string,
        validation: PropTypes.oneOf(['success', 'warning', 'error'])
    };

    static defaultProps = {
        type: 'text'
    };

    constructor(props) {
        super(props);
    }

    focus() {
        ReactDOM.findDOMNode(this.input).focus();
    }

    getInputDOMNode() {
        return ReactDOM.findDOMNode(this.input);
    }

    render() {
        switch (this.props.type) {
            case 'radio':
                return this._renderRadio();
            case 'checkbox':
                return this._renderCheckbox();
            case 'select':
                return this._renderSelect();
            case 'textarea':
                return this._renderTextArea();
            default:
                return this._renderInput();
        }
    }

    _renderCheckbox() {
        return <FormCheck ref={c => this.input = c} {...this.props}>{this.props.label}</FormCheck>;
    }

    _renderRadio() {
        return <FormCheck ref={c => this.input = c} {...this.props}>{this.props.label}</FormCheck>;
    }

    _renderSelect() {
        return <FormGroup size='sm'>
            {this._renderLabel()}
            <FormControl as='select' ref={c => this.input = c} {...this.props}>
                {this.props.children}
            </FormControl>
            {this.props.validation && <FormControl.Feedback/>}
            {this._renderHelp()}
        </FormGroup>;
    }

    _renderLabel() {
        return this.props.label ? <FormLabel>{this.props.label}</FormLabel> : null;
    }

    _renderTextArea() {
        return <FormGroup size='sm'>
            {this._renderLabel()}
            <FormControl as='textarea' style={{height: 'auto'}} ref={c => this.input = c} {...this.props}/>
            {this.props.validation && <FormControl.Feedback/>}
            {this._renderHelp()}
        </FormGroup>;
    }

    _renderHelp() {
        return this.props.help ? <FormText>{this.props.help}</FormText> : null;
    }

    _renderInput() {
        return <FormGroup size='sm'>
            {this._renderLabel()}
            <FormControl ref={c => this.input = c} as='input' {...this.props}/>
            {this.props.validation && <FormControl.Feedback/>}
            {this._renderHelp()}
        </FormGroup>;
    }
}
