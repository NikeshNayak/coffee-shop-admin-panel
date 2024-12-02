// DateRangePicker.js
import React, { useState } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { Col, Row } from "reactstrap";

const DateRangePicker = ({ sDate, eDate, onDateRangeChange }) => {
  const [startDate, setStartDate] = useState(sDate);
  const [endDate, setEndDate] = useState(eDate);

  const handleStartDateChange = (date) => {
    setStartDate(date);
    onDateRangeChange(date, endDate);
  };

  const handleEndDateChange = (date) => {
    setEndDate(date);
    onDateRangeChange(startDate, date);
  };

  return (
    <Row className="align-items-center">
      <Col>
        <DatePicker
          id="startDate"
          selected={startDate}
          onChange={handleStartDateChange}
          selectsStart
          startDate={startDate}
          endDate={endDate}
          placeholderText="Start Date"
          dateFormat="dd-MM-yyyy"
          className="form-control"
        />
      </Col>
      <Col>
        <DatePicker
          id="endDate"
          selected={endDate}
          onChange={handleEndDateChange}
          selectsEnd
          startDate={startDate}
          endDate={endDate}
          placeholderText="End Date"
          dateFormat="dd-MM-yyyy"
          minDate={startDate}
          className="form-control"
        />
      </Col>
    </Row>
  );
};

export default DateRangePicker;
