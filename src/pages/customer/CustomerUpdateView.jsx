// material-ui
import React, { useEffect, useState } from 'react';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';

// project import
import MainCard from 'components/MainCard';
import CustomerTable from 'pages/dashboard/CustomerTable';
import { client } from 'api/client';
import LottieAnimation from 'components/loaderDog';
import NoDataFoundAnimation from 'components/nodatafound';
import { IconButton, MenuItem, Select, Stack, TextField } from '@mui/material';
import { ClearOutlined, SearchOutlined } from '@ant-design/icons';

// let id = 0;
function createData(id, customerName, customerContactNo, customerAddress, totalCreditAmount, __v, _id, lastPurchaseDate) {
  // id = id + 1;
  return { id, customerName, customerContactNo, customerAddress, totalCreditAmount, __v, _id, lastPurchaseDate };
}

// ==============================|| DASHBOARD - DEFAULT ||============================== //

export default function ManageCustomer() {
  let pageSize = 20;
  const [open, setOpen] = useState(false);
  const [selectedDate, setSelectedData] = useState({});
  const handleClickOpen = (value) => {
    // console.log(value);
    setSelectedData(value.row);
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    fetchRowData(paginationModel.page, searchParm);
  };

  const columns = [
    { field: 'id', headerName: 'Sl No.', width: 100, headerClassName: 'super-app-theme--header', headerAlign: 'center' },
    { field: 'customerName', headerName: 'Customer Name', width: 300, headerClassName: 'super-app-theme--header', headerAlign: 'center' },
    { field: 'customerContactNo', headerName: 'Mobile No', width: 250, headerClassName: 'super-app-theme--header', headerAlign: 'center' },
    {
      field: 'customerAddress',
      headerName: 'Address',
      headerClassName: 'super-app-theme--header',
      headerAlign: 'center',
      //   type: 'number',
      width: 360
    },
    {
      field: 'totalCreditAmount',
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
    fetchRowData(newdata['page'], searchParm);
  };
  const [paginationModel, setPaginationModel] = useState({
    pageSize: 20,
    page: 0
  });
  const [rows, setRows] = useState([]);
  const [paginationCount, setPaginationCount] = useState(0);
  const [searchParm, setSearchParm] = useState('');
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
  ////// call apito get data in every page change
  let fetchRowData = async (page, url) => {
    // console.log('Fetch page' + page + ' pageSize ' + pageSize);
    client
      .get('/customer?page=' + page + url)
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
            value.__v,
            value._id,
            value.lastPurchaseDate
          );
          // console;
          newData = [...newData, createdData];
          id = parseInt(id) + 1;
        });
        setRows(newData);
        setLoading(false);
      })
      .catch((err) => setLoading(false));
  };
  // console.log(paginationCount);
  // useEffect(() => {
  //   (async () => await fetchRowData(paginationModel.page))();
  //   return () => {
  //     return null;
  //   };
  // }, []);
  useEffect(() => {
    (async () => await fetchRowData(paginationModel.page, searchParm))();
    return () => {
      return null;
    };
  }, [searchParm]);
  const [searchType, setSearchType] = useState('0');
  const [searchValue, setSearchValue] = useState('');
  const [loading, setLoading] = useState(true);
  if (loading) {
    return <LottieAnimation />;
  }
  if (!loading && !rows.length) {
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
            <Typography variant="h5">{rows.length} Customers found</Typography>
          </Grid>
          <Grid container justifyContent="flex-end">
            <Stack direction="row" spacing={1}>
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
                <MenuItem value="filterByCustomerName">Customer</MenuItem>
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
              {/* <Button disabled={searchType == 0 ? true : false} variant="contained" color="secondary" endIcon={<SearchOutlined />}>
                Search
              </Button> */}
            </Stack>
          </Grid>
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
