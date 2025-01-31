/* eslint-disable import/exports-last */

import React from "react";

import AsyncSelect from "react-select/async";

import {
  customErrStyles,
  customStyles,
  CustomValueContainer,
} from "common/CustomReactSelectStyle";

export const CustomAsyncSelect = ({
  classNamePrefix,
  loadOptions,
  label,
  name,
  handleOnChange,
  value,
  isErr,
  isDesktopView,
}) => {
  const getStyle = () => {
    if (isErr) {
      return customErrStyles(isDesktopView);
    }

    return customStyles(isDesktopView);
  };

  return (
    <div className="outline relative">
      <AsyncSelect
        cacheOptions
        defaultOptions
        classNamePrefix={classNamePrefix}
        loadOptions={loadOptions}
        name={name}
        placeholder={label}
        styles={getStyle()}
        value={value || null}
        components={{
          ValueContainer: CustomValueContainer,
          IndicatorSeparator: () => null,
        }}
        onChange={handleOnChange}
      />
    </div>
  );
};

CustomAsyncSelect.defaultProps = {
  classNamePrefix: "react-select-filter",
  label: "Select",
  placeholder: "Date Format",
  handleOnChange: () => {}, // eslint-disable-line  @typescript-eslint/no-empty-function
  isDesktopView: false,
};
