import React, { useState } from 'react';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import { Slide, Typography } from '@mui/material';

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

export default function SaleUpdate({ open, selectedDate, handleClose }) {
  console.log(selectedDate);
  const [formData, setFormData] = useState({
    id: '',
    billNumber: '',
    dateOfBilling: '',
    customerName: '',
    dueAmount: '0',
    paidAmount: '',
    sellTotalAmount: '',
    _id: ''
  });
  let changeValue = (event) => {
    let eventValue = event.target.value;
    let eventName = event.target.name;
    if (formData.id != selectedDate.id) {
      formData.id == selectedDate.id;
    }
    let newData = [...formData];
    newData[eventName] = eventValue;
    setFormData(newData);
  };
  let handleUpdate = (data) => {};
  return (
    <>
      <Dialog
        open={open}
        onClose={() => handleClose()}
        TransitionComponent={Transition}
        PaperProps={{
          component: 'form',
          onSubmit: (event) => {
            // event.preventDefault();
            // const formData = new FormData(event.currentTarget);
            // const formJson = Object.fromEntries(formData.entries());
            // const email = formJson.email;
            // console.log(email);
            // handleClose();
          }
        }}
      >
        <DialogTitle variant="h4" style={{ padding: '40px 40px', paddingBottom: '30px' }}>
          Update Customer
        </DialogTitle>
        <DialogContent style={{ padding: '0 40px', paddingBottom: '20px' }}>
          <DialogContentText>Update Existing Customer</DialogContentText>
          <TextField
            autoFocus
            required
            margin="normal"
            id="billNumber"
            name="billNumber"
            label="Bill Number"
            type="text"
            fullWidth
            variant="outlined"
            value={formData.billNumber ? formData.billNumber : selectedDate.billNumber}
            onChange={changeValue}
          />
          <TextField
            required
            margin="normal"
            id="customerName"
            name="customerName"
            label="Customer Name"
            type="text"
            fullWidth
            variant="outlined"
            value={formData.customerName ? formData.customerName : selectedDate.customerName}
            onChange={changeValue}
          />
          <TextField
            autoFocus
            required
            margin="normal"
            id="email"
            name="email"
            label="Email"
            type="email"
            fullWidth
            variant="standard"
            value={formData.email ? formData.email : selectedDate.email}
            onChange={changeValue}
          />
          <TextField
            autoFocus
            required
            margin="normal"
            id="address"
            name="address"
            label="Address"
            type="text"
            fullWidth
            variant="standard"
            value={formData.address ? formData.address : selectedDate.address}
            onChange={changeValue}
          />
          {/* <Typography variant='h5' sx={{pt:3}}>Total Due Amount:  ₹{15299}</Typography> */}
        </DialogContent>
        <DialogActions style={{ paddingBottom: '40px', paddingRight: '40px' }}>
          <Button variant="contained" color="secondary" onClick={() => handleClose()}>
            Cancel
          </Button>
          <Button variant="contained" color="success" onClick={() => handleUpdate(formData)}>
            Update
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}
