import React from 'react';
import {useDispatch, useSelector} from "react-redux";
import {Button, Card} from "react-bootstrap";
import {ROLE} from "../../constants/DefaultConstants";
import {transitionTo} from "../../utils/Routing";
import Routes from "../../constants/RoutesConstants";
import {loadActionByKey} from "../../actions/HistoryActions";
import HorizontalInput from "../HorizontalInput";
import {formatDateWithMilliseconds} from "../../utils/Utils";
import {useI18n} from "../../hooks/useI18n";
import {useParams} from "react-router-dom";
import {trackPromise} from "react-promise-tracker";
import {IfGranted} from "react-authorization";
import PromiseTrackingMask from "../misc/PromiseTrackingMask";

const HistoryDetail = () => {
    const {i18n} = useI18n();
    const {key} = useParams();
    const dispatch = useDispatch();
    const action = useSelector(state => state.history.actionLoaded.action);
    const currentUser = useSelector(state => state.auth.user);
    React.useEffect(() => {
        trackPromise(dispatch(loadActionByKey(key)), "history-detail");
    }, [dispatch, key]);

    return <IfGranted expected={ROLE.ADMIN} actual={currentUser.role}>
        <Card variant='primary'>
            <Card.Header className="text-light bg-primary" as="h6">
                {i18n('history.panel-title')}
            </Card.Header>
            <Card.Body>
                <PromiseTrackingMask area="history-detail"/>
                {action &&
                    <form>
                        <div className='row'>
                            <div className='col-12 col-sm-6'>
                                <HorizontalInput
                                    type='text' label={i18n('history.action-type')}
                                    disabled={true}
                                    value={action.type}
                                    labelWidth={3} inputWidth={8}/>
                            </div>
                            <div className='col-12 col-sm-6'>
                                <HorizontalInput
                                    type='text' label={i18n('history.time')}
                                    disabled={true} labelWidth={3} inputWidth={8}
                                    value={formatDateWithMilliseconds(action.timestamp)}
                                />
                            </div>
                        </div>
                        {action.author &&
                            <div className='row'>
                                <div className='col-12 col-sm-6'>
                                    <HorizontalInput
                                        type='text' label={i18n('history.author')}
                                        disabled={true} labelWidth={3} inputWidth={8}
                                        value={action.author.username}/>
                                </div>
                            </div>
                        }
                        {action.payload &&
                            <div className='row'>
                                <div className='col-12 col-sm-6'>
                                    <HorizontalInput
                                        type='textarea' label={i18n('history.payload')}
                                        disabled={true} rows={8} labelWidth={3} inputWidth={8}
                                        value={JSON.stringify(JSON.parse(action.payload), undefined, 2)}
                                    />
                                </div>
                            </div>
                        }
                        <div className="mt-3 text-center">
                            <Button variant='link' size='sm' onClick={() => transitionTo(Routes.historyActions)}>
                                {i18n('cancel')}
                            </Button>
                        </div>
                    </form>
                }
            </Card.Body>
        </Card>
    </IfGranted>;
};

export default HistoryDetail;
