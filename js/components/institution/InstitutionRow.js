import React from "react";
import {injectIntl} from "react-intl";
import withI18n from "../../i18n/withI18n";
import {Routes} from "../../utils/Routes";
import {Button} from "react-bootstrap";
import {LoaderSmall} from "../Loader";
import PropTypes from "prop-types";
import {Link} from 'react-router-dom';

let InstitutionRow = (props) => {
    const institution = props.institution;
    return <tr>
        <td className='report-row'>
            <Link to={Routes.institutions.path + '/' + institution.key}
               title={props.i18n('institutions.open-tooltip')}>{institution.name}</Link>
        </td>
        <td className='report-row'>{institution.emailAddress}</td>
        <td className='report-row actions'>
            <Button variant='primary' size='sm' title={props.i18n('institutions.open-tooltip')}
                    onClick={() => props.onEdit(props.institution)}>{props.i18n('open')}</Button>
            <Button variant='warning' size='sm' title={props.i18n('institutions.delete-tooltip')}
                    onClick={() => props.onDelete(props.institution)}>{props.i18n('delete')}
                    {props.deletionLoading && <LoaderSmall />}</Button>
        </td>
    </tr>;
};

InstitutionRow.propTypes = {
    institution: PropTypes.object.isRequired,
    onEdit: PropTypes.func.isRequired,
    onDelete: PropTypes.func.isRequired,
    deletionLoading: PropTypes.bool.isRequired
};

export default injectIntl(withI18n(InstitutionRow));

