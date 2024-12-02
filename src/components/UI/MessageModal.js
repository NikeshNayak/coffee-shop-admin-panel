import { Modal, ModalBody, ModalFooter, ModalHeader } from "reactstrap";
import MaterialUIButton from "./MaterialUIButton";

export default function MessageModal({
  title,
  message,
  isOpen,
  handleModalClose,
}) {
  return (
    <Modal
      isOpen={isOpen}
      toggle={handleModalClose}
      centered={true}
      backdrop="static"
      keyboard={false}
    >
      <ModalHeader>{title}</ModalHeader>
      <ModalBody>{message}</ModalBody>
      <ModalFooter>
        <MaterialUIButton label={"Okay"} onButtonClick={handleModalClose} />
      </ModalFooter>
    </Modal>
  );
}
