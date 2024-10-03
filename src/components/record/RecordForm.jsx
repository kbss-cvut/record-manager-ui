import React from "react";
import SForms, { Constants } from "@kbss-cvut/s-forms";
import PropTypes from "prop-types";
import { injectIntl } from "react-intl";
import withI18n from "../../i18n/withI18n";
import Loader from "../Loader";
import { axiosBackend } from "../../actions";
import { API_URL } from "../../../config";
import * as Logger from "../../utils/Logger";
import * as I18nStore from "../../stores/I18nStore";
// TODO enable s-forms-components
// import SmartComponents from "s-forms-components";

import "react-datepicker/dist/react-datepicker.css";
import PromiseTrackingMask from "../misc/PromiseTrackingMask";
import { trackPromise } from "react-promise-tracker";
// import "intelligent-tree-select/lib/styles.css"

// const componentMapping = SmartComponents.getComponentMapping();

class RecordForm extends React.Component {
  constructor(props) {
    super(props);
    this.i18n = this.props.i18n;
    this.form = this.props.form;
    this.updateForm = this.props.updateForm;
    this.refForm = React.createRef();
  }

  componentDidMount() {
    if (this.props.record.formTemplate) {
      this.loadWizard();
    }
  }

  componentDidUpdate(prevProps, prevState, snapshot) {
    const { record } = this.props;
    if (record.formTemplate && record.formTemplate !== prevProps.record.formTemplate) {
      this.loadWizard();
    }
  }

  loadWizard() {
    trackPromise(this.props.loadFormgen(this.props.record), "sform")
      .then((data) => {
        this.props.updateForm({ form: this.props.form, ...data });
      })
      .catch(() => Logger.error("Received no valid wizard."));
  }

  getFormData = () => {
    return this.refForm.current.getFormData();
  };

  validateForm = () => {
    this.refForm.current.validateForm();
  };

  getFormQuestionsData = () => {
    return this.refForm.current.getFormQuestionsData();
  };

  fetchTypeAheadValues = async (query) => {
    const FORM_GEN_POSSIBLE_VALUES_URL = `${API_URL}/rest/formGen/possibleValues`;

    const result = await axiosBackend.get(`${FORM_GEN_POSSIBLE_VALUES_URL}?query=${encodeURIComponent(query)}`);
    return result.data;
  };

  _getUsersOptions() {
    const currentUser = this.props.currentUser;
    return {
      users: [{ id: currentUser.uri, label: currentUser.firstName + " " + currentUser.lastName }],
      currentUser: currentUser.uri,
    };
  }

  _isDevGroupUser() {
    return this.props.currentUser.emailAddress.includes("devgroup");
  }

  _getIconsOptions() {
    if (this._isDevGroupUser()) {
      return {
        icons: [
          { id: Constants.ICONS.QUESTION_HELP, behavior: Constants.ICON_BEHAVIOR.ON_HOVER },
          { id: Constants.ICONS.QUESTION_LINK, behavior: Constants.ICON_BEHAVIOR.ON_HOVER },
          { id: Constants.ICONS.QUESTION_COMMENTS, behavior: Constants.ICON_BEHAVIOR.ON_HOVER },
        ],
      };
    }

    return {
      icons: [{ id: Constants.ICONS.QUESTION_HELP, behavior: Constants.ICON_BEHAVIOR.ON_HOVER }],
    };
  }

  render() {
    const i18n = {
      "wizard.next": this.i18n("wizard.next"),
      "wizard.previous": this.i18n("wizard.previous"),
      "section.expand": this.i18n("section.expand"),
      "section.collapse": this.i18n("section.collapse"),
    };
    const options = {
      i18n,
      intl: I18nStore.getIntl(),
      ...this._getUsersOptions(),
      ...this._getIconsOptions(),
    };

    return (
      <>
        <PromiseTrackingMask area="sform" />
        {!!this.props.form && (
          <SForms
            ref={this.refForm}
            form={this.props.form}
            formData={this.props.record.question}
            options={options}
            fetchTypeAheadValues={this.fetchTypeAheadValues}
            isFormValid={this.props.isFormValid}
            enableForwardSkip={true}
            loader={<Loader />}
          />
        )}
      </>
    );
  }
}

RecordForm.propTypes = {
  i18n: PropTypes.func,
  record: PropTypes.object.isRequired,
  currentUser: PropTypes.object.isRequired,
  loadFormgen: PropTypes.func,
  formgen: PropTypes.object,
  isFormValid: PropTypes.func,
  form: PropTypes.object,
  updateForm: PropTypes.func,
};

export default injectIntl(withI18n(RecordForm, { forwardRef: true }), { forwardRef: true });
