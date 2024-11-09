import React from 'react';
import { DataGrid, GridToolbar, gridClasses } from '@mui/x-data-grid';
import Box from '@mui/material/Box';
import { Pagination } from '@mui/material';
import { Stack } from '@mui/system';
import SaleUpdate from 'pages/sales/SaleUpdate';

// data table value

// const paginationModel = { page: 1, pageSize: 3 };

// ==============================|| ORDER TABLE ||============================== //

export default function SaleTable({
  paginationCount,
  selectedData,
  paginationModel,
  pageChange,
  rows,
  columns,
  open,
  handleClickOpen,
  handleClose
}) {
  // console.log(selectedData);
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
        onRowClick={(value) => handleClickOpen(value)}
        initialState={{ pagination: { paginationModel }, density: 'comfortable' }}
        // pageSizeOptions={[paginationModel.pageSize]}
        // paginationModel={paginationModel}
        // hideFooterSelectedRowCount
        hideFooterPagination
        sx={{ m: 2 }}
        getCellClassName={(params) => {
          return 'hot';
        }}
        slots={{
          toolbar: GridToolbar
        }}
        header
        onPaginationModelChange={pageChange}
      />
      <Stack justifyContent="center" alignItems="end" marginBottom={3}>
        <Pagination count={paginationCount} color="primary" onChange={(event, page) => pageChange(page)} />
      </Stack>
      <SaleUpdate open={open} selectedData={selectedData} handleClose={handleClose} />
    </Box>
  );
}
