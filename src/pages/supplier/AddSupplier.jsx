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
import { ButtonGroup, FormControl, FormHelperText, Input, InputLabel, TextField, useTheme } from '@mui/material';
import getColors from 'utils/getColors';

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
  sales:{
    totalSale:250000,
    percentage: 29,
    extraSale:2000
  },
  stock:{
   expiredProducts: 299,
   expiryDate: 2024-10, 
  },
  customer:{
    totalCustomer:280,
    totalCreditInMarket:29000,
  },
  purchaseOrder:{
    totalOrders: 188
  },
  supplier:{
    totalDue:19999,
    totalSuppliers:6
  }

}

// ==============================|| DASHBOARD - DEFAULT ||============================== //

export default function AddSupplier() {


  return (
    <Grid container rowSpacing={4.5} columnSpacing={2.75}>    
      <Grid item md={8} sx={{ display: { sm: 'none', md: 'block', lg: 'none' } }} />
      <Grid item xs={12} md={12} lg={12}>

        <Grid item />
        <MainCard sx={{ ml: '15%',mr:'15%',p:'5% 10%' }} content={false}>
        <Typography variant='h4' style={{marginBottom:10}}>Create New Customer</Typography>
        <div>
        <TextField
            autoFocus
            required
            margin="normal"
            id="name"
            name="email"
            label="Supplier Name"
            type="text"
            fullWidth
            variant="standard"
          />
                  <TextField
            autoFocus
            required
            margin="normal"
            id="name"
            name="email"
            label="Mobile No."
            type="number"
            fullWidth 
            variant="standard"
          />
                            <TextField
            autoFocus
            margin="normal"
            id="name"
            name="email"
            label="Email"
            type="email"
            fullWidth
            variant="standard"
          />
        <TextField
            autoFocus
            margin="normal"
            id="name"
            name="email"
            label="Address"
            type="text"
            fullWidth
            variant="standard"
          />
                  <TextField
            autoFocus
            required
            margin="normal"
            id="name"
            name="email"
            label="Total Credit Amount"
            type="number"
            fullWidth
            variant="standard"
          />
        </div>
        <Button variant='contained' color='secondary' style={{width:'100%',marginTop:"30px"}}>Create Customer</Button>
        </MainCard>
      </Grid>
    </Grid>
  );
}
