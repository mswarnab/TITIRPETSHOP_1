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
  Chip,
  Divider,
  FormControlLabel,
  Slide,
  Snackbar,
  Switch,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography
} from '@mui/material';
import { client } from 'api/client';
import { display, Stack } from '@mui/system';
import Paper from '@mui/material/Paper';
import dayjs from 'dayjs';
const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

export default function PurchaseUpdate({ open, handleClose, selectedData }) {
  // console.log(selectedData);
  const [purchaseUpdateForm, setPurchaseUpdateForm] = useState({
    addLessAmount: '',
    cerditAmount: '',
    cgst: '',
    crDrNote: '',
    dateOfPruchase: '',
    discount: '',
    dueDate: '',
    grandTotalAmount: '',
    invoiceNumber: '',
    modeOfPayment: '',
    paidAmount: '0',
    sgst: '',
    supplierId: '',
    totalAmount: '',
    __v: '',
    _id: ''
  });
  const [fullPaid, setFullPaid] = useState(false);
  // console.log(purchaseUpdateForm.paidAmount);
  const [prodValue, setProdValue] = useState([]);
  useEffect(() => {
    (async () => {
      if (selectedData._id) {
        client
          .get('/purchaseorder/' + selectedData._id)
          .then((res) => {
            // console.log(res.data.result.result.products);
            let productData = res.data.result.result.products;
            setProdValue(productData);
          })
          .catch();
      }
    })();
  }, [selectedData]);
  // console.log(prodValue);
  useEffect(() => {
    // console.log('in here');
    setPurchaseUpdateForm({
      ...purchaseUpdateForm,
      addLessAmount: selectedData.addLessAmount,
      cerditAmount: selectedData.cerditAmount,
      cgst: selectedData.cgst,
      crDrNote: selectedData.crDrNote,
      dateOfPruchase: selectedData.dateOfPruchase,
      discount: selectedData.discount,
      dueDate: selectedData.dueDate,
      grandTotalAmount: selectedData.grandTotalAmount,
      invoiceNumber: selectedData.invoiceNumber,
      modeOfPayment: selectedData.modeOfPayment,
      //   paidAmount: selectedData.paidAmount,
      sgst: selectedData.sgst,
      supplierId: selectedData.supplierId,
      totalAmount: selectedData.totalAmount,
      __v: selectedData.__v,
      _id: selectedData._id
    });
    return () => {
      return null;
    };
  }, [selectedData]);
  let updatePurchase = () => {
    let id = selectedData._id;
    if (purchaseUpdateForm.paidAmount > 0) {
      client
        .put('/purchaseorder/' + id, purchaseUpdateForm)
        .then((res) => {
          // console.log(res);
          setError({ err: false, message: res.data.message });
          setPurchaseUpdateForm({
            addLessAmount: '',
            cerditAmount: '',
            cgst: '',
            crDrNote: '',
            dateOfPruchase: '',
            discount: '',
            dueDate: '',
            grandTotalAmount: '',
            invoiceNumber: '',
            modeOfPayment: '',
            paidAmount: '0',
            sgst: '',
            supplierId: '',
            totalAmount: '',
            __v: '',
            _id: ''
          });
          handleClose();
        })
        .catch((err) => setError({ err: true, message: err.response.data.errorMessage }));
    }
  };
  let deletePurchase = () => {
    let id = selectedData._id;
    client
      .delete('/purchaseorder/' + id)
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
  let handleChangeFullPaid = () => {
    let newArr = { ...purchaseUpdateForm };
    if (!fullPaid) {
      newArr.paidAmount = newArr.cerditAmount;
    } else {
      newArr.paidAmount = 0;
    }
    setPurchaseUpdateForm(newArr);
    setFullPaid(!fullPaid);
  };
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
        fullWidth="true"
        maxWidth="lg"
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
          Update Purchase order
        </DialogTitle>
        <DialogContent style={{ padding: '0 40px', paddingBottom: '20px' }}>
          <DialogContentText>Update Existing Purchase Order</DialogContentText>
          <Stack direction="row" style={{ display: 'flex', justifyContent: 'space-between' }}>
            <Typography variant="h6" sx={{ pt: 1 }}>
              Invoice Number: {purchaseUpdateForm.invoiceNumber}
            </Typography>
            <Typography variant="h6" sx={{ pt: 1 }}>
              Purchase Date: {purchaseUpdateForm.dateOfPruchase}
            </Typography>
            <Typography variant="h6" sx={{ pt: 1 }}>
              Total Amount: ₹{purchaseUpdateForm.grandTotalAmount}
            </Typography>
          </Stack>
          <Stack direction="row" style={{ display: 'flex', justifyContent: 'space-between' }}>
            <Typography variant="h6" sx={{ pt: 1 }}>
              Payment Mode: {purchaseUpdateForm.modeOfPayment}
            </Typography>
            {purchaseUpdateForm.cerditAmount <= 0 ? (
              <Typography variant="h6" sx={{ pt: 1 }}>
                Paid Amount: ₹{selectedData.paidAmount}
              </Typography>
            ) : (
              ''
            )}
            <Typography variant="h6" sx={{ pt: 1 }}>
              Total Due Amount: ₹{purchaseUpdateForm.cerditAmount}
            </Typography>
          </Stack>

          {/* <TextField
            margin="normal"
            id="invoiceNumber"
            name="invoiceNumber"
            label="Invoice Number"
            type="text"
            value={purchaseUpdateForm.invoiceNumber}
            // onChange={(e) => setSupplierUpdateForm({ ...supplierUpdateForm, supplierName: e.target.value })}
            fullWidth
            variant="outlined"
            disabled
          />
          <TextField
            margin="normal"
            id="dateOfPruchase"
            name="dateOfPruchase"
            label="Purchase Date"
            type="text"
            value={purchaseUpdateForm.dateOfPruchase}
            // onChange={(e) => setSupplierUpdateForm({ ...supplierUpdateForm, supplierName: e.target.value })}
            fullWidth
            variant="outlined"
            disabled
          />
          <TextField
            margin="normal"
            id="grandTotalAmount"
            name="grandTotalAmount"
            label="Total Amount"
            type="text"
            value={purchaseUpdateForm.grandTotalAmount}
            // onChange={(e) => setSupplierUpdateForm({ ...supplierUpdateForm, supplierName: e.target.value })}
            fullWidth
            variant="outlined"
            disabled
          />
          <TextField
            margin="normal"
            id="modeOfPayment"
            name="modeOfPayment"
            label="Payment Mode"
            type="text"
            value={purchaseUpdateForm.modeOfPayment}
            // onChange={(e) => setSupplierUpdateForm({ ...supplierUpdateForm, supplierName: e.target.value })}
            fullWidth
            variant="outlined"
            disabled
          /> */}

          {purchaseUpdateForm.cerditAmount > 0 ? (
            <>
              <FormControlLabel
                control={<Switch checked={fullPaid} onChange={handleChangeFullPaid} aria-label="Full Paid" />}
                label="Full Paid"
              />
              <TextField
                margin="normal"
                id="paidAmount"
                name="paidAmount"
                label="Paid Amount"
                type="text"
                onChange={(e) => setPurchaseUpdateForm({ ...purchaseUpdateForm, paidAmount: e.target.value })}
                value={purchaseUpdateForm.paidAmount}
                fullWidth
                variant="outlined"
              />
            </>
          ) : (
            ''
          )}
          {prodValue?.length ? (
            <>
              <Divider style={{ marginBottom: '10px' }}>
                <Chip label="List Of Products" size="small" />
              </Divider>
              <DenseTable productDtls={prodValue} />
            </>
          ) : (
            ''
          )}
        </DialogContent>
        <DialogActions style={{ paddingBottom: '40px', paddingRight: '40px' }}>
          <Button variant="contained" color="secondary" onClick={() => handleClose()}>
            Cancel
          </Button>
          {purchaseUpdateForm.cerditAmount > 0 ? (
            <Button variant="contained" color="success" onClick={() => updatePurchase()}>
              Update
            </Button>
          ) : (
            ''
          )}
          <Button variant="contained" color="error" onClick={() => deletePurchase()}>
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}

// function createData(name, calories, fat, carbs, protein) {
//   return { name, calories, fat, carbs, protein };
// }

function DenseTable({ productDtls = [] }) {
  // productDtls.map();
  // const rows = [
  //   createData('Frozen yoghurt', 159, 6.0, 24, 4.0),
  //   createData('Ice cream sandwich', 237, 9.0, 37, 4.3),
  //   createData('Eclair', 262, 16.0, 24, 6.0),
  //   createData('Cupcake', 305, 3.7, 67, 4.3),
  //   createData('Gingerbread', 356, 16.0, 49, 3.9)
  // ];
  return (
    <TableContainer component={Paper}>
      <Table sx={{ minWidth: 650 }} size="small" aria-label="a dense table">
        <TableHead>
          <TableRow>
            <TableCell>Product Name</TableCell>
            <TableCell align="right">Category</TableCell>
            <TableCell align="right">Expiry Date</TableCell>
            <TableCell align="right">Purchase Qty</TableCell>
            <TableCell align="right">Available Qty</TableCell>
            <TableCell align="right">Rate</TableCell>
            <TableCell align="right">MRP</TableCell>
            <TableCell align="right">SGST</TableCell>
            <TableCell align="right">CGST</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {productDtls.map((row) => (
            <TableRow key={row.name} sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
              <TableCell component="th" scope="row">
                {row.productName}
              </TableCell>
              <TableCell align="right">{row.category}</TableCell>
              <TableCell align="right">{dayjs(row.expDate).format('YYYY-MM-DD')}</TableCell>
              <TableCell align="right">{row.purchaseQuantity}</TableCell>
              <TableCell align="right">{row.quantity}</TableCell>
              <TableCell align="right">{row.rate}</TableCell>
              <TableCell align="right">{row.mrp}</TableCell>
              <TableCell align="right">{row.sgst}</TableCell>
              <TableCell align="right">{row.cgst}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}
