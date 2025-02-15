import { Button, Grid, Paper, Stack, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Typography } from '@mui/material';

import React, { useEffect, useState, useRef } from 'react';
import Image from 'assets/images/icons/logo/Titir Pet Logo.png';
import QRImage from 'assets/images/qrPayment.jpeg';

import dayjs from 'dayjs';
// import LottieAnimation from 'components/loaderDog';
import { jsPDF } from 'jspdf';
import { client } from 'api/client';

function createData(invoice, item, quantity, mrp, rate, purchaseDate) {
  const formattedDate =
    purchaseDate.toString().substring(6, 9) + '/' + purchaseDate.toString().substring(4, 6) + '/' + purchaseDate.toString().substring(0, 4);
  return { invoice, item, quantity, mrp, rate, purchaseDate: formattedDate };
}

export default function CustomerBillGenarate() {
  const [saleDetails, setSaleDetails] = useState([]);
  const [totalAmount, setTotalAmount] = useState(0.0);
  const [paidAmount, setPaidAmount] = useState(0.0);
  const [discount, setDiscount] = useState(0.0);
  const [dueAmount, setDueAmount] = useState(0.0);

  const [customerDetails, setCustomerDetails] = useState([]);
  const contentRef = useRef(); // Reference to the content to be converted

  const handleDownload = () => {
    const doc = new jsPDF();

    // You can use the `html` method to capture an HTML element and convert it to PDF.
    // jsPDF will convert the content into PDF and automatically scale it.
    doc.html(contentRef.current, {
      callback: (doc) => {
        // When the conversion is done, save the PDF with a filename
        doc.save('downloaded-page.pdf');
        window.close();
      },
      x: 0, // Starting X position of the content in the PDF
      y: 0, // Starting Y position of the content in the PDF
      width: navigator.userAgent.toString().toLocaleLowerCase().includes('windows') ? 265 : 150, // Width of the content in the PDF
      windowWidth: document.body.scrollWidth
    });
  };

  const columns = [
    {
      id: 'purchaseDate',
      label: 'Date',
      minWidth: '10%'
    },
    { id: 'invoice', label: 'Invoice', minWidth: '6%' },
    { id: 'item', label: 'Item', minWidth: '25%' },

    { id: 'quantity', label: 'QTY', minWidth: '5%' },
    { id: 'mrp', label: 'MRP', minWidth: '10%' },

    {
      id: 'rate',
      label: 'Amount',
      minWidth: '9%'
    }
  ];

  const [loading, setLoading] = useState(true);
  const [customerId, setCustomerId] = useState(window.location.href.split('/')[window.location.href.split('/').length - 1]);

  // console.log(rows);

  // useEffect(() => {
  //   const timer = setTimeout(() => {
  //     setLoading(false);
  //   }, 3000);
  //   return () => clearTimeout(timer);
  // }, []);
  // if (loading) {
  //   return <LottieAnimation />;
  // }

  let generateMonthlyBill = () => {
    client.get('/customer/monthlybill/' + customerId).then((res) => {
      // setMonthlySaleDetails(res.data.result.saleDetails);
      const tempSaleDetails = res.data.result.saleDetails.result;
      let saleArray = [];
      let totalAmount = 0;
      let paidAmount = 0;
      let discount = 0;
      let dueAmount = 0;

      tempSaleDetails.map((e) => {
        e.products.forEach((el) => {
          saleArray = [
            ...saleArray,
            createData(
              e.billNumber,
              el.productName,
              el.quantity,
              el.mrp,
              parseFloat(parseFloat(el.sellingPrice) * parseInt(el.quantity)).toFixed(2),
              e.dateOfSale
            )
          ];
          totalAmount = parseFloat(parseFloat(totalAmount) + parseFloat(el.sellingPrice) * parseInt(el.quantity)).toFixed(2);
          paidAmount += parseFloat(e.paidAmount);
          discount += parseFloat(el.discountedAmount);
        });
      });
      // return { invoice, item, quantity, rate, purchaseDate };
      dueAmount = (totalAmount - paidAmount).toFixed(2);
      setDueAmount(dueAmount);
      setPaidAmount(paidAmount);
      setDiscount(discount);
      setTotalAmount(totalAmount);
      setSaleDetails(saleArray);
      setCustomerDetails(res.data.result.customerDetails);
      // setError({ err: false, message: res.data.message });
      // const width = window.innerWidth; // Get the full width of the screen
      // const height = window.innerHeight; // Get the full height of the screen
      // window.open('http://localhost:5174/customerbill/id', '', `width=${width},height=${height},top=0,left=0`); // You can specify a URL or leave it blank
    });
    // .catch((err) => setError({ err: true, message: err.response.data.errorMessage }));
  };

  useEffect(() => {
    // openWindow();
    // print('a', 'jsx-template');
    if (saleDetails.length) {
      handleDownload();
    }
    // window.close();
    // setDownloaded(true);
    // closeWindow();
  }, [saleDetails]);
  useEffect(() => {
    generateMonthlyBill();
  }, []);

  // if (setDownloaded) {
  //   return null;
  // }

  // useEffect(() => {

  // }, [saleDetails]);

  return (
    // <Grid xl={3}>
    <Grid>
      <Grid container sx={{ backgroundColor: '#ffffff' }} width={'80%'} ref={contentRef}>
        {/* row 1 */}
        {/* <Grid> */}
        <Stack
          sx={{
            alignItems: 'center',
            justifyContent: 'center',
            width: '100%',
            height: '100%',
            backgroundColor: 'cornflowerblue',
            color: 'white',
            padding: '60px',
            marginBottom: '30px'
          }}
          spacing={0}
          maxHeight={70}
        >
          <Typography variant="h2" sx={{ fontFamily: 'sans-serif' }}>
            Total Due
          </Typography>
          <Typography variant="h2" sx={{ fontFamily: 'sans-serif' }}>
            {dueAmount}
          </Typography>
        </Stack>
        {/* </Grid> */}
        {/* <Grid> */}
        <Grid container justifyContent={'center'} marginBottom="20px">
          <Button variant="contained" size="large" sx={{ padding: '10px 220px', backgroundColor: '#f5f5f5' }}>
            <Typography variant="h2" color={'black'}>
              Invoice
            </Typography>
          </Button>{' '}
        </Grid>
        <Stack
          direction="row"
          padding={1.5}
          sx={{ display: 'flex', justifyContent: 'space-between', width: '100%', height: '100%', padding: '0px 80px' }}
          maxHeight={120}
        >
          <Grid display={'flex'} alignItems={'center'}>
            <img src={Image} style={{ width: '180px', height: '120px', position: 'relative', left: -45 }} />
            <Grid>
              <Typography variant="h1" color={'#444597'} style={{ position: 'relative', left: -55 }}>
                TITIR PET SHOP
              </Typography>
              <Typography variant="body" color={'grey'} sx={{ paddingTop: '8px', position: 'relative', left: -50 }}>
                Your one stop pet solution.
              </Typography>
            </Grid>
          </Grid>
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
        {/* <Divider></Divider> */}
        <Grid container sx={{ height: '1px', backgroundColor: '#f5f5f5', margin: '20px 80px 35px 80px' }} />

        <Stack direction="row" padding={'0px 80px'} sx={{ display: 'flex', justifyContent: 'space-between', width: '100%' }}>
          <Stack>
            <Typography variant="h5">
              Bill To : <span>{customerDetails.customerName}</span>
            </Typography>
            <Typography variant="body">
              Mob: <span style={{ color: '#1677ff' }}>+91 {1212121212}</span>
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
        {/* <Grid container sx={{ height: '1px', backgroundColor: '#f5f5f5', margin: '40px 40px 35px 40px' }} /> */}
        <Grid container sx={{ padding: '40px 80px' }}>
          <Grid container style={{ backgroundColor: '#f5f5f5', height: 1 }}>
            {/* <Chip label="Invoice details" size="small" color="secondary" /> */}
            <Button
              variant="contained"
              size="small"
              style={{
                position: 'absolute',
                top: 475,
                left: navigator.userAgent.toString().toLocaleLowerCase().includes('windows') ? '47%' : '43%',
                backgroundColor: 'grey'
              }}
            >
              Item details
            </Button>
          </Grid>
        </Grid>
        <Grid sx={{ width: '100%', padding: '0px 80px' }}>
          <DenseTable productDtls={saleDetails} columns={columns} />
        </Grid>
        <Grid sx={{ width: '100%', padding: '0px 80px' }}>
          <Grid
            container
            sx={{
              height: '1px',
              backgroundColor: '#f5f5f5',
              margin: navigator.userAgent.toString().toLocaleLowerCase().includes('windows') ? '40px 0px 10px 0' : '40px 0px 40px 0'
            }}
          />
          <Grid display={'flex'} justifyContent={'space-between'}>
            <Grid>
              <img
                src={QRImage}
                style={
                  navigator.userAgent.toString().toLocaleLowerCase().includes('windows')
                    ? { width: '250px', height: '300px', paddingTop: '60px' }
                    : { width: '100px', height: '120px', transform: 'scale(1.5)' }
                }
              />
            </Grid>
            <Grid display={'flex'} flexDirection={'column'} justifyContent={'flex-end'} justifySelf={'flex-end'}>
              <Grid display={'flex'} justifyContent={'space-between'} marginBottom={'15px'}>
                <Typography variant="h4">Total Amount:</Typography>
                <Typography variant="h4" sx={{ color: 'cornflowerblue', marginLeft: '20px' }}>
                  {totalAmount}
                </Typography>
              </Grid>

              <Grid display={'flex'} justifyContent={'space-between'} marginBottom={'15px'}>
                <Typography variant="h4">Paid Amount:</Typography>
                <Typography variant="h4" sx={{ color: 'cornflowerblue', marginLeft: '20px' }}>
                  {paidAmount}
                </Typography>
              </Grid>
              <Grid display={'flex'} justifyContent={'space-between'} marginBottom={'15px'}>
                <Typography variant="h4">Discount:</Typography>
                <Typography variant="h4" sx={{ color: 'cornflowerblue', marginLeft: '20px' }}>
                  {discount}
                </Typography>
              </Grid>
              <Grid display={'flex'} justifyContent={'space-between'} paddingBottom={'40px'}>
                <Typography variant="h4">Amount Due:</Typography>
                <Typography variant="h4" sx={{ color: 'cornflowerblue', marginLeft: '20px' }}>
                  {dueAmount}
                </Typography>
              </Grid>
            </Grid>
          </Grid>
        </Grid>
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
    <Paper sx={{ width: '100%' }}>
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
            {productDtls.map((row) => (
              <TableRow sx={{ '&:last-child td, &:last-child th': { border: 0 } }} hover role="checkbox" tabIndex={-1}>
                <TableCell>{row.purchaseDate}</TableCell>
                <TableCell>{row.invoice}</TableCell>
                <TableCell>{row.item}</TableCell>
                <TableCell>{row.quantity}</TableCell>
                <TableCell>{row.mrp}</TableCell>
                <TableCell>{row.rate}</TableCell>
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
