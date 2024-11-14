// material-ui
import React, { useEffect, useState } from 'react';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';
// project import
import MainCard from 'components/MainCard';
import { client } from 'api/client';
import dayjs from 'dayjs';
import SaleTable from 'pages/dashboard/SaleTable';
import LottieAnimation from 'components/loaderDog';
import NoDataFoundAnimation from 'components/nodatafound';

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
      .get('/sales?page=' + page)
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
            value.grandTotalAmount,
            dayjs(value.dateOfSale).format('YYYY-MM-DD'),
            value.paidAmount,
            value.cerditAmount,
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
    (async () => await fetchRowData(paginationModel.page))();
    return () => {
      return null;
    };
  }, []);
  const [loading, setLoading] = useState(true);
  // console.log(rows);
  if (loading) {
    return <LottieAnimation />;
  }
  if (!loading && !rows.length) {
    return <NoDataFoundAnimation />;
  }
  // console.log(paginationCount);

  return (
    <Grid container rowSpacing={4.5} columnSpacing={2.75}>
      {/* row 1 */}

      <Grid item md={8} sx={{ display: { sm: 'none', md: 'block', lg: 'none' } }} />
      {/* row 3 */}
      <Grid item xs={12} md={12} lg={12}>
        <Grid container alignItems="flex-start" justifyContent="space-between">
          <Grid style={{ width: '50%' }}>
            <Typography variant="h5">{rows.length} Sales bill found</Typography>
          </Grid>
          <Grid container justifyContent="flex-end" style={{ width: '50%' }}>
            <Typography color={'teal'} variant="button">
              Click on the below rows to <span style={{ backgroundColor: 'yellow' }}>UPDATE</span>
            </Typography>
          </Grid>
          <Grid item />
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
