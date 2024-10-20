// material-ui
import React from 'react';
import Avatar from '@mui/material/Avatar';
import AvatarGroup from '@mui/material/AvatarGroup';
import Button from '@mui/material/Button';
import Grid from '@mui/material/Grid';
import List from '@mui/material/List';
import ListItemAvatar from '@mui/material/ListItemAvatar';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemSecondaryAction from '@mui/material/ListItemSecondaryAction';
import ListItemText from '@mui/material/ListItemText';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';

// project import
import MainCard from 'components/MainCard';
import AnalyticEcommerce from 'components/cards/statistics/AnalyticEcommerce';
import MonthlyBarChart from '../dashboard/MonthlyBarChart';
import ReportAreaChart from '../dashboard/ReportAreaChart';
import UniqueVisitorCard from '../dashboard/UniqueVisitorCard';
import SaleReportCard from '../dashboard/SaleReportCard';
import OrdersTable from '../dashboard/OrdersTable';

// assets
import GiftOutlined from '@ant-design/icons/GiftOutlined';
import MessageOutlined from '@ant-design/icons/MessageOutlined';
import SettingOutlined from '@ant-design/icons/SettingOutlined';
import avatar1 from 'assets/images/users/avatar-1.png';
import avatar2 from 'assets/images/users/avatar-2.png';
import avatar3 from 'assets/images/users/avatar-3.png';
import avatar4 from 'assets/images/users/avatar-4.png';
import { Alert, ButtonGroup, FormControl, FormHelperText, Input, InputLabel, Snackbar, TextField, useTheme } from '@mui/material';
import getColors from 'utils/getColors';
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

export default function AddSupplier() {
  const [checkSupplierName, setCheckSupplierName] = useState(false);
  const [checkSupplierPhoneNo, setCheckSupplierPhoneNo] = useState(false);
  const [addSupplierData, setAddSupplierData] = useState({
    supplierName: '',
    supplierContactNo: '',
    supplierEmail: '',
    supplierAddress: ''
  });
  let onChangeData = (event) => {
    let eventName = event.target.name;
    let eventValue = event.target.value;
    let newArr = { ...addSupplierData };
    newArr[eventName] = eventValue;
    setAddSupplierData(newArr);
  };
  let addSupplierName = () => {
    let flag = 1;
    if (addSupplierData.supplierName == '') {
      setCheckSupplierName('Please enter supplier name.');
      flag = 0;
    }
    if (addSupplierData.supplierContactNo == '') {
      setCheckSupplierPhoneNo('Please enter phone number.');
      flag = 0;
    }
    if (flag) {
      client
        .post('/supplier', addSupplierData)
        .then((res) => {
          setAddSupplierData([]);
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
            Create New Supulier
          </Typography>
          <div>
            <TextField
              autoFocus
              error={checkSupplierName ? true : false}
              required
              margin="normal"
              id="supplierName"
              name="supplierName"
              label="Supplier Name"
              type="text"
              fullWidth
              variant="outlined"
              value={addSupplierData.supplierName}
              autoComplete="off"
              onChange={(event) => onChangeData(event)}
              onFocus={() => setCheckSupplierName('')}
            />
            <TextField
              error={checkSupplierPhoneNo ? true : false}
              required
              margin="normal"
              id="supplierContactNo"
              name="supplierContactNo"
              label="Mobile No."
              type="number"
              fullWidth
              variant="outlined"
              autoComplete="off"
              value={addSupplierData.supplierContactNo}
              onChange={(event) => onChangeData(event)}
              onFocus={() => setCheckSupplierPhoneNo('')}
            />
            <TextField
              margin="normal"
              id="supplierEmail"
              name="supplierEmail"
              label="Email"
              type="email"
              fullWidth
              variant="outlined"
              autoComplete="off"
              value={addSupplierData.supplierEmail}
              onChange={(event) => onChangeData(event)}
            />
            <TextField
              margin="normal"
              id="supplierAddress"
              name="supplierAddress"
              label="Address"
              type="text"
              fullWidth
              variant="outlined"
              autoComplete="off"
              value={addSupplierData.supplierAddress}
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
          <Button variant="contained" color="secondary" style={{ width: '100%', marginTop: '30px' }} onClick={addSupplierName}>
            Create Supplier
          </Button>
        </MainCard>
      </Grid>
    </Grid>
  );
}
