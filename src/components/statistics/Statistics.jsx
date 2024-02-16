import React from 'react';
import {useDispatch, useSelector} from "react-redux";
import {Card, Table} from "react-bootstrap";
import {loadStatistics} from "../../actions/StatisticsActions";
import {useI18n} from "../../hooks/useI18n";
import {trackPromise} from "react-promise-tracker";
import PromiseTrackingMask from "../misc/PromiseTrackingMask";

const Statistics = () => {
    const {i18n} = useI18n();
    const statistics = useSelector(state => state.statistics.data);
    const dispatch = useDispatch();
    React.useEffect(() => {
        trackPromise(dispatch(loadStatistics()), "statistics");
    }, [dispatch]);

    return <Card variant='primary'>
        <Card.Header className="text-light bg-primary" as="h6">
            {i18n('statistics.panel-title')}
        </Card.Header>
        <Card.Body>
            <PromiseTrackingMask area="statistics"/>
            <Table size="sm" responsive striped bordered hover>
                <tbody>
                {statistics && Object.keys(statistics).map((key, index) => {
                    return <tr key={index}>
                        <th className='w-50 content-center'>{i18n(`statistics.${key}`)}</th>
                        <td className='w-50 content-center'>{statistics[key]}</td>
                    </tr>;
                })}
                </tbody>
            </Table>
        </Card.Body>
    </Card>
};

export default Statistics;
