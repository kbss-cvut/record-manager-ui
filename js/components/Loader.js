import React from 'react';
import {Card} from "react-bootstrap";

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

export const ContainerLoaderMask = () => (
    <div className='mask-container'>
        <div className='spinner-container'>
            <Loader/>
        </div>
    </div>
);

export const LoaderCard = (props) => (
    <Card variant='primary'>
        <Card.Header className="text-light bg-primary" as="h6">{props.header}</Card.Header>
        <Card.Body><Loader/></Card.Body>
    </Card>
);

export const LoaderSmall = () => (
    <div className="loader align-self-center"/>
);