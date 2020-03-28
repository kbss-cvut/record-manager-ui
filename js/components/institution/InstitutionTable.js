'use strict';

import React from "react";
import {Table} from "react-bootstrap";

import DeleteItemDialog from "../DeleteItemDialog";
import {ACTION_STATUS} from "../../constants/DefaultConstants";
import InstitutionRow from "./InstitutionRow";
import {injectIntl} from "react-intl";
import withI18n from "../../i18n/withI18n";
import PropTypes from "prop-types";

class InstitutionTable extends React.Component {
    static propTypes = {
        institutions: PropTypes.array.isRequired,
        handlers: PropTypes.object.isRequired,
        institutionDeleted: PropTypes.object
    };

    constructor(props) {
        super(props);
        this.i18n = this.props.i18n;
        this.state = {
            showDialog: false,
            selectedItem: null
        }
    }

    _onDelete = (item) => {
        this.setState({showDialog: true, selectedItem: item});
    };

    _onCancelDelete = () => {
        this.setState({showDialog: false, selectedItem: null});
    };

    _onSubmitDelete = () => {
        this.props.handlers.onDelete(this.state.selectedItem);
        this.setState({showDialog: false, selectedItem: null});
    };

    render() {
        return <div>
            <DeleteItemDialog onClose={this._onCancelDelete} onSubmit={this._onSubmitDelete}
                              show={this.state.showDialog} item={this.state.selectedItem}
                              itemLabel={this._getDeleteLabel()}/>
            {this.props.institutions.length > 0 ?
                <Table size="sm" responsive striped bordered hover>
                    {this._renderHeader()}
                    <tbody>
                    {this._renderRows()}
                    </tbody>
                </Table>
                :
                <p className="font-italic">{this.i18n('institutions.not-found')}</p>
            }
        </div>;
    }

    _getDeleteLabel() {
        const institution = this.state.selectedItem;
        return institution ? institution.name : '';
    }

    _renderHeader() {
        return <thead>
        <tr>
            <th className='w-40 content-center'>{this.i18n('name')}</th>
            <th className='w-40 content-center'>{this.i18n('institution.email')}</th>
            <th className='w-20 content-center'>{this.i18n('actions')}</th>
        </tr>
        </thead>;
    }

    _renderRows() {
        const {institutions, institutionDeleted} = this.props;
        const onEdit = this.props.handlers.onEdit;
        let rows = [];
        for (let i = 0, len = institutions.length; i < len; i++) {
            rows.push(<InstitutionRow key={institutions[i].key} institution={institutions[i]} onEdit={onEdit}
                                      onDelete={this._onDelete}
                                      deletionLoading={!!(institutionDeleted.status === ACTION_STATUS.PENDING
                                          && institutionDeleted.key === institutions[i].key)}/>);
        }
        return rows;
    }
}

export default injectIntl(withI18n(InstitutionTable));
