import { Form, Input } from "reactstrap";

const DataTableSearchBar = ({ text, value, onSearch }) => {
  return (
    <div className="mb-2">
        <Form className="app-search d-none d-lg-block">
          <div className="position-relative">
            <Input
              type="text"
              value={value}
              className="form-control"
              placeholder={text}
              onChange={(e) => onSearch(e.target.value)}
            />
            <span className="ri-search-line"></span>
          </div>
        </Form>
    </div>
  );
};

export default DataTableSearchBar;
