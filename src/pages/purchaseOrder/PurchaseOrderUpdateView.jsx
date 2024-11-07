// material-ui
import React, { useEffect, useState } from 'react';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';
// project import
import MainCard from 'components/MainCard';
import CustomerTable from 'pages/dashboard/CustomerTable';
import { client } from 'api/client';
import dayjs from 'dayjs';
import PurchaseTable from 'pages/dashboard/PurchaseTable';

// let id = 0;
function createData(
  id,
  invoiceNumber,
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
    { field: 'invoiceNumber', headerName: 'invoice Number', width: 300, headerClassName: 'super-app-theme--header', headerAlign: 'center' },
    // { field: 'supplierName', headerName: 'Supplier Name', width: 250, headerClassName: 'super-app-theme--header', headerAlign: 'center' },
    {
      field: 'grandTotalAmount',
      headerName: 'Total Amount',
      headerClassName: 'super-app-theme--header',
      headerAlign: 'center',
      //   type: 'number',
      width: 160
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
      width: 160
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
      width: 160
    }
  ];
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
  const [rows, setRows] = useState([]);
  const [paginationCount, setPaginationCount] = useState(0);
  ////// call apito get data in every page change
  let fetchRowData = async (page) => {
    // console.log('Fetch page' + page + ' pageSize ' + pageSize);
    client
      .get('/purchaseorder?page=' + page)
      .then((res) => {
        console.log(res.data.result.result);
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
            value.invoiceNumber,
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
      .catch((err) => console.log(err));
  };
  // console.log(paginationCount);
  useEffect(() => {
    (async () => await fetchRowData(paginationModel.page))();
    return () => {
      return null;
    };
  }, []);
  return (
    <Grid container rowSpacing={4.5} columnSpacing={2.75}>
      {/* row 1 */}

      <Grid item md={8} sx={{ display: { sm: 'none', md: 'block', lg: 'none' } }} />
      {/* row 3 */}
      <Grid item xs={12} md={12} lg={12}>
        <Grid container alignItems="flex-start" justifyContent="space-between">
          <Grid style={{ width: '50%' }}>
            <Typography variant="h5">{rows.length} Purchase Orders found</Typography>
          </Grid>
          <Grid container justifyContent="flex-end" style={{ width: '50%' }}>
            <Typography color={'teal'} variant="button">
              Click on the below rows to <span style={{ backgroundColor: 'yellow' }}>UPDATE</span>
            </Typography>
          </Grid>
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
