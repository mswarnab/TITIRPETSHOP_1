import React, { useEffect, useState } from 'react';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import { Autocomplete, Divider, Grid, MenuItem, Select, Slide, Stack, Typography } from '@mui/material';
import { DatePicker, LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import dayjs from 'dayjs';
import { client } from 'api/client';
import { prodCatagoryArr, gstPercArr } from 'static';

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

export default function StockUpdateView({ open, rowData, handleClose, handleUpdate, handleDelete, viewType }) {
  // console.log(rowData);
  const [formData, setFormDate] = useState({
    id: 0,
    name: '',
    catagory: '',
    batch: '',
    hsn: '',
    mfr: '',
    qty: '',
    mrp: '',
    sgstperc: 0,
    cgstPerc: 0,
    expDate: '',
    prodPurchasePrice: '',
    totalPrice: '',
    totalPriceWithGst: '',
    discountPerc: 0,
    discountScheme: 0
  });
  useEffect(() => {
    setFormDate({
      id: rowData.id,
      name: rowData.productName,
      catagory: rowData.productCategory,
      batch: rowData.batch,
      hsn: rowData.hsn,
      mfr: rowData.mfr,
      qty: rowData.qty,
      mrp: rowData.mrp,
      sgstperc: rowData.sgstPerc,
      cgstPerc: rowData.cgstPerc,
      expDate: rowData.expDate,
      prodPurchasePrice: rowData.purchaseRate,
      totalPrice: rowData.amount,
      totalPriceWithGst: rowData.amountWithgst,
      discountPerc: rowData.discountPerc,
      discountScheme: rowData.discountScheme
    });
    return () => {
      return null;
    };
  }, [rowData]);

  let changeDataOnClick = (event) => {
    let objName = event.target.name;
    let objValue = event.target.value;
    // console.log(event.target);
    let oldData = { ...formData };

    if (objName == 'qty') {
      // console.log(oldData['prodPurchasePrice']);
      if (objValue > 0) {
        oldData[objName] = objValue;
        let newTotalPrice = objValue * oldData['prodPurchasePrice'];
        let newTotalPriceWithGst =
          parseFloat(newTotalPrice) +
          parseFloat(newTotalPrice * oldData['sgstperc']) / 100 +
          parseFloat(newTotalPrice * oldData['cgstPerc']) / 100;
        oldData['totalPrice'] = newTotalPrice.toFixed(2);
        oldData['totalPriceWithGst'] = newTotalPriceWithGst.toFixed(2);
      }
    } else if (objName == 'prodPurchasePrice') {
      if (objValue >= 0) {
        oldData[objName] = objValue;
        let newTotalPrice = objValue * oldData['qty'];
        let newTotalPriceWithGst =
          parseFloat(newTotalPrice) +
          parseFloat(newTotalPrice * oldData['sgstperc']) / 100 +
          parseFloat(newTotalPrice * oldData['cgstPerc']) / 100;
        oldData['totalPrice'] = newTotalPrice.toFixed(2);
        oldData['totalPriceWithGst'] = newTotalPriceWithGst.toFixed(2);
      }
    } else if (objName == 'sgstperc') {
      oldData[objName] = objValue / 2;
      // let newTotalPrice = oldData['totalPrice'];
      oldData['cgstPerc'] = objValue / 2;
      let newTotalPrice = oldData['totalPrice'];
      let newTotalPriceWithGst = parseFloat(newTotalPrice) + parseFloat(newTotalPrice * objValue) / 100;
      // oldData['totalPrice']=newTotalPrice;
      oldData['totalPriceWithGst'] = newTotalPriceWithGst.toFixed(2);
    } else if (objName == 'discountPerc') {
      oldData[objName] = objValue;
      let purchasePrice = oldData['prodPurchasePrice'];
      let newPurchasePrice = parseFloat(purchasePrice) * parseFloat(1 - oldData['discountPerc'] / 100);
      let newTotalPrice = newPurchasePrice * parseFloat(1 - parseFloat(oldData['discountScheme'] / 100)) * oldData['qty'];
      let newTotalPriceWithGst = newTotalPrice * parseFloat(1 + (oldData['cgstPerc'] * 2) / 100);
      oldData['totalPrice'] = newTotalPrice.toFixed(2);
      oldData['totalPriceWithGst'] = newTotalPriceWithGst.toFixed(2);
    } else if (objName == 'discountScheme') {
      oldData[objName] = objValue;
      let purchasePrice = oldData['prodPurchasePrice'];
      let newPurchasePrice = parseFloat(purchasePrice) * parseFloat(1 - oldData['discountPerc'] / 100);
      let newTotalPrice = newPurchasePrice * parseFloat(1 - parseFloat(oldData['discountScheme'] / 100)) * oldData['qty'];
      let newTotalPriceWithGst = newTotalPrice * parseFloat(1 + (oldData['cgstPerc'] * 2) / 100);
      oldData['totalPrice'] = newTotalPrice.toFixed(2);
      oldData['totalPriceWithGst'] = newTotalPriceWithGst.toFixed(2);
    } else {
      oldData[objName] = objValue;
    }
    setFormDate(oldData);
  };
  let setExpDateFunction = (date) => {
    let newDate = new Date(date);
    // console.log(newDate);
    let dd = '01';
    let mm = newDate.getMonth() + 1;
    // console.log(mm);
    if (mm < 10) {
      mm = '0' + mm;
    }
    let yy = newDate.getFullYear();
    let oldData = { ...formData };
    if (oldData['id'] == '') {
      oldData['id'] = rowData.id;
    } else {
      if (oldData['id'] != rowData.id) {
        oldData['id'] = rowData.id;
      }
    }
    oldData['expDate'] = yy + '-' + mm + '-' + dd;
    setFormDate(oldData);
  };
  // console.log(formData);
  const [prodSearch, setProdSearch] = useState([]);
  const [prodNameParm, setProdNameParm] = useState('');
  // useEffect(()=>{
  //   setProdNameParm(row);
  // },[rowData]);
  useEffect(() => {
    // console.log('hi');
    (async () => {
      const getDate = setTimeout(() => {
        let strProdNameLength = prodNameParm.length;
        // console.log('hello : ' + strProdNameLength);
        if (strProdNameLength >= 3) {
          client
            .get('/stock/search', {
              params: { pattern: prodNameParm }
            })
            .then((res) => {
              let top100Films = [];
              let dataResultArr = res.data.result.result;
              dataResultArr.forEach((element) => {
                // console.log(element.supplierName);
                top100Films = [
                  ...top100Films,
                  {
                    productName: element.productName
                  }
                ];
              });
              setProdSearch(top100Films);
            })
            .catch();
        }
      }, 300);

      return () => clearTimeout(getDate);
    })();
  }, [prodNameParm]);
  // console.log(prodNameParm);
  let autoChangeName = (v) => {
    let oldData = { ...formData };
    if (oldData['id'] != rowData.id) {
      oldData['id'] = rowData.id;
    }
    oldData['name'] = v;
    setFormDate(oldData);
  };
  return (
    <>
      <Dialog
        open={open}
        fullWidth
        maxWidth="lg"
        onClose={() => handleClose()}
        TransitionComponent={Transition}
        PaperProps={{
          component: 'form',
          onSubmit: (event) => {
            event.preventDefault();

            handleClose();
          }
        }}
      >
        <DialogTitle variant="h3" style={{ padding: '20px 40px', paddingBottom: '20px' }}>
          <Grid container justifyContent={'space-between'} alignItems={'center'}>
            <Typography variant="h3">Update Stock</Typography>
            <Grid
              display={'flex'}
              style={{
                backgroundColor: 'cornflowerblue',
                padding: '20px 80px',
                marginRight: '15px',
                borderRadius: '18px',
                color: 'white'
              }}
            >
              <Grid style={{ paddingRight: '50px' }}>
                <Typography variant="h5">Total Amount:</Typography>
                <Typography>₹{parseFloat(formData.totalPrice).toFixed(2)}</Typography>
              </Grid>
              <Grid style={{ height: '50px', width: '1px', backgroundColor: 'white' }}></Grid>
              <Grid style={{ paddingLeft: '50px' }}>
                <Typography variant="h5">Total Amount including GST:</Typography>
                <Typography>₹{parseFloat(formData.totalPriceWithGst).toFixed(2)}</Typography>
              </Grid>
            </Grid>
          </Grid>
        </DialogTitle>
        <DialogContent style={{ padding: '0 40px', paddingBottom: '20px' }}>
          <DialogContentText>Update Existing Stocks</DialogContentText>
          <Divider style={{ margin: '20px 0px 20px 0px' }}></Divider>
          {/* <DefaultFields rowData={rowData} setStockData={setStockData}/> */}
          <Stack spacing={2}>
            {/* <TextField
              autoFocus
              required
              margin="normal"
              id="prodName"
              name="name"
              label="Product Name"
              type="text"
              fullWidth
              variant="outlined"
              value={formData.name != '' ? formData.name : rowData.productName}
              onChange={changeDataOnClick}
            /> */}
            <Select
              labelId="sgstLavel"
              id="catagory"
              value={formData.catagory}
              defaultValue={rowData.productCategory}
              displayEmpty
              name="catagory"
              onChange={changeDataOnClick}
              // label="Select GST"
              // onChange={handleChange}
            >
              <MenuItem value="" disabled>
                <em>Select Product Catagory</em>
              </MenuItem>
              {prodCatagoryArr.map((e) => (
                <MenuItem value={e}>{e}</MenuItem>
              ))}
            </Select>
            <Autocomplete
              id="free-solo-demo"
              freeSolo
              required
              options={prodSearch.map((option) => option.productName)}
              defaultValue={rowData.productName}
              value={formData.name}
              name="name"
              disableClearable="true"
              size="small"
              renderInput={(params) => (
                <TextField
                  {...params}
                  label="Product Name"
                  variant="outlined"
                  fullWidth
                  autoComplete="off"
                  name="name"
                  // style={{ paddingTop: '0px' }}
                  onChange={changeDataOnClick}
                  onKeyUp={(event) => setProdNameParm(event.target.value)}
                />
              )}
              onChange={(event, value) => {
                // setSupplierName(value);
                autoChangeName(value);
              }}
            />

            {/* <TextField
              margin="normal"
              id="prodBatch"
              name="mfr"
              label="Mfr"
              type="text"
              fullWidth
              variant="outlined"
              value={formData.mfr}
              onChange={changeDataOnClick}
            /> */}
            <TextField
              required
              margin="normal"
              id="prodBatch"
              name="batch"
              label="Batch No."
              type="text"
              fullWidth
              variant="outlined"
              value={formData.batch}
              onChange={changeDataOnClick}
            />
            <TextField
              required
              margin="normal"
              id="prodHSN"
              name="hsn"
              label="HSN Code"
              type="text"
              fullWidth
              variant="outlined"
              value={formData.hsn}
              onChange={changeDataOnClick}
            />
            <LocalizationProvider dateAdapter={AdapterDayjs}>
              <DatePicker
                label="Exp. Date"
                fullWidth
                views={['year', 'month']}
                defaultValue={dayjs(formData.expDate)}
                name="expDate"
                onChange={(date) => setExpDateFunction(date)}
              />
            </LocalizationProvider>
            <TextField
              required
              margin="normal"
              id="name"
              name="qty"
              label="Product Quantity"
              type="number"
              fullWidth
              variant="outlined"
              value={formData.qty}
              onChange={changeDataOnClick}
            />
            <TextField
              required
              margin="normal"
              id="prodPurchasePrice"
              name="prodPurchasePrice"
              label="Purchase Price"
              type="number"
              fullWidth
              variant="outlined"
              value={formData.prodPurchasePrice}
              onChange={changeDataOnClick}
            />

            <TextField
              required
              margin="normal"
              id="prodMrp"
              name="mrp"
              label="MRP"
              type="number"
              fullWidth
              variant="outlined"
              value={formData.mrp}
              onChange={changeDataOnClick}
            />
            {/* <TextField
              autoFocus
              required
              margin="normal"
              id="prodTotalPrice"
              name="totalPrice"
              label="Total Price"
              type="number"
              fullWidth
              variant="outlined"
              value={formData.totalPrice > '0' ? formData.totalPrice : rowData.amount}
              disabled
            /> */}
            <Select
              labelId="sgstLavel"
              id="demo-simple-select-helper"
              value={formData.sgstperc * 2}
              defaultValue={rowData.sgstPerc * 2}
              displayEmpty
              name="sgstperc"
              onChange={changeDataOnClick}
              // label="Select GST"
              // onChange={handleChange}
            >
              <MenuItem value="" disabled>
                <em>Select SGST</em>
              </MenuItem>
              {gstPercArr.map((gstv) => (
                <MenuItem value={gstv}>SGST {gstv}%</MenuItem>
              ))}
              {/* <MenuItem value={0}>SGST 0%</MenuItem>
              <MenuItem value={5}>SGST 5%</MenuItem>
              <MenuItem value={12}>SGST 12%</MenuItem>
              <MenuItem value={18}>SGST 18%</MenuItem> */}
            </Select>
            {/* <Select
              labelId="demo-simple-select-helper-label"
              id="demo-simple-select-helper"
              value={formData.cgstPerc}
              defaultValue={rowData.cgstPerc}
              displayEmpty
              name="cgstPerc"
              onChange={changeDataOnClick}
              // label="Select GST"
              // onChange={handleChangeCgst}
            >
              <MenuItem value="" disabled>
                <em>Select CGST</em>
              </MenuItem> */}

            {/* <MenuItem value={0}>CGST 0%</MenuItem>
              <MenuItem value={5}>CGST 5%</MenuItem>
              <MenuItem value={12}>CGST 12%</MenuItem>
              <MenuItem value={18}>CGST 18%</MenuItem> */}
            {/* </Select> */}
            {/* <TextField
              required
              margin="normal"
              id="prodTotalPrice"
              name="totalPriceWithGst"
              label="Total Price With GST"
              type="number"
              fullWidth
              variant="outlined"
              value={formData.totalPriceWithGst}
              disabled
            /> */}
            <TextField
              required
              margin="normal"
              id="discountPerc"
              name="discountPerc"
              label="Discount%"
              type="number"
              fullWidth
              variant="outlined"
              value={formData.discountPerc}
              onChange={changeDataOnClick}
            />
            <TextField
              required
              margin="normal"
              id="discountScheme"
              name="discountScheme"
              label="Discount Scheme%"
              type="number"
              fullWidth
              variant="outlined"
              value={formData.discountScheme}
              onChange={changeDataOnClick}
            />
          </Stack>
        </DialogContent>
        <DialogActions style={{ paddingBottom: '40px', paddingRight: '40px' }}>
          <Button variant="contained" color="secondary" onClick={() => handleClose()}>
            Cancel
          </Button>
          <Button variant="contained" color="success" onClick={() => handleUpdate(formData)}>
            Update
          </Button>
          <Button variant="contained" color="error" onClick={() => handleDelete(rowData.id)}>
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}
