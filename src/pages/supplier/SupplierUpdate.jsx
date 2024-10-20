import React, { useEffect, useState } from 'react';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import { Slide, Typography } from '@mui/material';
import { client } from 'api/client';

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

export default function SupplierUpdate({ open, handleClose, data }) {
  const [supplierUpdateForm, setSupplierUpdateForm] = useState({
    supplierName: '',
    supplierAddress: '',
    supplierContactNo: '',
    creditAmount: '',
    _id: ''
  });
  useEffect(() => {
    console.log('in here');
    setSupplierUpdateForm({
      ...supplierUpdateForm,
      supplierName: data.supplierName,
      supplierAddress: data.address,
      supplierContactNo: data.mobileNo,
      creditAmount: data.totalDue,
      _id: data._id
    });
  }, [data]);
  return (
    <>
      {console.log('data', data)}
      <Dialog
        open={open}
        onClose={() => handleClose()}
        TransitionComponent={Transition}
        PaperProps={{
          component: 'form',
          onSubmit: async (event) => {
            event.preventDefault();
            console.log(supplierUpdateForm);
            client.put(`/supplier/${supplierUpdateForm._id}`, supplierUpdateForm).then((res) => console.log(res));
            handleClose();
          }
        }}
      >
        <DialogTitle variant="h4" style={{ padding: '40px 40px', paddingBottom: '30px' }}>
          Update Supplier
        </DialogTitle>
        <DialogContent style={{ padding: '0 40px', paddingBottom: '20px' }}>
          <DialogContentText>Update Existing Suppliers</DialogContentText>
          <TextField
            autoFocus
            required
            margin="normal"
            id="name"
            name="email"
            label="Supplier Name"
            type="text"
            value={supplierUpdateForm.supplierName}
            onChange={(e) => setSupplierUpdateForm({ ...supplierUpdateForm, supplierName: e.target.value })}
            fullWidth
            variant="standard"
          />

          <TextField
            autoFocus
            required
            margin="normal"
            id="name"
            name="email"
            label="Mobile No."
            type="text"
            onChange={(e) => setSupplierUpdateForm({ ...supplierUpdateForm, supplierContactNo: e.target.value })}
            value={supplierUpdateForm.supplierContactNo}
            fullWidth
            variant="standard"
          />
          <TextField
            autoFocus
            required
            margin="normal"
            id="name"
            name="email"
            label="Address"
            onChange={(e) => setSupplierUpdateForm({ ...supplierUpdateForm, supplierAddress: e.target.value })}
            value={supplierUpdateForm.supplierAddress}
            type="text"
            fullWidth
            variant="standard"
          />
          <Typography variant="h5" sx={{ pt: 3 }}>
            Total Due Amount: ₹{supplierUpdateForm.creditAmount}
          </Typography>
        </DialogContent>
        <DialogActions style={{ paddingBottom: '40px', paddingRight: '40px' }}>
          <Button variant="contained" color="secondary" onClick={() => handleClose()}>
            Cancel
          </Button>
          <Button variant="contained" color="success" type="submit" success>
            Update
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}
