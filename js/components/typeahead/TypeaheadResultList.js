'use strict';

import React from 'react';
import classNames from 'classnames';

class TypeaheadResultList extends React.Component {
    getOptionLabel = (option) => {
        if (typeof this.props.displayOption === 'function') {
            return this.props.displayOption(option);
        } else {
            return option[this.props.displayOption];
        }
    };

    onClick = (event, option) => {
        event.preventDefault();
        this.props.onOptionSelected(option, event);
    };

    render() {
        return (
            <ul
                className={
                    classNames('autocomplete-results', {
                        extended: this.props.options.length > 21,
                        [this.props.customClasses.results]: this.props.customClasses.results
                    })}>

                {this.props.options.map(
                    (option, index) =>
                        <li className='btn-link item' key={'typeahead-result-' + index}
                            title={option.description}
                            onClick={(e) => this.onClick(e, option)}>{this.getOptionLabel(option)}</li>)
                }
            </ul>
        )
    }
}

export default TypeaheadResultList;

