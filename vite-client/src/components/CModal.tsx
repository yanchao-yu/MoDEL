import * as React from 'react';
import BugReport from "./BugReport";
import {Button} from "react-bootstrap";
import Modal from 'react-bootstrap/Modal';

export default function CModal({ title, description, close, children, showBugModal}) {
  return (
      <Modal.Dialog>
      {/*// <Modal show={showBugModal} onHide={close} scrollable={true} autoFocus={true}*/}
      {/*//        size="lg"*/}
      {/*//        aria-labelledby="contained-modal-title-vcenter"*/}
      {/*//        centered>*/}
        <Modal.Header closeButton>
          <Modal.Title>{title}</Modal.Title>
        </Modal.Header>
        <Modal.Body >
          <p className="hint-color">{description}</p>
          <div>{children}</div>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="primary" onClick={close}>
            Cancel
          </Button>
        </Modal.Footer>
      {/*</Modal>*/}
      </Modal.Dialog>
  );
}
