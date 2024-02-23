'use strict';

import React from 'react';
import {FormattedMessage} from 'react-intl';
import {formatDate} from "../../utils/Utils";
import PropTypes from "prop-types";

const RecordProvenance = (props) => {
    const record = props.record;
    if (record.isNew) {
        return null;
    }
    const author = record.author ? record.author.firstName + ' ' + record.author.lastName : '',
        created = formatDate(new Date(record.dateCreated));
    if (!record.lastModified) {
        return <div className='notice-small'>
            <FormattedMessage id='record.created-by-msg'
                              values={{date: created, name: <b>{author}</b>}}/>
        </div>;
    }
    const lastEditor = record.lastModifiedBy ? record.lastModifiedBy.firstName + ' ' + record.lastModifiedBy.lastName : '',
        lastModified = formatDate(new Date(record.lastModified));
    return <div className='notice-small'>
        <FormattedMessage id='record.created-by-msg'
                          values={{date: created, name: <b>{author}</b>}}/>
        <br/>
        <FormattedMessage id='record.last-edited-msg'
                          values={{date: lastModified, name: <b>{lastEditor}</b>}}/>
    </div>;
};

RecordProvenance.propTypes = {
    record: PropTypes.object
};

export default RecordProvenance;
