import React from "react";
import {usePromiseTracker} from "react-promise-tracker";
import {ContainerLoaderMask, LoaderMask} from "../Loader";

const PromiseTrackingMask = ({area, coverViewport}) => {
    const {promiseInProgress} = usePromiseTracker({area});

    return (
        <>
            {promiseInProgress &&
                (area && !coverViewport ? (
                    <ContainerLoaderMask/>
                ) : (
                    <LoaderMask/>
                ))}
        </>
    );
};

PromiseTrackingMask.defaultProps = {
    coverViewport: false,
};

export default PromiseTrackingMask;
