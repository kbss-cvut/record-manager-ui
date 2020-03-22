'use strict';

import React from "react";
import ReactDOM from "react-dom";
import {Checkbox, Col, ControlLabel, FormGroup, FormControl, HelpBlock, Radio, InputGroup} from "react-bootstrap";

export default class HorizontalInput extends React.Component {
    static propTypes = {
        type: React.PropTypes.string,
        label: React.PropTypes.string,
        value: React.PropTypes.any,
        onChange: React.PropTypes.func,
        help: React.PropTypes.string,
        validation: React.PropTypes.oneOf(['success', 'warning', 'error']),
        labelWidth: React.PropTypes.number,     // Width of the label
        inputWidth: React.PropTypes.number,     // Width of the input component container
        inputOffset: React.PropTypes.number, // Offset to put before the input component. Applicable only for
                                                // checkboxes and radios
        iconRight: React.PropTypes.object
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
        return <FormGroup>
            <Col lgOffset={this.props.inputOffset} lg={this.props.inputWidth}>
                <Checkbox ref={c => this.input = c} {...this._getInputProps()}>{this.props.label}</Checkbox>
            </Col>
        </FormGroup>;
    }

    _renderRadio() {
        return <FormGroup>
            <Col lgOffset={this.props.inputOffset} lg={this.props.inputWidth}>
                <Radio ref={c => this.input = c} {...this._getInputProps()}>{this.props.label}</Radio>
            </Col>
        </FormGroup>;
    }

    _renderSelect() {
        return <FormGroup validationState={this.props.validation}>
            {this._renderLabel()}
            <Col lg={this.props.inputWidth}>
                <FormControl componentClass='select' ref={c => this.input = c} {...this._getInputProps()}>
                    {this.props.children}
                </FormControl>
                {this.props.validation && <FormControl.Feedback/>}
                {this._renderHelp()}
            </Col>
        </FormGroup>;
    }

    _renderLabel() {
        return this.props.label ?
            <Col componentClass={ControlLabel} lg={this.props.labelWidth}>{this.props.label}</Col> : null;
    }

    _renderTextArea() {
        return <FormGroup validationState={this.props.validation}>
            {this._renderLabel()}
            <Col lg={this.props.inputWidth}>
                <FormControl componentClass='textarea' style={{height: 'auto'}}
                             ref={c => this.input = c} {...this._getInputProps()}/>
                {this.props.validation && <FormControl.Feedback/>}
                {this._renderHelp()}
            </Col>
        </FormGroup>;
    }

    _renderHelp() {
        return this.props.help ? <HelpBlock>{this.props.help}</HelpBlock> : null;
    }

    _renderInput() {
        const formControl = <FormControl ref={c => this.input = c} componentClass='input' {...this._getInputProps()}/>;
        return <FormGroup validationState={this.props.validation}>
            {this._renderLabel()}
            <Col lg={this.props.inputWidth}>
                {this.props.iconRight ?
                    <InputGroup>
                        {formControl}
                        <InputGroup.Addon>{this.props.iconRight}</InputGroup.Addon>
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
