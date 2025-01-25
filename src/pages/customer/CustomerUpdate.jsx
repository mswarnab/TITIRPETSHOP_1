import React, { useEffect, useState } from 'react';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import LottieAnimation from 'components/loaderDog';
import { client } from 'api/client';
import {
  Alert,
  Slide,
  Snackbar,
  Grid,
  Paper,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography
} from '@mui/material';
import dayjs from 'dayjs';

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

export default function CustomerUpdate({ open, selectedDate, handleClose }) {
  const [totalSoldAmount, setTotalSoldAmount] = useState(0);
  const [saleDetails, setSaleDetails] = useState([]);
  const columns = [
    { id: 'invoice', label: 'Invoice', minWidth: '20%' },
    { id: 'sellingDate', label: 'Date of Sale', minWidth: '15%' },
    {
      id: 'grandTotal',
      label: 'Total Amount',
      minWidth: '25%'
      // align: 'right',
      // format: (value) => value.toLocaleString('en-US')
    },
    {
      id: 'dueDate',
      label: 'Due Date',
      minWidth: '20%'
    },
    {
      id: 'amountDue',
      label: 'Amount Due',
      minWidth: '15%'
    }
  ];

  const [formData, setFormData] = useState({
    customerName: '',
    customerAddress: '',
    _id: '0',
    __v: '',
    totalCreditAmount: '',
    lastPurchaseDate: '',
    customerContactNo: '',
    paidAmount: '0'
  });
  useEffect(() => {
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
        customerContactNo: selectedDate.customerContactNo.toString(),
        paidAmount: '0'
      });
    }
    return () => {
      return null;
    };
  }, [selectedDate]);

  useEffect(() => {
    (async () => {
      await client
        .get('/customer/monthlybill/' + selectedDate._id)
        .then((res) => {
          let totalAmount = 0;
          let tempSaleDetails = [];
          res.data.result.saleDetails.result.map((e) => {
            totalAmount += e.grandTotalAmount;
            tempSaleDetails = [
              ...tempSaleDetails,
              {
                invoice: e.billNumber,
                sellingDate: e.dateOfSale,
                grandTotal: e.grandTotalAmount,
                dueDate: dayjs().endOf('month').format('DD/MM/YYYY'),
                amountDue: e.cerditAmount
              }
            ];
          });

          setTotalSoldAmount(totalAmount);
          setSaleDetails(tempSaleDetails);
        })
        .catch((err) => {
          setTotalSoldAmount(0);
        });
    })();
    return () => {
      return null;
    };
  }, [open]);

  let changeValue = (event) => {
    let eventValue = event.target.value.toString();
    let eventName = event.target.name;

    let newData = { ...formData };
    newData[eventName] = eventValue;
    setFormData(newData);
  };
  let handleUpdate = () => {
    let msg = '';
    if (formData.customerName == '') {
      msg = "Customer Name can't be blank.";
    } else if (formData.customerContactNo == '') {
      msg = "Mobile No can't be blank.";
    }

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

  let deleteCustomer = () => {
    let id = formData._id;
    client
      .delete('/customer/' + id)
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
        fullScreen
        PaperProps={{
          component: 'form',
          onSubmit: (event) => {
            event.preventDefault();
            const formData = new FormData(event.currentTarget);
            const formJson = Object.fromEntries(formData.entries());
            const email = formJson.email;
            handleClose();
          }
        }}
      >
        <DialogTitle variant="h4" style={{ padding: '40px 40px', paddingBottom: '20px' }}>
          Update Customer
          <CustomerDetailsBox customerData={{ ...formData, totalSoldAmount }} />
          <DialogContentText marginTop={4}>Update Existing Customer</DialogContentText>
          <Stack direction={'row'} spacing={5} paddingBottom={4} paddingTop={4}>
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
            <TextField
              required
              margin="normal"
              id="paidAmount"
              name="paidAmount"
              label="Add Amount Paid"
              type="text"
              fullWidth
              variant="standard"
              value={formData.paidAmount}
              onChange={changeValue}
              disabled
            />
          </Stack>
          <Grid container>
            <Grid xl={6}>
              <Typography variant="h5" style={{ marginTop: 0 }}>
                Sale Receipts of Last Month:
              </Typography>
            </Grid>
            <Grid xl={6}>
              <Typography variant="h5" style={{ marginLeft: 20 }}>
                Payment History:
              </Typography>
            </Grid>
          </Grid>
        </DialogTitle>
        <DialogContent style={{ padding: '0 40px', paddingBottom: '20px' }}>
          <Grid container sx={{ paddingTop: 0 }}>
            <Grid xl={6}>
              <DenseTable productDtls={saleDetails} columns={columns} />
            </Grid>
            <Grid xl={5.5} sx={{ marginLeft: '30px' }}>
              <Typography>Will be available soon!</Typography>
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions style={{ paddingBottom: '40px', paddingRight: '40px' }}>
          <Button variant="contained" color="secondary" onClick={() => handleClose()}>
            Cancel
          </Button>
          <Button variant="contained" color="success" onClick={() => handleUpdate()}>
            Update
          </Button>
          <Button variant="contained" color="error" onClick={() => deleteCustomer()}>
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}

function DenseTable({ productDtls = [], columns }) {
  return (
    <Paper sx={{ width: '100%', overflow: 'hidden' }}>
      <TableContainer sx={{ maxHeight: 350 }}>
        <Table aria-label="sticky table" size="small">
          <TableHead>
            <TableRow>
              {columns.map((column) => (
                <TableCell key={column.id} align={column.align} style={{ width: column.minWidth }}>
                  {column.label}
                </TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {productDtls.map((row) => (
              <TableRow sx={{ '&:last-child td, &:last-child th': { border: 0 } }} hover role="checkbox" tabIndex={-1}>
                <TableCell>{row.invoice}</TableCell>
                <TableCell>{row.sellingDate}</TableCell>
                <TableCell>{row.grandTotal}</TableCell>
                <TableCell>{row.dueDate}</TableCell>
                <TableCell>{row.amountDue}</TableCell>
              </TableRow>
              // invoice, sellingDate, grandTotal, dueDate, amountDue
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Paper>
  );
}

const CustomerDetailsBox = ({ customerData }) => {
  return (
    <Grid
      xl={12}
      sx={{ borderRadius: '14px', backgroundColor: 'cornflowerblue', color: 'white' }}
      paddingLeft={5}
      paddingRight={5}
      paddingTop={3}
      paddingBottom={3}
      marginTop={2}
      marginBottom={2}
    >
      <Grid sx={{ display: 'flex', justifyContent: 'space-between' }}>
        <Grid>
          <Typography variant="h6">Name: </Typography>
          <Typography variant="h5" style={{ marginTop: 15 }}>
            {customerData.customerName}
          </Typography>
        </Grid>
        <Grid>
          <Typography variant="h6">Mobile No:</Typography>
          <Typography variant="h5" style={{ marginTop: 15 }}>
            +91 {customerData.customerContactNo}
          </Typography>{' '}
        </Grid>
        <Grid>
          <Typography variant="h6">Address </Typography>
          <Typography variant="h5" style={{ marginTop: 15 }}>
            {customerData.customerAddress}
          </Typography>{' '}
        </Grid>
        <Grid sx={{ height: '60px', width: '1px', backgroundColor: 'white' }}></Grid>

        <Grid>
          <Typography variant="h6">Total amount sold last month: </Typography>
          <Typography variant="h5" style={{ marginTop: 15 }}>
            ₹{customerData.totalSoldAmount}
          </Typography>{' '}
        </Grid>
        <Grid>
          <Typography variant="h6">Total amount Due: </Typography>
          <Typography variant="h5" style={{ marginTop: 15 }}>
            ₹{customerData.totalCreditAmount}
          </Typography>{' '}
        </Grid>
      </Grid>
    </Grid>
  );
};
