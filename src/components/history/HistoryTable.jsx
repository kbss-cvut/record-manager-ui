import React from "react";
import {Table} from "react-bootstrap";
import HistoryRow from "./HistoryRow";
import HistorySearch from "./HistorySearch";
import PropTypes from "prop-types";
import {useI18n} from "../../hooks/useI18n";

const HistoryTable = ({actions, handlers, searchData}) => {
    const {i18n} = useI18n();

    return <div>
        <Table size="sm" responsive striped bordered hover>
            <thead>
            <tr>
                <th className='w-26 content-center'>{i18n('history.action-type')}</th>
                <th className='w-26 content-center'>{i18n('history.author')}</th>
                <th className='w-26 content-center'>{i18n('history.time')}</th>
                <th className='w-20 content-center'>{i18n('actions')}</th>
            </tr>
            </thead>
            <tbody>
            <HistorySearch handlers={handlers} searchData={searchData}/>
            {actions.length > 0 ? actions.map(a => <HistoryRow key={a.key} action={a} onOpen={handlers.onOpen}/>)
                : <tr className="font-italic">
                    <td colSpan="4">{i18n('history.not-found')}</td>
                </tr>
            }
            </tbody>
        </Table>
    </div>;
}

HistoryTable.propTypes = {
    actions: PropTypes.array.isRequired,
    handlers: PropTypes.object.isRequired,
    searchData: PropTypes.object.isRequired
};


export default HistoryTable;
