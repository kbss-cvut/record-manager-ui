import React, { useEffect, useState } from "react";
import { Constants, JsonLdObjectUtils } from "@kbss-cvut/s-forms";
import * as JsonLdUtils from "jsonld-utils";
import Select from "react-select";
import { axiosBackend } from "../../actions";
import PropTypes from "prop-types";

const fetchTypeAheadValues = async (endpointURL) => {
  const result = await axiosBackend.get(endpointURL);
  return result.data;
};

export const processTypeaheadOptions = (options, intl) => {
  if (!options) {
    return [];
  }

  // sort by label
  options.sort(JsonLdObjectUtils.getCompareLocalizedLabelFunction(intl));

  // sort by property
  JsonLdObjectUtils.orderPreservingToplogicalSort(options, Constants.HAS_PRECEDING_VALUE);

  return JsonLdUtils.processTypeaheadOptions(options, intl);
};

const intl = { locale: "cs" };

const TypeaheadAnswer = (props) => {
  // TODO

  const [isLoading, setLoading] = useState(true);
  const [options, setOptions] = useState(processTypeaheadOptions(props.options, intl));

  useEffect(() => {
    if (options.length === 0) {
      fetchTypeAheadValues(props.possibleValuesEndpoint).then((d) => {
        setLoading(false);
        setOptions(processTypeaheadOptions(d, intl));
      });
    }
  }, [options.length, props.possibleValuesEndpoint]);

  const onOptionSelected = (option) => {
    const e = { target: { name: props.name, value: null } };
    if (option) {
      e.target.value = option.id;
    }
    props.onChange(e);
  };

  return (
    <Select
      options={options}
      isSearchable={true}
      isLoading={isLoading}
      isClearable={true}
      isDisabled={isLoading || props.isDisabled === true}
      value={options.filter((option) => option.id === props.value)}
      placeholder={""}
      getOptionLabel={(option) => option.name}
      getOptionValue={(option) => option.id}
      onChange={onOptionSelected}
      // components={{ Option: DescriptionOption }}
    />
  );
};

TypeaheadAnswer.propTypes = {
  options: PropTypes.object,
  name: PropTypes.string,
  possibleValuesEndpoint: PropTypes.string.isRequired,
  label: PropTypes.string.isRequired,
  value: PropTypes.string,
  onChange: PropTypes.func.isRequired,
  isDisabled: PropTypes.bool,
};

export default TypeaheadAnswer;
