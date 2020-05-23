'use strict';

import React from 'react';
import {connect} from "react-redux";
import {injectIntl} from "react-intl";
import withI18n from "../../i18n/withI18n";
import {Button, Card} from "react-bootstrap";
import {ACTION_STATUS, ALERT_TYPES, ROLE} from "../../constants/DefaultConstants";
import {transitionTo} from "../../utils/Routing";
import Routes from "../../constants/RoutesConstants";
import {loadActionByKey} from "../../actions/HistoryActions";
import {bindActionCreators} from "redux";
import {LoaderCard} from "../Loader";
import AlertMessage from "../AlertMessage";
import HorizontalInput from "../HorizontalInput";
import {formatDateWithMilliseconds} from "../../utils/Utils";

class ActionHistory extends React.Component {
    constructor(props) {
        super(props);
        this.i18n = this.props.i18n;
    }

    componentDidMount() {
        this.props.loadActionByKey(this.props.match.params.key);
    }

    _onCancel = () => {
        transitionTo(Routes.historyActions);
    };

    render() {
        const {currentUser, actionLoaded} = this.props;
        if (!currentUser || currentUser.role !== ROLE.ADMIN) {
            return null;
        } else if (!actionLoaded.status || actionLoaded.status === ACTION_STATUS.PENDING) {
            return <LoaderCard header={this.i18n('history.panel-title')}/>;
        } else if (actionLoaded.status === ACTION_STATUS.ERROR) {
            return <AlertMessage type={ALERT_TYPES.DANGER}
                                 message={this.props.formatMessage('history.load-error', {error: actionLoaded.error.message})}/>;
        }
        const action = actionLoaded.action;
        return <Card variant='primary'>
            <Card.Header className="text-light bg-primary" as="h6">
                {this.i18n('history.panel-title')}
            </Card.Header>
            <Card.Body>
                <form>
                    <div className='row'>
                        <div className='col-12 col-sm-6'>
                            <HorizontalInput
                                type='text' label={this.i18n('history.action-type')}
                                disabled={true}
                                value={action.type}
                                labelWidth={3} inputWidth={8}/>
                        </div>
                        <div className='col-12 col-sm-6'>
                            <HorizontalInput
                                type='text' label={this.i18n('history.time')}
                                disabled={true} labelWidth={3} inputWidth={8}
                                value={formatDateWithMilliseconds(action.timestamp)}
                            />
                        </div>
                    </div>
                    {action.author &&
                    <div className='row'>
                        <div className='col-12 col-sm-6'>
                            <HorizontalInput
                                type='text' label={this.i18n('history.author')}
                                disabled={true} labelWidth={3} inputWidth={8}
                                value={action.author.username}/>
                        </div>
                    </div>
                    }
                    {action.payload &&
                    <div className='row'>
                        <div className='col-12 col-sm-6'>
                            <HorizontalInput
                                type='textarea' label={this.i18n('history.payload')}
                                disabled={true} rows={8} labelWidth={3} inputWidth={8}
                                value={JSON.stringify(JSON.parse(action.payload), undefined, 2)}
                            />
                        </div>
                    </div>
                    }
                    <div className="mt-3 text-center">
                        <Button variant='link' size='sm' onClick={this._onCancel}>
                            {this.i18n('cancel')}
                        </Button>
                    </div>
                </form>
            </Card.Body>
        </Card>
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(injectIntl(withI18n(ActionHistory)));

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
