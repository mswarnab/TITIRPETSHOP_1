// material-ui
import React, { useEffect, useState } from 'react';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';
// project import
import MainCard from 'components/MainCard';
import { client } from 'api/client';
import dayjs from 'dayjs';
import PurchaseTable from 'pages/dashboard/PurchaseTable';
import LottieAnimation from 'components/loaderDog';
import NoDataFoundAnimation from 'components/nodatafound';
import ChipsArray from 'components/ChipsArray';
import { IconButton, MenuItem, Select, Stack, TextField } from '@mui/material';
import { ClearOutlined, SearchOutlined } from '@ant-design/icons';

// let id = 0;
function createData(
  id,
  invoiceNumber,
  supplierName,
  grandTotalAmount,
  dateOfPruchase,
  cerditAmount,
  paidAmount,
  modeOfPayment,
  _id,
  addLessAmount,
  cgst,
  crDrNote,
  discount,
  dueDate,
  sgst,
  supplierId,
  totalAmount,
  __v
) {
  // id = id + 1;
  return {
    id,
    invoiceNumber,
    supplierName,
    grandTotalAmount,
    dateOfPruchase,
    cerditAmount,
    paidAmount,
    modeOfPayment,
    _id,
    addLessAmount,
    cgst,
    crDrNote,
    discount,
    dueDate,
    sgst,
    supplierId,
    totalAmount,
    __v
  };
}

// ==============================|| DASHBOARD - DEFAULT ||============================== //

export default function ManagePurchaseOrder() {
  let pageSize = 20;
  // let paginationCount = (50/;
  const [open, setOpen] = useState(false);
  const [selectedData, setSelectedData] = useState([]);
  const [productCount, setProductCOunt] = useState(0);
  const handleClickOpen = (value) => {
    // console.log(value);
    setSelectedData(value.row);
    setOpen(true);
  };

  const handleClose = () => {
    fetchRowData(paginationModel.page);
    setOpen(false);
  };

  const columns = [
    { field: 'id', headerName: 'Sl No.', width: 100, headerClassName: 'super-app-theme--header', headerAlign: 'center' },
    { field: 'invoiceNumber', headerName: 'invoice Number', width: 150, headerClassName: 'super-app-theme--header', headerAlign: 'center' },
    { field: 'supplierName', headerName: 'Supplier Name', width: 220, headerClassName: 'super-app-theme--header', headerAlign: 'center' },
    {
      field: 'grandTotalAmount',
      headerName: 'Total Amount',
      headerClassName: 'super-app-theme--header',
      headerAlign: 'center',
      //   type: 'number',
      width: 120
    },
    {
      field: 'dateOfPruchase',
      headerName: 'Date Of Purchase',
      //   description: 'This column has a value getter and is not sortable.',
      sortable: true,
      width: 160,
      headerClassName: 'super-app-theme--header',
      headerAlign: 'center'
      //   valueGetter: (value, row) => `${row.firstName || ''} ${row.lastName || ''}`,
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
      field: 'modeOfPayment',
      headerName: 'Payment Mode',
      headerClassName: 'super-app-theme--header',
      headerAlign: 'center',
      //   type: 'number',
      width: 160
    },
    {
      field: 'cerditAmount',
      headerName: 'Due Amount',
      headerClassName: 'super-app-theme--header',
      headerAlign: 'center',
      //   type: 'number',
      width: 135
    }
  ];
  let pageChange = (page) => {
    let newdata = [];
    newdata['page'] = parseInt(page - 1);
    newdata['pageSize'] = 20;
    setPaginationModel(newdata);
    fetchRowData(newdata['page'], searchParm);
  };
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
  const [paginationModel, setPaginationModel] = useState({
    pageSize: 20,
    page: 0
  });
  const [rows, setRows] = useState([]);
  const [paginationCount, setPaginationCount] = useState(0);
  ////// call apito get data in every page change
  let fetchRowData = async (page, url) => {
    // console.log('Fetch page' + page + ' pageSize ' + pageSize);
    client
      .get('/purchaseorder?page=' + page + url)
      .then((res) => {
        // console.log(res.data.result.result);
        let count = res.data.result.count;
        let pagiCount = Math.ceil(count / pageSize);
        setPaginationCount(pagiCount);
        let newData = [];
        let result = [...res.data.result.result];
        // console.log(result);
        // /createData(id, invoiceNumber, supplierName, grandTotalAmount, dateOfPurchase, creditAmount, paidAmount) {
        setProductCOunt(res.data.result.count);
        let id = parseInt(parseInt(page * 20) + 1);
        result.map((value) => {
          let createdData = createData(
            id,
            value.invoiceNumber,
            value.supplierName,
            value.grandTotalAmount,
            dayjs(value.dateOfPruchase).format('YYYY-MM-DD'),
            value.cerditAmount,
            value.paidAmount,
            value.modeOfPayment,
            value._id,
            value.addLessAmount,
            value.cgst,
            value.crDrNote,
            value.discount,
            value.dueDate,
            value.sgst,
            value.supplierId,
            value.totalAmount,
            value.__v
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
  // console.log(paginationCount);
  useEffect(() => {
    (async () => await fetchRowData(paginationModel.page, searchParm))();
    return () => {
      return null;
    };
  }, [searchParm]);

  const [loading, setLoading] = useState(true);
  const [searchType, setSearchType] = useState('0');
  const [searchValue, setSearchValue] = useState('');
  // console.log(rows);
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
        <Grid
          container
          direction={'row'}
          alignItems="center"
          justifyContent="space-between"
          style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', alignItems: 'center' }}
        >
          <Grid lg={5}>
            <Typography variant="h5">{productCount} Purchase Orders found</Typography>
          </Grid>
          <Grid container justifyContent="flex-end" style={{ width: '50%' }}>
            <Stack direction="row" spacing={1}>
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
                {/* <MenuItem value="filterByProductName">Product Name</MenuItem> */}
                {/* <MenuItem value="filterByCategory">Category</MenuItem> */}
                <MenuItem value="filterByInvoice">Invoice No.</MenuItem>
                <MenuItem value="filterBySupplierName">Supplier</MenuItem>
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
              {/* <Button disabled={searchType == 0 ? true : false} variant="contained" color="secondary" endIcon={<SearchOutlined />}>
                Search
              </Button> */}
            </Stack>
          </Grid>
          {/* <Grid container justifyContent="flex-end" style={{ width: '50%' }}>
            <Typography color={'teal'} variant="button">
              Click on the below rows to <span style={{ backgroundColor: 'yellow' }}>UPDATE</span>
            </Typography>
          </Grid> */}
          {/* <Grid md={12} lg={7} style={{ marginRight: 0 }}>
            <ChipsArray />
          </Grid> */}
          <Grid item />
        </Grid>
        <MainCard sx={{ mt: 2 }} content={false}>
          <PurchaseTable
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
