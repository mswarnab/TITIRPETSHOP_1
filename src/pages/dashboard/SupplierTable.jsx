import React, { useEffect, useState } from 'react';
import { DataGrid, GridToolbar, gridClasses } from '@mui/x-data-grid';
import Box from '@mui/material/Box';
import StockUpdateView from 'pages/stock/StockUpdateView';
import CustomerUpdate from 'pages/customer/CustomerUpdate';
import SupplierUpdate from 'pages/supplier/SupplierUpdate';
import { client } from 'api/client';
import { Stack } from '@mui/system';
import { Pagination } from '@mui/material';
import LottieAnimation from 'components/loaderDog';
import NoDataFoundAnimation from 'components/nodatafound';

// let id = 0;

function createData(id, supplierName, mobileNo, address, gstinNumber, totalDue, _id, supplierEmail, __v, lastPurchaseDate) {
  // id = id + 1;
  return { id, supplierName, mobileNo, address, gstinNumber, totalDue, _id, supplierEmail, __v, lastPurchaseDate };
}

// data table value
const columns = [
  { field: 'id', headerName: 'Sl No.', width: 70, headerClassName: 'super-app-theme--header', headerAlign: 'center' },
  { field: 'supplierName', headerName: 'Supplier Name', width: 250, headerClassName: 'super-app-theme--header', headerAlign: 'center' },
  { field: 'mobileNo', headerName: 'Mobile No', width: 160, headerClassName: 'super-app-theme--header', headerAlign: 'center' },
  {
    field: 'address',
    headerName: 'Address',
    headerClassName: 'super-app-theme--header',
    headerAlign: 'center',
    //   type: 'number',
    width: 360
  },
  {
    field: 'gstinNumber',
    headerName: 'GSTIN',
    headerClassName: 'super-app-theme--header',
    headerAlign: 'center',
    //   type: 'number',
    width: 160
  },
  {
    field: 'totalDue',
    headerName: 'Credit Amount',
    //   description: 'This column has a value getter and is not sortable.',
    sortable: true,
    width: 195,
    headerClassName: 'super-app-theme--header',
    headerAlign: 'center'
    //   valueGetter: (value, row) => `${row.firstName || ''} ${row.lastName || ''}`,
  }
];

// const paginationModel = { page: 1, pageSize: 10 };

// ==============================|| ORDER TABLE ||============================== //

export default function SupplierTable() {
  let pageSize = 20;
  const [open, setOpen] = useState(false);
  const [selectedRow, setSelectedRow] = useState('');
  const [rows, setRows] = useState([]);
  const [paginationCount, setPaginationCount] = useState(0);
  const handleSelectedRow = (value) => {
    // console.log(value.row);
    setSelectedRow(value.row);
    setOpen(true);
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
      .get('/supplier?page=' + page)
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
            value.supplierName,
            value.supplierContactNo,
            value.supplierAddress,
            value.gstinNumber,
            value.totalCreditAmount,
            value._id,
            value.supplierEmail,
            value.__v,
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
  useEffect(() => {
    fetchRowData(paginationModel.page);
  }, []);
  const [loading, setLoading] = useState(true);
  // console.log(rows);
  if (loading) {
    return <LottieAnimation />;
  }
  if (!loading && !rows.length) {
    return <NoDataFoundAnimation />;
  }
  return (
    <Box
      sx={{
        width: '100%',
        paddingRight: '20px',
        [`.${gridClasses.cell}.cold`]: {
          backgroundColor: 'white'
        },
        [`.${gridClasses.cell}.hot`]: {
          borderRadius: 3,
          border: '1px solid #f5f5f5'
        },
        '& .super-app-theme--header': {
          backgroundColor: '#c8c8c8'
        }
      }}
    >
      <DataGrid
        rows={rows}
        style={{ fontSize: 14, cursor: 'pointer', width: '100%' }}
        columns={columns}
        onRowClick={(value) => handleSelectedRow(value)}
        initialState={{ pagination: { paginationModel }, density: 'comfortable' }}
        // pageSizeOptions={[5, 10]}

        sx={{ m: 2 }}
        getCellClassName={(params) => {
          return 'hot';
        }}
        slots={{
          toolbar: GridToolbar
        }}
        header
      />

      <Stack spacing={2} justifyContent="center" alignItems="end">
        <Pagination count={paginationCount} color="primary" onChange={(event, page) => pageChange(page)} />
      </Stack>
      <SupplierUpdate open={open} handleClose={handleClose} data={selectedRow} />
    </Box>
  );
}
