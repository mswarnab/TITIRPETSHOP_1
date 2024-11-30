import { Container, Grid, Paper, Stack, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Typography } from '@mui/material';
import React, { useEffect, useState } from 'react';
import Image from 'assets/images/icons/logo/Titir Pet Logo.png';
import { Divider } from 'antd';
import { red } from '@ant-design/colors';
import { minWidth } from '@mui/system';
import dayjs from 'dayjs';
import LottieAnimation from 'components/loaderDog';
function createData(item, quantity, rate, purchaseDate, price) {
  // const density = population / size;
  return { item, quantity, rate, purchaseDate };
}

export default function CustomerBillGenarate() {
  const columns = [
    { id: 'item', label: 'Item', minWidth: '40%' },
    { id: 'quantity', label: 'QTY', minWidth: '5%' },
    {
      id: 'rate',
      label: 'Rate',
      minWidth: '5%'
      // align: 'right',
      // format: (value) => value.toLocaleString('en-US')
    },
    {
      id: 'purchaseDate',
      label: 'Date',
      minWidth: '15%'
    }
    // {
    //   id: 'price',
    //   label: 'Price',
    //   minWidth: '15%'
    //   // align: 'right',
    //   // format: (value) => value.toLocaleString('en-US')
    // }
  ];
  const rows = [
    createData('RC MAXI(P) 4KG', '10', 100, '23/11/24', 1000),
    createData('RC MAXI(P) 4KG', '10', 100, '23/11/24', 1000),

    createData('RC MAXI(P) 4KG', '10', 100, '23/11/24', 1000),
    createData('RC MAXI(P) 4KG', '10', 100, '23/11/24', 1000),
    createData('RC MAXI(P) 4KG', '10', 100, '23/11/24', 1000),
    createData('RC MAXI(P) 4KG', '10', 100, '23/11/24', 1000),
    createData('RC MAXI(P) 4KG', '10', 100, '23/11/24', 1000),
    createData('RC MAXI(P) 4KG', '10', 100, '23/11/24', 1000),
    createData('RC MAXI(P) 4KG', '10', 100, '23/11/24', 1000),
    createData('RC MAXI(P) 4KG', '10', 100, '23/11/24', 1000),
    createData('RC MAXI(P) 4KG', '10', 100, '23/11/24', 1000),
    createData('RC MAXI(P) 4KG', '10', 100, '23/11/24', 1000),
    createData('RC MAXI(P) 4KG', '10', 100, '23/11/24', 1000),
    createData('RC MAXI(P) 4KG', '10', 100, '23/11/24', 1000),
    createData('RC MAXI(P) 4KG', '10', 100, '23/11/24', 1000),
    createData('RC MAXI(P) 4KG', '10', 100, '23/11/24', 1000),
    createData('RC MAXI(P) 4KG', '10', 100, '23/11/24', 1000),
    createData('RC MAXI(P) 4KG', '10', 100, '23/11/24', 1000)
  ];
  const [loading, setLoading] = useState(true);
  // console.log(rows);

  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false);
    }, 3000);
    return () => clearTimeout(timer);
  }, []);
  if (loading) {
    return <LottieAnimation />;
  }
  return (
    // <Grid xl={3}>
    <Grid container sx={{ backgroundColor: '#ffffff' }}>
      {/* row 1 */}
      {/* <Grid> */}
      <Stack
        sx={{ alignItems: 'center', justifyContent: 'center', width: '100%', height: '100%', backgroundColor: '#008080', color: 'white' }}
        spacing={0}
        // padding={'15px 0 15px 0'}
        maxHeight={70}
      >
        <Typography variant="h5" sx={{ fontFamily: 'sans-serif' }}>
          Total Due
        </Typography>
        <Typography variant="h5" sx={{ fontFamily: 'sans-serif' }}>{`₹50,000`}</Typography>
      </Stack>
      {/* </Grid> */}
      {/* <Grid> */}
      <Stack
        direction="row"
        padding={1.5}
        sx={{ display: 'flex', justifyContent: 'space-between', width: '100%', height: '100%' }}
        maxHeight={120}
      >
        <Stack>
          <img src={Image} style={{ width: '100px', height: '70px' }} />
          <Typography variant="body">TITIR PET SHOP</Typography>
        </Stack>
        {/* <Stack padding={0}>
          <Typography variant="h4">CUSTOMER BILL</Typography>
          <Typography variant="h5">ADDRESS: </Typography>
          <Typography variant="h6">PATULIYA, KHARDAHA</Typography>
          <Typography variant="h6">PIN: 700118</Typography>
          <Typography variant="h6">
            MOB: <span style={{ color: '#1677ff' }}>+91 9836214748</span>
          </Typography>
        </Stack> */}
        <Stack padding={0}>
          <Typography variant="h5">TITIR PET SHOP</Typography>
          <Typography variant="h6">Address: </Typography>
          <Typography variant="body">Patuliya, Khardaha</Typography>
          <Typography variant="body">Pin: 700118</Typography>
          <Typography variant="body">
            Mob: <span style={{ color: '#1677ff' }}>+91 9836214748</span>
          </Typography>
        </Stack>
      </Stack>
      {/* </Grid> */}
      <Divider></Divider>
      <Stack direction="row" padding={'0px 12px 0px 12px'} sx={{ display: 'flex', justifyContent: 'space-between', width: '100%' }}>
        <Stack>
          <Typography variant="h5">
            Bill To : <span>Dodo Mia</span>
          </Typography>
          <Typography variant="body">
            Mob: <span style={{ color: '#1677ff' }}>+91 9836214748</span>
          </Typography>
        </Stack>
        <Stack paddingLeft={1.5}>
          <Typography variant="bady">
            <b>Date</b> : <span>{dayjs('2024-11-30').format('MMM DD, YYYY')}</span>
          </Typography>
          {/* <Typography variant="body">
            Mob: <span style={{ color: '#1677ff' }}>+91 9836214748</span>
          </Typography> */}
        </Stack>
      </Stack>
      <Divider></Divider>
      <Grid sx={{ width: '100%', padding: '0px 10px' }}>
        <DenseTable productDtls={rows} columns={columns} />
      </Grid>
    </Grid>
    // </Grid>
  );
}

function DenseTable({ productDtls = [], columns }) {
  // productDtls.map();
  // const rows = [
  //   createData('Frozen yoghurt', 159, 6.0, 24, 4.0),
  //   createData('Ice cream sandwich', 237, 9.0, 37, 4.3),
  //   createData('Eclair', 262, 16.0, 24, 6.0),
  //   createData('Cupcake', 305, 3.7, 67, 4.3),
  //   createData('Gingerbread', 356, 16.0, 49, 3.9)
  // ];
  return (
    <Paper sx={{ width: '100%', overflow: 'hidden' }}>
      <TableContainer sx={{ maxHeight: 400 }}>
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
            {productDtls.map((row) => (
              <TableRow sx={{ '&:last-child td, &:last-child th': { border: 0 } }} hover role="checkbox" tabIndex={-1}>
                <TableCell>{row.item}</TableCell>
                <TableCell>{row.quantity}</TableCell>
                <TableCell>{row.rate}</TableCell>
                <TableCell>{row.purchaseDate}</TableCell>
                {/* <TableCell>{row.price}</TableCell> */}
                {/* <TableCell align="right">{row.quantity}</TableCell> */}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Paper>
  );
}
