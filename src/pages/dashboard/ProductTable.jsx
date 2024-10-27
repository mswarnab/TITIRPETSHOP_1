import React, { useEffect } from 'react';
import { DataGrid, GridToolbar, gridClasses } from '@mui/x-data-grid';
import Box from '@mui/material/Box';
import StockUpdateView from 'pages/stock/StockUpdateView';
import { client } from 'api/client';

let id = 0;

function createData(ProductName, Category, quantity, expiryDate, purchasePrice, mrp, supplierName) {
  id = id + 1;
  return { id, ProductName, Category, quantity, expiryDate, purchasePrice, mrp, supplierName };
}

const rows = [
  createData('Royal Canin Maxi Puppy', 'DOGFOOD', 15, '2024-12-01', 2800, 3800, 'ABCD PVT Limited'),
  createData('Royal Canin Maxi Puppy', 'DOGFOOD', 15, '2024-12-01', 2800, 3800, 'ABCD PVT Limited'),
  createData('Royal Canin Maxi Puppy', 'DOGFOOD', 15, '2024-12-01', 2800, 3800, 'ABCD PVT Limited'),
  createData('Royal Canin Maxi Puppy', 'DOGFOOD', 15, '2024-12-01', 2800, 3800, 'ABCD PVT Limited'),
  createData('Royal Canin Maxi Puppy', 'DOGFOOD', 15, '2024-12-01', 2800, 3800, 'ABCD PVT Limited'),
  createData('Royal Canin Maxi Puppy', 'DOGFOOD', 15, '2024-12-01', 2800, 3800, 'ABCD PVT Limited'),
  createData('Royal Canin Maxi Puppy', 'DOGFOOD', 15, '2024-12-01', 2800, 3800, 'ABCD PVT Limited'),
  createData('Royal Canin Maxi Puppy', 'DOGFOOD', 15, '2024-12-01', 2800, 3800, 'ABCD PVT Limited'),
  createData('Royal Canin Maxi Puppy', 'DOGFOOD', 15, '2024-12-01', 2800, 3800, 'ABCD PVT Limited'),
  createData('Royal Canin Maxi Puppy', 'DOGFOOD', 15, '2024-12-01', 2800, 3800, 'ABCD PVT Limited'),
  createData('Royal Canin Maxi Puppy', 'DOGFOOD', 15, '2024-12-01', 2800, 3800, 'ABCD PVT Limited'),
  createData('Royal Canin Maxi Puppy', 'DOGFOOD', 15, '2024-12-01', 2800, 3800, 'ABCD PVT Limited'),
  createData('Royal Canin Maxi Puppy', 'DOGFOOD', 15, '2024-12-01', 2800, 3800, 'ABCD PVT Limited'),
  createData('Royal Canin Maxi Puppy', 'DOGFOOD', 15, '2024-12-01', 2800, 3800, 'ABCD PVT Limited'),
  createData('Royal Canin Maxi Puppy', 'DOGFOOD', 15, '2024-12-01', 2800, 3800, 'ABCD PVT Limited'),
  createData('Royal Canin Maxi Puppy', 'DOGFOOD', 15, '2024-12-01', 2800, 3800, 'ABCD PVT Limited'),
  createData('Royal Canin Maxi Puppy', 'DOGFOOD', 15, '2024-12-01', 2800, 3800, 'ABCD PVT Limited'),
  createData('Royal Canin Maxi Puppy', 'DOGFOOD', 15, '2024-12-01', 2800, 3800, 'ABCD PVT Limited'),
  createData('Royal Canin Maxi Puppy', 'DOGFOOD', 15, '2024-12-01', 2800, 3800, 'ABCD PVT Limited'),
  createData('Royal Canin Maxi Puppy', 'DOGFOOD', 15, '2024-12-01', 2800, 3800, 'ABCD PVT Limited'),
  createData('Royal Canin Maxi Puppy', 'DOGFOOD', 15, '2024-12-01', 2800, 3800, 'ABCD PVT Limited'),
  createData('Royal Canin Maxi Puppy', 'DOGFOOD', 15, '2024-12-01', 2800, 3800, 'ABCD PVT Limited'),
  createData('Royal Canin Maxi Puppy', 'DOGFOOD', 15, '2024-12-01', 2800, 3800, 'ABCD PVT Limited'),
  createData('Royal Canin Maxi Puppy', 'DOGFOOD', 15, '2024-12-01', 2800, 3800, 'ABCD PVT Limited'),
  createData('Royal Canin Maxi Puppy', 'DOGFOOD', 15, '2024-12-01', 2800, 3800, 'ABCD PVT Limited'),
  createData('Royal Canin Maxi Puppy', 'DOGFOOD', 15, '2024-12-01', 2800, 3800, 'ABCD PVT Limited'),
  createData('Royal Canin Maxi Puppy', 'DOGFOOD', 15, '2024-12-01', 2800, 3800, 'ABCD PVT Limited'),
  createData('Royal Canin Maxi Puppy', 'DOGFOOD', 15, '2024-12-01', 2800, 3800, 'ABCD PVT Limited'),
  createData('Royal Canin Maxi Puppy', 'DOGFOOD', 15, '2024-12-01', 2800, 3800, 'ABCD PVT Limited'),
  createData('Royal Canin Maxi Puppy', 'DOGFOOD', 15, '2024-12-01', 2800, 3800, 'ABCD PVT Limited'),
  createData('Royal Canin Maxi Puppy', 'DOGFOOD', 15, '2024-12-01', 2800, 3800, 'ABCD PVT Limited'),
  createData('Royal Canin Maxi Puppy', 'DOGFOOD', 15, '2024-12-01', 2800, 3800, 'ABCD PVT Limited'),
  createData('Royal Canin Maxi Puppy', 'DOGFOOD', 15, '2024-12-01', 2800, 3800, 'ABCD PVT Limited'),
  createData('Royal Canin Maxi Puppy', 'DOGFOOD', 15, '2024-12-01', 2800, 3800, 'ABCD PVT Limited'),
  createData('Royal Canin Maxi Puppy', 'DOGFOOD', 15, '2024-12-01', 2800, 3800, 'ABCD PVT Limited'),
  createData('Royal Canin Maxi Puppy', 'DOGFOOD', 15, '2024-12-01', 2800, 3800, 'ABCD PVT Limited')
];

// data table value
const columns = [
  { field: 'id', headerName: 'Sl No.', width: 70, headerClassName: 'super-app-theme--header', headerAlign: 'center' },
  { field: 'ProductName', headerName: 'Product Name', width: 260, headerClassName: 'super-app-theme--header', headerAlign: 'center' },
  { field: 'Category', headerName: 'Category', width: 130, headerClassName: 'super-app-theme--header', headerAlign: 'center' },
  {
    field: 'quantity',
    headerName: 'Quantity',
    headerClassName: 'super-app-theme--header',
    headerAlign: 'center',
    //   type: 'number',
    width: 120
  },
  {
    field: 'expiryDate',
    headerName: 'Expiry Date',
    //   description: 'This column has a value getter and is not sortable.',
    sortable: false,
    width: 160,
    headerClassName: 'super-app-theme--header',
    headerAlign: 'center'
    //   valueGetter: (value, row) => `${row.firstName || ''} ${row.lastName || ''}`,
  },
  { field: 'purchasePrice', headerName: 'PurchasePrice', width: 130, headerClassName: 'super-app-theme--header', headerAlign: 'center' },
  { field: 'mrp', headerName: 'MRP(₹)', width: 130, headerClassName: 'super-app-theme--header', headerAlign: 'center' },
  // { field: 'sellingPrice', headerName: 'Selling Price(₹)', width: 130 },
  { field: 'supplierName', headerName: 'Supplier Name', width: 170, headerClassName: 'super-app-theme--header', headerAlign: 'center' }
];

const paginationModel = { page: 1, pageSize: 10 };

// ==============================|| ORDER TABLE ||============================== //

export default function ProductTable({
  selectedRowData,
  open,
  row,
  column,
  handleClose,
  handleClickOpen,
  handleUpdate,
  handleDelete,
  type,
  paginationModel
  // htmlData
}) {
  // console.log(htmlData);
  // const [open, setOpen] = React.useState(false);
  // const [selectedRowData, setSelectedRowData] = React.useState('');
  // const handleClickOpen = (value) => {
  //   // console.log(value.row);
  //   // setSelectedRowData(value.row);
  //   // alert(value);
  //   // setOpen(true);
  //   return value.row;
  // };
  // console.log(selectedRowData);
  // const handleClose = () => {
  //   setOpen(false);
  // };

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
        rows={row}
        style={{ fontSize: 14, cursor: 'pointer', width: '100%' }}
        columns={column}
        onRowClick={(value) => handleClickOpen(value)}
        initialState={{ pagination: { paginationModel }, density: 'comfortable' }}
        pageSizeOptions={[5, 10]}
        // disableRowSelectionOnClick={type == 'view' ? true : false}
        // disableRowSelectionOnClick
        // disableVirtualization
        sx={{ m: 2 }}
        getCellClassName={(params) => {
          return 'hot';
        }}
        slots={{
          toolbar: GridToolbar
        }}
        header
      />
      {type == 'view' ? (
        ''
      ) : (
        <StockUpdateView
          open={open}
          rowData={selectedRowData}
          handleClose={handleClose}
          handleUpdate={handleUpdate}
          handleDelete={handleDelete}
          // htmlData={htmlData}
        />
      )}
    </Box>
  );
}
