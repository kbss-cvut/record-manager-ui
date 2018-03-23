import React from 'react';
import {Panel} from "react-bootstrap";

const Loader = () => (
    <div className="loader-spin">
        <div className="loading-icon">
            <div className="circle circle1"></div>
            <div className="circle circle2"></div>
            <div className="circle circle3"></div>
            <div className="circle circle4"></div>
        </div>
    </div>
);

export default Loader;

export const LoaderMask = () => (
    <div className='mask'>
        <div className='spinner-container'>
            <Loader/>
        </div>
    </div>
);

export const LoaderPanel = (props) => (
    <Panel header={props.header} bsStyle='primary'>
        <Loader/>
    </Panel>
);