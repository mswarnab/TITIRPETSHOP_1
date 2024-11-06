// material-ui
import React, { useEffect, useState } from 'react';
import Avatar from '@mui/material/Avatar';
import AvatarGroup from '@mui/material/AvatarGroup';
import Button from '@mui/material/Button';
import Grid from '@mui/material/Grid';

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
import {
  ButtonGroup,
  Chip,
  Divider,
  FormControl,
  FormControlLabel,
  FormHelperText,
  Input,
  InputLabel,
  Stack,
  Switch,
  TextField,
  useTheme
} from '@mui/material';
import getColors from 'utils/getColors';
import { DatePicker, LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import dayjs from 'dayjs';
import FullScreenDialog from 'components/FullScreenModal';
import OnSearchItemBox from 'components/OnSearchItemBox';

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

export default function AddSale() {
  const [open, setOpen] = useState(false);
  const [addedProduct, setAddedProduct] = useState([]);
  const [fullPaid, setFullPaid] = useState(false);
  const [customerAddress, setCustomerAddress] = useState('');
  const [customerPhoneNumber, setCustomerPhoneNumber] = useState('');
  const [billDtls, setBillDtls] = useState({
    billNumber: '',
    customerName: '',
    customerId: '',
    billDate: '',
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
    console.log(quantityArray);
    console.log(selectedProducts);
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
          rate: e.rate,
          expDate: dayjs(e.expDate).format('YYYY-MM-DD'),
          sellingPrice: sellingPrice
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
      let totalBillAmount = 0;
      addedProduct.map((e) => {
        totalBillAmount += parseFloat(e.quantity * e.sellingPrice);
      });
      newArr.billTotalAmount = totalBillAmount;
      if (fullPaid) {
        newArr.billPaidAmount = totalBillAmount;
        newArr.billDueAmount = 0;
      } else {
        newArr.billPaidAmount = 0;
        newArr.billDueAmount = totalBillAmount;
      }
    } else {
      newArr.billPaidAmount = 0;
      newArr.billDueAmount = 0;
      newArr.billTotalAmount = 0;
    }
    setBillDtls(newArr);
  }, [addedProduct]);
  let handleChangeBillDtls = (event) => {
    // console.log(event);
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
  return (
    <Grid container rowSpacing={4.5} columnSpacing={2.75}>
      {console.log(billDtls)}
      <Grid item md={8} sx={{ display: { sm: 'none', md: 'block', lg: 'none' } }} />
      <Grid item xs={12} md={12} lg={12}>
        <Grid item />
        <MainCard sx={{ ml: '15%', mr: '15%', p: '5% 10%' }} content={false}>
          <Stack direction="row" style={{ display: 'flex', justifyContent: 'space-between' }}>
            <Typography variant="h4" style={{ marginBottom: 10 }}>
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
              variant="outlined"
              value={billDtls.billNumber}
              onChange={handleChangeBillDtls}
            />
            <TextField
              required
              id="customerName"
              name="customerName"
              label="Customer Name"
              type="text"
              fullWidth
              variant="outlined"
              value={billDtls.customerName}
              onChange={handleChangeBillDtls}
            />
            <TextField
              required={billDtls.customerName != '' && billDtls.customerId == '' && billDtls.billDueAmount != 0 ? true : false}
              disabled={billDtls.customerName != '' && billDtls.customerId == '' && billDtls.billDueAmount != 0 ? false : true}
              id="customerPhoneNumber"
              name="customerPhoneNumber"
              label="Customer PH No."
              value={customerPhoneNumber}
              type="text"
              fullWidth
              variant="outlined"
            />
            <TextField
              required={billDtls.customerName != '' && billDtls.customerId == '' && billDtls.billDueAmount != 0 ? true : false}
              disabled={billDtls.customerName != '' && billDtls.customerId == '' && billDtls.billDueAmount != 0 ? false : true}
              id="customerAddress"
              name="customerAddress"
              label="Customer Address"
              value={customerAddress}
              type="text"
              fullWidth
              variant="outlined"
            />
            <LocalizationProvider dateAdapter={AdapterDayjs}>
              <DatePicker
                required
                label="Bill Date"
                fullWidth
                // views={['year', 'month']}
                name="billDate"
                // value={dayjs(billDtls.billDate).format('MM/DD/YYYY')}
                defaultValue={dayjs()}
                onChange={(date) => handleChangeBillDate(date)}
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
              disabled
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
              disabled
            />
          </Stack>
          <Button variant="contained" color="secondary" style={{ width: '100%', marginTop: '30px' }} onClick={() => setOpen(true)}>
            Add Items
          </Button>
          {addedProduct?.length ? (
            <Divider textAlign="left" style={{ margin: '20px 0px 20px 0px' }}>
              <Chip label="Selected Products" size="small" />
            </Divider>
          ) : (
            ''
          )}
          {addedProduct.map((e) => (
            <OnSearchItemBox result={true} selected={true} added={true} data={e} onDelete={handleSelectedProductDelete} />
          ))}
        </MainCard>
      </Grid>
      <FullScreenDialog open={open} handleClose={handleClose} handleAddItemSale={handleAddItemSale} selectedLots={addedProduct} />
    </Grid>
  );
}
