// material-ui
import React, { useEffect, useState } from 'react';
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
import { ButtonGroup, useTheme } from '@mui/material';
import CustomerTable from 'pages/dashboard/CustomerTable';
import getColors from 'utils/getColors';
import axios from 'axios';
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
// let id = 0;
function createData(id, customerName, mobileNo, address, totalDue, custId) {
  // id = id + 1;
  return { id, customerName, mobileNo, address, totalDue, custId };
}

// ==============================|| DASHBOARD - DEFAULT ||============================== //

export default function ManageCustomer() {
  let pageSize = 20;
  // let paginationCount = (50/;
  const [open, setOpen] = useState(false);
  const [selectedDate, setSelectedData] = useState([]);
  const handleClickOpen = (value) => {
    console.log(value);
    setSelectedData(value.row);
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const columns = [
    { field: 'id', headerName: 'Sl No.', width: 100, headerClassName: 'super-app-theme--header', headerAlign: 'center' },
    { field: 'customerName', headerName: 'Customer Name', width: 300, headerClassName: 'super-app-theme--header', headerAlign: 'center' },
    { field: 'mobileNo', headerName: 'Mobile No', width: 250, headerClassName: 'super-app-theme--header', headerAlign: 'center' },
    {
      field: 'address',
      headerName: 'Address',
      headerClassName: 'super-app-theme--header',
      headerAlign: 'center',
      //   type: 'number',
      width: 360
    },
    {
      field: 'totalDue',
      headerName: 'Credit Amount',
      //   description: 'This column has a value getter and is not sortable.',
      sortable: true,
      width: 160,
      headerClassName: 'super-app-theme--header',
      headerAlign: 'center'
      //   valueGetter: (value, row) => `${row.firstName || ''} ${row.lastName || ''}`,
    }
  ];
  let pageChange = (page) => {
    let newdata = [];
    newdata['page'] = parseInt(page - 1);
    newdata['pageSize'] = 20;
    setPaginationModel(newdata);
    fetchRowData(newdata['page']);
  };
  const [paginationModel, setPaginationModel] = useState({
    pageSize: 20,
    page: 0
  });
  const [rows, setRows] = useState([]);
  const [paginationCount, setPaginationCount] = useState(0);
  ////// call apito get data in every page change
  let fetchRowData = async (page) => {
    // console.log('Fetch page' + page + ' pageSize ' + pageSize);
    client
      .get('/customer?page=' + page)
      .then((res) => {
        // console.log(res.data.result.result);
        let count = res.data.result.count;
        let pagiCount = Math.ceil(count / pageSize);
        setPaginationCount(pagiCount);
        let newData = [];
        let result = [...res.data.result.result];
        // console.log(result);
        let id = parseInt(parseInt(page * 20) + 1);
        result.map((value) => {
          let createdData = createData(
            id,
            value.customerName,
            value.customerContactNo,
            value.customerAddress,
            value.totalCreditAmount,
            value._id
          );
          // console;
          newData = [...newData, createdData];
          id = parseInt(id) + 1;
        });
        setRows(newData);
      })
      .catch((err) => console.log(err));
  };
  // console.log(paginationCount);
  useEffect(() => {
    (async () => await fetchRowData(paginationModel.page))();
    return () => {
      return null;
    };
  }, []);
  return (
    <Grid container rowSpacing={4.5} columnSpacing={2.75}>
      {/* row 1 */}

      <Grid item md={8} sx={{ display: { sm: 'none', md: 'block', lg: 'none' } }} />
      {/* row 3 */}
      <Grid item xs={12} md={12} lg={12}>
        <Grid container alignItems="flex-start" justifyContent="space-between">
          {/* <Grid style={{ width: '50%' }}>
            <Typography variant="h5">{209} Products found</Typography>
          </Grid> */}
          {/* <Grid container justifyContent="flex-end" style={{ width: '50%' }}>
            <Typography color={'teal'} variant="button">
              Click on the below rows to <span style={{ backgroundColor: 'yellow' }}>UPDATE</span>
            </Typography>
          </Grid> */}
          <Grid item />
        </Grid>
        <MainCard sx={{ mt: 2 }} content={false}>
          <CustomerTable
            paginationCount={paginationCount}
            selectedDate={selectedDate}
            paginationModel={paginationModel}
            rows={rows}
            pageChange={pageChange}
            columns={columns}
            open={open}
            handleClickOpen={handleClickOpen}
            handleClose={handleClose}
          />
        </MainCard>
      </Grid>
    </Grid>
  );
}
