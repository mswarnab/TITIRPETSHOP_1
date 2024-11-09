import React, { useEffect, useState } from 'react';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import { Alert, Slide, Snackbar } from '@mui/material';
import LottieAnimation from 'components/loaderDog';
import { client } from 'api/client';

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

export default function CustomerUpdate({ open, selectedDate, handleClose }) {
  // console.log(selectedDate);
  const [formData, setFormData] = useState({
    customerName: '',
    customerAddress: '',
    _id: '0',
    __v: '',
    totalCreditAmount: '',
    lastPurchaseDate: '',
    customerContactNo: ''
  });
  useEffect(() => {
    // console.log('in here');
    // console.log(selectedDate?.length);
    if (selectedDate.customerName) {
      // console.log('in');
      setFormData({
        ...formData,
        customerName: selectedDate.customerName,
        customerAddress: selectedDate.customerAddress,
        _id: selectedDate._id,
        totalCreditAmount: selectedDate.totalCreditAmount,
        __v: selectedDate.__v,
        lastPurchaseDate: selectedDate.lastPurchaseDate,
        customerContactNo: selectedDate.customerContactNo.toString()
        // _id: data._id
      });
    }
    return () => {
      // console.log('out');
      return null;
    };
  }, [selectedDate]);
  let changeValue = (event) => {
    let eventValue = event.target.value.toString();
    let eventName = event.target.name;

    let newData = { ...formData };
    // console.log(newData);
    newData[eventName] = eventValue;
    setFormData(newData);
  };
  let handleUpdate = () => {
    // setLoading(true);
    let msg = '';
    if (formData.customerName == '') {
      msg = "Customer Name can't be blank.";
    } else if (formData.customerContactNo == '') {
      msg = "Mobile No can't be blank.";
    }
    // console.log(hello);
    if (msg == '') {
      if (
        formData.customerName == selectedDate.customerNam &&
        formData.customerAddress == selectedDate.customerAddress &&
        formData.customerContactNo == selectedDate.customerContactNo
      ) {
      } else {
        let id = selectedDate._id;
        client
          .put('/customer/' + id, formData)
          .then((res) => {
            // console.log(res);
            setError({ err: false, message: res.data.message });
            setLoading(false);
            handleClose();
          })
          .catch((err) => {
            setError({ err: true, message: err.response.data.errorMessage });
            // setLoading(false);
          });
      }
    } else {
      setError({ err: 'error', message: msg });
      // setLoading(false);
    }
  };
  const [error, setError] = React.useState('');
  let handleCloseSnackBar = () => {
    setError('');
  };
  const [loading, setLoading] = useState(false);
  // console.log(rows);
  if (loading) {
    return <LottieAnimation />;
  }
  let vertical = 'top';
  let horizontal = 'center';
  return (
    <>
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
          component: 'form',
          onSubmit: (event) => {
            event.preventDefault();
            const formData = new FormData(event.currentTarget);
            const formJson = Object.fromEntries(formData.entries());
            const email = formJson.email;
            // console.log(email);
            handleClose();
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
            id="customerName"
            name="customerName"
            label="Customer Name"
            type="text"
            fullWidth
            variant="standard"
            value={formData.customerName}
            onChange={changeValue}
          />
          <TextField
            required
            margin="normal"
            id="customerContactNo"
            name="customerContactNo"
            label="Mobile No."
            type="text"
            fullWidth
            variant="standard"
            value={formData.customerContactNo}
            onChange={changeValue}
          />
          {/* <TextField
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
          /> */}
          <TextField
            margin="normal"
            id="customerAddress"
            name="customerAddress"
            label="Address"
            type="text"
            fullWidth
            variant="standard"
            value={formData.customerAddress}
            onChange={changeValue}
          />
          {/* <Typography variant='h5' sx={{pt:3}}>Total Due Amount:  ₹{15299}</Typography> */}
        </DialogContent>
        <DialogActions style={{ paddingBottom: '40px', paddingRight: '40px' }}>
          <Button variant="contained" color="secondary" onClick={() => handleClose()}>
            Cancel
          </Button>
          <Button variant="contained" color="success" onClick={() => handleUpdate()}>
            Update
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}
