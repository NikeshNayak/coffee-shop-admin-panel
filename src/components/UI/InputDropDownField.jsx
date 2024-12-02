import { useEffect, useState } from "react";
import { Label, FormFeedback } from "reactstrap";
import Select from "react-select";
import { useSelector } from "react-redux";

export default function InputDropDownField({
  label,
  selectedValue,
  defaultInputValue,
  options,
  required = false,
  invalid = false,
  className = "mb-3",
  noOptionsMessage = "No options available",
  validateTrigger, // External trigger for validation
  darkMode = false, // Added prop to track dark mode
  ...props
}) {
  const theme = useSelector((state) => state.Layout.theme);

  const borderStyle = {
    control: (base) => ({
      ...base,
      boxShadow: "none",
      backgroundColor: theme === 'dark' ? "#2d3448" : "#fff", // Background color based on dark mode
      color: theme === 'dark' ? "#fff" : "#000",
    }),
    menu: (base) => ({
      ...base,
      backgroundColor: theme === 'dark' ? "#2d3448" : "#fff", // Dropdown background
    }),
    singleValue: (base) => ({
      ...base,
      color: theme === 'dark' ? "#ffffff" : "#000000", // Text color in dropdown
    }),
    option: (base, { isFocused }) => ({
      ...base,
      backgroundColor: isFocused
        ? theme === 'dark' ? "#fff" : "#f0f0f0" // Hover background color for dark/light mode
        : theme === 'dark' ? "#2d3448" : "#ffffff", // Default background color
      color: isFocused
        ? theme === 'dark' ? "#000" : "#000" // Hover text color for dark/light mode
        : theme === 'dark' ? "#fff" : "#000", // Default text color
    }),
  };

  const erroBorderStyle = {
    control: (base) => ({
      ...base,
      border: "1px solid red",
      boxShadow: "none",
      backgroundColor: theme === 'dark' ? "#2d3448" : "#fff", // Error mode background
      color: theme === 'dark' ? "#fff" : "#000",
    }),
  };

  return (
    <div className={className}>
      <Label className="form-label">
        {label} {required && <span style={{ color: "red" }}> *</span>}
      </Label>
      <Select
        value={selectedValue}  
        defaultInputValue={defaultInputValue}
        options={options}
        required={required}
        classNamePrefix={`select2-selection`}
        noOptionsMessage={() => noOptionsMessage}
        styles={!invalid ? borderStyle : erroBorderStyle}
        {...props}
      />
      {invalid && (
        <FormFeedback className="d-block">
          This field is required.
        </FormFeedback>
      )}
    </div>
  );
}
