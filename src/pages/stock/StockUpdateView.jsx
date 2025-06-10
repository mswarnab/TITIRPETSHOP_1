import React, { useEffect, useState } from 'react';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import { Alert, Autocomplete, Divider, Grid, MenuItem, Select, Slide, Snackbar, Stack, Typography } from '@mui/material';
import { DatePicker, LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import dayjs from 'dayjs';
import { client } from 'api/client';
import { prodCatagoryArr, gstPercArr } from 'static';

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});
function deepEqual(obj1, obj2) {
  if (obj1 === obj2) return true;

  if (typeof obj1 !== 'object' || obj1 === null || typeof obj2 !== 'object' || obj2 === null) {
    return false;
  }

  const keys1 = Object.keys(obj1);
  const keys2 = Object.keys(obj2);

  if (keys1.length !== keys2.length) return false;

  for (let key of keys1) {
    if (!keys2.includes(key)) return false;
    if (!deepEqual(obj1[key], obj2[key])) return false;
  }

  return true;
}

export default function StockUpdateView({ open, rowData, handleClose, handleUpdate, handleDelete, viewType }) {
  // console.log(rowData);
  // const [formData, setFormDate] = useState({
  //   id: 0,
  //   name: '',
  //   catagory: '',
  //   batch: '',
  //   hsn: '',
  //   mfr: '',
  //   qty: '',
  //   mrp: '',
  //   sgstperc: 0,
  //   // cgstPerc: 0,
  //   expDate: '',
  //   prodPurchasePrice: '',
  //   totalPrice: '',
  //   totalPriceWithGst: '',
  //   discountPerc: 0,
  //   discountScheme: 0
  // });
  const [formData, setFormDate] = useState({ ...rowData });
  const [alertOpen, setAlertOpen] = useState({
    openFlag: false,
    alertMsg: '1',
    severity: 'error'
  });
  const [submitAlert, setSubmitAlert] = useState({
    flag: false,
    title: '',
    msg: '',
    submitType: ''
  });
  useEffect(() => {
    // console.log(rowData);
    setFormDate({
      pid: rowData.pid,
      id: rowData.id,
      name: rowData.productName,
      catagory: rowData.productCategory,
      batch: rowData.batch,
      hsn: rowData.hsn,
      mfr: rowData.mfr,
      qty: rowData.qty,
      mrp: rowData.mrp,
      sgstperc: rowData.sgstPerc * 2,
      // cgstPerc: rowData.cgstPerc,
      expDate: dayjs(rowData.expDate),
      prodPurchasePrice: rowData.purchaseRate,
      totalPrice: rowData.amount,
      totalPriceWithGst: rowData.amountWithgst,
      discountPerc: rowData.discountPerc,
      discountScheme: rowData.discountScheme
    });
    // console.log(dayjs(rowData.expDate).format('DD-MM-YYYY'));
    return () => {
      return null;
    };
  }, [rowData]);

  useEffect(() => {
    let newData = { ...formData };
    let newPurchasePrice = newData.prodPurchasePrice;
    if (newData.discountPerc > 0) {
      newPurchasePrice = parseFloat(newPurchasePrice) * parseFloat(1 - newData.discountPerc / 100);
    }
    if (newData.discountScheme > 0) {
      newPurchasePrice = parseFloat(newPurchasePrice) * parseFloat(1 - newData.discountScheme / 100);
    }
    let totalAmountData = parseFloat(newData.qty) * parseFloat(newPurchasePrice);
    let totalAmountWithGst = parseFloat(totalAmountData) * parseFloat(1 + parseFloat(parseFloat(newData.sgstperc) / 100));
    newData['totalPrice'] = totalAmountData;
    newData['totalPriceWithGst'] = totalAmountWithGst;
    setFormDate(newData);
    return () => {
      return null;
    };
  }, [formData.qty, formData.discountPerc, formData.discountScheme, formData.prodPurchasePrice, formData.sgstperc]);

  let changeDataOnClick = (event) => {
    let objName = event.target.name;
    let objValue = event.target.value;
    // console.log(event.target);
    if (objName == 'qty' && rowData.pid && rowData.availableQty > objValue) {
      setAlertOpen({ openFlag: true, alertMsg: 'You can not reduce QTY less than ' + rowData.availableQty + ' QTY.', severity: 'error' });
    } else {
      let oldData = { ...formData };

      /*if (objName == 'qty') {
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
    } else { */
      oldData[objName] = objValue;
      // }
      setFormDate(oldData);
    }
  };
  // let setExpDateFunction = (date) => {
  //   // let newDate = new Date(date);
  //   // console.log(newDate);
  //   // let dd = '01';
  //   // let mm = newDate.getMonth() + 1;
  //   // // console.log(mm);
  //   // if (mm < 10) {
  //   //   mm = '0' + mm;
  //   // }
  //   let yy = newDate.getFullYear();
  //   let oldData = { ...formData };
  //   if (oldData['id'] == '') {
  //     oldData['id'] = rowData.id;
  //   } else {
  //     if (oldData['id'] != rowData.id) {
  //       oldData['id'] = rowData.id;
  //     }
  //   }
  //   // oldData['expDate'] = yy + '-' + mm + '-' + dd;
  //   setFormDate(oldData);
  // };
  // console.log(formData);
  const [prodSearch, setProdSearch] = useState([]);
  const [prodNameParm, setProdNameParm] = useState('');
  const vertical = 'top';
  const horizontal = 'center';
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

  const handleCloseSnackBar = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }

    setAlertOpen({ openFlag: false, alertMsg: '1', severity: 'error' });
  };
  let handleConfirm = () => {
    if (submitAlert.submitType == 'edit') {
      handleUpdate(formData);
    } else if (submitAlert.submitType == 'delete') {
      handleDelete(rowData.id);
    }
    handleCloseSubmitAlert();
  };
  let handleUpdateCheckAndConfirm = (submitType) => {
    if (submitType == 'DELETE') {
      setSubmitAlert({
        flag: true,
        title: 'Delete Product',
        msg: 'Are you sure? ',
        submitType: 'delete'
      });
    } else if (submitType == 'EDIT') {
      let editFlag = deepEqual(rowData, formData);
      if (!editFlag) {
        setSubmitAlert({
          flag: true,
          title: 'Edit Product',
          msg: 'Are you sure? ',
          submitType: 'edit'
        });
      }
    }
  };
  let handleCloseSubmitAlert = () => {
    setSubmitAlert({
      flag: false,
      title: '',
      msg: '',
      submitType: ''
    });
  };
  // console.log(formData.expDate);
  return (
    <>
      <Dialog open={submitAlert.flag} onClose={handleCloseSubmitAlert} aria-describedby="alert-dialog-slide-description">
        <DialogTitle>{submitAlert.title}</DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-slide-description">{submitAlert.msg}</DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleConfirm}>Confirm</Button>
          <Button onClick={handleCloseSubmitAlert}>Cancel</Button>
        </DialogActions>
      </Dialog>
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
            <Snackbar
              anchorOrigin={{ vertical, horizontal }}
              open={alertOpen.openFlag}
              autoHideDuration={6000}
              onClose={handleCloseSnackBar}
            >
              <Alert onClose={handleCloseSnackBar} severity={alertOpen.severity} variant="filled" sx={{ width: '100%' }}>
                {alertOpen.alertMsg}
              </Alert>
            </Snackbar>
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
              readOnly={rowData.pid ? true : false}
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

            {/* {formData.expDate} */}
            <LocalizationProvider dateAdapter={AdapterDayjs}>
              <DatePicker
                label="Exp. Date"
                fullWidth
                views={['year', 'month']}
                format="MMMM-YYYY"
                value={formData.expDate}
                name="expDate"
                onChange={(date, constext) => {
                  if (constext.validationError == null) {
                    setFormDate({ ...formData, expDate: date });
                  }
                }}
              />
            </LocalizationProvider>
            <TextField
              required
              margin="normal"
              id="name"
              name="qty"
              label="Product Quantity"
              type="text"
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
              type="text"
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
              type="text"
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
              type="text"
              fullWidth
              variant="outlined"
              value={formData.totalPrice > '0' ? formData.totalPrice : rowData.amount}
              disabled
            /> */}
            <Select
              labelId="sgstLavel"
              id="demo-simple-select-helper"
              value={formData.sgstperc}
              defaultValue={parseInt(rowData.sgstPerc) * 2}
              displayEmpty
              name="sgstperc"
              onChange={changeDataOnClick}
              // label="Select GST"
              // onChange={handleChange}
            >
              <MenuItem value="" disabled>
                <em>Select GST</em>
              </MenuItem>
              {gstPercArr.map((gstv) => (
                <MenuItem value={gstv}>GST {gstv}%</MenuItem>
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
              type="text"
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
              type="text"
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
              type="text"
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

          {rowData.pid ? (
            ''
          ) : (
            <>
              <Button variant="contained" color="success" onClick={() => handleUpdate(formData)}>
                Update
              </Button>
              <Button variant="contained" color="error" onClick={() => handleDelete(rowData.id)}>
                Delete
              </Button>
            </>
          )}
          {/* {rowData.pid && rowData.availableQty == rowData.qty ? (
            <>
              <Button variant="contained" color="success" onClick={() => handleUpdateCheckAndConfirm('EDIT')}>
                Update
              </Button>
              <Button variant="contained" color="error" onClick={() => handleUpdateCheckAndConfirm('DELETE')}>
                Delete
              </Button>
            </>
          ) : (
            <Button variant="contained" color="success" onClick={() => handleUpdateCheckAndConfirm('EDIT')}>
              Update
            </Button>
          )} */}
        </DialogActions>
      </Dialog>
    </>
  );
}
