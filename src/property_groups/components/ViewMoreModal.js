import React, { Component } from 'react';
import {
  Button,
  ButtonToolbar,
  Modal,
  ModalBody,
  ModalFooter,
  ModalHeader,
  Table,
} from 'react-gears';

class ViewMoreModal extends Component {
  rowRenderer = (row) => {
    if (this.props.data.type === 'Users') {
      return row.email;
    } else if (this.props.data.type === 'Properties') {
      return row.displayAddress;
    }
    return '';
  }

  render() {
    const { type, rows } = this.props.data;
    const { isOpen, toggle } = this.props;

    return (
      <Modal
        isOpen={isOpen}
        toggle={() => toggle()}
      >
        <ModalHeader toggle={() => toggle()}>{`${type} Information`}</ModalHeader>
        <ModalBody style={{ maxHeight: '50vh', overflow: 'auto' }}>
          <Table>
            <thead>
              <tr>
                <th>
                  {`${type} in Group`}
                </th>
              </tr>
            </thead>
            <tbody>
              {rows.map(row => (
                <tr>
                  <td>
                    {this.rowRenderer(row)}
                  </td>
                </tr>
            ))}
            </tbody>
          </Table>
        </ModalBody>
        <ModalFooter>
          <ButtonToolbar>
            <Button onClick={() => toggle()}>
              Cancel
            </Button>
          </ButtonToolbar>
        </ModalFooter>
      </Modal>
    );
  }
}

export default ViewMoreModal;
