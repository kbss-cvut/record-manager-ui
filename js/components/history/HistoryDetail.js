'use strict';

import React from 'react';
import {connect} from "react-redux";
import injectIntl from "../../utils/injectIntl";
import I18nWrapper from "../../i18n/I18nWrapper";
import {Button, Panel} from "react-bootstrap";
import {ACTION_STATUS, ALERT_TYPES, ROLE} from "../../constants/DefaultConstants";
import {transitionTo} from "../../utils/Routing";
import {Routes} from "../../utils/Routes";
import {loadActionByKey} from "../../actions/HistoryActions";
import {bindActionCreators} from "redux";
import {LoaderPanel} from "../Loader";
import AlertMessage from "../AlertMessage";
import HorizontalInput from "../HorizontalInput";
import * as moment from "moment/moment";

class ActionHistory extends React.Component {
    constructor(props) {
        super(props);
        this.i18n = this.props.i18n;
    }

    componentDidMount() {
        this.props.loadActionByKey(this.props.params.key);
    }

    _onCancel = () => {
        transitionTo(Routes.historyActions);
    };

    render() {
        const {currentUser, actionLoaded} = this.props;
        if (!currentUser || currentUser.role !== ROLE.ADMIN) {
            return null;
        } else if (!actionLoaded.status || actionLoaded.status === ACTION_STATUS.PENDING) {
            return <LoaderPanel header={this._renderHeader()} />;
        } else if (actionLoaded.status === ACTION_STATUS.ERROR) {
            return <AlertMessage type={ALERT_TYPES.DANGER}
                                 message={this.props.formatMessage('history.load-error', {error: actionLoaded.error.message})}/>;
        }
        const action = actionLoaded.action;
        return <Panel header={this._renderHeader()} bsStyle='primary'>
            <form className='form-horizontal' style={{margin: '0.5em 0 0 0'}}>
                <div className='row'>
                    <div className='col-xs-6'>
                        <HorizontalInput type='text' label={this.i18n('history.action-type')}
                                         disabled={true}
                                         value={action.type} labelWidth={3} inputWidth={8}/>
                    </div>
                    <div className='col-xs-6'>
                        <HorizontalInput type='text' label={this.i18n('history.time')}
                                         disabled={true} value={moment.unix(action.timestamp / 1000).format('DD-MM-YYYY HH:mm:ss:SSS')}
                                         labelWidth={3} inputWidth={8}/>
                    </div>
                </div>
                <div className='row'>
                    <div className='col-xs-6'>
                        <HorizontalInput type='text' label={this.i18n('history.author')}
                                         disabled={true}
                                         value={action.author.username} labelWidth={3} inputWidth={8}/>
                    </div>
                </div>
                {action.payload &&
                    <div className='row'>
                        <div className='col-xs-6'>
                            <HorizontalInput type='textarea' label={this.i18n('history.payload')}
                                             disabled={true} rows={8}
                                             value={JSON.stringify(JSON.parse(action.payload), undefined, 2)} labelWidth={3}
                                             inputWidth={8}/>
                        </div>
                    </div>
                }
                <div style={{margin: '1em 0em 0em 0em', textAlign: 'center'}}>
                    <Button bsStyle='link' bsSize='small' onClick={this._onCancel}>
                        {this.i18n('cancel')}
                    </Button>
                </div>
            </form>
        </Panel>
    }

    _renderHeader() {
        return <span>
            {this.i18n('history.panel-title')}
        </span>;

    }
}

export default connect(mapStateToProps, mapDispatchToProps)(injectIntl(I18nWrapper(ActionHistory)));

function mapStateToProps(state) {
    return {
        currentUser: state.auth.user,
        actionLoaded: state.history.actionLoaded
    };
}

function mapDispatchToProps(dispatch) {
    return {
        loadActionByKey: bindActionCreators(loadActionByKey, dispatch)
    }
}
