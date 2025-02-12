// material-ui
import React, { useState } from 'react';
import { a as screenType } from 'assets/static/screenType';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';

// project import
import MainCard from 'components/MainCard';
import SupplierTable from 'pages/dashboard/SupplierTable';
import { IconButton, MenuItem, Select, Stack, TextField } from '@mui/material';
import { ClearOutlined, SearchOutlined } from '@ant-design/icons';
import CustomerFilter from 'pages/filters/filter';
import CustomSort from 'pages/filters/sort';
// import React from 'react';

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

export default function ManageSupplier() {
  const [rowData, setRowData] = useState('');
  const handleRowData = (data) => {
    setRowData(data);
  };
  const [searchParm, setSearchParm] = useState('');
  const [searchType, setSearchType] = useState('0');
  const [searchValue, setSearchValue] = useState('');
  const [sortPerm, setSortParm] = useState('');
  let createUrl = () => {
    // let newdata = { ...paginationModel };
    // newdata.page = 0;
    // // newdata['pageSize'] = 20;
    // setPaginationModel(newdata);
    let value = '&' + searchType + '=' + searchValue;
    setSearchParm(value);
  };
  let crearAllFilter = () => {
    // let newdata = { ...paginationModel };
    // newdata.page = 0;
    // // newdata['pageSize'] = 20;
    // setPaginationModel(newdata);
    setSearchType('0');
    setSearchValue('');
    setSearchParm('');
  };
  const [searchFilterData, setSearchFilterData] = useState({
    searchBySupplierName: '',
    searchByCustomerName: '',
    searchByInvoiceNo: '',
    searchByBillNo: '',
    onlyDue: 'N',
    fromDate: '',
    toDate: '',
    dateFilter: ''
  });
  const createUrlFromFilter = (data) => {
    let value = '';
    if (data.searchBySupplierName) {
      value += '&filterBySupplierName=' + data.searchBySupplierName;
    }
    if (data.searchByCustomerName) {
      value += '&filterByCustomer=' + data.searchByCustomerName;
    }
    if (data.searchByInvoiceNo) {
      value += '&filterByInvoiceNumber=' + data.searchByInvoiceNo;
    }
    if (data.searchByBillNo) {
      value += '&filterByInvoiceNumber=' + data.searchByBillNo;
    }
    if (data.onlyDue == 'Y') {
      value += '&filterByCreditAmount=' + data.onlyDue;
    }
    if (data.fromDate) {
      value += '&filterByStartDate=' + dayjs(data.fromDate).format('YYYYMMDD');
    }
    if (data.toDate) {
      value += '&filterByEndDate=' + dayjs(data.toDate).format('YYYYMMDD');
    }
    // if(data.searchBySupplierName){
    //   value='&searchBySupplierName='+data.searchBySupplierName;
    // }
    setSearchParm(value);
    setSearchFilterData(data);
  };
  let createSortParm = (sortType, sortValue) => {
    let value = '';
    if (sortType && sortValue) {
      value = '&' + sortType + '=' + sortValue;
    }
    setSortParm(value);
  };
  // console.log(searchParm);
  return (
    <Grid container rowSpacing={4.5} columnSpacing={2.75}>
      {/* row 1 */}

      <Grid item md={8} sx={{ display: { sm: 'none', md: 'block', lg: 'none' } }} />
      {/* row 3 */}
      <Grid item xs={12} md={12} lg={12}>
        <Grid container alignItems="flex-start" justifyContent="space-between">
          <Grid style={{ width: '50%' }}>
            <Typography variant="h5">{rowData} Suppliers found</Typography>
          </Grid>
          <Grid container justifyContent="flex-end">
            <CustomSort screenType={{ ...screenType, SUPPLIER: true }} createSortParm={createSortParm} />
            <CustomerFilter
              screenType={{ ...screenType, SUPPLIER: true }}
              createUrlFromFilter={createUrlFromFilter}
              searchFilterData={searchFilterData}
            />
            {/* <Stack direction="row" spacing={1}>
              <Select
                labelId="demo-simple-select-label"
                id="demo-simple-select"
                value={searchType}
                // sx={{ height: '45px' }}
                // label="Age"
                onChange={(event) => {
                  setSearchType(event.target.value);
                }}
              >
                <MenuItem value="0">Search Type</MenuItem>
                <MenuItem value="filterBySupplierName">Supplier Name</MenuItem>
                <MenuItem value="filterByPhoneNumber">Phone No.</MenuItem>
              </Select>

              <TextField
                disabled={searchType == 0 ? true : false}
                value={searchValue}
                id="outlined-search"
                label="Search field"
                type="search"
                // size="medium"
                // sx={{ height: '45px' }}
                onChange={(event) => setSearchValue(event.target.value)}
              />
              <IconButton aria-label="delete" size="small" sx={{ backgroundColor: '#8fe7e3', height: '41px' }} onClick={() => createUrl()}>
                <SearchOutlined />
              </IconButton>
              <IconButton aria-label="" size="small" sx={{ backgroundColor: '#aaeaaa', height: '41px' }} onClick={() => crearAllFilter()}>
                <ClearOutlined />
              </IconButton>
              
            </Stack> */}
          </Grid>
          <Grid item />
        </Grid>
        <MainCard sx={{ mt: 2 }} content={false}>
          <SupplierTable handleRowData={handleRowData} filterUrl={searchParm} sortUrl={sortPerm} />
        </MainCard>
      </Grid>
    </Grid>
  );
}
