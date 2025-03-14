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
  Typography,
  FormControl,
  FormLabel,
  RadioGroup,
  FormControlLabel,
  Radio
} from '@mui/material';
import dayjs from 'dayjs';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DatePicker, LocalizationProvider } from '@mui/x-date-pickers';
import AlertDialog from 'components/AlertDialog';

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

export default function CustomerUpdate({ open, selectedDate, handleClose }) {
  const [totalSoldAmount, setTotalSoldAmount] = useState(0);
  const [saleDetails, setSaleDetails] = useState([]);
  const [newPaymentButton, setNewPaymentButton] = useState(false);
  const [paidAddData, setPaidAddData] = useState({ amount: 0, paymentDate: '', paymentMode: '', title: '' });
  const [paymentDetails, setPaymentDetails] = useState([]);
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
      id: 'paidAmount',
      label: 'Paid Amount',
      minWidth: '20%'
    },
    {
      id: 'amountDue',
      label: 'Amount Due',
      minWidth: '15%'
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
                paidAmount: e.paidAmount,
                amountDue: e.cerditAmount
              }
            ];
          });

          setTotalSoldAmount(totalAmount);
          setSaleDetails(tempSaleDetails);
        })
        .catch((err) => {
          setTotalSoldAmount(0);
          setSaleDetails([]);
        });
    })();
    return () => {
      return null;
    };
  }, [open]);

  useEffect(() => {
    (async () => {
      await client
        .get('/payment?filterByCustomerSupplier=' + selectedDate._id)
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
  }, [selectedDate]);

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

  let handleMonthlyBill = () => {
    let id = formData._id;
    client
      .get('/customer/monthlybill/' + id)
      .then((res) => {
        const tempSaleDetails = res.data.result.saleDetails.result || [];

        if (!tempSaleDetails.length) {
          return setError({ err: true, message: err.response.data.errorMessage });
        }
        setError({ err: false, message: res.data.message });
        const width = window.innerWidth; // Get the full width of the screen
        const height = window.innerHeight; // Get the full height of the screen
        window.open(
          'https://titirpetshop-1-ez7f.vercel.app/customerbill/' + formData._id,
          '',
          `width=${width},height=${height},top=0,left=0`
        ); // You can specify a URL or leave it blank
      })
      .catch((err) => setError({ err: true, message: err.response.data.errorMessage }));
  };
  let checkUserInputTotalPaidvalue = (value) => {
    let regex = /^-?\d*\.?\d*$/;
    if (regex.test(value)) {
      //console.log('ok');
      setPaidAddData({ ...paidAddData, amount: value });
    }
  };

  const [error, setError] = React.useState('');

  const handleAddPayment = async () => {
    client
      .post('/payment', {
        paymentPartner: 'CUSTOMER',
        id: formData._id,
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
      .catch((err) => setError({ err: true, message: res.data.message }));
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
          <Grid container justifyContent={'space-between'}>
            <Typography variant="h3">Customer Details</Typography>

            <Button variant="outlined" color="secondary" onClick={() => handleMonthlyBill()}>
              Generate Monthly bill
            </Button>
          </Grid>
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
            <Button
              variant="contained"
              color={'success'}
              size="small"
              sx={{ width: 500 }}
              onClick={() => setNewPaymentButton(!newPaymentButton)}
            >
              ADD PAYMENT
            </Button>
            {/* </Stack> */}
          </Stack>
          {/* <Button variant="outlined" onClick={() => }>
            New Payment
          </Button> */}
          <Dialog open={newPaymentButton} onClose={() => setNewPaymentButton(false)} fullWidth maxWidth="sm">
            <DialogTitle style={{ padding: '30px 30px 10px 30px' }}>
              <Typography variant="h4">{'New Payment'}</Typography>
            </DialogTitle>
            <DialogContent style={{ padding: '0px 30px 0px 30px' }}>
              <Stack direction="row" spacing={10} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Typography>
                  <b>Customer Name :</b> {formData.customerName}
                </Typography>
                <Typography>
                  <b>Due Amount :</b> {`₹` + (formData.totalCreditAmount || 0)}
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
                    disabled={formData.paymentDate <= 0 ? true : false}
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
                    disabled={formData.paymentDate <= 0 ? true : false}
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
          <Grid container>
            <Grid xl={6}>
              <Typography variant="h5" style={{ marginTop: 5 }}>
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
              <DenseTable purpose={'SALES'} productDtls={saleDetails} columns={columns} />
            </Grid>
            <Grid xl={5.5} sx={{ marginLeft: '30px' }}>
              <DenseTable
                purpose={'PAYMENT'}
                productDtls={paymentDetails}
                columns={columnsPayment}
                name={selectedDate.customerName}
                handleDelete={handleDelete}
              />
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
                      <TableCell>{row.paidAmount}</TableCell>
                      <TableCell>{row.paymentMode}</TableCell>
                      <TableCell>{row.title}</TableCell>
                    </TableRow>
                    // invoice, sellingDate, grandTotal, dueDate, amountDue
                  ))
                : null}
          </TableBody>
        </Table>
      </TableContainer>
      <AlertDialog
        open={open}
        handleClose={handleClose}
        handleDelete={(data) => handleDelete(data)}
        entity="CUSTOMER"
        data={{ ...selectedData, supplierName: name }}
      />
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
        {/* <Grid sx={{ height: '60px', width: '1px', backgroundColor: 'white' }}></Grid> */}
      </Grid>
    </Grid>
  );
};
