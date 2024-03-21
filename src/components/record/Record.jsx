import React from "react";
import { Button, Modal } from "react-bootstrap";
import PropTypes from "prop-types";
import { FormattedMessage, injectIntl } from "react-intl";
import withI18n from "../../i18n/withI18n";
import HorizontalInput from "../HorizontalInput";
import RecordForm from "./RecordForm";
import RecordProvenance from "./RecordProvenance";
import RequiredAttributes from "./RequiredAttributes";
import { ACTION_STATUS, EXTENSION_CONSTANTS, RECORD_PHASE } from "../../constants/DefaultConstants";
import { LoaderCard, LoaderSmall } from "../Loader";
import { processTypeaheadOptions } from "./TypeaheadAnswer";
import { EXTENSIONS } from "../../../config";
import { isAdmin } from "../../utils/SecurityUtils";
import PromiseTrackingMask from "../misc/PromiseTrackingMask";
import { dfsTraverseQuestionTree } from "../../utils/Utils.js";
import { Constants as SConstants } from "@kbss-cvut/s-forms";
import FormValidationDialog from "../FormValidationDialog.jsx";

class Record extends React.Component {
  static propTypes = {
    i18n: PropTypes.object.isRequired,
    intl: PropTypes.object.isRequired,
  };
  constructor(props) {
    super(props);
    this.i18n = this.props.i18n;
    this.recordForm = React.createRef();
    this.state = {
      isFormValid: false,
      form: null,
      showModal: false,
      invalidQuestions: [],
      incompleteQuestions: [],
    };
  }

  _onChange = (e) => {
    const change = {};
    change[e.target.name] = e.target.value;
    this.props.handlers.onChange(change);
  };

  getFormData = () => {
    return this.recordForm.current.getFormData();
  };

  isFormValid = (isFormValid) => {
    this.setState({ isFormValid });
  };

  validateForm = () => {
    this.recordForm.current.validateForm();
  };

  getFormQuestionsData = () => {
    return this.recordForm.current.getFormQuestionsData();
  };

  updateForm = (form) => {
    this.setState({ form });
  };

  _filterQuestionsBySeverity = (severity) => {
    const matchedQuestion = [];

    const collectIfTriggered = (question) => {
      if (question?.[SConstants.HAS_VALIDATION_SEVERITY] === severity) {
        matchedQuestion.push(question);
      }
    };

    dfsTraverseQuestionTree(this.getFormQuestionsData(), collectIfTriggered);

    return matchedQuestion;
  };

  _handleOnSave = () => {
    const { form } = this.state;
    if (form) {
      this.validateForm();
      const invalidQuestions = this._filterQuestionsBySeverity("error");
      this.setState({ invalidQuestions }, () => {
        if (invalidQuestions.length > 0) {
          this.setState({ showModal: true });
        } else {
          this.props.handlers.onSave();
        }
      });
    }
  };

  _handleOnComplete = () => {
    const { form } = this.state;
    if (form) {
      this.validateForm();
      const incompleteQuestions = this._filterQuestionsBySeverity("warning");
      this.setState({ incompleteQuestions }, () => {
        if (incompleteQuestions.length > 0) {
          this.setState({ showModal: true });
        } else {
          this.props.handlers.onComplete();
        }
      });
    }
  };

  _handleOnCloseModal = () => {
    this.setState({
      showModal: false,
      invalidQuestions: [],
      incompleteQuestions: [],
    });
  };

  render() {
    const { record, formTemplate, currentUser } = this.props;

    if (!record?.formTemplate) {
      if (formTemplate) {
        record.formTemplate = formTemplate;
      }
    }

    if (!record) {
      return <LoaderCard header={this._renderHeader()} variant="primary" />;
    }

    return (
      <div className="record">
        <PromiseTrackingMask area="record" coverViewport={true} />
        <form>
          <RequiredAttributes
            record={record}
            onChange={this._onChange}
            formTemplate={formTemplate}
            currentUser={currentUser}
            completed={record.state.isComplete()}
          />
          {this._showInstitution() && this._renderInstitution()}
          <RecordProvenance record={record} />
        </form>
        {this._renderForm()}
        {this._renderButtons()}
        {this._renderModal()}
      </div>
    );
  }

  _renderHeader() {
    const identifier = this.props.record && this.props.record.localName ? this.props.record.localName : "";
    const formTemplateName = this._getFormTemplateName();
    return (
      <span>
        {formTemplateName ? (
          formTemplateName + " " + identifier
        ) : (
          <FormattedMessage id="record.panel-title" values={{ identifier }} />
        )}
      </span>
    );
  }

  _renderForm() {
    const { record, loadFormgen, formgen } = this.props;
    const { form } = this.state;

    return !record.state.isInitial() ? (
      <RecordForm
        ref={this.recordForm}
        record={record}
        loadFormgen={loadFormgen}
        formgen={formgen}
        currentUser={this.props.currentUser}
        isFormValid={this.isFormValid}
        form={form}
        updateForm={this.updateForm}
      />
    ) : null;
  }

  _renderButtons() {
    const { record, recordSaved, formgen } = this.props;

    return (
      <div className="mt-3 text-center">
        {EXTENSIONS === EXTENSION_CONSTANTS.SUPPLIER &&
          !record.isNew &&
          (record.phase === RECORD_PHASE.OPEN || this._isAdmin()) && (
            <Button
              className="mx-1 action-button"
              variant="danger"
              size="sm"
              disabled={
                formgen.status === ACTION_STATUS.PENDING ||
                recordSaved.status === ACTION_STATUS.PENDING ||
                !this.state.isFormValid ||
                !record.state.isComplete() ||
                record.phase === RECORD_PHASE.REJECTED
              }
              onClick={this.props.handlers.onReject}
            >
              {this.i18n("reject")}
              {recordSaved.status === ACTION_STATUS.PENDING && <LoaderSmall />}
            </Button>
          )}

        {(EXTENSIONS === EXTENSION_CONSTANTS.SUPPLIER || EXTENSIONS === EXTENSION_CONSTANTS.OPERATOR) &&
          !record.isNew &&
          (record.phase === RECORD_PHASE.OPEN || this._isAdmin()) && (
            <Button
              className="mx-1 action-button"
              variant="success"
              size="sm"
              disabled={
                formgen.status === ACTION_STATUS.PENDING ||
                recordSaved.status === ACTION_STATUS.PENDING ||
                !this.state.isFormValid ||
                !record.state.isComplete() ||
                record.phase === RECORD_PHASE.COMPLETED
              }
              onClick={this._handleOnComplete}
            >
              {this.i18n("complete")}
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
            !this.state.isFormValid ||
            !record.state.isComplete()
          }
          hidden={
            !this._isAdmin() &&
            [RECORD_PHASE.COMPLETED, RECORD_PHASE.REJECTED, RECORD_PHASE.PUBLISHED].includes(record.phase)
          }
          onClick={this._handleOnSave}
        >
          {this.i18n("save")}
          {recordSaved.status === ACTION_STATUS.PENDING && <LoaderSmall />}
        </Button>
        <Button className="mx-1 action-button" variant="link" size="sm" onClick={this.props.handlers.onCancel}>
          {this.i18n("cancel")}
        </Button>
      </div>
    );
  }

  _renderInstitution() {
    const record = this.props.record;
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
            label={this.i18n("record.institution")}
            readOnly
          />
        </div>
      </div>
    );
  }

  _renderModal() {
    const { showModal, invalidQuestions, incompleteQuestions } = this.state;
    const questionsToShow = invalidQuestions.length > 0 ? invalidQuestions : incompleteQuestions;

    let modalMessage = "";
    if (questionsToShow === invalidQuestions) {
      modalMessage = this.i18n("form.validation.error");
    }
    if (questionsToShow === incompleteQuestions) {
      modalMessage = this.i18n("form.validation.warning");
    }

    return (
      <FormValidationDialog
        show={showModal}
        modalMessage={modalMessage}
        questionsToShow={questionsToShow}
        handleOnCloseModal={this._handleOnCloseModal}
      />
    );
  }

  _getFormTemplateName() {
    const { formTemplatesLoaded, record, intl } = this.props;
    const formTemplate = this.props.formTemplate || record?.formTemplate;
    if (formTemplate) {
      const formTemplateOptions = formTemplatesLoaded.formTemplates
        ? processTypeaheadOptions(formTemplatesLoaded.formTemplates, intl)
        : [];
      return formTemplateOptions.find((r) => r.id === formTemplate)?.name;
    }
  }

  _showInstitution() {
    return this._isAdmin();
  }

  _getPanelTitle() {
    if (!this._isAdmin() && this.props.formTemplate) {
      const formTemplateName = this._getFormTemplateName();
      if (formTemplateName) {
        return formTemplateName;
      }
    }
    return this.i18n("record.panel-title");
  }

  _isAdmin() {
    return isAdmin(this.props.currentUser);
  }
}

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

export default injectIntl(withI18n(Record, { forwardRef: true }), { forwardRef: true });
