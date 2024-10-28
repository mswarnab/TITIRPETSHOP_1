import React, { useEffect, useState } from 'react';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import { Alert, Slide, Snackbar, Typography } from '@mui/material';
import { client } from 'api/client';

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

export default function SupplierUpdate({ open, handleClose, data }) {
  // console.log(data);
  const [supplierUpdateForm, setSupplierUpdateForm] = useState({
    supplierName: '',
    supplierAddress: '',
    supplierContactNo: '',
    gstinNumber: '',
    totalCreditAmount: '',
    __v: '',
    lastPurchaseDate: '',
    supplierEmail: ''
  });
  useEffect(() => {
    // console.log('in here');
    setSupplierUpdateForm({
      ...supplierUpdateForm,
      supplierName: data.supplierName,
      supplierAddress: data.address,
      supplierContactNo: data.mobileNo,
      gstinNumber: data.gstinNumber,
      totalCreditAmount: data.totalDue,
      __v: data.__v,
      lastPurchaseDate: data.lastPurchaseDate,
      supplierEmail: data.supplierEmail
      // _id: data._id
    });
    return () => {
      return null;
    };
  }, [data]);
  let updateSupplier = () => {
    let id = data._id;
    client
      .put('/supplier/' + id, supplierUpdateForm)
      .then((res) => {
        // console.log(res);
        setError({ err: false, message: res.data.message });
        handleClose();
      })
      .catch((err) => setError({ err: true, message: err.response.data.errorMessage }));
  };
  const [error, setError] = React.useState('');
  let handleCloseSnackBar = () => {
    setError('');
  };
  let vertical = 'top';
  let horizontal = 'center';
  return (
    <>
      {/* {console.log('data', data)} */}
      <Snackbar
        anchorOrigin={{ vertical, horizontal }}
        open={error ? true : false}
        autoHideDuration={6000}
        onClose={handleCloseSnackBar}
        // action={action}
        key={vertical + horizontal}
      >
        {error && (
          <Alert severity={error && error.err ? 'error' : 'success'} variant="filled" sx={{ width: '100%' }}>
            {error.message}
          </Alert>
        )}
      </Snackbar>

      <Dialog
        open={open}
        onClose={() => handleClose()}
        TransitionComponent={Transition}
        PaperProps={{
          component: 'form'
          // onSubmit: async (event) => {
          //   event.preventDefault();
          //   console.log(supplierUpdateForm);
          //   client.put(`/supplier/${supplierUpdateForm._id}`, supplierUpdateForm).then((res) => console.log(res));
          //   handleClose();
          // }
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
          <TextField
            required
            margin="normal"
            id="name"
            name="gstinNumber"
            label="GSTIN"
            onChange={(e) => setSupplierUpdateForm({ ...supplierUpdateForm, gstinNumber: e.target.value })}
            value={supplierUpdateForm.gstinNumber}
            type="text"
            fullWidth
            variant="standard"
          />
          <Typography variant="h5" sx={{ pt: 3 }}>
            Total Due Amount: ₹{data.creditAmount}
          </Typography>
        </DialogContent>
        <DialogActions style={{ paddingBottom: '40px', paddingRight: '40px' }}>
          <Button variant="contained" color="secondary" onClick={() => handleClose()}>
            Cancel
          </Button>
          <Button variant="contained" color="success" onClick={() => updateSupplier()}>
            Update
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}
