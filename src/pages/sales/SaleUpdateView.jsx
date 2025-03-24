// material-ui
import React, { useEffect, useState } from 'react';
import { a as screenType } from 'assets/static/screenType';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';
// project import
import MainCard from 'components/MainCard';
import { client } from 'api/client';
import dayjs from 'dayjs';
import SaleTable from 'pages/dashboard/SaleTable';
import LottieAnimation from 'components/loaderDog';
import NoDataFoundAnimation from 'components/nodatafound';
import { IconButton, MenuItem, Select, Stack, TextField } from '@mui/material';
import { ClearOutlined, SearchOutlined } from '@ant-design/icons';
import CustomSort from 'pages/filters/sort';
import CustomerFilter from 'pages/filters/filter';

// let id = 0;
function createData(id, billNumber, customerName, customerMobileNo, sellTotalAmount, dateOfBilling, paidAmount, dueAmount, _id, value) {
  // id = id + 1;
  let billStatus = '';
  if (sellTotalAmount == paidAmount) {
    billStatus = 'Paid';
  } else {
    billStatus = 'Due';
  }

  return { id, billNumber, customerName, customerMobileNo, sellTotalAmount, dateOfBilling, billStatus, paidAmount, dueAmount, _id, value };
}

// ==============================|| DASHBOARD - DEFAULT ||============================== //

export default function ManageSaleView() {
  let pageSize = 20;
  // let paginationCount = (50/;
  const [open, setOpen] = useState(false);
  const [selectedData, setSelectedData] = useState([]);
  const [searchType, setSearchType] = useState('0');
  const [searchValue, setSearchValue] = useState('');
  const [searchParm, setSearchParm] = useState('');
  const [sortPerm, setSortParm] = useState('');
  let createUrl = () => {
    let newdata = { ...paginationModel };
    newdata.page = 0;
    // newdata['pageSize'] = 20;
    setPaginationModel(newdata);
    let value = '&' + searchType + '=' + searchValue;
    setSearchParm(value);
  };
  let crearAllFilter = () => {
    let newdata = { ...paginationModel };
    newdata.page = 0;
    // newdata['pageSize'] = 20;
    setPaginationModel(newdata);
    setSearchType('0');
    setSearchValue('');
    setSearchParm('');
  };
  const handleClickOpen = (value) => {
    // console.log(value);
    setSelectedData(value.row);
    setOpen(true);
  };

  const handleClose = () => {
    fetchRowData(paginationModel.page, searchParm, sortPerm);
    setOpen(false);
  };

  const columns = [
    { field: 'id', headerName: 'Sl No.', width: 100, headerClassName: 'super-app-theme--header', headerAlign: 'center' },
    { field: 'billNumber', headerName: 'Bill Number', width: 120, headerClassName: 'super-app-theme--header', headerAlign: 'center' },
    { field: 'customerName', headerName: 'Customer Name', width: 220, headerClassName: 'super-app-theme--header', headerAlign: 'center' },
    {
      field: 'customerMobileNo',
      headerName: 'Customer Mobile',
      width: 180,
      headerClassName: 'super-app-theme--header',
      headerAlign: 'center'
    },
    {
      field: 'sellTotalAmount',
      headerName: 'Total Sell Amount',
      headerClassName: 'super-app-theme--header',
      headerAlign: 'center',
      //   type: 'number',
      width: 120
    },
    {
      field: 'dateOfBilling',
      headerName: 'Date Of Billing',
      //   description: 'This column has a value getter and is not sortable.',
      sortable: true,
      width: 120,
      headerClassName: 'super-app-theme--header',
      headerAlign: 'center'
      //   valueGetter: (value, row) => `${row.firstName || ''} ${row.lastName || ''}`,
    },
    {
      field: 'billStatus',
      headerName: 'Status',
      headerClassName: 'super-app-theme--header',
      headerAlign: 'center',
      //   type: 'number',
      width: 80
    },
    {
      field: 'paidAmount',
      headerName: 'Paid Amount',
      headerClassName: 'super-app-theme--header',
      headerAlign: 'center',
      //   type: 'number',
      width: 120
    },
    {
      field: 'dueAmount',
      headerName: 'Due Amount',
      headerClassName: 'super-app-theme--header',
      headerAlign: 'center',
      //   type: 'number',
      width: 120
    }
  ];
  let pageChange = (page) => {
    let newdata = [];
    newdata['page'] = parseInt(page - 1);
    newdata['pageSize'] = 20;
    setPaginationModel(newdata);
    fetchRowData(newdata['page'], searchParm, sortPerm);
  };
  const [paginationModel, setPaginationModel] = useState({
    pageSize: 20,
    page: 0
  });
  const [rows, setRows] = useState([]);
  const [paginationCount, setPaginationCount] = useState(0);
  ////// call apito get data in every page change
  let fetchRowData = async (page, url, sorturl) => {
    // console.log('Fetch page' + page + ' pageSize ' + pageSize);
    client
      .get('/sales?page=' + page + url + sorturl)
      .then((res) => {
        // console.log(res.data.result.result);
        let count = res.data.result.count;
        let pagiCount = Math.ceil(count / pageSize);
        setPaginationCount(pagiCount);
        let newData = [];
        let result = [...res.data.result.result];
        // console.log(result);
        // /createData(id, invoiceNumber, supplierName, grandTotalAmount, dateOfPurchase, creditAmount, paidAmount) {

        let id = parseInt(parseInt(page * 20) + 1);
        result.map((value) => {
          let createdData = createData(
            id,
            value.billNumber,
            value.customerName,
            value.customerMobileNo,
            parseFloat(value.grandTotalAmount).toFixed(2),
            dayjs(value.dateOfSale).format('YYYY-MM-DD'),
            parseFloat(value.paidAmount).toFixed(2),
            parseFloat(value.cerditAmount).toFixed(2),
            value._id,
            value
          );
          // console;
          newData = [...newData, createdData];
          id = parseInt(id) + 1;
        });
        setRows(newData);
      })
      .catch(() => setRows([]))
      .finally(() => setLoading(false));
  };
  useEffect(() => {
    (async () => await fetchRowData(paginationModel.page, searchParm, sortPerm))();
    return () => {
      return null;
    };
  }, [searchParm, sortPerm]);
  const [loading, setLoading] = useState(true);
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
  // console.log(rows);
  if (loading) {
    return <LottieAnimation />;
  }
  if (!loading && !rows.length) {
    // return <NoDataFoundAnimation />;
  }
  // console.log(paginationCount);

  return (
    <Grid container rowSpacing={4.5} columnSpacing={2.75}>
      {/* row 1 */}

      <Grid item md={8} sx={{ display: { sm: 'none', md: 'block', lg: 'none' } }} />
      {/* row 3 */}
      <Grid item xs={12} md={12} lg={12}>
        <Grid
          container
          direction={'row'}
          alignItems="center"
          justifyContent="space-between"
          style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', alignItems: 'center' }}
        >
          <Grid lg={12}>
            <Stack direction="row" justifyContent="space-between">
              <Typography variant="h5">{rows.length} Sales bill found</Typography>
              <div style={{ display: 'flex' }}>
                <CustomSort screenType={{ ...screenType, SALE: true }} createSortParm={createSortParm} />
                <CustomerFilter
                  screenType={{ ...screenType, SALE: true }}
                  createUrlFromFilter={createUrlFromFilter}
                  searchFilterData={searchFilterData}
                />
              </div>
            </Stack>
          </Grid>
          <Grid container justifyContent="flex-end" sx={{ backgroundColor: 'red' }}>
            {/* <Stack direction="row" spacing={1}>
              <Select
                labelId="demo-simple-select-label"
                id="demo-simple-select"
                value={searchType}
                // sx={{ height: '45px' }}
                // label="Age"
                onChange={(event) => {
                  setSearchType(event.target.value);
                  if (event.target.value == 'filterByCategory') {
                    setSearchValue(0);
                  } else if (event.target.value == 'filterByOnlyDue') {
                    setSearchValue(1);
                  }
                }}
              >
                <MenuItem value="0">Search Type</MenuItem>
                <MenuItem value="filterByBillNumber">Invoice No.</MenuItem>
                <MenuItem value="filterByCustomerName">Customer</MenuItem>
                <MenuItem value="filterByOnlyDue">Only Due</MenuItem>
              </Select>
              {searchType == 'filterByOnlyDue' ? (
                ''
              ) : (
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
              )}
              <IconButton aria-label="delete" size="large" sx={{ backgroundColor: '#8fe7e3', height: '41px' }} onClick={() => createUrl()}>
                <SearchOutlined />
              </IconButton>
              <IconButton aria-label="" size="large" sx={{ backgroundColor: '#aaeaaa', height: '41px' }} onClick={() => crearAllFilter()}>
                <ClearOutlined />
              </IconButton>
            </Stack> */}
          </Grid>
          {/* <Grid container justifyContent="flex-end" style={{ width: '50%' }}>
            <Typography color={'teal'} variant="button">
              Click on the below rows to <span style={{ backgroundColor: 'yellow' }}>UPDATE</span>
            </Typography>
          </Grid> */}
          {/* <Grid md={12} lg={7} style={{ marginRight: 0 }}>
            <ChipsArray />
          </Grid> */}
          {/* <Grid item /> */}
        </Grid>
        <MainCard sx={{ mt: 2 }} content={false}>
          <SaleTable
            paginationCount={paginationCount}
            selectedData={selectedData}
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
