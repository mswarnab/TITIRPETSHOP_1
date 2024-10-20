import React, { useEffect, useState } from 'react';
import { DataGrid, GridToolbar, gridClasses } from '@mui/x-data-grid';
import Box from '@mui/material/Box';
import StockUpdateView from 'pages/stock/StockUpdateView';
import CustomerUpdate from 'pages/customer/CustomerUpdate';
import SupplierUpdate from 'pages/supplier/SupplierUpdate';
import { client } from 'api/client';

let id = 0;

function createData(supplierName, mobileNo, address, totalDue, _id) {
  id = id + 1;
  return { id, supplierName, mobileNo, address, totalDue, _id };
}

// data table value
const columns = [
  { field: 'id', headerName: 'Sl No.', width: 100, headerClassName: 'super-app-theme--header', headerAlign: 'center' },
  { field: 'supplierName', headerName: 'Supplier Name', width: 300, headerClassName: 'super-app-theme--header', headerAlign: 'center' },
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

const paginationModel = { page: 1, pageSize: 10 };

// ==============================|| ORDER TABLE ||============================== //

export default function SupplierTable() {
  const [open, setOpen] = useState(false);
  const [selectedRow, setSelectedRow] = useState('');
  const [rows, setRows] = useState([]);

  useEffect(() => {
    client.get('/supplier').then((res) => {
      let tempRows = [];
      res.data.result.result.map((e) => {
        const { _id, supplierName, supplierContactNo, supplierAddress, totalCreditAmount } = e;
        console.log('eeeeeeee', supplierName);
        tempRows = [...tempRows, createData(supplierName, supplierContactNo, supplierAddress, totalCreditAmount, _id)];
        setRows(tempRows);
      });
    });
  }, []);

  const handleSelectedRow = (value) => {
    setSelectedRow(value.row);
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

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
        pageSizeOptions={[5, 10]}
        sx={{ m: 2 }}
        getCellClassName={(params) => {
          return 'hot';
        }}
        slots={{
          toolbar: GridToolbar
        }}
        header
      />

      <SupplierUpdate open={open} handleClose={handleClose} data={selectedRow} />
    </Box>
  );
}
