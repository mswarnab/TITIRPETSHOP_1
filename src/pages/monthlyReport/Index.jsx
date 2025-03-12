// material-ui
import Avatar from '@mui/material/Avatar';
import Grid from '@mui/material/Grid';
import List from '@mui/material/List';
import ListItemAvatar from '@mui/material/ListItemAvatar';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemSecondaryAction from '@mui/material/ListItemSecondaryAction';
import ListItemText from '@mui/material/ListItemText';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
// project import
import MainCard from 'components/MainCard';
import AnalyticEcommerce from 'components/cards/statistics/AnalyticEcommerce';
// import MonthlyBarChart from './MonthlyBarChart';
// import SaleReportCard from './SaleReportCard';
// import OrdersTable from './OrdersTable';

// assets
import GiftOutlined from '@ant-design/icons/GiftOutlined';
import { useEffect, useState } from 'react';
import dayjs from 'dayjs';
import { client } from 'api/client';
import { useNavigate } from 'react-router';
import { Chip, Divider } from '@mui/material';

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

const data = {
  sales: {
    totalSale: 250000,
    percentage: 29,
    extraSale: 2000
  },
  stock: {
    expiredProducts: 299,
    expiryDate: 2024 - 10
  },
  customer: {
    totalCustomer: 280,
    totalCreditInMarket: 29000
  },
  purchaseOrder: {
    totalOrders: 188
  },
  supplier: {
    totalDue: 19999,
    totalSuppliers: 6
  }
};

// ==============================|| DASHBOARD - DEFAULT ||============================== //

export default function MonthlyReport() {
  const { sales, customer, purchaseOrder, stock, supplier } = data;
  const { totalSale = 100, percentage = 20, extraSale = 2000 } = sales;
  const [totalSales, setTotalSales] = useState('');
  const [weeklyTotalSales, setWeeklyTotalSales] = useState('');
  const [purchaseOrdersWithAmountDue, setPurchaseOrdersWithAmountDue] = useState([]);

  const [totalCustomers, setTotalCustomers] = useState('');
  const [expiredProducts, setExpiredProducts] = useState('');

  const expiryDate = dayjs().add(3, 'month').format('YYYY-MM-DD');
  const { totalOrders } = purchaseOrder;
  const [totalSupplierDue, setTotalSupplierDue] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    (async () => {
      client
        .get('/stock/getexpiredproducts')
        .then((res) => {
          // setError({ err: false, message: res.data.message });
          setExpiredProducts(res.data.result);
        })
        .catch((err) => setError({ err: true, message: null }));

      client.get('/sales/totalsale').then((res) => {
        setTotalSales({ count: res.data.result.count, amount: res.data.result.result.length ? res.data.result.result[0].totalSales : 0 });
      });

      client.get('/supplier/totaldue').then((res) => {
        setTotalSupplierDue({ count: res.data.result.count, amount: res.data.result.result[0].totalDue });
      });

      client.get('/customer/totaldue').then((res) => {
        setTotalCustomers({ count: res.data.result.count, amount: res.data.result.result[0].totalDue });
      });

      client.get('/purchaseorder?page=0&filterByCreditAmountGte=1&filterByCreditAmountLte=9999999999').then((res) => {
        setPurchaseOrdersWithAmountDue(res.data.result.result);
      });
    })();

    return () => {
      return null;
    };
  }, []);
  const navigate = useNavigate();

  return (
    <Grid container rowSpacing={4.5} columnSpacing={2.75}>
      {/* row 1 */}
      <Grid item xs={12} sx={{ mb: -2.25 }}>
        <Typography variant="h4">Monthly Report card</Typography>
      </Grid>
      <Grid item xs={12} sm={6} md={4} lg={3}>
        <AnalyticEcommerce
          //   expiredProducts={expiredProducts}
          title={'Total Purchase Orders Made'}
          //   isLoss
          extraLabel={'Total spent for PO in this month'}
          count={'₹' + expiredProducts?.count}
          // extra={'Click here to view more'}
          //   onHandleClick={() => navigate('/stock/expired')}
        />
      </Grid>
      <Grid item xs={12} sm={6} md={4} lg={3}>
        <AnalyticEcommerce
          title="Total sales in current month"
          count={`₹${parseFloat(totalSales.amount).toFixed(2) || 0}`}
          // percentage={percentage}
          extraLabel={''}
          extra={(totalSales.count || 0) + ` sales made since last month`}
        />
      </Grid>
      <Grid item xs={12} sm={6} md={4} lg={3}>
        <AnalyticEcommerce
          title="Total Expense"
          count={'₹' + (parseFloat(totalSupplierDue.amount).toFixed(2) || 0)}
          isLoss
          color="warning"
          extraLabel={'Total expenses recorded in this month'}
          //   extra={` to ${totalSupplierDue.count || 0} suppliers.`}
        />
      </Grid>
      <Grid item xs={12} sm={6} md={4} lg={3}>
        <AnalyticEcommerce
          title="Total profit"
          count={'₹' + (totalCustomers.amount || 0)}
          // percentage={percentage}
          extraLabel={'Total profit recorded this month'}
          //   extra={totalCustomers.count || 0 + ' customer(s)'}
        />
      </Grid>

      <Grid item xs={12} sm={6} md={4} lg={3}>
        <AnalyticEcommerce
          title="Growth metrics"
          count={'20%'}
          // percentage={percentage}
          extraLabel={'Growth metrics as per last month'}
          //   extra={totalCustomers.count || 0 + ' customer(s)'}
        />
      </Grid>
      <Grid item xs={12} sm={6} md={4} lg={3}>
        <AnalyticEcommerce
          title="Total due from customers"
          count={'20%'}
          // percentage={percentage}
          extraLabel={'Growth metrics as per last month'}
          //   extra={totalCustomers.count || 0 + ' customer(s)'}
        />
      </Grid>
      <Grid item xs={12} sm={6} md={4} lg={3}>
        <AnalyticEcommerce
          title="Total due to Supplier"
          count={'20%'}
          // percentage={percentage}
          extraLabel={'Total wasted recorded for this month'}
          //   extra={totalCustomers.count || 0 + ' customer(s)'}
        />
      </Grid>
      <Grid item xs={12} sm={6} md={4} lg={3}>
        <AnalyticEcommerce
          title="Total wastage"
          count={'20%'}
          // percentage={percentage}
          extraLabel={'Total wasted recorded for this month'}
          //   extra={totalCustomers.count || 0 + ' customer(s)'}
        />
      </Grid>

      <Grid item md={8} sx={{ display: { sm: 'none', md: 'block', lg: 'none' } }} />

      <Grid item xs={12} md={12} lg={12}>
        <Grid container alignItems="center" justifyContent="space-between">
          {/* <Grid item>
            <Typography variant="h5">Sales Overview</Typography>
          </Grid> */}
          <Grid item />
        </Grid>
        {/* <Grid container style={{ backgroundColor: 'lightgrey', height: 1, zIndex: '0' }} /> */}
        {/*   */}
        {/* <MainCard sx={{ mt: 2 }} content={false}>
          <Box sx={{ p: 3, pb: 0 }}>
            <Stack spacing={2}>
              <Typography variant="h6" color="text.secondary">
                Last 7 days Sales report
              </Typography>
              <Typography variant="h3">₹{weeklyTotalSales || 0}</Typography>
            </Stack>
          </Box>
        </MainCard> */}
      </Grid>

      {/* row 3 */}
      {/* <Grid item xs={12} md={7} lg={8}>
        <Grid container alignItems="center" justifyContent="space-between">
          <Grid item>
            <Typography variant="h5">Overdue Amounts (Top 10)</Typography>
          </Grid>
          <Grid item />
        </Grid>
        <MainCard sx={{ mt: 2 }} content={false}>
          {/* <OrdersTable /> 
        </MainCard>
      </Grid> */}
      <Grid
        container
        justifyContent={'center'}
        sx={{
          marginLeft: '25px',
          backgroundColor: 'white'
          // borderRadius: '15px',
          // borderLeft: '4px solid cornflowerblue',
          // borderRight: '4px solid cornflowerblue'
        }}
      >
        <Typography
          variant="h2"
          sx={{
            padding: '20px 100px 20px 100px'
            // color: 'cornflowerblue'
            // borderBottom: '4px solid cornflowerblue',
            // borderTop: '4px solid cornflowerblue'
          }}
        >
          Report
        </Typography>
      </Grid>
      <Grid container justifyContent={'space-between'} sx={{ margin: '0px 0px 0px 25px', mt: 1 }}>
        <Grid xl={5.9} justifyItems={'center'} sx={{ backgroundColor: 'white' }}>
          <Typography
            variant="h4"
            sx={{
              padding: '20px 80px 20px 80px'
            }}
          >
            Debit
          </Typography>
        </Grid>
        {/* <Grid xl={1} justifyItems={'center'} sx={{}}>
          <Grid style={{ width: '1px', margin: '12px 0px 20px 0px', backgroundColor: 'lightgrey', height: '60%' }} />
        </Grid> */}
        <Grid xl={5.9} justifyItems={'center'} sx={{ backgroundColor: 'white' }}>
          <Typography sx={{ padding: '20px 80px 20px 80px', borderRadius: 10 }} variant="h4">
            Credit
          </Typography>
        </Grid>
      </Grid>

      {/* row 4 */}
      {/* <Grid item xs={12} md={7} lg={8}>
        {/* <SaleReportCard /> 
      </Grid> */}
      <Grid item xs={12} md={6} lg={6} style={{ paddingTop: 0, margin: 0 }}>
        {/* <Grid container alignItems="center" justifyContent="space-between">
          {/* <Grid item>{/* <Typography variant="h5">Payment due for Purchase Orders</Typography> </Grid>
          <Grid item /> 
        </Grid> */}
        <Grid sx={{ mt: 1 }}>
          <List
            component="nav"
            sx={{
              px: 0,
              py: 0,
              '& .MuiListItemButton-root': {
                py: 1.5,
                '& .MuiAvatar-root': avatarSX,
                '& .MuiListItemSecondaryAction-root': { ...actionSX, position: 'relative' }
              }
            }}
          >
            {purchaseOrdersWithAmountDue.length
              ? purchaseOrdersWithAmountDue.map((e, i) => {
                  const { invoiceNumber, supplierName, cerditAmount, dueDate, dateOfPruchase, grandTotalAmount } = e;
                  if (i > 5) {
                    return null;
                  }
                  return (
                    <ListItemButton divider style={{ backgroundColor: 'white' }}>
                      <ListItemAvatar
                        sx={{
                          color: 'error.main',
                          bgcolor: 'error.lighter',
                          width: 80,
                          padding: '10px 0 10px 0',
                          display: 'flex',
                          marginRight: '20px',
                          justifyContent: 'center',
                          alignItems: 'center',
                          borderRadius: '20px'
                        }}
                      >
                        {/* <Avatar > */}
                        <Typography>Purchase</Typography>
                        {/* </Avatar> */}
                      </ListItemAvatar>
                      <ListItemText
                        primary={<Typography variant="subtitle1">Order #{invoiceNumber}</Typography>}
                        secondary={supplierName}
                      />
                      <ListItemSecondaryAction>
                        <Stack alignItems="flex-end">
                          <Typography variant="subtitle1" noWrap>
                            ₹{cerditAmount}
                          </Typography>
                          <Typography variant="h6" color="secondary" noWrap>
                            {dayjs(dueDate).format('YYYY-MM-DD')}
                          </Typography>
                        </Stack>
                      </ListItemSecondaryAction>
                    </ListItemButton>
                  );
                })
              : ''}
          </List>
        </Grid>
      </Grid>
      <Grid item xs={12} md={6} lg={6} style={{ paddingTop: 0, margin: 0 }}>
        {/* <Grid container alignItems="center" justifyContent="space-between">
          {/* <Grid item>{/* <Typography variant="h5">Payment due for Purchase Orders</Typography> </Grid>
          <Grid item /> 
        </Grid> */}
        <Grid sx={{ mt: 1 }}>
          <List
            component="nav"
            sx={{
              px: 0,
              py: 0,
              '& .MuiListItemButton-root': {
                py: 1.5,
                '& .MuiAvatar-root': avatarSX,
                '& .MuiListItemSecondaryAction-root': { ...actionSX, position: 'relative' }
              }
            }}
          >
            {purchaseOrdersWithAmountDue.length
              ? purchaseOrdersWithAmountDue.map((e, i) => {
                  const { invoiceNumber, supplierName, cerditAmount, dueDate, dateOfPruchase, grandTotalAmount } = e;
                  if (i > 5) {
                    return null;
                  }
                  return (
                    <ListItemButton divider style={{ backgroundColor: 'white' }}>
                      <ListItemAvatar
                        sx={{
                          color: 'success.main',
                          bgcolor: 'success.lighter',
                          width: 80,
                          padding: '10px 0 10px 0',
                          display: 'flex',
                          marginRight: '20px',
                          justifyContent: 'center',
                          alignItems: 'center',
                          borderRadius: '20px'
                        }}
                      >
                        {/* <Avatar > */}
                        <Typography>Sale</Typography>
                        {/* </Avatar> */}
                      </ListItemAvatar>
                      <ListItemText
                        primary={<Typography variant="subtitle1">Order #{invoiceNumber}</Typography>}
                        secondary={supplierName}
                      />
                      <ListItemSecondaryAction>
                        <Stack alignItems="flex-end">
                          <Typography variant="subtitle1" noWrap>
                            ₹{cerditAmount}
                          </Typography>
                          <Typography variant="h6" color="secondary" noWrap>
                            {dayjs(dueDate).format('YYYY-MM-DD')}
                          </Typography>
                        </Stack>
                      </ListItemSecondaryAction>
                    </ListItemButton>
                  );
                })
              : ''}
          </List>
        </Grid>
      </Grid>
    </Grid>
  );
}
