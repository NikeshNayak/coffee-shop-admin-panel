import { FormFeedback, FormGroup, Input, Label } from "reactstrap";

export default function InputField({
  id,
  label,
  invalid = false,
  emailInvalid = false,
  mobileNoInvalid = false,
  passwordLength = false,
  sameConfirmPassword = false,
  required = false,
  type = "text",
  className = "mb-3",
  ...props
}) {
  return (
    <FormGroup>
      <div className={className}>
        <Label className="form-label" htmlFor={id}>
          {label}
          {required && <span style={{ color: "red" }}> *</span>}
        </Label>
        <Input
          id={id}
          name={id}
          type={type}
          className="form-control"
          invalid={invalid || emailInvalid}
          {...props}
        />
        {invalid && (
          <FormFeedback className="d-block">
            This field is required!
          </FormFeedback>
        )}
        {emailInvalid && (
          <FormFeedback className="d-block">Invalid Email!</FormFeedback>
        )}
        {mobileNoInvalid && (
          <FormFeedback className="d-block">
            Invalid Mobile Number!
          </FormFeedback>
        )}
        {passwordLength && (
          <FormFeedback className="d-block">
            Password must be at least 8 characters long!
          </FormFeedback>
        )}
        {sameConfirmPassword && (
          <FormFeedback className="d-block">
            New Password & Confirm Password should be same !
          </FormFeedback>
        )}
      </div>
    </FormGroup>
  );
}
