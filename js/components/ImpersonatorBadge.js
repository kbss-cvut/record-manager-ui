import React from "react";
import {useSelector} from "react-redux";
import {IMPERSONATOR_TYPE} from "../constants/Vocabulary";
import {Badge} from "react-bootstrap";
import {sanitizeArray} from "../utils/Utils";
import {useI18n} from "../hooks/useI18n";

const ImpersonatorBadge = () => {
    const {i18n} = useI18n();
    const user = useSelector(state => state.auth.user);
    if (sanitizeArray(user.types).indexOf(IMPERSONATOR_TYPE) !== -1) {
        return <Badge variant="warning" className="nav-badge">{i18n("main.impersonating")}</Badge>;
    }
    return null;
};

export default ImpersonatorBadge;
