import React, { useEffect, useState } from 'react';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import {
  Alert,
  FormControl,
  FormControlLabel,
  FormLabel,
  Grid,
  Paper,
  Radio,
  RadioGroup,
  Slide,
  Snackbar,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Stack,
  Typography
} from '@mui/material';
import { client } from 'api/client';
import dayjs from 'dayjs';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DatePicker, LocalizationProvider } from '@mui/x-date-pickers';
import AlertDialog from 'components/AlertDialog';
// import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';

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
  const [newPaymentButton, setNewPaymentButton] = useState(false);
  const [paidAddData, setPaidAddData] = useState({ amount: 0, paymentDate: '', paymentMode: '', title: '' });
  const [paymentDetails, setPaymentDetails] = useState([]);
  const [purchaseDetails, setPurchaseDetails] = useState([]);
  const [totalPurchaseAmount, setTotalPurchaseAmount] = useState(0);
  const columns = [
    { id: 'invoice', label: 'Invoice', minWidth: '30%' },
    { id: 'sellingDate', label: 'Date of Purchase', minWidth: '20%' },
    {
      id: 'grandTotal',
      label: 'Total Amount',
      minWidth: '20%'
      // align: 'right',
      // format: (value) => value.toLocaleString('en-US')
    },
    {
      id: 'paidAmount',
      label: 'Amount paid',
      minWidth: '15%'
    },
    {
      id: 'amountDue',
      label: 'Amount Due',
      minWidth: '20%'
    }
  ];

  const columnsPayment = [
    // { id: 'invoice', label: 'Invoice', minWidth: '20%' },
    { id: 'paymentDate', label: 'Date of Payment', minWidth: '25%' },
    {
      id: 'paidAmount',
      label: 'Amount',
      minWidth: '25%'
      // align: 'right',
      // format: (value) => value.toLocaleString('en-US')
    },
    {
      id: 'paymentMode',
      label: 'Mode',
      minWidth: '20%'
    },
    {
      id: 'title',
      label: 'Title',
      minWidth: '25%'
    }
  ];

  useEffect(() => {
    (async () => {
      await client
        .get('/purchaseorder?filterBySupplierId=' + data._id)
        .then((res) => {
          let totalAmount = 0;
          let tempPurchaseDetails = [];
          // console.log(res.data.result.result);
          res.data.result.result.map((e) => {
            totalAmount += e.grandTotalAmount;
            tempPurchaseDetails = [
              ...tempPurchaseDetails,
              {
                invoice: e.invoiceNumber,
                sellingDate: e.dateOfPruchase,
                grandTotal: e.grandTotalAmount,
                paidAmount: e.paidAmount,
                amountDue: e.cerditAmount
              }
            ];
          });

          setTotalPurchaseAmount(totalAmount);
          setPurchaseDetails(tempPurchaseDetails);
        })
        .catch((err) => {
          setTotalPurchaseAmount(0);
          setPurchaseDetails([]);
        });
    })();
    return () => {
      return null;
    };
  }, [data]);

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
  let deleteSupplier = () => {
    let id = data._id;
    client
      .delete('/supplier/' + id)
      .then((res) => {
        // console.log(res);
        setError({ err: false, message: res.data.message });
        handleClose();
      })
      .catch((err) => setError({ err: true, message: err.response.data.errorMessage }));
  };
  const [error, setError] = React.useState('');
  useEffect(() => {
    (async () => {
      await client
        .get('/payment?filterByCustomerSupplier=' + data._id)
        .then((res) => {
          setPaymentDetails(res.data.result.result);
        })
        .catch((err) => {
          setPaymentDetails([]);
        });
    })();
    return () => {
      return null;
    };
  }, [data]);
  let checkUserInputTotalPaidvalue = (value) => {
    let regex = /^-?\d*\.?\d*$/;
    if (regex.test(value)) {
      //console.log('ok');
      setPaidAddData({ ...paidAddData, amount: value });
    }
  };

  const handleAddPayment = async () => {
    // console.log(paidAddData);
    client
      .post('/payment', {
        paymentPartner: 'SUPPLIER',
        id: data._id,
        paymentDate: paidAddData.paymentDate,
        title: paidAddData.title,
        paidAmount: paidAddData.amount,
        paymentMode: paidAddData.paymentMode
      })
      .then((res) => {
        setError({ err: false, message: res.data.message });
        setNewPaymentButton(false);
        handleClose();
      })
      .catch((error) => {
        setError({ err: true, message: error.response.data.errorMessage });
      })
      .finally(() => {
        setPaidAddData({ amount: 0, paymentDate: '', paymentMode: '', title: '' });
      });
  };

  const handleDelete = async (data) => {
    await client
      .delete('/payment/' + data._id)
      .then((res) => {
        if (res.data.status == '200') {
          setError({ err: false, message: res.data.message });
          handleClose();
        }
      })
      .catch((error) => {
        // alert(error);
        setError({ err: true, message: error.response.data.errorMessage });
      })
      .finally(() => {
        setPaidAddData({ amount: 0, paymentDate: '', paymentMode: '', title: '' });
      });
  };

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
        fullScreen
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
        <DialogTitle variant="h4" style={{ padding: '40px 40px', paddingBottom: '5px' }}>
          Update Supplier
        </DialogTitle>
        <SupplierDetailsBox supplierData={supplierUpdateForm} />
        <DialogContent style={{ padding: '0 40px', paddingBottom: '20px' }}>
          <DialogContentText>Update Existing Suppliers</DialogContentText>
          <Grid style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }} mt={1.5}>
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
              sx={{ marginRight: '20px' }}
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
              sx={{ marginRight: '20px' }}
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
              sx={{ marginRight: '20px' }}
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
              sx={{ marginRight: '20px' }}
            />
            <Button
              variant="contained"
              color={'success'}
              size="small"
              sx={{ width: 800, height: '50px' }}
              onClick={() => setNewPaymentButton(!newPaymentButton)}
            >
              ADD PAYMENT
            </Button>
          </Grid>
          <Dialog open={newPaymentButton} onClose={() => setNewPaymentButton(false)} fullWidth maxWidth="sm">
            <DialogTitle style={{ padding: '30px 30px 10px 30px' }}>
              <Typography variant="h4">{'New Payment'}</Typography>
            </DialogTitle>
            <DialogContent style={{ padding: '0px 30px 0px 30px' }}>
              <Stack direction="row" spacing={10} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Typography>
                  <b>Supplier Name :</b> {supplierUpdateForm.supplierName}
                </Typography>
                <Typography>
                  <b>Due Amount :</b> {`₹` + (supplierUpdateForm.totalCreditAmount || 0)}
                </Typography>
              </Stack>
              <Stack spacing={1}>
                <Typography>
                  <TextField
                    required
                    margin="normal"
                    id="paidAmount"
                    name="paidAmount"
                    label="Add Amount Paid"
                    type="text"
                    fullWidth
                    variant="outlined"
                    value={paidAddData.amount}
                    onChange={(event) => {
                      checkUserInputTotalPaidvalue(event.target.value);
                    }}
                    disabled={supplierUpdateForm.paymentDate <= 0 ? true : false}
                  />
                </Typography>
                <LocalizationProvider dateAdapter={AdapterDayjs}>
                  <DatePicker
                    label="Payment Date*"
                    required
                    name="paymentDate"
                    format="DD-MM-YYYY"
                    value={paidAddData.paymentDate || null}
                    onChange={(date, constext) => {
                      // console.log(constext.validationError);
                      if (constext.validationError == null) {
                        setPaidAddData({ ...paidAddData, paymentDate: date });
                      }
                    }} //setPurchaseDate(dayjs('2020-01-02'))
                  />
                </LocalizationProvider>
                <Typography>
                  <TextField
                    required
                    margin="normal"
                    id="paidAmount"
                    name="paidAmount"
                    label="Title"
                    type="text"
                    fullWidth
                    variant="outlined"
                    value={paidAddData.title}
                    onChange={(event) => {
                      setPaidAddData({ ...paidAddData, title: event.target.value });
                    }}
                    disabled={supplierUpdateForm.paymentDate <= 0 ? true : false}
                  />
                  <FormControl sx={{ mt: 1 }}>
                    <FormLabel id="demo-row-radio-buttons-group-label">Payment Mode</FormLabel>
                    <RadioGroup
                      row
                      aria-labelledby="demo-row-radio-buttons-group-label"
                      name="row-radio-buttons-group"
                      value={paidAddData.paymentMode}
                      onChange={(event) => setPaidAddData({ ...paidAddData, paymentMode: event.target.value })}
                    >
                      <FormControlLabel value="CARD" control={<Radio size="small" />} label="CARD" />
                      <FormControlLabel
                        value="CASH"
                        control={<Radio size="small" />}
                        label="CASH"
                        // onClick={(event) => setPaidAddData(event.target.value)}
                      />
                      <FormControlLabel
                        value="ONLINE"
                        control={<Radio size="small" />}
                        label="ONLINE"
                        // onClick={(event) => setPaidAddData(event.target.value)}
                      />
                    </RadioGroup>
                  </FormControl>
                </Typography>
              </Stack>
            </DialogContent>
            <DialogActions style={{ padding: '20px 30px 30px 30px' }}>
              <Button variant="outlined" color="success" onClick={handleAddPayment}>
                Add
              </Button>
              <Button variant="outlined" color="error" onClick={() => setNewPaymentButton(false)}>
                Cancel
              </Button>
            </DialogActions>
          </Dialog>
          <Grid container mt={2}>
            <Grid xl={6}>
              <Typography variant="h5" style={{ marginTop: 5 }}>
                Purchase Orders:
              </Typography>
            </Grid>
            <Grid xl={6}>
              <Typography variant="h5" style={{ marginLeft: 20 }}>
                Payment History:
              </Typography>
            </Grid>
          </Grid>
          <DialogContent style={{ paddingBottom: '20px', paddingLeft: 0 }}>
            <Grid container sx={{ paddingTop: 0 }} mt={0}>
              <Grid xl={6}>
                <DenseTable purpose={'SALES'} productDtls={purchaseDetails} columns={columns} />
              </Grid>
              <Grid xl={5.5} sx={{ marginLeft: '30px' }}>
                <DenseTable
                  purpose={'PAYMENT'}
                  productDtls={paymentDetails}
                  columns={columnsPayment}
                  name={supplierUpdateForm.supplierName}
                  handleDelete={handleDelete}
                />
              </Grid>
            </Grid>
          </DialogContent>
        </DialogContent>
        <DialogActions style={{ paddingBottom: '40px', paddingRight: '40px' }}>
          <Button variant="contained" color="secondary" onClick={() => handleClose()}>
            Cancel
          </Button>
          <Button variant="contained" color="success" onClick={() => updateSupplier()}>
            Update
          </Button>
          <Button variant="contained" color="error" onClick={() => deleteSupplier()}>
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}

function DenseTable({ productDtls = [], purpose = 'SALES', columns, name, handleDelete }) {
  const [open, setOpen] = useState(false);
  const [selectedData, setSelectedData] = useState({});

  const handleClose = () => {
    setOpen(false);
  };

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
            {purpose == 'SALES'
              ? productDtls.map((row) => (
                  <TableRow sx={{ '&:last-child td, &:last-child th': { border: 0 } }} hover role="checkbox" tabIndex={-1}>
                    <TableCell>{row.invoice}</TableCell>
                    <TableCell>{dayjs(row.sellingDate).format('DD-MM-YYYY')}</TableCell>
                    <TableCell>{parseFloat(row.grandTotal).toFixed(2)}</TableCell>
                    <TableCell>{parseFloat(row.paidAmount).toFixed(2)}</TableCell>
                    <TableCell>{parseFloat(row.amountDue).toFixed(2)}</TableCell>
                  </TableRow>
                  // invoice, sellingDate, grandTotal, dueDate, amountDue
                ))
              : purpose == 'PAYMENT'
                ? productDtls.map((row) => (
                    <TableRow
                      sx={{ '&:last-child td, &:last-child th': { border: 0 }, cursor: 'pointer' }}
                      hover
                      role="checkbox"
                      tabIndex={-1}
                      onClick={() => {
                        setOpen(true);
                        setSelectedData(row);
                      }}
                    >
                      <TableCell>{dayjs(row.paymentDate).format('DD-MM-YYYY')}</TableCell>
                      <TableCell>{parseFloat(row.paidAmount).toFixed(2)}</TableCell>
                      <TableCell>{row.paymentMode}</TableCell>
                      <TableCell>{row.title}</TableCell>
                    </TableRow>
                  ))
                : null}
          </TableBody>
        </Table>
      </TableContainer>
      <AlertDialog
        open={open}
        handleClose={handleClose}
        handleDelete={(data) => handleDelete(data)}
        data={{ ...selectedData, supplierName: name }}
      />
    </Paper>
  );
}

const SupplierDetailsBox = ({ supplierData }) => {
  return (
    <Grid
      xl={12}
      sx={{ borderRadius: '14px', backgroundColor: 'cornflowerblue', color: 'white' }}
      style={{ maxHeight: 110 }}
      paddingLeft={5}
      paddingRight={5}
      paddingTop={3}
      paddingBottom={3}
      marginTop={2}
      marginBottom={2}
      marginLeft={5}
      marginRight={5}
    >
      <Grid sx={{ display: 'flex', justifyContent: 'space-between' }}>
        <Grid>
          <Typography variant="h6">Name: </Typography>
          <Typography variant="h5" style={{ marginTop: 15 }}>
            {supplierData.supplierName}
          </Typography>
        </Grid>
        <Grid>
          <Typography variant="h6">Mobile No:</Typography>
          <Typography variant="h5" style={{ marginTop: 15 }}>
            +91 {supplierData.supplierContactNo}
          </Typography>{' '}
        </Grid>
        <Grid>
          <Typography variant="h6">Address </Typography>
          <Typography variant="h5" style={{ marginTop: 15 }}>
            {supplierData.supplierAddress}
          </Typography>{' '}
        </Grid>
        <Grid sx={{ height: '60px', width: '1px', backgroundColor: 'white' }}></Grid>

        {/* <Grid>
          <Typography variant="h6">Total amount Purchased month: </Typography>
          <Typography variant="h5" style={{ marginTop: 15 }}>
            ₹{supplierData.totalPurchaseAmount}
          </Typography>{' '}
        </Grid> */}
        <Grid>
          <Typography variant="h6">Total amount Due: </Typography>
          <Typography variant="h5" style={{ marginTop: 15 }}>
            ₹{supplierData.totalCreditAmount}
          </Typography>{' '}
        </Grid>
        {/* <Grid sx={{ height: '60px', width: '1px', backgroundColor: 'white' }}></Grid> */}
      </Grid>
    </Grid>
  );
};
