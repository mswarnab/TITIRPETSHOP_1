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
  Paper,
  Slide,
  Snackbar,
  Stack,
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
import dayjs from 'dayjs';

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

export default function SaleUpdate({ open, selectedData, handleClose }) {
  // console.log(selectedData);
  const [saleUpdateForm, setSaleUpdateForm] = useState({
    paidAmount: 0
  });
  const editSale = () => {
    window.open('https://titirpetshop-1-ez7f.vercel.app/sale/edit/' + selectedData._id, '_blank');
    handleClose();
  };

  // let changeValue = (event) => {
  //   let eventValue = event.target.value;
  //   let eventName = event.target.name;
  //   if (formData.id != selectedDate.id) {
  //     formData.id == selectedDate.id;
  //   }
  //   let newData = [...supplierUpdateForm];
  //   newData[eventName] = eventValue;
  //   setFormData(newData);
  // };
  let updateSaleOrder = () => {
    let id = selectedData._id;
    client
      .put('/sales/' + id, saleUpdateForm)
      .then((res) => {
        setError({ err: false, message: res.data.message });
        handleClose();
        setSaleUpdateForm({
          paidAmount: 0
        });
      })
      .catch();
  };
  const [error, setError] = useState('');
  let handleCloseSnackBar = () => {
    setError('');
  };
  let vertical = 'top';
  let horizontal = 'center';
  const [fullPaid, setFullPaid] = useState(false);
  // console.log(purchaseUpdateForm.paidAmount);
  const [prodValue, setProdValue] = useState([]);
  useEffect(() => {
    (async () => {
      if (selectedData?._id) {
        client
          .get('/sales/' + selectedData._id)
          .then((res) => {
            // console.log(res.data.result.result.products);
            let productData = res.data.result.result.products;
            setProdValue(productData);
          })
          .catch();
      }
    })();
  }, [selectedData]);
  let handleChangeFullPaid = () => {
    if (!fullPaid) {
      setSaleUpdateForm({ ...saleUpdateForm, paidAmount: parseFloat(selectedData.dueAmount) });
    } else {
      setSaleUpdateForm({ ...saleUpdateForm, paidAmount: 0 });
    }
    setFullPaid(!fullPaid);
  };
  let deleteSaleOrder = () => {
    client
      .delete('/sales/' + selectedData._id)
      .then((res) => {
        setError({ error: false, message: res.data.message });
        handleClose();
      })
      .catch((err) => setError({ err: true, message: err.response.data.errorMessage }));
  };
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
        fullWidth="true"
        maxWidth="lg"
        onClose={() => handleClose()}
        TransitionComponent={Transition}
        PaperProps={{
          component: 'form'
        }}
      >
        <DialogTitle variant="h4" style={{ padding: '40px 40px', paddingBottom: '30px' }}>
          Update Sale order
        </DialogTitle>
        <DialogContent style={{ padding: '0 40px', paddingBottom: '20px' }}>
          <DialogContentText>Update Existing Purchase Order</DialogContentText>
          <Stack direction="row" style={{ display: 'flex', justifyContent: 'space-between' }}>
            <Typography variant="h6" sx={{ pt: 1 }}>
              Bill Number: {selectedData?.billNumber}
            </Typography>
            <Typography variant="h6" sx={{ pt: 1 }}>
              Bill Date: {dayjs(selectedData?.dateOfBilling).format('YYYY-MM-DD')}
            </Typography>
            <Typography variant="h6" sx={{ pt: 1 }}>
              Total Sell Amount: ₹{selectedData?.sellTotalAmount}
            </Typography>
          </Stack>
          <Stack direction="row" style={{ display: 'flex', justifyContent: 'space-between' }}>
            {/* <Typography variant="h6" sx={{ pt: 1 }}>
              Payment Mode: {supplierUpdateForm.modeOfPayment}
            </Typography> */}
            {/* {selectedData?.cerditAmount <= 0 ? ( */}
            <Typography variant="h6" sx={{ pt: 1 }}>
              Paid Amount: ₹{selectedData?.paidAmount}
            </Typography>
            {/* ) : (
              ''
            )} */}
            <Typography variant="h6" sx={{ pt: 1 }}>
              Total Due Amount: ₹{selectedData?.dueAmount}
            </Typography>
          </Stack>

          {selectedData?.dueAmount > 0 ? (
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
                onChange={(e) => setSaleUpdateForm({ ...saleUpdateForm, paidAmount: e.target.value })}
                value={saleUpdateForm.paidAmount}
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
          <Button variant="contained" color="info" onClick={() => editSale()}>
            EDIT ITEM
          </Button>
          <Button variant="contained" color="secondary" onClick={() => handleClose()}>
            CANCEL
          </Button>
          {selectedData?.dueAmount > 0 ? (
            <Button variant="contained" color="success" onClick={() => updateSaleOrder()}>
              UPDATE
            </Button>
          ) : (
            ''
          )}
          <Button variant="contained" color="error" onClick={() => deleteSaleOrder()}>
            DELETE
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}

function DenseTable({ productDtls = [] }) {
  return (
    <TableContainer component={Paper}>
      <Table sx={{ minWidth: 650 }} size="small" aria-label="a dense table">
        <TableHead>
          <TableRow>
            <TableCell>Product Name</TableCell>
            <TableCell align="right">Purchase Price + Gst</TableCell>
            <TableCell align="right">MRP</TableCell>
            <TableCell align="right">Sale Qty</TableCell>
            <TableCell align="right">Selling Price</TableCell>
            <TableCell align="right">Total Price</TableCell>
            <TableCell align="right">Discount Amount</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {productDtls.map((row) => (
            <TableRow key={row.name} sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
              <TableCell component="th" scope="row">
                {row.productName}
              </TableCell>
              <TableCell align="right">{parseFloat(row.purchasePriceWithGst).toFixed(2)}</TableCell>
              <TableCell align="right">{row.mrp}</TableCell>
              <TableCell align="right">{row.quantity}</TableCell>
              <TableCell align="right">{parseFloat(row.sellingPrice).toFixed(2)}</TableCell>
              <TableCell align="right">{parseFloat(row.quantity * row.sellingPrice).toFixed(2)}</TableCell>
              <TableCell align="right">{parseFloat(row.discountedAmount).toFixed(2)}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}
