// material-ui
import React, { useEffect, useState } from 'react';
import Button from '@mui/material/Button';
import Grid from '@mui/material/Grid';

import Typography from '@mui/material/Typography';

// project import
import MainCard from 'components/MainCard';

import { Alert, Autocomplete, Chip, Divider, FormControlLabel, IconButton, Snackbar, Stack, Switch, TextField } from '@mui/material';
import { DatePicker, LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import dayjs from 'dayjs';
import FullScreenDialog from 'components/FullScreenModal';
import OnSearchItemBox from 'components/OnSearchItemBox';
import { client } from 'api/client';
import LottieAnimation from 'components/loaderDog';
import { PlusCircleOutlined } from '@ant-design/icons';

// ==============================|| DASHBOARD - DEFAULT ||============================== //

export default function AddSale() {
  const [open, setOpen] = useState(false);
  const [addedProduct, setAddedProduct] = useState([]);
  const [fullPaid, setFullPaid] = useState(false);
  const [customerAddress, setCustomerAddress] = useState('');
  const [customerPhoneNumber, setCustomerPhoneNumber] = useState('');
  const [customerPrevDueAmount, setCustomerPrevDueAmount] = useState(0);
  const [saleId, setSaleId] = useState(window.location.href.split('/')[window.location.href.split('/').length - 1]);
  const [error, setError] = useState('');
  const [productId, setProductId] = useState('');
  const [quantity, setQuantity] = useState(0);
  const [sellingPrice, setSellingPrice] = useState(0);
  const [stockData, setStockData] = useState({});

  const [billDtls, setBillDtls] = useState({
    billNumber: '',
    customerName: '',
    customerId: '',
    billDate: null,
    dueDate: '',
    billPaidAmount: 0,
    billDueAmount: 0,
    billTotalAmount: 0
  });

  const handleClose = () => {
    setOpen(false);
  };
  const handleSelectedProductDelete = (id) => {
    const newArray = addedProduct.filter((e) => e._id != id);
    setAddedProduct(newArray);
  };
  const handleAddItemSale = (selectedProducts, quantityArray, sellingPrice) => {
    // console.log(quantityArray);
    // console.log(selectedProducts);
    let newDataArr = [...addedProduct];
    selectedProducts.map((e, i) => {
      if (quantityArray.find((el) => e._id == el._id)) {
        let newDataArray = {
          _id: e._id,
          productName: e.productName,
          quantity: quantityArray[i].quantity,
          sgst: e.sgst,
          cgst: e.cgst,
          mrp: e.mrp,
          purchasePrice: e.purchasePrice,
          expDate: dayjs(e.expDate).format('YYYY-MM-DD'),
          sellingPrice: parseFloat(parseInt(sellingPrice) / quantityArray[i].quantity).toFixed(2),
          productId: e._id,
          totalSellingPrice: sellingPrice
        };
        newDataArr = [...newDataArr, newDataArray];
      }
    });
    setAddedProduct(newDataArr);
    handleClose();
  };
  useEffect(() => {
    let newArr = { ...billDtls };

    if (addedProduct?.length) {
      // console.log(billDtls.billPaidAmount);
      let totalBillAmount = 0;
      addedProduct.map((e) => {
        totalBillAmount += parseFloat(e.quantity * e.sellingPrice);
      });
      newArr.billTotalAmount = totalBillAmount.toFixed(2);
      if (fullPaid) {
        newArr.billPaidAmount = totalBillAmount;
        newArr.billDueAmount = 0;
      } else {
        // newArr.billPaidAmount = 0;
        newArr.billDueAmount = parseFloat(totalBillAmount - newArr.billPaidAmount).toFixed(2);
      }
    } else {
      newArr.billPaidAmount = 0;
      newArr.billDueAmount = 0;
      newArr.billTotalAmount = 0;
    }
    setBillDtls(newArr);
  }, [addedProduct, billDtls.billPaidAmount]);
  // console.log(billDtls);
  useEffect(() => {
    // console.log(saleId);
    if (!saleId) {
      // console.log('here1');
      return undefined;
    } else if (saleId === 'add') {
      return undefined;
    }

    client
      .get('/sales/' + saleId)
      .then((res) => {
        // console.log('hello1');
        const data = res.data.result.result;
        if (data) {
          setBillDtls({
            billNumber: data.billNumber,
            customerName: data.customerName,
            customerId: data.customerId,
            billDate: dayjs(data.dateOfSale),
            dueDate: dayjs(data.dueDate),
            billPaidAmount: parseFloat(data.paidAmount).toFixed(2),
            billDueAmount: parseFloat(data.grandTotalAmount - data.paidAmount).toFixed(2),
            billTotalAmount: parseFloat(data.grandTotalAmount).toFixed(2)
          });
          if (data.products && data.products.length) {
            let prodArr = [];
            data.products.map((e) => {
              let newDataArray = {
                _id: e._id,
                productName: e.productName,
                quantity: e.quantity,
                sgst: 0,
                cgst: 0,
                mrp: e.mrp,
                purchasePrice: e.purchasePriceWithGst,
                expDate: '',
                sellingPrice: e.sellingPrice,
                productId: e.productId,
                productMFR: e.mfrCode,
                totalSellingPrice: e.quantity * e.sellingPrice
              };
              prodArr = [...prodArr, newDataArray];
            });
            setAddedProduct(prodArr);
          }
        }
        // console.log(data);
      })
      .catch((err) => {
        // console.log('here2');
        // setBillDtls({
        //   billNumber: '',
        //   customerName: '',
        //   customerId: '',
        //   billDate: null,
        //   dueDate: '',
        //   billPaidAmount: 0,
        //   billDueAmount: 0,
        //   billTotalAmount: 0
        // });
      });
  }, []);
  // console.log(billDtls);
  let handleChangeBillDtls = (event) => {
    // console.log(event.target);
    let eventName = event.target.name;
    let eventValue = event.target.value;
    let newArr = { ...billDtls };
    newArr[eventName] = eventValue;
    setBillDtls(newArr);
  };
  let handleChangeFullPaid = () => {
    // console.log(billDtls);
    let newArr = { ...billDtls };
    if (!fullPaid) {
      newArr.billDueAmount = 0;
      newArr.billPaidAmount = billDtls.billTotalAmount;
    } else {
      newArr.billDueAmount = billDtls.billTotalAmount;
      newArr.billPaidAmount = 0;
    }
    setBillDtls(newArr);
    setFullPaid(!fullPaid);
  };
  let handleChangeBillDate = (data) => {
    let newArr = { ...billDtls };
    newArr.billDate = dayjs(data).format('YYYYMMDD');
    setBillDtls(newArr);
  };
  let handleChangeDueDate = (data) => {
    let newArr = { ...billDtls };
    newArr.dueDate = dayjs(data).format('YYYYMMDD');
    setBillDtls(newArr);
  };
  let [customerSearch, setCustomerSearch] = React.useState([]);
  const [customerSearchParm, setCustomerSearchParm] = useState('');
  useEffect(() => {
    (async () => {
      const getData = setTimeout(async () => {
        // console.log(supplierName);
        let strLength = customerSearchParm.length;
        // console.log(strLength);
        if (strLength >= 3) {
          // alert(strLength);
          client
            .get('/customer/search', {
              params: { pattern: customerSearchParm }
            })
            .then((res) => {
              // console.log(res.data.result.result);
              // setSupplierSearch([]);
              let top100Films = [];
              let dataResultArr = res.data.result.result;
              dataResultArr.forEach((element) => {
                // console.log(element.customerContactNo);
                top100Films = [
                  ...top100Films,
                  {
                    customerContactNo: element.customerContactNo,
                    customerName: element.customerName,
                    id: element._id,
                    prevDue: element.totalCreditAmount
                  }
                ];
              });
              // if (!top100Films.length) {
              //   top100Films = [
              //     {
              //       customerName: 'NO DATA FOUND'
              //     }
              //   ];
              // }
              setCustomerSearch(top100Films);
            })
            .catch(() => {
              // let top100Films = [
              //   {
              //     customerName: 'NO DATA FOUND'
              //   }
              // ];
              // setCustomerSearch(top100Films);
            });
        }
      }, 300);
      return () => clearTimeout(getData);
    })();
  }, [customerSearchParm]);
  let changeCustomerId = (e) => {
    let name = e;
    // console.log(name);
    let split_name = name.split('--');
    //console.log(split_name);
    let custName = split_name[0];
    let phNo = split_name[1];
    //console.log(name + '----' + supName + '----' + phNo);
    customerSearch.forEach((value) => {
      if (value.customerName == custName && value.customerContactNo == phNo) {
        let newArr = { ...billDtls };
        newArr.customerId = value.id;
        newArr.customerName = e;
        // setSupplierId(value.id);
        setCustomerPhoneNumber(value.customerContactNo);
        setCustomerPrevDueAmount(value.prevDue);
        setBillDtls(newArr);
      }
    });
  };

  let onloader = () => {
    setLoading(true);
  };
  let offloader = () => {
    setLoading(false);
  };
  let submitSaleBill = async () => {
    let msg = '';
    if (billDtls.billDueAmount > 0) {
      if (billDtls.customerName == '' && billDtls.customerId == '') {
        msg = 'Please enter customer name.';
      } else if (customerPhoneNumber == '' && billDtls.customerId == '') {
        msg = 'Please enter customer contact number.';
      } else if (customerPhoneNumber.length < 10 && billDtls.customerId == '') {
        msg = 'Please enter 10 digit contact number';
      } else if (isNaN(customerPhoneNumber) && billDtls.customerId == '') {
        msg = 'Contact number must be number.';
      } else if (customerAddress == '' && billDtls.customerId == '') {
        msg = 'Please enter customer address.';
      }
    } else if (addedProduct?.length == 0) {
      msg = 'Please atleast sale one item.';
    }
    if (msg == '') {
      // console.log(billDtls);
      let customerNameSplit = billDtls.customerName.split('--');
      let dueDate = billDtls.dueDate ? dayjs(billDtls.dueDate).format('YYYYMMDD') : dayjs(billDtls.billDate).format('YYYYMMDD');
      // addedProduct.map()
      // addedProduct._id(productId);
      let postData = {
        billNumber: billDtls.billNumber,
        customerId: billDtls.customerId,
        customerMobileNo: customerPhoneNumber,
        customerName: customerNameSplit[0],
        customerAddress: customerAddress,
        dateOfSale: dayjs(billDtls.billDate).format('YYYYMMDD'),
        products: addedProduct,
        cgst: '0',
        sgst: '0',
        paidAmount: billDtls.billPaidAmount || 0,
        dueDate: dueDate
      };
      // console.log(postData);
      onloader();
      if (saleId != 'add') {
        await client
          .delete('/sales/' + saleId)
          .then((res) => {
            setError({ error: false, message: res.data.message });
            handleClose();
          })
          .catch((err) => setError({ err: true, message: err.response.data.errorMessage }));
      }

      await client
        .post('/sales', postData)
        .then((res) => {
          setAddedProduct([]);
          setBillDtls({
            billNumber: '',
            customerName: '',
            customerId: '',
            billDate: dayjs(),
            dueDate: '',
            billPaidAmount: 0,
            billDueAmount: 0,
            billTotalAmount: 0
          });
          setError({ err: false, message: res.data.message });
          window.close();
        })
        .catch((err) => {
          setError({ err: true, message: err.response.data.errorMessage });
        })
        .finally(() => offloader());
    } else {
      setError({ err: true, message: msg });
      offloader();
    }
  };
  const handleAddItem = () => {
    if (addedProduct.find((e) => e.productId == productId)) {
      return setError({ err: true, message: 'SAME PRODUCT ALREADY ADDED IN THE BILL' });
    }
    client
      .get('/stock/productid/' + encodeURIComponent(productId))
      .then((res) => {
        if (!res.data.result.count) {
          return setError({ err: true, message: 'STOCK NOT FOUND' });
        }
        const product = res.data.result.result;
        if (quantity > product.quantity) {
          return setError({ err: true, message: 'ENTERED QUANTITY NOT AVAILABLE - AVAILABLE QUANTITY IS: ' + product.quantity });
        }

        const productObject = {
          _id: product._id,
          productName: product.productName,
          quantity,
          sgst: product.sgst,
          cgst: product.cgst,
          mrp: product.mrp,
          purchasePrice: product.purchasePrice,
          expDate: dayjs(product.expDate).format('YYYY-MM-DD'),
          sellingPrice: parseFloat(parseInt(sellingPrice) / quantity).toFixed(2),
          productId: product._id,
          productMFR: product.mfrCode,
          totalSellingPrice: parseFloat(sellingPrice).toFixed(2)
        };
        setAddedProduct([...addedProduct, productObject]);
      })
      .catch((err) => setError({ err: true, message: 'STOCK NOT FOUND' }));
  };

  const handleCloseSnackBar = () => {
    setError('');
  };
  let vertical = 'top';
  let horizontal = 'center';
  const [loading, setLoading] = useState(false);
  // console.log(rows);
  if (loading) {
    return <LottieAnimation />;
  }
  return (
    <Grid container rowSpacing={4.5} columnSpacing={2.75}>
      {/* {console.log(billDtls)} */}
      {/* {console.log(billDtls)} */}
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
      {/* {console.log(billDtls)} */}
      <Grid item md={8} sx={{ display: { sm: 'none', md: 'block', lg: 'none' } }} />
      <Grid item xs={12} md={12} lg={12}>
        <Grid item />
        <MainCard sx={{ ml: '15%', mr: '15%', p: '5% 10%' }} content={false}>
          <Stack direction="row" style={{ display: 'flex', justifyContent: 'space-between' }}>
            <Typography variant="h4" style={{ marginBottom: 20 }}>
              Create New Selling Bill
            </Typography>
            <FormControlLabel control={<Switch checked={fullPaid} onChange={handleChangeFullPaid} name="fullPaid" />} label="Full Paid" />
            {/* <Typography>Full paid</Typography> */}
          </Stack>

          <Stack spacing={2}>
            <TextField
              autoFocus
              required
              id="billNumber"
              name="billNumber"
              label="Bill Number"
              type="text"
              fullWidth
              // disabled={saleId ? 'true' : 'false'}
              readOnly={saleId ? true : false}
              variant="outlined"
              value={billDtls.billNumber}
              onChange={saleId != 'add' ? null : handleChangeBillDtls}
            />
            <Autocomplete
              id="free-solo-demo"
              freeSolo
              options={customerSearch.map((option) => option.customerName + '--' + option.customerContactNo)}
              value={billDtls.customerName}
              name="customerName"
              disableClearable={true}
              // readOnly={saleId ? 'true' : 'false'}
              size="small"
              renderInput={(params) => (
                <TextField
                  {...params}
                  label="Customer Name / Mobile No .Search"
                  variant="outlined"
                  fullWidth
                  autoComplete="off"
                  onChange={(event) => {
                    //console.log('name : ' + value);
                    // setSupplierName(event.target.value);
                    // handleChangeBillDtls(event);
                    setCustomerPhoneNumber('');
                    setCustomerAddress('');
                    setBillDtls({ ...billDtls, customerId: '', customerName: event.target.value });
                  }}
                  onKeyUp={(event) => setCustomerSearchParm(event.target.value)}
                />
              )}
              onChange={(event, value) => {
                // console.log('name : ' + value);
                // setSupplierName(value);
                // handleChangeBillDtls(event);
                // let newArr = { ...billDtls, customerName: value };
                // console.log('hello');
                // setBillDtls({ ...billDtls, customerName: value });
                changeCustomerId(value);
              }}
            />
            {/* <TextField
              required
              id="customerName"
              name="customerName"
              label="Customer Name"
              type="text"
              fullWidth
              variant="outlined"
              value={billDtls.customerName}
              onChange={handleChangeBillDtls}
            /> */}
            {/* {console.log(billDtls.customerId)} */}
            <TextField
              required={billDtls.customerName != '' && billDtls.customerId == '' && billDtls.billDueAmount != 0 ? true : false}
              disabled={billDtls.customerId?.length || false}
              id="customerPhoneNumber"
              name="customerPhoneNumber"
              label="Customer PH No."
              value={customerPhoneNumber}
              type="text"
              fullWidth
              variant="outlined"
              onChange={(event) => setCustomerPhoneNumber(event.target.value)}
            />
            <TextField
              required={billDtls.customerName != '' && billDtls.customerId == '' && billDtls.billDueAmount != 0 ? true : false}
              disabled={billDtls.customerId?.length || false}
              id="customerAddress"
              name="customerAddress"
              label="Customer Address"
              value={customerAddress}
              // readOnly={saleId ? 'true' : 'false'}

              type="text"
              fullWidth
              variant="outlined"
              onChange={(event) => setCustomerAddress(event.target.value)}
            />
            <LocalizationProvider dateAdapter={AdapterDayjs}>
              <DatePicker
                required
                label="Bill Date"
                fullWidth
                format="DD-MM-YYYY"
                // readOnly={saleId ? 'true' : 'false'}
                // views={['year', 'month']}
                name="billDate"
                value={billDtls.billDate}
                // value={dayjs(billDtls.billDate).format('MM/DD/YYYY')}
                // defaultValue={dayjs()}
                onChange={(date, constext) => {
                  if (constext.validationError == null) {
                    setBillDtls({ ...billDtls, billDate: date });
                  }
                }}
              />
            </LocalizationProvider>
            <TextField
              required
              id="billPaidAmount"
              name="billPaidAmount"
              value={billDtls.billPaidAmount}
              label="Amount Paid"
              type="text"
              fullWidth
              variant="outlined"
              onChange={handleChangeBillDtls}
              disabled={fullPaid ? true : false}
            />
            <LocalizationProvider dateAdapter={AdapterDayjs}>
              <DatePicker
                label="Due Date"
                fullWidth
                views={['year', 'month']}
                name="dueDate"
                readOnly={saleId ? true : false}
                // value={} dayjs(prodExpDate)
                // defaultValue={}
                onChange={(date) => handleChangeDueDate(date)}
                disabled={billDtls.billPaidAmount == billDtls.billTotalAmount ? true : false}
              />
            </LocalizationProvider>
            <TextField
              required
              id="name"
              name="billTotalAmount"
              value={billDtls.billTotalAmount}
              label="Total Amount"
              type="text"
              fullWidth
              variant="outlined"
              readOnly
            />
            <TextField
              required
              id="name"
              name="billDueAmountPrev"
              label="Previous Due"
              value={customerPrevDueAmount}
              type="text"
              fullWidth
              variant="outlined"
              readOnly
            />
            <TextField
              required
              id="name"
              name="billDueAmount"
              label="Amount Due"
              value={billDtls.billDueAmount}
              type="text"
              fullWidth
              variant="outlined"
              readOnly
            />
          </Stack>

          <Grid
            container
            sx={{ pb: 5, mt: 1.5, borderTop: '1px solid #cccccc', borderBottom: '1px solid #cccccc', borderRadius: 2 }}
            justifyContent={'space-between'}
            alignItems={'center'}
            padding={'0px 10px 10px 10px'}
          >
            <Grid container mb={4} mt={3}>
              <Typography variant="h5">Add Items using Product ID</Typography>
            </Grid>
            <TextField
              required
              id="productId"
              name="productId"
              label="PRODUCT ID"
              sx={{ width: 300 }}
              value={productId}
              type="text"
              variant="outlined"
              onChange={(event) => setProductId(event.target.value)}
            />{' '}
            <TextField
              required
              id="productId"
              name="productId"
              label="QTY"
              sx={{ width: 80 }}
              value={quantity}
              type="text"
              variant="outlined"
              onChange={(event) => {
                if (/^-?\d*\.?\d*$/.test(event.target.value)) {
                  setQuantity(event.target.value);
                }
              }}
            />{' '}
            <TextField
              required
              id="productId"
              name="productId"
              label="SELLING PRICE"
              sx={{ width: 150 }}
              value={sellingPrice}
              type="text"
              variant="outlined"
              onChange={(event) => {
                if (/^-?\d*\.?\d*$/.test(event.target.value)) {
                  setSellingPrice(event.target.value);
                }
              }}
            />{' '}
            <IconButton onClick={handleAddItem}>
              <PlusCircleOutlined style={{ fontSize: 30, color: 'cornflowerblue' }} />
            </IconButton>
          </Grid>

          {addedProduct?.length ? (
            <Divider textAlign="center" style={{ margin: '20px 0px 20px 0px' }}>
              <Chip label="Selected Products" size="small" />
            </Divider>
          ) : (
            ''
          )}
          {addedProduct.map((e) => {
            // console.log(e);
            return <OnSearchItemBox result={true} selected={true} added={true} data={e} onDelete={handleSelectedProductDelete} />;
          })}
          <Stack direction="row" spacing={2}>
            <Button variant="contained" color="secondary" style={{ width: '100%', marginTop: '30px' }} onClick={() => setOpen(true)}>
              Add Items
            </Button>
            <Button variant="contained" color="secondary" style={{ width: '100%', marginTop: '30px' }} onClick={() => submitSaleBill()}>
              Submit
            </Button>
          </Stack>
        </MainCard>
      </Grid>
      <FullScreenDialog open={open} handleClose={handleClose} handleAddItemSale={handleAddItemSale} selectedLots={addedProduct} />
    </Grid>
  );
}
