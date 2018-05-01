import React from 'react';
import * as BS from 'react-bootstrap';
import {observer} from 'mobx-react';

@observer
export default class Register extends React.Component {
  constructor(props, context) {
    super(props, context);

    this.handleShow = this.handleShow.bind(this);
    this.handleClose = this.handleClose.bind(this);

    this.state = {
      show: false
    };
   }

   handleClose() {
     this.setState({ show: false });
   }

   handleShow() {
     this.setState({ show: true });
   }

   render() {
     return (
       <div>
         <p>Click to get the full BS.Modal experience!</p>

         <BS.Button bsStyle="primary" bsSize="large" onClick={this.handleShow}>
           Launch demo BS.Modal
         </BS.Button>

         <BS.Modal show={this.state.show} onHide={this.handleClose}>
           <BS.Modal.Header closeButton>
             <BS.Modal.Title>BS.Modal heading</BS.Modal.Title>
           </BS.Modal.Header>
           <BS.Modal.Body>
             <h4>Text in a BS.Modal</h4>
             <p>
               Duis mollis, est non commodo luctus, nisi erat porttitor ligula.
             </p>


             <hr />

             <h4>Overflowing text to show scroll behavior</h4>
             <p>
               Cras mattis consectetur purus sit amet fermentum. Cras justo odio,
               dapibus ac facilisis in, egestas eget quam. Morbi leo risus, porta
               ac consectetur ac, vestibulum at eros.
             </p>
           </BS.Modal.Body>
           <BS.Modal.Footer>
             <BS.Button onClick={this.handleClose}>Close</BS.Button>
           </BS.Modal.Footer>
         </BS.Modal>
       </div>
     );
   }
}
