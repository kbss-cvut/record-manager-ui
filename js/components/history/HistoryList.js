import React from 'react';
import {connect} from "react-redux";
import {injectIntl} from "react-intl";
import withI18n from "../../i18n/withI18n";
import {Card} from "react-bootstrap";
import {loadActions} from "../../actions/HistoryActions";
import {bindActionCreators} from "redux";
import {ACTIONS_PER_PAGE} from "../../constants/DefaultConstants";
import HistoryTable from "./HistoryTable";
import Routes from "../../constants/RoutesConstants";
import {transitionToWithOpts} from "../../utils/Routing";
import HistoryPagination from "./HistoryPagination";
import PromiseTrackingMask from "../misc/PromiseTrackingMask";
import {trackPromise} from "react-promise-tracker";

class HistoryList extends React.Component {
    constructor(props) {
        super(props);
        this.i18n = this.props.i18n;
        this.state = {
            searchData: {},
            pageNumber: 1
        }
    }

    componentDidMount() {
        trackPromise(this.props.loadActions(1), "history");
    }

    _onOpen = (key) => {
        this.props.transitionToWithOpts(Routes.historyAction, {
            params: {key}
        });
    };

    _handleChange = (e) => {
        let change = {};
        change[e.target.name] = e.target.value;
        this.setState({searchData: {...this.state.searchData, ...change}, pageNumber: 1});
    };

    _onKeyPress = (e) => {
        if (e.key === 'Enter') {
            this._handleSearch();
        }
    };

    _handleSearch = (newPageNumber = 1) => {
        this.props.loadActions(newPageNumber, this.state.searchData);
    };

    _handleReset = () => {
        this.setState({searchData: {}, pageNumber: 1});
        this.props.loadActions(1, {});
    };

    _handlePagination = (direction) => {
        if (this.props.actionsLoaded.actions.length <= ACTIONS_PER_PAGE && direction === 1 ||
            this.state.pageNumber === 1 && direction === -1) {
            return;
        }
        const newPageNumber = this.state.pageNumber + direction;
        this.setState({pageNumber: newPageNumber});
        this._handleSearch(newPageNumber);
    };

    render() {
        const {actionsLoaded} = this.props;
        const handlers = {
            handleSearch: this._handleSearch,
            handleReset: this._handleReset,
            handleChange: this._handleChange,
            onKeyPress: this._onKeyPress,
            onOpen: this._onOpen
        };
        return <Card variant='primary'>
            <Card.Header className="text-light bg-primary" as="h6">
                {this.i18n('main.history')}
            </Card.Header>
            <Card.Body>
                <PromiseTrackingMask area="history"/>
                {actionsLoaded.actions &&
                    <>
                        <HistoryTable handlers={handlers} searchData={this.state.searchData}
                                      actions={actionsLoaded.actions} i18n={this.i18n}/>
                        <HistoryPagination pageNumber={this.state.pageNumber}
                                           numberOfActions={actionsLoaded.actions.length}
                                           handlePagination={this._handlePagination}/>
                    </>
                }
            </Card.Body>
        </Card>
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(injectIntl(withI18n(HistoryList)));

function mapStateToProps(state) {
    return {
        actionsLoaded: state.history.actionsLoaded
    };
}

function mapDispatchToProps(dispatch) {
    return {
        loadActions: bindActionCreators(loadActions, dispatch),
        transitionToWithOpts: bindActionCreators(transitionToWithOpts, dispatch)
    }
}
