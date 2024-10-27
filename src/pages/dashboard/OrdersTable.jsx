import PropTypes from 'prop-types';
// material-ui
import Link from '@mui/material/Link';
import Stack from '@mui/material/Stack';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import axios from 'axios';

// third-party
import { NumericFormat } from 'react-number-format';

// project import
import Dot from 'components/@extended/Dot';
import { useEffect, useState } from 'react';
import { client } from 'api/client';

function createData(tracking_no, name, mobile, fat, carbs, protein) {
  return { tracking_no, name, mobile, fat, carbs, protein };
}

// const rows = [
//   createData(84564564, 'Pintu da', '8240828075', 40, 2, 40570),
//   createData(98764564, 'Prashanta da', '8240828075', 300, 2, 180139),
//   createData(98756325, 'Samir Da', '8240828075', 355, 2, 90989),
//   createData(98652366, 'Swarnab Majumder', '780988075', 50, 2, 10239),
//   createData(13286564, 'Supratim Sarkar', '8240828075', 100, 2, 83348),
//   createData(86739658, 'Bipul Majumder', '8240828075', 99, 2, 410780),
//   createData(13256498, 'Sandeep Ghosh', '8240828075', 125, 2, 70999),
//   createData(98753263, 'Sayan Gowswami', '8240828075', 89, 2, 10570),
//   createData(98751263, 'Bhabesh Kathari', '8240828075', 89, 2, 10570)
// ];

// let rows = [];

function descendingComparator(a, b, orderBy) {
  if (b[orderBy] < a[orderBy]) {
    return -1;
  }
  if (b[orderBy] > a[orderBy]) {
    return 1;
  }
  return 0;
}

function getComparator(order, orderBy) {
  return order === 'desc' ? (a, b) => descendingComparator(a, b, orderBy) : (a, b) => -descendingComparator(a, b, orderBy);
}

function stableSort(array, comparator) {
  console.log(array);
  const stabilizedThis = array.map((el, index) => [el, index]);
  stabilizedThis.sort((a, b) => {
    const order = comparator(a[0], b[0]);
    if (order !== 0) {
      return order;
    }
    return a[1] - b[1];
  });
  return stabilizedThis.map((el) => el[0]);
}

const headCells = [
  {
    id: 'tracking_no',
    align: 'left',
    disablePadding: false,
    label: 'Invoice No.'
  },
  {
    id: 'name',
    align: 'left',
    disablePadding: true,
    label: 'Mobile No.'
  },
  {
    id: 'mobile',
    align: 'left',
    disablePadding: true,
    label: 'Total Amount'
  },
  {
    id: 'fat',
    align: 'right',
    disablePadding: false,
    label: 'Amount paid'
  },
  {
    id: 'carbs',
    align: 'left',
    disablePadding: false,
    label: 'Amount due'
  },
  {
    id: 'protein',
    align: 'right',
    disablePadding: false,
    label: 'Billing date'
  }
];

// ==============================|| ORDER TABLE - HEADER ||============================== //

function OrderTableHead({ order, orderBy }) {
  return (
    <TableHead>
      <TableRow>
        {headCells.map((headCell) => (
          <TableCell
            key={headCell.id}
            align={headCell.align}
            padding={headCell.disablePadding ? 'none' : 'normal'}
            sortDirection={orderBy === headCell.id ? order : false}
          >
            {headCell.label}
          </TableCell>
        ))}
      </TableRow>
    </TableHead>
  );
}

function OrderStatus({ status }) {
  let color;
  let title;

  switch (status) {
    case 0:
      color = 'warning';
      title = 'Partially Paid';
      break;
    case 1:
      color = 'success';
      title = 'Fully Paid';
      break;
    case 2:
      color = 'error';
      title = 'Payment Due';
      break;
    default:
      color = 'primary';
      title = 'None';
  }

  return (
    <Stack direction="row" spacing={1} alignItems="center">
      <Dot color={color} />
      <Typography>{title}</Typography>
    </Stack>
  );
}

// ==============================|| ORDER TABLE ||============================== //

export default function OrderTable() {
  const order = 'asc';
  const orderBy = 'tracking_no';
  const [rows, setRows] = useState([]);
  const [salesArray, setSalesArray] = useState([]);

  useEffect(() => {
    salesArray.forEach((e) => {
      setRows([...rows, createData(e.billNumber, e.customerMobileNo, e.grandTotalAmount, e.paidAmount, e.cerditAmount, e.dateOfSale)]);
    });
  }, [salesArray]);

  useEffect(() => {
    client
      .get('/sales', {
        params: {
          page: 0,
          sortByCreditAmount: '-1',
          filterByCreditAmount: { $gt: 0 }
        }
      })
      .then((res) => {
        console.log(res.data.result.result);
        setSalesArray(res.data.result.result);
      });
  }, []);
  return (
    <Box>
      <TableContainer
        sx={{
          width: '100%',
          overflowX: 'auto',
          position: 'relative',
          display: 'block',
          maxWidth: '100%',
          '& td, & th': { whiteSpace: 'nowrap' }
        }}
      >
        <Table aria-labelledby="tableTitle">
          <OrderTableHead order={order} orderBy={orderBy} />
          <TableBody>
            {stableSort(rows, getComparator(order, orderBy)).map((row, index) => {
              const labelId = `enhanced-table-checkbox-${index}`;
              console.log(row);
              return (
                <TableRow
                  hover
                  role="checkbox"
                  sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                  tabIndex={-1}
                  key={row.tracking_no}
                >
                  <TableCell component="th" id={labelId} scope="row">
                    <Link color="secondary"> {row.tracking_no}</Link>
                  </TableCell>
                  <TableCell align="right">{row.name}</TableCell>
                  <TableCell align="right">
                    <NumericFormat value={row.mobile} displayType="text" thousandSeparator prefix="" />
                  </TableCell>
                  <TableCell align="right">
                    <NumericFormat value={row.fat} displayType="text" thousandSeparator prefix="" />
                  </TableCell>
                  <TableCell align="right">
                    <NumericFormat value={row.carbs} displayType="text" thousandSeparator prefix="" />
                  </TableCell>
                  <TableCell align="right">{row.protein}</TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
}
// createData(84564564, 'Pintu da', '8240828075', 40, 2, 40570),

// {
//   id: 'tracking_no',
//   align: 'left',
//   disablePadding: false,
//   label: 'Bill No.'
// },
OrderTableHead.propTypes = { order: PropTypes.any, orderBy: PropTypes.string };

OrderStatus.propTypes = { status: PropTypes.number };
