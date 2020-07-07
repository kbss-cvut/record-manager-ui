'use strict';

import React from "react";
import ReactDOM from "react-dom";
import {Col, FormCheck, FormControl, FormGroup, FormLabel, FormText, InputGroup} from "react-bootstrap";
import PropTypes from "prop-types";
import Row from 'react-bootstrap/Row';
import TypeaheadAnswer from "./record/TypeaheadAnswer";

export default class HorizontalInput extends React.Component {
    static propTypes = {
        type: PropTypes.string,
        label: PropTypes.string,
        value: PropTypes.any,
        onChange: PropTypes.func,
        help: PropTypes.string,
        validation: PropTypes.oneOf(['success', 'warning', 'error']),
        labelWidth: PropTypes.number,     // Width of the label
        inputWidth: PropTypes.number,     // Width of the input component container
        inputOffset: PropTypes.number, // Offset to put before the input component. Applicable only for
        possibleValueQuery: PropTypes.string,
        // checkboxes and radios
        iconRight: PropTypes.object
    };

    static defaultProps = {
        type: 'text',
        labelWidth: 4,
        inputWidth: 9,
        inputOffset: 4
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
            case 'autocomplete':
                return this._renderAutocomplete();
            default:
                return this._renderInput();
        }
    }

    _getInputProps() {
        let props = {...this.props};
        delete props.inputOffset;
        delete props.inputWidth;
        delete props.labelWidth;
        delete props.help;
        delete props.validation;
        delete props.iconRight;

        return props;
    }

    _renderCheckbox() {
        return <FormGroup as={Row}>
            <Col lgOffset={this.props.inputOffset} lg={this.props.inputWidth}>
                <FormCheck type="checkbox"
                           ref={c => this.input = c} {...this._getInputProps()}>{this.props.label}</FormCheck>
            </Col>
        </FormGroup>;
    }

    _renderRadio() {
        return <FormGroup as={Row}>
            <Col lgOffset={this.props.inputOffset} lg={this.props.inputWidth}>
                <FormCheck type="radio"
                           ref={c => this.input = c} {...this._getInputProps()}>{this.props.label}</FormCheck>
            </Col>
        </FormGroup>;
    }

    _renderSelect() {
        // TODO validation
        return <FormGroup as={Row}>
            {this._renderLabel()}
            <Col lg={this.props.inputWidth}>
                <FormControl as='select' ref={c => this.input = c} {...this._getInputProps()}>
                    {this.props.children}
                </FormControl>
                {this.props.validation && <FormControl.Feedback/>}
                {this._renderHelp()}
            </Col>
        </FormGroup>;
    }

    _renderAutocomplete() {
        // TODO validation
        return <FormGroup as={Row}>
            {this._renderLabel()}
            <Col lg={this.props.inputWidth}>
                <TypeaheadAnswer {...this._getInputProps()}/>
                {this.props.validation && <FormControl.Feedback/>}
                {this._renderHelp()}
            </Col>
        </FormGroup>
    }

    _renderLabel() {
        return this.props.label ?
            <Col as={FormLabel} lg={this.props.labelWidth}
                 className="font-weight-bold text-lg-right align-self-center">{this.props.label}
            </Col> : null;
    }

    _renderTextArea() {
        // TODO validation
        return <FormGroup as={Row}>
            {this._renderLabel()}
            <Col lg={this.props.inputWidth}>
                <FormControl as='textarea' style={{height: 'auto'}}
                             ref={c => this.input = c} {...this._getInputProps()}/>
                {this.props.validation && <FormControl.Feedback/>}
                {this._renderHelp()}
            </Col>
        </FormGroup>;
    }

    _renderHelp() {
        return this.props.help ? <FormText>{this.props.help}</FormText> : null;
    }

    _renderInput() {
        // TODO validation
        const formControl = <FormControl ref={c => this.input = c} as='input' {...this._getInputProps()}/>;
        return <FormGroup as={Row}>
            {this._renderLabel()}
            <Col lg={this.props.inputWidth}>
                {this.props.iconRight ?
                    <InputGroup>
                        {formControl}
                        <InputGroup.Append><InputGroup.Text
                            className="py-0">{this.props.iconRight}</InputGroup.Text></InputGroup.Append>
                    </InputGroup>
                    :
                    <div>
                        {formControl}
                        {this.props.validation && <FormControl.Feedback/>}
                        {this._renderHelp()}
                    </div>
                }
            </Col>
        </FormGroup>;
    }
}
