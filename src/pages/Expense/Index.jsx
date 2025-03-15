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
// import MainCard from 'components/MainCard';
// import AnalyticEcommerce from 'components/cards/statistics/AnalyticEcommerce';
// import MonthlyBarChart from './MonthlyBarChart';
// import SaleReportCard from './SaleReportCard';
// import OrdersTable from './OrdersTable';

// assets
import GiftOutlined from '@ant-design/icons/GiftOutlined';
import { useEffect, useState } from 'react';
import dayjs from 'dayjs';
import { client } from 'api/client';
import { useNavigate } from 'react-router';
import MainCard from 'components/MainCard';
import { Alert, Button, Paper, Snackbar, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, TextField } from '@mui/material';
import AlertDialog from 'components/AlertDialog';
import AddExpenseDialog from 'components/AddExpenseDialog';
import LottieAnimation from 'components/loaderDog';

const columns = [
  { id: 'expenseName', label: 'Expense Name', minWidth: '30%' },
  { id: 'expenseAmount', label: 'Amount', minWidth: '20%' },
  { id: 'expenseDate', label: 'Expense Date', minWidth: '20%' },
  { id: 'expenseTitle', label: 'Title', minWidth: '30%' }
];

// ==============================|| DASHBOARD - DEFAULT ||============================== //

export default function ExpenseDefault() {
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);
  const [refreshed, setRefreshed] = useState(false);

  const [expenseData, setExpenseData] = useState([]);

  useEffect(() => {
    (async () => {
      setLoading(true);
      client
        .get('/expense')
        .then((res) => setExpenseData(res.data.result.result))
        .catch((err) => setExpenseData([]))
        .finally(() => setLoading(false));
    })();

    return () => {
      return null;
    };
  }, [refreshed]);

  const handleAdd = async (data) => {
    client
      .post('/expense', data)
      .then((res) => {
        setError({ err: false, message: res.data.message });
        setOpen(false);
      })
      .catch((err) => {
        setError({ err: true, message: err.response.data.errorMessage });
      })
      .finally(() => handleClose());
  };

  const handleDelete = async (id) => {
    client
      .delete('/expense/' + id)
      .then((res) => {
        setError({ err: false, message: res.data.message });
        return true;
      })
      .catch((err) => setError({ err: true, message: err.response.data.errorMessage }))
      .finally(() => handleClose());
  };
  const handleClose = () => {
    setOpen(false);
    setRefreshed(!refreshed);
  };
  let vertical = 'top';
  let horizontal = 'center';
  let handleCloseSnackBar = () => {
    setError('');
  };
  if (loading) {
    return <LottieAnimation />;
  }
  return (
    <Grid container rowSpacing={4.5} columnSpacing={2.75}>
      {/* row 1 */}
      <Grid item xs={12} sx={{ mb: -2.25 }}>
        <Typography variant="h4">Expense Management</Typography>
      </Grid>
      <Snackbar
        anchorOrigin={{ vertical, horizontal }}
        open={error ? true : false}
        autoHideDuration={6000}
        onClose={handleCloseSnackBar}
        // action={action}
        key={vertical + horizontal}
      >
        {error && (
          <Alert severity={error && error.err ? 'error' : 'success'} variant="filled" sx={{ width: '100%' }}>
            {error.message}
          </Alert>
        )}
      </Snackbar>

      <Grid item md={8} sx={{ display: { sm: 'none', md: 'block', lg: 'none' } }} />

      <Grid item xs={12} md={12} lg={12}>
        <Grid container alignItems="center" justifyContent="space-between">
          <Grid item>
            {/* <Button variant="contained" onClick={() => setOpen(true)}>
              Add Expense
            </Button> */}
          </Grid>
          <Grid item />
          <AddExpenseDialog open={open} handleAdd={handleAdd} handleClose={handleClose} />
        </Grid>
        <Grid container justifyContent={'space-between'} alignItems={'center'}>
          <Typography variant="h5" color="text.primary" mt={2}>
            {expenseData.length} Expenses found
          </Typography>
          <Button variant="contained" color="info" onClick={() => setOpen(true)}>
            Add Expense
          </Button>
        </Grid>

        <MainCard sx={{ mt: 2 }} content={false}>
          <DenseTable columns={columns} data={expenseData} handleDelete={handleDelete} />
        </MainCard>
      </Grid>
      {/* row 4 */}
    </Grid>
  );
}

function DenseTable({ data = [], purpose = 'SALES', handleAdd, columns, name, handleDelete }) {
  const [open, setOpen] = useState(false);
  const [selectedData, setSelectedData] = useState({});

  const handleClose = () => {
    setOpen(false);
  };

  return (
    <Paper sx={{ width: '100%', overflow: 'hidden' }}>
      <TableContainer>
        <Table aria-label="sticky table" size="small">
          <TableHead>
            <TableRow>
              {columns.map((column) => (
                <TableCell key={column.id} align={column.align} style={{ width: column.minWidth }}>
                  {column.label}
                </TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {data.map((e) => (
              <TableRow
                sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                hover
                role="checkbox"
                tabIndex={-1}
                style={{ cursor: 'pointer' }}
                onClick={() => {
                  setSelectedData(e);
                  setOpen(true);
                }}
              >
                <TableCell>{e.expenseName}</TableCell>
                <TableCell>{parseFloat(e.expenseAmount).toFixed(2)}</TableCell>
                <TableCell>{dayjs(e.expenseDate).format('DD-MM-YYYY')}</TableCell>
                <TableCell>{e.expenseTitle}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      <AddExpenseDialog
        open={open}
        handleDelete={(id) => {
          const deleted = handleDelete(id);
          if (deleted) {
            handleClose();
          }
        }}
        handleClose={handleClose}
        data={selectedData}
        id={selectedData._id}
      />
    </Paper>
  );
}
