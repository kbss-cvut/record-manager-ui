'use strict';

import React from "react";
import {Button, Panel} from "react-bootstrap";
import Actions from "../../actions/Actions";
import Authentication from "../../utils/Authentication";
import InstitutionStore from "../../stores/InstitutionStore";
import I18nWrapper from "../../i18n/I18nWrapper";
import injectIntl from "../../utils/injectIntl";
import Input from "../Input";
import HorizontalInput from "../HorizontalInput";
import Mask from "../Mask";
import UserValidator from "../../validation/UserValidator";
import Vocabulary from "../../constants/Vocabulary";

class User extends React.Component {
    static propTypes = {
        user: React.PropTypes.object,
        loading: React.PropTypes.bool,
        onSave: React.PropTypes.func.isRequired,
        onChange: React.PropTypes.func.isRequired,
        backToInstitution: React.PropTypes.bool
    };

    constructor(props) {
        super(props);
        this.i18n = this.props.i18n;
        this.state = {
            institutions: InstitutionStore.getInstitutions() ? User._processInstitutions(InstitutionStore.getInstitutions()) : []
        };
    }

    componentDidMount() {
        if (this.state.institutions.length === 0 && Authentication.isAdmin()) {
            Actions.loadAllInstitutions();
        }
        this.unsubscribe = InstitutionStore.listen(this._onInstitutionsLoaded);
    }

    _onInstitutionsLoaded = (data) => {
        if (data.action === Actions.loadAllInstitutions) {
            this.setState({
                institutions: User._processInstitutions(data.data)
            });
        }
    };

    static _processInstitutions(institutions) {
        return institutions.map((item) => {
            return {label: item.name, value: item.uri}
        });
    };

    componentWillUnmount() {
        this.unsubscribe();
    }

    _onChange = (e) => {
        var change = {};
        change[e.target.name] = e.target.value;
        this.props.onChange(change);
    };

    _onInstitutionSelected = (e) => {
        var value = e.target.value,
            institution = InstitutionStore.getInstitutions().find((item) => item.uri === value),
            change = {
                institution: institution
            };
        this.props.onChange(change);
    };

    _onAdminStatusChange = (e) => {
        var isAdmin = e.target.checked,
            types = this.props.user.types.slice();
        if (isAdmin) {
            types.push(Vocabulary.ADMIN_TYPE);
        } else {
            types.splice(types.indexOf(Vocabulary.ADMIN_TYPE), 1);
        }
        this.props.onChange({types: types});
    };

    _generateInstitutionsOptions = () => {
        let options = [];
        const len = this.state.institutions.length;
        for (let i = 0; i < len; i++) {
            let option = this.state.institutions[i];
            options.push(<option key={'opt_' + option.value} value={option.value}>{option.label}</option>);
        }
        options.unshift(<option key='opt_default' value='' disabled style={{display: 'none'}}>
            {this.i18n('select.default')}
        </option>);
        return options;
    };

    render() {
        if (this.props.loading) {
            return <Mask text={this.i18n('please-wait')}/>;
        }
        var user = this.props.user;
        return <Panel header={<h3>{this.i18n('user.panel-title')}</h3>} bsStyle='primary'>
            <form className='form-horizontal' style={{margin: '0.5em 0 0 0'}}>
                <div className='row'>
                    <div className='col-xs-4'>
                        <HorizontalInput type='text' name='firstName' label={this.i18n('user.first-name')}
                               value={user.firstName}
                               labelWidth={4} inputWidth={8} onChange={this._onChange}/>
                    </div>
                    <div className='col-xs-4'>
                        <HorizontalInput type='text' name='lastName' label={this.i18n('user.last-name')}
                               value={user.lastName}
                               labelWidth={4} inputWidth={8} onChange={this._onChange}/>
                    </div>
                </div>
                <div className='row'>
                    <div className='col-xs-4'>
                        <HorizontalInput type='text' name='username' label={this.i18n('user.username')}
                               value={user.username}
                               labelWidth={4} inputWidth={8} onChange={this._onChange}/>
                    </div>
                    <div className='col-xs-4'>
                        <HorizontalInput type='text' name='emailAddress' label={this.i18n('users.email')}
                               value={user.emailAddress}
                               labelWidth={4} inputWidth={8} onChange={this._onChange}/>
                    </div>
                </div>
                <div className='row'>
                    <div className='col-xs-4'>
                        <HorizontalInput type='text' name='password' label={this.i18n('user.password')}
                               readOnly={true} value={user.password}
                               labelWidth={4} inputWidth={8}/>
                    </div>
                </div>
                <div className='row'>
                    <div className='col-xs-4'>
                        <HorizontalInput type='select' name='institution' label={this.i18n('institution.panel-title')}
                                         onChange={this._onInstitutionSelected}
                                         value={user.institution ? user.institution.uri : ''}
                                         labelWidth={4} inputWidth={8}>
                            {this._generateInstitutionsOptions()}
                        </HorizontalInput>
                    </div>
                </div>
                <div className='row'>
                    <div className='col-xs-4'>
                        <div className='col-xs-4'>&nbsp;</div>
                        <div className='col-xs-8' style={{padding: '0 0 0 25px'}}>
                            <Input type='checkbox' checked={Authentication.isAdmin(user)}
                                   onChange={this._onAdminStatusChange}
                                   label={this.i18n('user.is-admin')} inline={true}
                                   disabled={!Authentication.isAdmin()}/>
                        </div>
                    </div>
                </div>
                <div style={{margin: '1em 0em 0em 0em', textAlign: 'center'}}>
                    <Button bsStyle='success' bsSize='small' ref='submit'
                            disabled={!UserValidator.isValid(user) || this.props.loading}
                            onClick={this.props.onSave}>{this.i18n('save')}</Button>
                    <Button bsStyle='link' bsSize='small' onClick={this.props.onCancel}>
                        {this.i18n(this.props.backToInstitution ? 'users.back-to-institution' : 'cancel')}
                    </Button>
                </div>
            </form>
        </Panel>;
    }
}

export default injectIntl(I18nWrapper(User));
