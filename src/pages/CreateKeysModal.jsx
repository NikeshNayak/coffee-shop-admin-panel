import { TextField } from "@mui/material";
import { useRef } from "react";
import UIButton from "../components/UI/UIButton";
import useHttp from "../hooks/useHttp";
import { APIRoutes, BASEURL } from "../configs/globalConfig";
import Error from "../components/Error";
import {
  Button,
  Col,
  Container,
  Input,
  Label,
  Modal,
  ModalBody,
  ModalFooter,
  ModalHeader,
  Row,
} from "reactstrap";
import MessageModal from "../components/UI/MessageModal";
import MaterialUIButton from "../components/UI/MaterialUIButton";

const requestConfig = {
  method: "POST",
  headers: {
    "Content-Type": "application/json",
  },
};

function CreateKeysPage({ isOpen, handleClose, handleRefreshKeys }) {
  const formRef = useRef(null); // Step 1: Create a ref for the form

  const {
    data,
    isLoading: isSending,
    error,
    sendRequest,
    clearData,
  } = useHttp(`${BASEURL}${APIRoutes.createKeys}`, requestConfig);

  async function handleSubmit(event) {
    event.preventDefault();

    const fd = new FormData(event.target);
    const keysData = Object.fromEntries(fd.entries());
    console.log(keysData);
    sendRequest(JSON.stringify(keysData));
  }

  function handleModalClose() {
    if (formRef.current) {
      formRef.current.reset(); // Step 2: Reset the form
    }
    clearData();
    handleClose();
  }

  function handleFinish() {
    handleRefreshKeys();
    handleModalClose();
    clearData();
  }

  let actions = (
    <>
      <Button
        type="button"
        onClick={handleClose}
        color="light"
        className="waves-effect"
      >
        Close
      </Button>
      <Button color="primaryPurple" className="waves-effect waves-light">
        Submit
      </Button>
    </>
  );

  if (isSending) {
    actions = (
      <p>
        <span>Creating new set of keys...</span>
      </p>
    );
  }

  if (data && !error) {
    console.log(data);
    return (
      <MessageModal
        isOpen={isOpen}
        title="Success!"
        message="Product Keys was created successfully."
        handleModalClose={handleFinish}
      />
    );
  }

  return (
    <Modal isOpen={isOpen} toggle={handleModalClose} centered={true}>
      <ModalHeader toggle={handleModalClose}>Add New Set of Keys</ModalHeader>
      <form ref={formRef} onSubmit={handleSubmit}>
        <ModalBody>
          <div className="mb-3">
            <Label className="form-label" htmlFor="noOfKeys">
              Number of Keys
            </Label>
            <Input
              type="text"
              className="form-control"
              id="noOfKeys"
              name="noOfKeys"
              required
              autoFocus
              placeholder="Eg. 25000"
              min="0"
              onInput={(e) => {
                // Remove decimal points and non-numeric characters
                e.target.value = e.target.value.replace(/\D/g, "");

                // Ensure the value is within the range [0, max]
                const value =
                  e.target.value !== ""
                    ? Math.abs(parseInt(e.target.value, 10))
                    : null;

                e.target.value = value; // Set the input's value to the cleaned-up value
              }}
            />
          </div>
          {error && (
            <Error title="Failed to create new set of keys" message={error} />
          )}
        </ModalBody>
        <ModalFooter>{actions}</ModalFooter>{" "}
      </form>
    </Modal>
  );
}

export default CreateKeysPage;
