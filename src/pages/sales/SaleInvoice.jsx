import {
  Button,
  Divider,
  Grid,
  Paper,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography
} from '@mui/material';

import React, { useEffect, useState, useRef } from 'react';
import Image from 'assets/images/icons/logo/Titir Pet Logo.png';
import QRImage from 'assets/images/qrPayment.jpeg';

import dayjs, { Dayjs } from 'dayjs';
// import LottieAnimation from 'components/loaderDog';
import { jsPDF } from 'jspdf';
import { client } from 'api/client';
// import { color } from 'framer-motion';
// import { fontSize } from '@mui/system';

function createData(sNo, item, quantity, mrp, discountedAmount, rate) {
  // const formattedDate =
  // purchaseDate.toString().substring(6, 9) + '/' + purchaseDate.toString().substring(4, 6) + '/' + purchaseDate.toString().substring(0, 4);
  return { sNo, item, quantity, mrp, discountedAmount, rate };
}
function formatToRupee(amount) {
  return '' + amount.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
}

export default function SaleInvoice() {
  const [saleDetails, setSaleDetails] = useState([]);
  const [totalAmount, setTotalAmount] = useState(0.0);
  const [paidAmount, setPaidAmount] = useState(0.0);
  const [discount, setDiscount] = useState(0.0);
  const [dueAmount, setDueAmount] = useState(0.0);
  const [invoiceNumber, setInvoiceNumber] = useState('');
  // const [previousDueAmount, setPreviousDueAmount] = useState(0);
  const [customerDetails, setCustomerDetails] = useState({});
  const [customerId, setCustomerId] = useState('');
  const [customerAVL, setCustomerAVL] = useState('');
  const [purchaseDate, setPurchaseDate] = useState('');
  const contentRef = useRef(); // Reference to the content to be converted

  const handleDownload = (name) => {
    const doc = new jsPDF();

    // You can use the `html` method to capture an HTML element and convert it to PDF.
    // jsPDF will convert the content into PDF and automatically scale it.
    doc.html(contentRef.current, {
      callback: (doc) => {
        // When the conversion is done, save the PDF with a filename
        // window.print();
        doc.save(`${name}.pdf`);
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
      id: 'sNo',
      label: 'Sr. No',
      minWidth: '10%'
    },
    { id: 'item', label: 'Item', minWidth: '25%' },
    { id: 'quantity', label: 'QTY', minWidth: '5%' },
    { id: 'mrp', label: 'MRP', minWidth: '10%' },
    { id: 'discount', label: 'Discount', minWidth: '6%' },
    {
      id: 'rate',
      label: 'Amount',
      minWidth: '9%'
    }
  ];

  const [loading, setLoading] = useState(true);
  const [saleId, setSaleId] = useState(window.location.href.split('/')[window.location.href.split('/').length - 1]);

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
  // console.log(QRImage);
  let getSaleDetails = () => {
    client.get('/sales/' + saleId).then((res) => {
      // setMonthlySaleDetails(res.data.result.saleDetails);
      const tempSaleDetails = res.data.result.result;

      if (!tempSaleDetails) {
        return;
      }

      setInvoiceNumber(tempSaleDetails.billNumber);
      setTotalAmount(tempSaleDetails.grandTotalAmount);
      setDueAmount(tempSaleDetails.cerditAmount);
      setPaidAmount(tempSaleDetails.paidAmount);
      setDiscount(tempSaleDetails.discountedAmount);
      setCustomerId(tempSaleDetails.customerId);
      setPurchaseDate(tempSaleDetails.dateOfSale);
      // setPreviousDueAmount(0);

      if (tempSaleDetails.customerId && tempSaleDetails.customerId != 'No DATA') {
        // console.log('here');
        client
          .get('/customer/' + tempSaleDetails.customerId)
          .then((res) => {
            if (res.data.result.result) {
              setCustomerDetails(res.data.result.result);
            }
          })
          .finally(() => setCustomerAVL('NA'));
      } else {
        // console.log('else');
        setCustomerAVL('NA');
      }
      let saleArray = [];
      // let totalAmount = 0;
      // let paidAmount = 0;
      // let discount = 0;
      // let dueAmount = 0;

      tempSaleDetails.products.forEach((e, i) => {
        saleArray = [
          ...saleArray,
          createData(i + 1, e.productName, e.quantity, e.mrp, parseFloat(parseFloat(e.sellingPrice)).toFixed(2), e.discountedAmount)
        ];
      });

      // console.log(saleArray);

      setSaleDetails(saleArray);

      // tempSaleDetails.map((e) => {
      //   e.products.forEach((el) => {
      //     saleArray = [
      //       ...saleArray,
      //       createData(e.billNumber, el.productName, el.quantity, el.mrp, parseFloat(parseFloat(el.sellingPrice)).toFixed(2), e.dateOfSale)
      //     ];
      //     totalAmount = parseFloat(parseFloat(totalAmount) + parseFloat(el.sellingPrice) * parseInt(el.quantity)).toFixed(2);
      //     paidAmount = (parseFloat(paidAmount) + parseFloat(e.paidAmount)).toFixed(2);
      //     discount = (parseFloat(discount) + parseFloat(el.discountedAmount)).toFixed(2);
      //   });
      // });
      // return { invoice, item, quantity, rate, purchaseDate };
      // dueAmount = (totalAmount - paidAmount).toFixed(2);
      // const creditAmount = parseFloat(res.data.result.customerDetails.totalCreditAmount).toFixed(2);
      // setDueAmount(dueAmount);
      // setPaidAmount(paidAmount);
      // setDiscount(discount);
      // setTotalAmount(totalAmount);
      // setSaleDetails(saleArray);
      // setCustomerDetails(res.data.result.customerDetails);
      // setInvoiceNumber(res.data.result.invoiceNumber.toUpperCase());
      // setPreviousDueAmount(parseFloat(parseFloat(creditAmount) - parseFloat(dueAmount)).toFixed(2));

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
    console.log(invoiceNumber);
    console.log(customerDetails);
    console.log(customerAVL);

    if (invoiceNumber.length && (customerDetails.customerName || customerAVL == 'NA')) {
      handleDownload(invoiceNumber);
    }
    // window.close();
    // setDownloaded(true);
    // closeWindow();
  }, [saleDetails, customerAVL]);
  useEffect(() => {
    getSaleDetails();
  }, []);

  return (
    // <Grid xl={3}>
    <Grid sx={{ display: 'flex', justifyContent: 'center' }}>
      <Grid container sx={{ backgroundColor: '#ffffff', border: '1px solid lightgray', paddingTop: 5 }} width={'80%'} ref={contentRef}>
        <Stack
          direction="row"
          padding={1.5}
          sx={{ display: 'flex', justifyContent: 'space-between', width: '100%', height: '100%', padding: '0px 80px' }}
          maxHeight={150}
        >
          <Grid display={'flex'} alignItems={'center'}>
            <img src={Image} style={{ width: '250px', height: '180px', position: 'relative', left: -45, top: 30 }} />
            <Grid>
              <Typography fontFamily="sans-serif" variant="h1" color={'#444597'} style={{ position: 'relative', left: -55, top: 30 }}>
                TITIR PET SHOP
              </Typography>
              {/* <Typography variant="body" color={'grey'} sx={{ paddingTop: '8px', position: 'relative', fontSize: 18, left: -50 }}>
                .
              </Typography> */}
              <Typography variant="h4" color={'#333'} style={{ position: 'relative', left: -50, top: 30 }}>
                Patulia, Khardaha, Pin: 700119
              </Typography>
              <Typography variant="h4" color={'#333'} style={{ position: 'relative', left: -50, top: 30 }}>
                Mob: <span style={{ color: '#1677ff' }}>+91 9836214748</span>
              </Typography>
            </Grid>
          </Grid>

          <Stack sx={{ display: 'flex' }}>
            {/* <Typography fontFamily="sans-serif" variant="h1" color="#444597">
              <b>INVOICE</b>
            </Typography> */}
          </Stack>
          <Stack sx={{ position: 'relative', top: 50 }}>
            {/* <Typography fontFamily="sans-serif" variant="h1" color="#444597">
              <b>
                <u>INVOICE</u>
              </b>
            </Typography> */}
            <Typography variant="h4" fontFamily="sans-serif" sx={{ color: '#444597' }}>
              INVOICE NO : <span style={{ color: '#333', fontSize: '19px' }}>{invoiceNumber}</span>
            </Typography>
            <Typography variant="h4" fontFamily="sans-serif" sx={{ color: '#444597' }}>
              DATE : <span style={{ color: '#333', fontSize: '19px' }}>{dayjs(purchaseDate).format('MMMM DD, YYYY')}</span>
            </Typography>
            <Typography variant="h4" fontFamily="sans-serif" sx={{ color: '#444597' }}>
              BILL TO : <span style={{ color: '#333', fontSize: '19px' }}>{customerDetails ? customerDetails.customerName : ' '}</span>
            </Typography>
            <Typography variant="h4" fontFamily="sans-serif" sx={{ color: '#444597' }}>
              MOB: <span style={{ color: '#333', fontSize: '19px' }}> {customerDetails ? customerDetails.customerContactNo : ' '}</span>
            </Typography>
          </Stack>
        </Stack>
        {/* </Grid> */}
        {/* <Divider></Divider> */}
        {/* <Grid container sx={{ height: '2px', backgroundColor: '#444597', margin: '50px 80px 35px 80px' }} /> */}

        <Stack direction="row" padding={'0px 80px'} sx={{ display: 'flex', justifyContent: 'space-between', width: '100%' }}>
          <Stack paddingLeft={1.5}>
            {/* <Typography variant="body">
            Mob: <span style={{ color: '#1677ff' }}>+91 9836214748</span>
          </Typography> */}
          </Stack>
        </Stack>
        {/* <Grid container sx={{ height: '2px', backgroundColor: '#444597', margin: '50px 80px 35px 80px' }} /> */}
        {/* <div
          style={{
            position: 'absolute',
            top: 227,
            // borderLeft: '1px solid #444597',
            // borderRight: '1px solid #444597',
            // borderTop: '1px solid   #444597',
            // borderBottom: '1px solid   #444597',
            padding: 3,
            borderRadius: 20,
            left: navigator.userAgent.toString().toLocaleLowerCase().includes('windows') ? '47%' : '43%',
            backgroundColor: 'white',
            borderColor: '#444597',
            color: '#444597',
            fontSize: '15px',
            fontFamily: 'sans-serif'
          }}
        >
          <b>ITEM DETAILS</b>
        </div> */}
        {/* <Grid container sx={{ height: '1px', backgroundColor: '#f5f5f5', margin: '40px 40px 35px 40px' }} /> */}
        {/* <Grid container sx={{ padding: '0px 0px' }}>
          <Grid container style={{ backgroundColor: '#f5f5f5', height: 1 }}>
            <Button
              variant="contained"
              size="small"
              style={{
                position: 'absolute',
                // top: 497,
                left: navigator.userAgent.toString().toLocaleLowerCase().includes('windows') ? '47%' : '43%',
                backgroundColor: 'grey'
              }}
            >
              Item details
            </Button>
          </Grid>
        </Grid> */}
        <Grid sx={{ width: '100%', padding: '50px 80px 0px' }}>
          <DenseTable productDtls={saleDetails} columns={columns} />
        </Grid>
        <Grid container sx={{ height: '2px', backgroundColor: '#444597', margin: '20px 80px 5px 80px' }} />

        <Grid display={'flex'} justifyContent={'space-between'} sx={{ width: '100%', padding: '0px 80px' }}>
          <Typography variant="h4" paddingRight={12} fontFamily="sans-serif" sx={{ color: '#444597' }}>
            FINAL AMOUNT
          </Typography>
          <Typography variant="h4" sx={{ color: '#333', marginLeft: '20px' }}>
            {formatToRupee(totalAmount)}
          </Typography>
        </Grid>

        <Grid container sx={{ height: '2px', backgroundColor: '#444597', margin: '5px 80px 5px 80px' }} />
        {/* <Grid
            container
            sx={{
              height: '1px',
              backgroundColor: '#f5f5f5',
              margin: navigator.userAgent.toString().toLocaleLowerCase().includes('windows') ? '40px 0px 10px 0' : '40px 0px 40px 0'
            }}
          /> */}

        <Grid sx={{ width: '100%', padding: '0px 80px' }}>
          <Grid display={'flex'} justifyContent={'space-between'}>
            <Grid lg={6}>
              <img
                src={null}
                style={
                  navigator.userAgent.toString().toLocaleLowerCase().includes('windows')
                    ? { width: '250px', height: '300px', paddingTop: '60px' }
                    : { width: '100px', height: '120px', transform: 'scale(1.5)' }
                }
              />
            </Grid>
            <Grid lg={6} display={'flex'} flexDirection={'column'}>
              {/* <Grid display={'flex'} justifyContent={'space-between'} marginBottom={'15px'}>
                <Typography variant="h4">Total Amount:</Typography>
                <Typography variant="h4" sx={{ color: 'cornflowerblue', marginLeft: '20px' }}>
                  {totalAmount}
                </Typography>
              </Grid> */}

              <Grid container marginBottom={'15px'} marginTop={'20px'}>
                {/* <Grid container marginBottom={'5px'}>
                  <Grid lg={9} sx={{ display: 'flex', justifyContent: 'flex-end' }}>
                    <Typography variant="h4" fontFamily="sans-serif" sx={{ color: '#444597' }}>
                      DISCOUNT :
                    </Typography>
                  </Grid>
                  <Grid lg={3} sx={{ display: 'flex', justifyContent: 'flex-end' }}>
                    <Typography variant="h4" sx={{ color: '#333', marginLeft: '0px' }}>
                      {discount > 0 ? formatToRupee(discount) : formatToRupee(0)}
                    </Typography>
                  </Grid>
                </Grid> */}
                {/* <Grid container marginBottom={'5px'}>
                  <Grid lg={9} sx={{ display: 'flex', justifyContent: 'flex-end' }}>
                    <Typography variant="h4" fontFamily="sans-serif" sx={{ color: '#444597' }}>
                      FINAL AMOUNT :
                    </Typography>
                  </Grid>
                  <Grid lg={3} sx={{ display: 'flex', justifyContent: 'flex-end' }}>
                    <Typography variant="h4" sx={{ color: '#333', marginLeft: '0px' }}>
                      {formatToRupee(totalAmount)}
                    </Typography>
                  </Grid>
                </Grid> */}
                <Grid lg={9} sx={{ display: 'flex', justifyContent: 'flex-end' }}>
                  <Typography variant="h4" fontFamily="sans-serif" sx={{ color: '#444597' }}>
                    AMOUNT PAID :
                  </Typography>
                </Grid>
                <Grid lg={3} sx={{ display: 'flex', justifyContent: 'flex-end' }}>
                  <Typography variant="h4" sx={{ color: '#333', marginLeft: '20px' }}>
                    {formatToRupee(paidAmount)}
                  </Typography>
                </Grid>
              </Grid>

              {/* <Grid sx={{ height: '2px', backgroundColor: '#444597', margin: '5px 0px 5px 200px' }} /> */}

              {/* <Grid container marginBottom={'5px'}> */}
              {/* <Grid lg={9} sx={{ display: 'flex', justifyContent: 'flex-end' }}>
                  <Typography variant="h4" fontFamily="sans-serif" sx={{ color: '#444597' }}>
                    PAID AMOUNT :
                  </Typography>
                </Grid>
                <Grid lg={3} sx={{ display: 'flex', justifyContent: 'flex-end' }}>
                  <Typography variant="h4" sx={{ color: '#333', marginLeft: '20px' }}>
                    {formatToRupee(paidAmount)}
                  </Typography> */}
              {/* </Grid> */}
              {/* <Grid lg={9} sx={{ display: 'flex', justifyContent: 'flex-end' }}>
                  <Typography variant="h4" fontFamily="sans-serif" sx={{ color: '#444597' }}>
                    CURRENT DUE :
                  </Typography>
                </Grid>
                <Grid lg={3} sx={{ display: 'flex', justifyContent: 'flex-end' }}>
                  <Typography variant="h4" sx={{ color: '#333', marginLeft: '0px' }}>
                    {formatToRupee(dueAmount)}
                  </Typography>
                </Grid> */}
              {/* </Grid> */}
              {/* <Grid container marginBottom={'-15px'}>
                 <Grid lg={9} sx={{ display: 'flex', justifyContent: 'flex-end' }}>
                  <Typography variant="h4" fontFamily="sans-serif" sx={{ color: '#444597' }}>
                    PREVIOUS DUE :
                  </Typography>
                </Grid>
                <Grid lg={3} sx={{ display: 'flex', justifyContent: 'flex-end' }}>
                  <Typography variant="h4" sx={{ color: '#333', marginLeft: '0px' }}>
                    {formatToRupee(previousDueAmount)}
                  </Typography>
                </Grid> 
              </Grid> */}
              <Grid sx={{ height: '2px', backgroundColor: '#444597', margin: '-15px 0px 5px 220px' }} />
              <Grid container marginBottom={'5px'}>
                <Grid lg={9} sx={{ display: 'flex', justifyContent: 'flex-end' }}>
                  <Typography variant="h4" fontFamily="sans-serif" sx={{ color: '#444597' }}>
                    TOTAL DUE :
                  </Typography>
                </Grid>
                <Grid lg={3} sx={{ display: 'flex', justifyContent: 'flex-end' }}>
                  <Typography variant="h4" sx={{ color: '#333', marginLeft: '0px' }}>
                    {formatToRupee(totalAmount - paidAmount)}
                  </Typography>
                </Grid>
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
  // let totalQty = 0;
  const totalQty = productDtls.reduce((sum, row) => sum + Number(row.quantity), 0);
  // let totalMrp = 0;
  const totalMrp = productDtls.reduce((sum, row) => sum + Number(row.mrp) * Number(row.quantity), 0);
  // let totalDiscount = 0;
  const totalDiscount = productDtls.reduce((sum, row) => sum + Number(row.rate) * Number(row.quantity), 0);
  // let totalDiscountedAmount = 0;
  const totalDiscountedAmount = productDtls.reduce((sum, row) => sum + Number(row.discountedAmount) * Number(row.quantity), 0);

  return (
    <Paper sx={{ width: '100%' }}>
      <TableContainer>
        <Table aria-label="sticky table" size="small">
          <TableHead sx={{ color: 'whitesmoke' }}>
            <TableRow>
              {columns.map((column) => (
                <TableCell
                  key={column.id}
                  align={column.align}
                  style={{ width: column.minWidth, fontSize: '15px', borderBottom: '1px solid black', borderTop: '1px solid black' }}
                >
                  {column.label}
                </TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {productDtls.map((row) => (
              <TableRow sx={{ '&:last-child td, &:last-child th': { border: 0 } }} hover role="checkbox" tabIndex={-1}>
                {/* <TableCell sx={{ fontSize: '16px' }}>{row.purchaseDate}</TableCell> */}
                <TableCell sx={{ fontSize: '15px' }} variant="head">
                  {row.sNo}
                </TableCell>
                <TableCell sx={{ fontSize: '15px' }} variant="head">
                  {row.item}
                </TableCell>
                <TableCell sx={{ fontSize: '15px' }} variant="head">
                  {row.quantity}
                </TableCell>
                <TableCell sx={{ fontSize: '15px' }} variant="head">
                  {row.mrp}
                </TableCell>
                <TableCell sx={{ fontSize: '15px' }} variant="head">
                  {row.rate}
                </TableCell>
                <TableCell sx={{ fontSize: '15px' }} variant="head">
                  {row.discountedAmount * row.quantity}
                </TableCell>

                {/* <TableCell>{row.price}</TableCell> */}
                {/* <TableCell align="right">{row.quantity}</TableCell> */}
              </TableRow>
            ))}
            <TableRow>
              <TableCell colSpan={6}>
                <Grid sx={{ height: '1px', backgroundColor: '#000' }} />
              </TableCell>
            </TableRow>
            <TableRow>
              <TableCell variant="head" align="center" colSpan={2} sx={{ fontSize: '15px' }}>
                Total
              </TableCell>
              <TableCell variant="head" sx={{ fontSize: '16px' }}>
                {totalQty}
              </TableCell>
              <TableCell variant="head" sx={{ fontSize: '16px' }}>
                {totalMrp}
              </TableCell>
              <TableCell variant="head" sx={{ fontSize: '16px' }}>
                {totalDiscount}
              </TableCell>
              <TableCell variant="head" sx={{ fontSize: '16px' }}>
                {totalDiscountedAmount}
              </TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </TableContainer>
    </Paper>
  );
}
