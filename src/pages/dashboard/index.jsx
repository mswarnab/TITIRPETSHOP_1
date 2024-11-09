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
import MonthlyBarChart from './MonthlyBarChart';
import SaleReportCard from './SaleReportCard';
import OrdersTable from './OrdersTable';

// assets
import GiftOutlined from '@ant-design/icons/GiftOutlined';
import { useEffect, useState } from 'react';
import dayjs from 'dayjs';
import { client } from 'api/client';
import { useNavigate } from 'react-router';

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

export default function DashboardDefault() {
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
        setTotalSales({ count: res.data.result.count, amount: res.data.result.result[0].totalSales });
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
        <Typography variant="h5">Dashboard</Typography>
      </Grid>
      <Grid item xs={12} sm={6} md={4} lg={3}>
        <AnalyticEcommerce
          expiredProducts={expiredProducts}
          title={`Stocks expiring by ${expiryDate}`}
          isLoss
          extraLabel={'Click to view the stocks'}
          count={expiredProducts?.count}
          // extra={'Click here to view more'}
          onHandleClick={() => navigate('/stock/expired')}
        />
      </Grid>
      <Grid item xs={12} sm={6} md={4} lg={3}>
        <AnalyticEcommerce
          title="Total sales in current month"
          count={`₹${totalSales.amount || 0}`}
          // percentage={percentage}
          extraLabel={''}
          extra={totalSales.count + ` sales made since last month`}
        />
      </Grid>
      <Grid item xs={12} sm={6} md={4} lg={3}>
        <AnalyticEcommerce
          title="Total due to suppliers"
          count={'₹' + (totalSupplierDue.amount || 0)}
          isLoss
          color="warning"
          extraLabel={'Total amount due'}
          extra={` to ${totalSupplierDue.count || 0} suppliers.`}
        />
      </Grid>
      <Grid item xs={12} sm={6} md={4} lg={3}>
        <AnalyticEcommerce
          title="Total amount due from customers"
          count={'₹' + (totalCustomers.amount || 0)}
          // percentage={percentage}
          extraLabel={'You have payment due for '}
          extra={totalCustomers.count || 0 + ' customer(s)'}
        />
      </Grid>

      <Grid item md={8} sx={{ display: { sm: 'none', md: 'block', lg: 'none' } }} />

      <Grid item xs={12} md={5} lg={4}>
        <Grid container alignItems="center" justifyContent="space-between">
          <Grid item>
            <Typography variant="h5">Sales Overview</Typography>
          </Grid>
          <Grid item />
        </Grid>
        <MainCard sx={{ mt: 2 }} content={false}>
          <Box sx={{ p: 3, pb: 0 }}>
            <Stack spacing={2}>
              <Typography variant="h6" color="text.secondary">
                This Week's Sales report
              </Typography>
              <Typography variant="h3">₹{weeklyTotalSales || 0}</Typography>
            </Stack>
          </Box>
          <MonthlyBarChart onTotalSaleChange={(value) => setWeeklyTotalSales(value)} />
        </MainCard>
      </Grid>

      {/* row 3 */}
      <Grid item xs={12} md={7} lg={8}>
        <Grid container alignItems="center" justifyContent="space-between">
          <Grid item>
            <Typography variant="h5">Overdue Amounts (Top 10)</Typography>
          </Grid>
          <Grid item />
        </Grid>
        <MainCard sx={{ mt: 2 }} content={false}>
          <OrdersTable />
        </MainCard>
      </Grid>

      {/* row 4 */}
      <Grid item xs={12} md={7} lg={8}>
        <SaleReportCard />
      </Grid>
      <Grid item xs={12} md={5} lg={4}>
        <Grid container alignItems="center" justifyContent="space-between">
          <Grid item>
            <Typography variant="h5">Payment due for Purchase Orders</Typography>
          </Grid>
          <Grid item />
        </Grid>
        <MainCard sx={{ mt: 2 }} content={false}>
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
              ? purchaseOrdersWithAmountDue.map((e) => {
                  const { invoiceNumber, supplierName, cerditAmount, dueDate, dateOfPruchase, grandTotalAmount } = e;
                  return (
                    <ListItemButton divider>
                      <ListItemAvatar>
                        <Avatar sx={{ color: 'error.main', bgcolor: 'error.lighter' }}>
                          <GiftOutlined />
                        </Avatar>
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

            {/* <ListItemButton divider>
              <ListItemAvatar>
                <Avatar sx={{ color: 'primary.main', bgcolor: 'primary.lighter' }}>
                  <MessageOutlined />
                </Avatar>
              </ListItemAvatar>
              <ListItemText primary={<Typography variant="subtitle1">Order #984947</Typography>} secondary="5 August, 1:45 PM" />
              <ListItemSecondaryAction>
                <Stack alignItems="flex-end">
                  <Typography variant="subtitle1" noWrap>
                    + $302
                  </Typography>
                  <Typography variant="h6" color="secondary" noWrap>
                    8%
                  </Typography>
                </Stack>
              </ListItemSecondaryAction>
            </ListItemButton>
            <ListItemButton>
              <ListItemAvatar>
                <Avatar sx={{ color: 'error.main', bgcolor: 'error.lighter' }}>
                  <SettingOutlined />
                </Avatar>
              </ListItemAvatar>
              <ListItemText primary={<Typography variant="subtitle1">Order #988784</Typography>} secondary="7 hours ago" />
              <ListItemSecondaryAction>
                <Stack alignItems="flex-end">
                  <Typography variant="subtitle1" noWrap>
                    + $682
                  </Typography>
                  <Typography variant="h6" color="secondary" noWrap>
                    16%
                  </Typography>
                </Stack>
              </ListItemSecondaryAction>
            </ListItemButton> */}
          </List>
        </MainCard>
        {/* <MainCard sx={{ mt: 2 }}>
          <Stack spacing={3}>
            <Grid container justifyContent="space-between" alignItems="center">
              <Grid item>
                <Stack>
                  <Typography variant="h5" noWrap>
                    Help & Support Chat
                  </Typography>
                  <Typography variant="caption" color="secondary" noWrap>
                    Typical replay within 5 min
                  </Typography>
                </Stack>
              </Grid>
              <Grid item>
                <AvatarGroup sx={{ '& .MuiAvatar-root': { width: 32, height: 32 } }}>
                  <Avatar alt="Remy Sharp" src={avatar1} />
                  <Avatar alt="Travis Howard" src={avatar2} />
                  <Avatar alt="Cindy Baker" src={avatar3} />
                  <Avatar alt="Agnes Walker" src={avatar4} />
                </AvatarGroup>
              </Grid>
            </Grid>
            <Button size="small" variant="contained" sx={{ textTransform: 'capitalize' }}>
              Need Help?
            </Button>
          </Stack>
        </MainCard> */}
      </Grid>
    </Grid>
  );
}
