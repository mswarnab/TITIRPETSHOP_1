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
import { ButtonGroup, Pagination, useTheme } from '@mui/material';
import ProductTable from 'pages/dashboard/ProductTable';
import getColors from 'utils/getColors';
import StockUpdateView from './StockUpdateView';
import LottieAnimation from 'components/loaderDog';
import NoDataFoundAnimation from 'components/nodatafound';
import { client } from 'api/client';
import dayjs from 'dayjs';

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

// ==============================|| DASHBOARD - DEFAULT ||============================== //
function createData(id, productName, category, batchNumber, hsnCode, mfrCode, quantity, rate, mrp, expDate, sgst, cgst, supplierName) {
  // console.log(expDate);
  expDate = dayjs(expDate).format('YYYY-MM-DD');
  console.log(expDate);
  return { id, productName, category, batchNumber, hsnCode, mfrCode, quantity, rate, mrp, expDate, sgst, cgst, supplierName };
}

export default function ManageStock() {
  const typeView = 'view';
  const pageSize = 20;
  const [openUpdate, setOpenUpdate] = React.useState(false);
  const [selectedRowData, setSelectedRowData] = React.useState('');
  const [paginationCount, setPaginationCount] = useState(0);
  const [dataRows, setDataRows] = useState([]);
  const dataColumns = [
    { field: 'id', headerName: 'Sl No.', width: 90 },
    {
      field: 'productName',
      headerName: 'Product Name',
      width: 250
      // editable: true
    },
    {
      field: 'category',
      headerName: 'Product Categroy',
      width: 150
      // editable: true
    },

    {
      field: 'batchNumber',
      headerName: 'Batch No.',
      width: 160
    },
    {
      field: 'hsnCode',
      headerName: 'Hsn',
      width: 160
    },
    {
      field: 'mfrCode',
      headerName: 'Mfr',
      width: 160
    },

    {
      field: 'quantity',
      headerName: 'QTY',
      type: 'number',
      width: 90,
      editable: true
    },
    {
      field: 'rate',
      headerName: 'Rate',
      width: 100
    },
    {
      field: 'mrp',
      headerName: 'MRP',
      type: 'number',
      width: 100
      // editable: true
    },
    {
      field: 'expDate',
      headerName: 'Expiry Date',
      width: 160
    },

    {
      field: 'sgst',
      headerName: 'SGST/PROD',
      width: 160
    },
    {
      field: 'cgst',
      headerName: 'CGST/PROD',
      width: 160
    },

    {
      field: 'supplierName',
      headerName: 'Supplier Name',
      width: 250
    }
  ];

  const handleCloseUpdate = () => {
    setOpenUpdate(false);
  };
  const handleClickOpenUpdate = (value) => {
    // console.log(value.row);
    setSelectedRowData(value.row);
    // alert(value);
    setOpenUpdate(true);
  };
  const handleDelete = () => {
    handleCloseUpdate();
  };
  const handleUpdate = () => {
    handleCloseUpdate();
  };
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
  const handleClose = () => {
    let page = paginationModel.page;
    fetchRowData(page);
    setOpen(false);
  };
  let fetchRowData = (page) => {
    // console.log('Fetch page' + page + ' pageSize ' + pageSize);
    client
      .get('/stock/?page=' + page)
      .then((res) => {
        console.log(res.data.result.result);
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
            value.productName,
            value.category,
            value.batchNumber,
            value.hsnCode,
            value.mfrCode,
            value.quantity,
            value.rate,
            value.mrp,
            value.expDate,
            value.sgst,
            value.cgst,
            value.supplierName
          );

          // console;
          newData = [...newData, createdData];
          id = parseInt(id) + 1;
        });
        // console.log(newData);
        setDataRows(newData);
        setLoading(false);
      })
      .catch((err) => setLoading(false));
  };
  useEffect(() => {
    fetchRowData(paginationModel.page);
    return () => {
      return null;
    };
  }, []);
  const [loading, setLoading] = useState(true);
  // console.log(dataRows);
  if (loading) {
    return <LottieAnimation />;
  }
  if (!loading && !dataRows.length) {
    return <NoDataFoundAnimation />;
  }
  return (
    <Grid container rowSpacing={4.5} columnSpacing={2.75}>
      {/* row 1 */}

      <Grid item md={8} sx={{ display: { sm: 'none', md: 'block', lg: 'none' } }} />
      {/* row 3 */}
      <Grid item xs={12} md={12} lg={12}>
        <Grid container alignItems="flex-start" justifyContent="space-between">
          <Grid style={{ width: '50%' }}>
            <Typography variant="h5">{209} Products found</Typography>
          </Grid>
          <Grid container justifyContent="flex-end" style={{ width: '50%' }}>
            <Typography color={'teal'} variant="button">
              Click on the below rows to <span style={{ backgroundColor: 'yellow' }}>UPDATE</span>
            </Typography>
          </Grid>
          <Grid item />
        </Grid>
        <MainCard sx={{ mt: 2 }} content={false}>
          <ProductTable
            type={typeView}
            handleClose={handleCloseUpdate}
            selectedRowData={selectedRowData}
            // prodCatagoryArr={prodCatagoryArr}
            open={openUpdate}
            row={dataRows}
            column={dataColumns}
            // htmlData={htmlDataStockView}
            handleClickOpen={handleClickOpenUpdate}
            handleDelete={handleDelete}
            handleUpdate={handleUpdate}
            paginationModel={paginationModel}
          />
        </MainCard>
        <Stack spacing={2} justifyContent="center" alignItems="end">
          <Pagination count={paginationCount} color="primary" onChange={(event, page) => pageChange(page)} />
        </Stack>
      </Grid>
    </Grid>
  );
}
