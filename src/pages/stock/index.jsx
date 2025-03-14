// material-ui
import React, { useEffect, useState } from 'react';
import Grid from '@mui/material/Grid';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import { prodCatagoryArr } from 'static';

// project import
import MainCard from 'components/MainCard';
import { Button, IconButton, MenuItem, Pagination, Select, TextField } from '@mui/material';
import ProductTable from 'pages/dashboard/ProductTable';
import LottieAnimation from 'components/loaderDog';
import NoDataFoundAnimation from 'components/nodatafound';
import { client } from 'api/client';
import dayjs from 'dayjs';
import { ClearOutlined, SearchOutlined } from '@ant-design/icons';

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
function createData(
  id,
  productName,
  invoiceNumber,
  category,
  expDate,
  quantity,
  rate,
  discount,
  schemeDiscount,
  purchasePrice,
  mrp,
  sgst,
  cgst,
  supplierName,
  batchNumber,
  hsnCode
) {
  // console.log(expDate);
  expDate = dayjs(expDate).format('YYYY-MM-DD');
  // console.log(expDate);
  return {
    id,
    productName,
    invoiceNumber,
    category,
    expDate,
    quantity,
    rate,
    discount,
    schemeDiscount,
    purchasePrice: parseFloat(purchasePrice + sgst + cgst).toFixed(2),
    mrp,
    supplierName,
    sgst,
    cgst,
    batchNumber,
    hsnCode
  };
}

export default function ManageStock() {
  const typeView = 'view';
  const pageSize = 20;
  const [openUpdate, setOpenUpdate] = React.useState(false);
  const [selectedRowData, setSelectedRowData] = React.useState('');
  const [paginationCount, setPaginationCount] = useState(0);
  const [dataRows, setDataRows] = useState([]);
  const [productCount, setProductCOunt] = useState(0);

  const dataColumns = [
    { field: 'id', headerAlign: 'center', headerName: 'Sl No.', headerClassName: 'super-app-theme--header', width: 90 },
    {
      field: 'productName',
      headerClassName: 'super-app-theme--header',
      headerAlign: 'center',

      headerName: 'Product Name',
      width: 250
      // editable: true
    },
    {
      field: 'invoiceNumber',
      headerClassName: 'super-app-theme--header',
      headerAlign: 'center',

      headerName: 'Invoice No.',
      width: 250
      // editable: true
    },
    {
      field: 'category',
      headerClassName: 'super-app-theme--header',
      headerAlign: 'center',

      headerName: 'Product Categroy',
      width: 150
      // editable: true
    },
    {
      field: 'expDate',
      headerClassName: 'super-app-theme--header',
      headerAlign: 'center',

      headerName: 'Expiry Date',
      width: 160
    },

    {
      field: 'quantity',
      headerAlign: 'center',

      headerName: 'QTY',
      headerClassName: 'super-app-theme--header',

      type: 'number',
      width: 90,
      editable: true
    },
    {
      field: 'rate',
      headerAlign: 'center',

      headerClassName: 'super-app-theme--header',
      headerName: 'Rate',
      width: 100
    },
    {
      field: 'discount',
      headerAlign: 'center',

      headerName: 'Discount %',
      headerClassName: 'super-app-theme--header',
      //   type: 'number',
      width: 135
    },
    {
      field: 'schemeDiscount',
      headerAlign: 'center',

      headerName: 'Scheme Discount %',
      headerClassName: 'super-app-theme--header',
      //   type: 'number',
      width: 155
    },
    {
      field: 'purchasePrice',
      headerAlign: 'center',

      headerName: 'Purchase Price (Including GST)',
      headerClassName: 'super-app-theme--header',
      //   type: 'number',
      width: 135
    },

    {
      field: 'mrp',
      headerAlign: 'center',

      headerClassName: 'super-app-theme--header',

      headerName: 'MRP',
      type: 'number',
      width: 100
      // editable: true
    },
    {
      field: 'supplierName',
      headerAlign: 'center',

      headerClassName: 'super-app-theme--header',
      headerName: 'Supplier Name',
      width: 250
    },

    {
      field: 'sgst',
      headerAlign: 'center',

      headerClassName: 'super-app-theme--header',

      headerName: 'SGST/PROD',
      width: 160
    },
    {
      field: 'cgst',
      headerAlign: 'center',

      headerClassName: 'super-app-theme--header',

      headerName: 'CGST/PROD',
      width: 160
    },

    {
      field: 'batchNumber',
      headerAlign: 'center',

      headerClassName: 'super-app-theme--header',

      headerName: 'Batch No.',
      width: 160
    },
    {
      field: 'hsnCode',
      headerAlign: 'center',

      headerClassName: 'super-app-theme--header',

      headerName: 'Hsn',
      width: 160
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
    fetchRowData(newdata['page'], searchParm);
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
  let fetchRowData = (page, url) => {
    console.log('/stock/?page=' + page + url);
    // console.log('Fetch page' + page + ' pageSize ' + pageSize);
    client
      .get('/stock?page=' + page + url)
      .then((res) => {
        // console.log(res.data.result.result);
        let count = res.data.result.count;
        let pagiCount = Math.ceil(count / pageSize);
        setPaginationCount(pagiCount);
        let newData = [];
        let result = [...res.data.result.result];
        setProductCOunt(res.data.result.count);
        // console.log(result);
        let id = parseInt(parseInt(page * 20) + 1);
        result.map((value) => {
          let createdData = createData(
            id,
            value.productName,
            value.invoiceNumber,
            value.category,
            value.expDate,
            value.quantity,
            parseFloat(value.rate).toFixed(2),
            parseFloat(value.discount).toFixed(2),
            parseFloat(value.schemeDiscount).toFixed(2),
            parseFloat(value.purchasePrice).toFixed(2),
            parseFloat(value.mrp).toFixed(2),
            parseFloat(value.sgst).toFixed(2),
            parseFloat(value.cgst).toFixed(2),
            value.supplierName,
            value.batchNumber,
            value.hsnCode
          );
          // console;
          newData = [...newData, createdData];
          id = parseInt(id) + 1;
        });
        // console.log(newData);
        setDataRows(newData);
        setLoading(false);
      })
      .catch((err) => {
        setLoading(false);
        setDataRows([]);
        setProductCOunt(0);
      });
  };
  useEffect(() => {
    fetchRowData(paginationModel.page, searchParm);
    return () => {
      return null;
    };
  }, [searchParm]);
  const [loading, setLoading] = useState(true);
  const [searchType, setSearchType] = useState('0');
  const [searchValue, setSearchValue] = useState('');
  // console.log(dataRows);
  if (loading) {
    return <LottieAnimation />;
  }
  if (!loading && !dataRows.length) {
    // return <NoDataFoundAnimation />;
  }
  // const [width, setWidth] = useState(window.innerWidth);
  // useEffect(() => {
  //   setWidth(navigator.userAgent.toString().toLocaleLowerCase().includes('windows'));
  // }, [navigator.userAgent]);
  return (
    <Grid container rowSpacing={4.5} columnSpacing={2.75}>
      {/* row 1 */}

      <Grid item md={8} sx={{ display: { sm: 'none', md: 'block', lg: 'none' } }} />
      {/* row 3 */}
      <Grid item xs={12} md={12} lg={12}>
        <Grid container alignItems="flex-start" justifyContent="space-between">
          <Grid style={{ width: '50%', marginTop: '10px' }}>
            <Typography variant="h5">{productCount} Products found</Typography>
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
                  if (event.target.value == 'filterByCategory') {
                    setSearchValue(0);
                  }
                }}
              >
                <MenuItem value="0">Search Type</MenuItem>
                <MenuItem value="filterByProductName">Product Name</MenuItem>
                <MenuItem value="filterByCategory">Category</MenuItem>
                <MenuItem value="filterByInvoiceNumber">Invoice No.</MenuItem>
                <MenuItem value="filterBySupplierName">Supplier</MenuItem>
                <MenuItem value="filterByHsnCode">Hsn Code</MenuItem>
              </Select>
              {searchType == 'filterByCategory' ? (
                <Select
                  labelId="demo-simple-select-label"
                  id="demo-simple-select"
                  value={searchValue}
                  // sx={{ height: '45px' }}
                  // label="Age"
                  onChange={(event) => setSearchValue(event.target.value)}
                >
                  <MenuItem value="0">Search Catagory</MenuItem>
                  {prodCatagoryArr.map((element) => (
                    <MenuItem value={element}>{element}</MenuItem>
                  ))}
                </Select>
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
        <Grid container alignItems="flex-start" justifyContent="space-between" marginTop={3}>
          <Grid style={{ width: '50%' }}>{/* <Typography variant="h5">{productCount} Products found</Typography> */}</Grid>
          <Grid container justifyContent="flex-end" style={{ width: '50%' }}>
            {/* <Typography color={'teal'} variant="button">
              Click on the below rows to <span style={{ backgroundColor: 'yellow' }}>UPDATE</span>
            </Typography> */}
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
