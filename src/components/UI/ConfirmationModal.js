import { Button, Modal, ModalBody, ModalFooter, ModalHeader } from "reactstrap";
import MaterialUIButton from "./MaterialUIButton";

export default function ConfirmationModal({
  title,
  message,
  isOpen,
  handleActionModalClose,
}) {
  return (
    <Modal isOpen={isOpen} centered={true} backdrop="static" keyboard={false}>
      <ModalHeader>{title}</ModalHeader>
      <ModalBody>{message}</ModalBody>
      <ModalFooter>
        <Button
          type="button"
          style={{
            borderRadius: "38px",
            paddingLeft: "20px",
            paddingRight: "20px"
          }}
          onClick={() => handleActionModalClose(false)}
          color="secondary"
        >
          No
        </Button>
        <span className="ms-1"></span>
        <MaterialUIButton
          label={"Yes"}
          borderRadius="38px"
          onButtonClick={() => handleActionModalClose(true)}
        />
      </ModalFooter>
    </Modal>
  );
}
