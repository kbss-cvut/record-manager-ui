import React, { useState, useRef, useEffect, useImperativeHandle, forwardRef } from "react";
import { Alert, Button } from "react-bootstrap";
import PropTypes from "prop-types";
import { FormattedMessage, useIntl } from "react-intl";
import HorizontalInput from "../HorizontalInput";
import RecordForm from "./RecordForm";
import RecordProvenance from "./RecordProvenance";
import RequiredAttributes from "./RequiredAttributes";
import { ACTION_STATUS, EXTENSION_CONSTANTS, RECORD_PHASE, ROLE } from "../../constants/DefaultConstants";
import { LoaderCard, LoaderSmall } from "../Loader";
import { processTypeaheadOptions } from "./TypeaheadAnswer";
import PromiseTrackingMask from "../misc/PromiseTrackingMask";
import { Constants as SConstants, FormUtils } from "@kbss-cvut/s-forms";
import FormValidationDialog from "../FormValidationDialog.jsx";
import RejectButton from "../button/RejectButton.jsx";
import { EXTENSIONS } from "../../../config/index.js";
import { canReadInstitutionInfo, canWriteRecord, hasRole } from "../../utils/RoleUtils.js";
import { useDispatch, useSelector } from "react-redux";
import { loadFormTemplates } from "../../actions/FormTemplatesActions.js";
import { useI18n } from "../../hooks/useI18n.jsx";

const Record = (
  { record, handlers, recordSaved, formgen, loadFormgen, formTemplatesLoaded, currentUser, formTemplate },
  ref,
) => {
  const intl = useIntl();
  const recordForm = useRef(null);

  const dispatch = useDispatch();
  const formTemplates = useSelector((state) => state.formTemplates.formTemplatesLoaded.formTemplates);
  const { i18n } = useI18n();

  useImperativeHandle(ref, () => ({
    getFormData: () => recordForm.current.getFormData(),
  }));

  const [state, setState] = useState({
    isFormValid: false,
    form: null,
    showModal: false,
    invalidQuestions: [],
    incompleteQuestions: [],
    action: "",
  });

  useEffect(() => {
    dispatch(loadFormTemplates());
  }, []);

  useEffect(() => {
    if (state.action === "save") {
      if (state.invalidQuestions.length > 0) {
        setState((prev) => ({ ...prev, showModal: true }));
      } else {
        handlers.onSave();
      }
    } else if (state.action === "complete") {
      if (state.incompleteQuestions.length > 0 || state.invalidQuestions.length > 0) {
        setState((prev) => ({ ...prev, showModal: true }));
      } else {
        handlers.onSave();
        handlers.onComplete();
      }
    }
  }, [state.action]);

  const onChange = (e) => {
    const change = {};
    change[e.target.name] = e.target.value;
    handlers.onChange(change);
  };

  const getFormData = () => {
    return recordForm.current.getFormData();
  };

  const isFormValid = (isFormValid) => {
    setState((prev) => ({ ...prev, isFormValid }));
  };

  const validateForm = () => {
    recordForm.current.validateForm();
  };

  const getFormQuestionsData = () => {
    return recordForm.current.getFormQuestionsData();
  };

  const updateForm = (form) => {
    setState((prev) => ({ ...prev, form }));
  };

  const filterQuestionsBySeverity = (severity) => {
    const matchedQuestion = [];

    const collectIfTriggered = (question) => {
      if (question?.[SConstants.HAS_VALIDATION_SEVERITY] === severity) {
        matchedQuestion.push(question);
      }
    };

    FormUtils.dfsTraverseQuestionTree(getFormQuestionsData(), collectIfTriggered);

    return matchedQuestion;
  };

  const handleOnSave = () => {
    const { form } = state;
    if (form) {
      validateForm();
      const invalidQuestions = filterQuestionsBySeverity("error");
      setState((prev) => ({ ...prev, invalidQuestions, action: "save" }));
    }
  };

  const handleOnComplete = () => {
    const { form } = state;
    if (form) {
      validateForm();
      const incompleteQuestions = filterQuestionsBySeverity("warning");
      const invalidQuestions = filterQuestionsBySeverity("error");
      setState((prev) => ({
        ...prev,
        incompleteQuestions,
        invalidQuestions,
        action: "complete",
      }));
    }
  };

  const handleOnCloseModal = () => {
    setState((prev) => ({
      ...prev,
      showModal: false,
      invalidQuestions: [],
      incompleteQuestions: [],
    }));
  };

  const renderHeader = () => {
    const identifier = record && record.localName ? record.localName : "";
    const formTemplateName = getFormTemplateName();
    return (
      <span>
        {formTemplateName ? (
          formTemplateName + " " + identifier
        ) : (
          <FormattedMessage id="record.panel-title" values={{ identifier }} />
        )}
      </span>
    );
  };

  const renderForm = () => {
    const { form } = state;
    return !record.state.isInitial() ? (
      <RecordForm
        ref={recordForm}
        record={record}
        loadFormgen={loadFormgen}
        formgen={formgen}
        currentUser={currentUser}
        isFormValid={isFormValid}
        form={form}
        updateForm={updateForm}
      />
    ) : null;
  };

  const renderButtons = () => {
    return (
      <div className="mt-3 text-center">
        {EXTENSIONS === EXTENSION_CONSTANTS.SUPPLIER &&
          !record.isNew &&
          record.phase === RECORD_PHASE.OPEN &&
          hasRole(currentUser, ROLE.REJECT_RECORDS) &&
          canWriteRecord(currentUser, record) && (
            <RejectButton
              className="mx-1 action-button"
              variant="danger"
              size="sm"
              disabled={
                formgen.status === ACTION_STATUS.PENDING ||
                recordSaved.status === ACTION_STATUS.PENDING ||
                !state.isFormValid ||
                !record.state.isComplete() ||
                record.phase === RECORD_PHASE.REJECTED
              }
              onClick={handlers.onReject}
            >
              {intl.formatMessage({ id: "reject" })}
              {recordSaved.status === ACTION_STATUS.PENDING && <LoaderSmall />}
            </RejectButton>
          )}

        {!record.isNew &&
          record.phase === RECORD_PHASE.OPEN &&
          hasRole(currentUser, ROLE.COMPLETE_RECORDS) &&
          canWriteRecord(currentUser, record) && (
            <Button
              className="mx-1 action-button"
              variant="success"
              size="sm"
              disabled={
                formgen.status === ACTION_STATUS.PENDING ||
                recordSaved.status === ACTION_STATUS.PENDING ||
                !state.isFormValid ||
                !record.state.isComplete() ||
                record.phase === RECORD_PHASE.COMPLETED
              }
              onClick={handleOnComplete}
            >
              {intl.formatMessage({ id: "complete" })}
              {recordSaved.status === ACTION_STATUS.PENDING && <LoaderSmall />}
            </Button>
          )}

        <Button
          className="mx-1 action-button"
          variant="success"
          size="sm"
          disabled={
            formgen.status === ACTION_STATUS.PENDING ||
            recordSaved.status === ACTION_STATUS.PENDING ||
            !state.isFormValid ||
            !record.state.isComplete()
          }
          hidden={
            !canWriteRecord(currentUser, record) &&
            [RECORD_PHASE.COMPLETED, RECORD_PHASE.REJECTED, RECORD_PHASE.PUBLISHED].includes(record.phase)
          }
          onClick={handleOnSave}
        >
          {intl.formatMessage({ id: "save" })}
          {recordSaved.status === ACTION_STATUS.PENDING && <LoaderSmall />}
        </Button>
        <Button className="mx-1 action-button" variant="link" size="sm" onClick={handlers.onCancel}>
          {intl.formatMessage({ id: "cancel" })}
        </Button>
      </div>
    );
  };

  const renderInstitution = () => {
    if (!record.institution) {
      return null;
    }
    return (
      <div className="row">
        <div className="col-12 col-sm-6">
          <HorizontalInput
            labelWidth={4}
            inputWidth={8}
            type="text"
            value={record.institution.name}
            label={intl.formatMessage({ id: "record.institution" })}
            readOnly
          />
        </div>
      </div>
    );
  };

  const renderModal = () => {
    const { showModal, invalidQuestions, incompleteQuestions } = state;
    const questionsToShow = invalidQuestions.length > 0 ? invalidQuestions : incompleteQuestions;

    let modalMessage = "";
    if (questionsToShow === invalidQuestions) {
      modalMessage = intl.formatMessage({ id: "form.validation.error" });
    }
    if (questionsToShow === incompleteQuestions) {
      modalMessage = intl.formatMessage({ id: "form.validation.warning" });
    }

    return (
      <FormValidationDialog
        show={showModal}
        modalMessage={modalMessage}
        questionsToShow={questionsToShow}
        handleOnCloseModal={handleOnCloseModal}
      />
    );
  };

  const getFormTemplateName = () => {
    const formTemplateToUse = formTemplate || record?.formTemplate;
    if (formTemplateToUse) {
      const formTemplateOptions = formTemplatesLoaded.formTemplates
        ? processTypeaheadOptions(formTemplatesLoaded.formTemplates, intl)
        : [];
      return formTemplateOptions.find((r) => r.id === formTemplateToUse)?.name;
    }
  };

  const showInstitution = () => {
    return canReadInstitutionInfo(this.props.currentUser, this.record?.institution);
  };

  const getPanelTitle = () => {
    if (!hasRole(this.props.currentUser, ROLE.READ_ALL_RECORDS) && this.props.formTemplate) {
      const formTemplateName = this._getFormTemplateName();
      if (formTemplateName) {
        return formTemplateName;
      }
    }
    return intl.formatMessage({ id: "record.panel-title" });
  };

  if (!record?.formTemplate) {
    if (formTemplate) {
      record.formTemplate = formTemplate;
    }
  }

  if (!record) {
    return <LoaderCard header={renderHeader()} variant="primary" />;
  }

  if (formTemplates?.length === 0) {
    return <Alert variant="warning">{i18n("formTemplates.no-form-templates")}</Alert>;
  }

  return (
    <div className="record">
      <PromiseTrackingMask area="record" coverViewport={true} />
      <form>
        <RequiredAttributes
          record={record}
          onChange={onChange}
          formTemplate={formTemplate}
          currentUser={currentUser}
          completed={record.state.isComplete()}
        />
        {showInstitution() && renderInstitution()}
        <RecordProvenance record={record} />
      </form>
      {renderForm()}
      {renderButtons()}
      {renderModal()}
    </div>
  );
};

Record.propTypes = {
  record: PropTypes.object,
  handlers: PropTypes.object.isRequired,
  recordSaved: PropTypes.object,
  recordLoaded: PropTypes.object,
  formgen: PropTypes.object,
  loadFormgen: PropTypes.func,
  showAlert: PropTypes.bool,
  formTemplatesLoaded: PropTypes.object.isRequired,
  currentUser: PropTypes.object.isRequired,
  formTemplate: PropTypes.string,
};

export default forwardRef(Record);
