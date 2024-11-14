import React from 'react';
import { DataGrid, GridToolbar, gridClasses } from '@mui/x-data-grid';
import Box from '@mui/material/Box';
import StockUpdateView from 'pages/stock/StockUpdateView';
import dayjs from 'dayjs';

let id = 0;

function createData(ProductName, Category, quantity, expiryDate, purchasePrice, mrp, supplierName) {
  id = id + 1;
  return { id, ProductName, Category, quantity, expiryDate, purchasePrice, mrp, supplierName };
}

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
          backgroundColor: 'white',
          borderRadius: 3,
          border: '1px solid #f5f5f5'
        },
        [`.${gridClasses.cell}.hot`]: {
          backgroundColor: '#e27c7c',
          color: 'white',
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
          if (params.row.expDate < dayjs().add(3, 'month').format('YYYY-MM-DD')) return 'hot';
          else return 'cold';
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
