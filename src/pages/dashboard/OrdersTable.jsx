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
// third-party
import { NumericFormat } from 'react-number-format';

// project import
import Dot from 'components/@extended/Dot';
import { useEffect, useState } from 'react';
import { client } from 'api/client';
import dayjs from 'dayjs';

function createData(customerName, mobile, address, creditAmount) {
  return { customerName, mobile, address, creditAmount };
}

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
  // console.log(array);
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
    id: 'customerName',
    align: 'left',
    disablePadding: false,
    label: 'Customer Name'
  },
  {
    id: 'customerContactNo',
    align: 'left',
    disablePadding: true,
    label: 'Mobile No.'
  },
  {
    id: 'customerAddress',
    align: 'left',
    disablePadding: true,
    label: 'Address'
  },
  // {
  //   id: 'fat',
  //   align: 'right',
  //   disablePadding: false,
  //   label: 'Amount paid'
  // },
  {
    id: 'totalCreditAmount',
    align: 'left',
    disablePadding: false,
    label: 'Amount due'
  }
  // {
  //   id: 'protein',
  //   align: 'right',
  //   disablePadding: false,
  //   label: 'Billing date'
  // }
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
    let newValue = [];
    salesArray.forEach((e) => {
      newValue = [
        ...newValue,
        {
          customerName: e.customerName,
          customerContactNo: e.customerContactNo,
          customerAddress: e.customerAddress,
          // e.lastPurchaseDate,
          totalCreditAmount: e.totalCreditAmount
        }
      ];
      // setRows([
      //   ...rows,
      //   createData(
      //     e.customerName,
      //     e.customerContactNo,
      //     e.customerAddress,
      //     // e.lastPurchaseDate,
      //     e.totalCreditAmount
      //     // dayjs(e.dateOfSale).format('YYYY-MM-DD')
      //   )
      // ]);
    });
    setRows(newValue);
  }, [salesArray]);

  useEffect(() => {
    (async () => {
      client
        .get('/customer', {
          params: {
            page: 0,
            filterByCreditAmount: 'Y',
            sortByCreditAmount: 'DESC'
          }
        })
        .then((res) => {
          // console.log(res.data.result.result);
          setSalesArray(res.data.result.result);
        });
    })();
    return () => {
      return null;
    };
  }, []);
  console.log(rows);
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
              // console.log(row);
              if (index >= 10) return null; // Limit to 10 rows for performance
              return (
                <TableRow
                  hover
                  role="checkbox"
                  sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                  tabIndex={-1}
                  key={row.customerName}
                >
                  <TableCell component="th" id={labelId} scope="row">
                    {row.customerName}
                    {/* <Link color="secondary"> {row.customerName}</Link> */}
                  </TableCell>
                  {/* <TableCell align="right">{row.name}</TableCell> */}
                  <TableCell>{row.customerContactNo}</TableCell>
                  <TableCell>{row.customerAddress}</TableCell>
                  <TableCell>
                    <NumericFormat value={row.totalCreditAmount} displayType="text" thousandSeparator prefix="" />
                  </TableCell>
                  {/* <TableCell align="right">{row.protein}</TableCell> */}
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
