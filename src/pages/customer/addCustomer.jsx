// material-ui
import React from 'react';
import Button from '@mui/material/Button';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';

// project import
import MainCard from 'components/MainCard';
import { Alert, Snackbar, TextField } from '@mui/material';
import { useState } from 'react';
import { client } from 'api/client';

// avatar style
const avatarSX = {
  width: 36,
  height: 36,
  fontSize: '1rem'
};

// action style
const actionSX = {
  mt: 0.75,
  ml: 1,
  top: 'auto',
  right: 'auto',
  alignSelf: 'flex-start',
  transform: 'none'
};

const data = {
  sales: {
    totalSale: 250000,
    percentage: 29,
    extraSale: 2000
  },
  stock: {
    expiredProducts: 299,
    expiryDate: 2024 - 10
  },
  customer: {
    totalCustomer: 280,
    totalCreditInMarket: 29000
  },
  purchaseOrder: {
    totalOrders: 188
  },
  supplier: {
    totalDue: 19999,
    totalSuppliers: 6
  }
};

// ==============================|| DASHBOARD - DEFAULT ||============================== //

export default function AddCustomer() {
  const [checkCustomerName, setCheckCustomerName] = useState(false);
  const [checkCustomerPhoneNo, setCheckCustomerPhoneNo] = useState(false);
  const [addCustomerData, setAddCustomerData] = useState({
    customerName: '',
    customerContactNo: '',
    customerEmail: '',
    customerAddress: ''
  });
  let onChangeData = (event) => {
    let eventName = event.target.name;
    let eventValue = event.target.value;
    let newArr = { ...addCustomerData };
    newArr[eventName] = eventValue;
    setAddCustomerData(newArr);
  };
  let addCustomerName = () => {
    let flag = 1;
    if (addCustomerData.customerName == '') {
      setCheckCustomerName('Please enter customer name.');
      flag = 0;
    }
    if (addCustomerData.customerContactNo == '') {
      setCheckCustomerPhoneNo('Please enter phone number.');
      flag = 0;
    }
    if (flag) {
      client
        .post('/customer', addCustomerData)
        .then((res) => {
          // setAddCustomerData([]);
          // console.log(res);
          setError({ err: false, message: res.data.message });
        })
        .catch((err) => setError({ err: true, message: err.response.data.errorMessage }));
    }
  };
  const [error, setError] = React.useState('');
  let handleCloseSnackBar = () => {
    setError('');
  };
  let vertical = 'top';
  let horizontal = 'center';
  return (
    <Grid container rowSpacing={4.5} columnSpacing={2.75}>
      <Grid item md={8} sx={{ display: { sm: 'none', md: 'block', lg: 'none' } }} />
      <Grid item xs={12} md={12} lg={12}>
        <Grid item />
        <MainCard sx={{ ml: '15%', mr: '15%', p: '5% 10%' }} content={false}>
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
          <Typography variant="h4" style={{ marginBottom: 10 }}>
            Create New Customer
          </Typography>
          <div>
            <TextField
              autoFocus
              error={checkCustomerName ? true : false}
              required
              margin="normal"
              id="customerName"
              name="customerName"
              label="Customer Name"
              type="text"
              fullWidth
              variant="outlined"
              value={addCustomerData.customerName}
              autoComplete="off"
              onChange={(event) => onChangeData(event)}
              onFocus={() => setCheckCustomerName('')}
            />
            <TextField
              error={checkCustomerPhoneNo ? true : false}
              required
              margin="normal"
              id="customerContactNo"
              name="customerContactNo"
              label="Mobile No."
              type="number"
              fullWidth
              variant="outlined"
              autoComplete="off"
              value={addCustomerData.customerContactNo}
              onChange={(event) => onChangeData(event)}
              onFocus={() => setCheckCustomerPhoneNo('')}
            />
            <TextField
              margin="normal"
              id="customerEmail"
              name="customerEmail"
              label="Email"
              type="email"
              fullWidth
              variant="outlined"
              autoComplete="off"
              value={addCustomerData.customerEmail}
              onChange={(event) => onChangeData(event)}
            />
            <TextField
              margin="normal"
              id="customerAddress"
              name="customerAddress"
              label="Address"
              type="text"
              fullWidth
              variant="outlined"
              autoComplete="off"
              value={addCustomerData.customerAddress}
              onChange={(event) => onChangeData(event)}
            />
            {/* <TextField
              margin="normal"
              id="name"
              name="email"
              label="Total Credit Amount"
              type="number"
              fullWidth
              variant="outlined"
              autoComplete="off"
              value={supplierTotalCredit}
              onChange={(event) => setSupplierTotalCredit(event.target.value)}
            /> */}
          </div>
          <Button variant="contained" color="secondary" style={{ width: '100%', marginTop: '30px' }} onClick={addCustomerName}>
            Create Customer
          </Button>
        </MainCard>
      </Grid>
    </Grid>
  );
}
