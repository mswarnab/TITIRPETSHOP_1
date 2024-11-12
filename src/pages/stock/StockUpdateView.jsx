import React, { useEffect, useState } from 'react';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import { Autocomplete, Divider, MenuItem, Select, Slide, Stack } from '@mui/material';
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
    totalPriceWithGst: ''
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
      totalPriceWithGst: rowData.amountWithgst
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
    // if (oldData['id'] == '') {
    //   oldData['id'] = rowData.id;
    // } else {
    //   if (oldData['id'] != rowData.id) {
    //     oldData['id'] = rowData.id;
    //   }
    // }

    // if (oldData['prodPurchasePrice'] == '') {
    //   oldData['prodPurchasePrice'] = rowData.purchaseRate;
    // }
    // if (oldData['sgstperc'] <= 0) {
    //   alert('here');
    //   oldData['sgstperc'] = rowData.sgstPerc;
    // }
    // if (oldData['cgstPerc'] <= 0) {
    //   oldData['cgstPerc'] = rowData.cgstPerc;
    // }
    // if (oldData['qty'] == '') {
    //   oldData['qty'] = rowData.qty;
    // }

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
      if (objValue > 0) {
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
      oldData[objName] = objValue;
      let newTotalPrice = oldData['totalPrice'];
      let newTotalPriceWithGst =
        parseFloat(newTotalPrice) + parseFloat(newTotalPrice * objValue) / 100 + parseFloat(newTotalPrice * oldData['cgstPerc']) / 100;
      // oldData['totalPrice']=newTotalPrice;
      oldData['totalPriceWithGst'] = newTotalPriceWithGst.toFixed(2);
    } else if (objName == 'cgstPerc') {
      oldData[objName] = objValue;
      let newTotalPrice = oldData['totalPrice'];
      let newTotalPriceWithGst =
        parseFloat(newTotalPrice) + parseFloat(newTotalPrice * oldData['sgstperc']) / 100 + parseFloat(newTotalPrice * objValue) / 100;
      // oldData['totalPrice']=newTotalPrice;
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
        <DialogTitle variant="h4" style={{ padding: '40px 40px', paddingBottom: '30px' }}>
          Update Stock
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

            <TextField
              margin="normal"
              id="prodBatch"
              name="mfr"
              label="Mfr"
              type="text"
              fullWidth
              variant="outlined"
              value={formData.mfr}
              onChange={changeDataOnClick}
            />
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
            <TextField
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
            />
            <Select
              labelId="sgstLavel"
              id="demo-simple-select-helper"
              value={formData.sgstperc}
              defaultValue={rowData.sgstPerc}
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
            <Select
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
              </MenuItem>
              {gstPercArr.map((gstv) => (
                <MenuItem value={gstv}>CGST {gstv}%</MenuItem>
              ))}
              {/* <MenuItem value={0}>CGST 0%</MenuItem>
              <MenuItem value={5}>CGST 5%</MenuItem>
              <MenuItem value={12}>CGST 12%</MenuItem>
              <MenuItem value={18}>CGST 18%</MenuItem> */}
            </Select>
            <TextField
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
