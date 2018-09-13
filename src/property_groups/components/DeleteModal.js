import React from 'react';
import {
  Button,
  ButtonToolbar,
  Modal,
  ModalBody,
  ModalFooter,
  ModalHeader
} from 'react-gears';

const DeleteModal = ({ isOpen, onDelete, toggle }) => (
  <Modal
    isOpen={isOpen}
    toggle={toggle}
  >
    <ModalHeader toggle={toggle}>Delete Property Group</ModalHeader>
    <ModalBody>
      Are you sure you want to delete this Property Group?
    </ModalBody>
    <ModalFooter>
      <ButtonToolbar>
        <Button color="danger" onClick={() => onDelete()}>
          Delete
        </Button>
        <Button onClick={toggle}>
          Cancel
        </Button>
      </ButtonToolbar>
    </ModalFooter>
  </Modal>
);

export default DeleteModal;
