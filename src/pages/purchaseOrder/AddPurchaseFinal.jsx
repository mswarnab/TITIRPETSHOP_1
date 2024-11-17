import {
  Alert,
  Autocomplete,
  Button,
  Container,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Divider,
  FormControl,
  FormControlLabel,
  FormLabel,
  Grid,
  MenuItem,
  Radio,
  RadioGroup,
  Select,
  Snackbar,
  Stack,
  Switch,
  TextField
} from '@mui/material';
import { client } from '../../api/client';
import React, { useEffect, useState } from 'react';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import ProductTable from 'pages/dashboard/ProductTable';
import dayjs from 'dayjs';
import { prodCatagoryArr, gstPercArr } from 'static';
import LottieAnimation from 'components/loaderDog';

// import './Css/AddPurchase.css'
// import AddStockDiv from '../relationComponents/AddStockDiv';

export default function AddPurchase() {
  // dayjs.tz.setDefault("Asia/Kolkata");
  let today = new Date();
  let dd = String(today.getDate()).padStart(2, '0');
  let mm = String(today.getMonth() + 1).padStart(2, '0'); //January is 0!
  let yyyy = today.getFullYear();
  // today = dd + '/' + mm + '/' + yyyy;
  today = yyyy + '-' + mm + '-' + dd;
  // const prodCatagoryArr = ['FOOD', 'MEDICINE', 'ACCESSORIES'];
  const [orderNumber, setOrderNumber] = React.useState('');
  const [supplierName, setSupplierName] = React.useState('');
  const [supplierId, setSupplierId] = React.useState('');
  const [purchaseDate, setPurchaseDate] = React.useState('');
  const [totalSGSTAmount, setTotalSGSTAmount] = React.useState(0);
  const [totalCGSTAmount, setTotalCGSTAmount] = React.useState(0);
  const [totalAmount, setTotalAmount] = React.useState(0);
  // console.log(dayjs(purchaseDate).format('YYYYMMDD'));
  const [paidAmount, setPaidAmount] = React.useState(0);
  const [creditAmount, setCreditAmount] = React.useState(0);
  const [sgstPerc, setSgstPerc] = React.useState(0);
  const [cgstPerc, setCgstPerc] = React.useState(0);
  const [prodBatch, setProdBatch] = React.useState('');
  const [prodHsn, setProdHsn] = React.useState('');
  const [prodExpDate, setProdExpDate] = React.useState(null);
  const [open, setOpen] = React.useState(false);
  const [prodTotalPrice, setProdTotalPrice] = React.useState('');
  const [prodTotalPriceWithGST, setProdTotalPriceWithGST] = React.useState('');
  const [modeOfPayment, setModeofPayment] = useState('');
  const [stockData, setStockData] = React.useState([]);
  // console.clear();
  // console.log(stockData);
  const [prodName, setProdName] = React.useState('');
  const [prodQty, setProdQty] = React.useState('');
  const [prodCatagory, setProdCatagory] = React.useState('');
  const [prodPurcahsePrice, setProdPurcahsePrice] = React.useState('');
  const [prodMrpPrice, setProdMrpPrice] = React.useState('');
  const [emptyProdNameCheck, setEmptyProdNameCheck] = React.useState('');
  const [emptyProdCategoryCheck, setEmptyProdCategoryCheck] = React.useState('');
  const [prodMfr, setProdMfr] = useState('');
  // const [emptyProdExpDateCheck,setEmptyProdExpDateCheck]=React.useState('');
  const [emptyProdQtyCheck, setEmptyProdQtyCheck] = React.useState('');
  const [emptyProdPurchasePriceCheck, setEmptyProdPurchasePriceCheck] = React.useState('');
  const [emptyProdMrpCheck, setEmptyProdMrpCheck] = React.useState('');
  const [emptyProdTotalPriceWithoutGstCheck, setEmptyProdTotalPriceWithoutGstCheck] = React.useState('');
  const [emptyProdTotalPriceWithGstCheck, setEmptyProdTotalPriceWithGstCheck] = React.useState('');
  /* all fucntion */
  let handleChange = (event) => {
    let sgstPercValue = event.target.value;
    setSgstPerc(sgstPercValue);
    totalProductPriceCal(prodQty, prodPurcahsePrice, cgstPerc, sgstPercValue);
  };
  let handleChangeCgst = (e) => {
    let cgstPercAmount = e.target.value;
    setCgstPerc(cgstPercAmount);
    totalProductPriceCal(prodQty, prodPurcahsePrice, cgstPercAmount, sgstPerc);
  };
  let onProductQtyChagne = (event) => {
    let productQuantity = event.target.value;
    // let productPrice = prodPurcahsePrice;
    setProdQty(productQuantity);
    totalProductPriceCal(productQuantity, prodPurcahsePrice, cgstPerc, sgstPerc);
  };
  let onProductPurchasePriceChange = (event) => {
    // let productQuantity = prodQty;
    let productPrice = event.target.value;
    // let cgstPerc = cgstPerc;

    setProdPurcahsePrice(productPrice);
    totalProductPriceCal(prodQty, productPrice, cgstPerc, sgstPerc);
  };
  let totalProductPriceCal = (productQuantity, productPrice, cgstPerc, sgstPerc) => {
    if (productQuantity != '' && productPrice != '') {
      let totalPriceWithoutGst = productQuantity * productPrice;
      let totalPriceWithGst = productQuantity * productPrice;
      setProdTotalPrice(totalPriceWithoutGst);
      //
      if (cgstPerc != '') {
        let cgstAmount = (totalPriceWithoutGst * (cgstPerc / 100)).toFixed(2);
        totalPriceWithGst = parseFloat(totalPriceWithGst) + parseFloat(cgstAmount);
      }
      if (sgstPerc != '') {
        let sgstAmount = (totalPriceWithoutGst * (sgstPerc / 100)).toFixed(2);
        totalPriceWithGst = parseFloat(totalPriceWithGst) + parseFloat(sgstAmount);
      }
      setProdTotalPriceWithGST(totalPriceWithGst.toFixed(2));
    }
  };
  let handleClickOpen = () => {
    setOpen(true);
  };
  let handleClose = () => {
    setOpen(false);
  };
  let addStock = () => {
    let flag = 1;
    if (prodName == '' || prodName == 'undefined') {
      setEmptyProdNameCheck('Please enter product name.');
      flag = 0;
    }
    if (prodCatagory == '' || prodCatagory == 'undefined') {
      setEmptyProdCategoryCheck('Please enter product category.');
      flag = 0;
    }
    if (prodQty == '' || prodQty == 'undefined') {
      setEmptyProdQtyCheck('Please enter product quantity.');
      flag = 0;
    }
    if (prodQty <= 0) {
      if (prodQty < 0) {
        setEmptyProdQtyCheck('Quantity must be in positive figure.');
      } else if (prodQty == 0) {
        setEmptyProdQtyCheck("Quantity must be greater than '0'.");
      }
      flag = 0;
    }
    if (prodPurcahsePrice == '' || prodPurcahsePrice == 'undefined') {
      setEmptyProdPurchasePriceCheck('Please enter purchase rate.');
      flag = 0;
    }
    if (prodPurcahsePrice <= 0) {
      if (prodPurcahsePrice < 0) {
        setEmptyProdPurchasePriceCheck('Purchase rate must be in positive figure.');
      } else if (prodPurcahsePrice == 0) {
        setEmptyProdPurchasePriceCheck("Purchase rate must be greater than '0'.");
      }
      flag = 0;
    }
    setEmptyProdTotalPriceWithoutGstCheck;
    if (prodMrpPrice == '' || prodMrpPrice == 'undefined') {
      setEmptyProdMrpCheck('Please enter MRP.');
      flag = 0;
    }
    if (prodMrpPrice <= 0) {
      if (prodMrpPrice < 0) {
        setEmptyProdMrpCheck('MRP must be in positive figure.');
      } else if (prodMrpPrice == 0) {
        setEmptyProdMrpCheck("MRP must be greater than '0'.");
      }
      flag = 0;
    }
    if (prodMrpPrice > 0) {
      if (parseFloat(prodMrpPrice) < parseFloat(prodPurcahsePrice)) {
        setEmptyProdMrpCheck('MRP must be greater than purchase rate.');
        flag = 0;
      }
    }
    if (prodTotalPrice == '' || prodTotalPrice == 'undefined') {
      setEmptyProdTotalPriceWithoutGstCheck('Please re-enter purchase rate or quantity.');
      flag = 0;
    }
    if (prodTotalPrice <= 0) {
      if (prodTotalPrice < 0) {
        setEmptyProdTotalPriceWithoutGstCheck('Please re-enter purchase rate or quantity.');
      } else if (prodTotalPrice == 0) {
        setEmptyProdTotalPriceWithoutGstCheck('Please re-enter purchase rate or quantity.');
      }
      flag = 0;
    }
    if (prodTotalPriceWithGST == '' || prodTotalPriceWithGST == 'undefined') {
      setEmptyProdTotalPriceWithGstCheck('Please re-enter purchase rate or quantity.');
      flag = 0;
    }
    if (prodTotalPriceWithGST <= 0) {
      if (prodTotalPriceWithGST < 0) {
        setEmptyProdTotalPriceWithGstCheck('Please re-enter purchase rate or quantity or GST.');
      } else if (prodTotalPriceWithGST == 0) {
        setEmptyProdTotalPriceWithGstCheck('Please re-enter purchase rate or quantity or GST.');
      }
      flag = 0;
    }

    if (flag) {
      let newGrandTotal = (parseFloat(totalAmount) + parseFloat(prodTotalPriceWithGST)).toFixed(2);
      setTotalAmount(newGrandTotal);
      let newCreditAmount = (parseFloat(newGrandTotal) - parseFloat(paidAmount)).toFixed(2);
      if (newCreditAmount < 0) {
        newCreditAmount = 0;
      }
      setCreditAmount(newCreditAmount);
      // setTotalSGSTAmount(parseFloat(totalSGSTAmount + (prodTotalPrice * (sgstPerc / 100)).toFixed(2)));
      // setTotalCGSTAmount(parseFloat(totalCGSTAmount + (prodTotalPrice * (cgstPerc / 100)).toFixed(2)));
      const newDataForm = {
        prodName: prodName,
        prodQty: prodQty,
        prodCatagory: prodCatagory,
        prodPurcahsePrice: prodPurcahsePrice,
        prodMrpPrice: prodMrpPrice,
        prodMfr: prodMfr,
        prodBatch: prodBatch,
        prodSGST: sgstPerc,
        prodCGST: cgstPerc,
        prodAmountWithoutGst: prodTotalPrice,
        prodExpDate: prodExpDate,
        prodHsn: prodHsn,
        prodAmountWithGst: prodTotalPriceWithGST
      };
      setStockData([...stockData, newDataForm]);
      setProdName('');
      setProdQty('');
      setProdCatagory('');
      setProdPurcahsePrice('');
      setProdMrpPrice('');
      setProdMfr('');
      setSgstPerc(0);
      setCgstPerc(0);
      setProdBatch('');
      setProdHsn('');
      setProdExpDate(null);
      setProdTotalPriceWithGST('');
      setProdTotalPrice('');
      setEmptyProdTotalPriceWithGstCheck('');
      setEmptyProdTotalPriceWithoutGstCheck('');
      setEmptyProdNameCheck('');
      setEmptyProdCategoryCheck('');
      setEmptyProdQtyCheck('');
      setEmptyProdPurchasePriceCheck('');
      setEmptyProdMrpCheck('');
    }
  };
  useEffect(() => {
    let totSgstAmount = 0;
    let totCgstAmount = 0;
    let totalAmount = 0;
    let totalDueAmount = 0;
    stockData.map((e) => {
      totSgstAmount = parseFloat(parseFloat(totCgstAmount) + parseFloat(e.prodAmountWithoutGst * (e.prodSGST / 100)).toFixed(2));
      totCgstAmount = parseFloat(parseFloat(totCgstAmount) + parseFloat(e.prodAmountWithoutGst * (e.prodCGST / 100)).toFixed(2));
      totalAmount = parseFloat(
        parseFloat(totalAmount) +
          parseFloat(
            parseFloat(e.prodAmountWithoutGst) +
              parseFloat(parseFloat(e.prodAmountWithoutGst * (e.prodSGST / 100)) + parseFloat(e.prodAmountWithoutGst * (e.prodCGST / 100)))
          )
      ).toFixed(2);
    });
    totalDueAmount = parseFloat(parseFloat(totalAmount) - parseFloat(paidAmount)).toFixed(2);
    if (totalDueAmount < 0) {
      totalDueAmount = 0;
    }
    setTotalSGSTAmount(totSgstAmount);
    setTotalCGSTAmount(totCgstAmount);
    setTotalAmount(totalAmount);
    setCreditAmount(totalDueAmount);
  }, [stockData]);
  // console.log(stockData);
  // let orderNumberOnchange=(e)=>{
  //   const result = e.target.value.replace(/\D/g, '');

  //     setOrderNumber(result)
  // }
  /* all fucntion */
  ///// table column
  const dataColumns = [
    { field: 'id', headerName: 'Sl No.', width: 90 },
    {
      field: 'productName',
      headerName: 'Product Name',
      width: 150,
      editable: true
    },
    {
      field: 'productCategory',
      headerName: 'Product Categroy',
      width: 150,
      editable: true
    },
    {
      field: 'mfr',
      headerName: 'Mfr',
      width: 160
    },
    {
      field: 'batch',
      headerName: 'Batch No.',
      width: 160
    },
    {
      field: 'expDate',
      headerName: 'Exp',
      width: 160
    },
    {
      field: 'hsn',
      headerName: 'Hsn',
      width: 160
    },
    {
      field: 'qty',
      headerName: 'QTY',
      type: 'number',
      width: 110,
      editable: true
    },
    {
      field: 'purchaseRate',
      headerName: 'Rate',
      width: 160
    },
    {
      field: 'mrp',
      headerName: 'MRP',
      type: 'number',
      width: 110,
      editable: true
    },
    {
      field: 'amount',
      headerName: 'Amount',
      width: 160
    },
    {
      field: 'sgst',
      headerName: 'SGST',
      width: 160
    },
    {
      field: 'cgst',
      headerName: 'CGST',
      width: 160
    },
    {
      field: 'amountWithgst',
      headerName: 'Amount+GST',
      width: 160
    },
    {
      field: 'sgstPerc',
      headerName: 'SGST %',
      width: 0
    },
    {
      field: 'cgstPerc',
      headerName: 'CGST %',
      width: 0
    }
  ];
  let count = 0;
  //// table row data
  function createDate(rowValues) {
    count++;
    let sgstAmount = (rowValues.prodAmountWithoutGst * (rowValues.prodSGST / 100)).toFixed(2);
    let cgstAmount = (rowValues.prodAmountWithoutGst * (rowValues.prodCGST / 100)).toFixed(2);
    let months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
    let newDate = new Date(rowValues.prodExpDate);
    let mmmm = months[newDate.getMonth()];
    let yy = newDate.getFullYear();
    let data = {
      id: count,
      productName: rowValues.prodName,
      productCategory: rowValues.prodCatagory,
      mfr: rowValues.prodMfr,
      batch: rowValues.prodBatch,
      expDate: mmmm + ' ,' + yy,
      hsn: rowValues.prodHsn,
      qty: rowValues.prodQty,
      purchaseRate: rowValues.prodPurcahsePrice,
      mrp: rowValues.prodMrpPrice,
      amount: rowValues.prodAmountWithoutGst,
      sgst: sgstAmount + ' (' + rowValues.prodSGST + '%)',
      cgst: cgstAmount + ' (' + rowValues.prodCGST + '%)',
      amountWithgst: rowValues.prodAmountWithGst,
      sgstPerc: rowValues.prodSGST,
      cgstPerc: rowValues.prodCGST
    };
    return data;
  }
  let dataRows = [];
  stockData.map((e) => {
    let newData = createDate(e);
    dataRows = [...dataRows, newData];
  });
  // alert(purchaseDate);
  let setPurchaseDateFunction = (date) => {
    let newDate = new Date(date);
    // console.log(newDate);
    let dd = newDate.getDate();
    let mm = newDate.getMonth() + 1;
    // console.log(mm);
    let yy = newDate.getFullYear();
    setPurchaseDate(yy + '-' + mm + '-' + dd);
  };
  // console.log(stockData);
  let setExpDateFunction = (date) => {
    let newDate = new Date(date);
    // console.log(newDate);
    let dd = '01';
    let mm = newDate.getMonth() + 1;
    // console.log(mm);
    let yy = newDate.getFullYear();
    setProdExpDate(yy + '-' + mm + '-' + dd);
  };
  let changePaidAmount = (event) => {
    let regex = /^-?\d*\.?\d*$/;
    let newPaidAmount = event.target.value;
    if (regex.test(newPaidAmount)) {
      // newPaidAmount = parseFloat(newPaidAmount);
      setPaidAmount(newPaidAmount);
    }
    let newCreditAmount = parseFloat(totalAmount).toFixed(2);
    if (newPaidAmount > 0) {
      newCreditAmount = (parseFloat(totalAmount) - parseFloat(newPaidAmount)).toFixed(2);
    }
    if (newCreditAmount < 0) {
      newCreditAmount = 0;
    }
    setCreditAmount(newCreditAmount);
  };

  let handleDelete = (e) => {
    e = e - 1;
    // alert('hello');
    if (e >= 0) {
      setStockData((l) => l.filter((item, i) => i != e));
    }
    if (stockData?.length == 1) {
      setTotalSGSTAmount(0);
      setTotalCGSTAmount(0);
      setTotalAmount(0);
      setCreditAmount(0);
    }
    handleCloseUpdate();
  };
  const [openUpdate, setOpenUpdate] = React.useState(false);
  const [selectedRowData, setSelectedRowData] = React.useState('');
  const [fullPaid, setFullPaid] = useState(false);

  const handleCloseUpdate = () => {
    setOpenUpdate(false);
  };
  const handleClickOpenUpdate = (value) => {
    // console.log(value.row);
    setSelectedRowData(value.row);
    // alert(value);
    setOpenUpdate(true);
  };
  let handleUpdate = (formData) => {
    // console.log(formData);
    let findId = formData.id - 1;

    if (findId >= 0) {
      let newData = [...stockData];
      // console.log(newData);
      let expDate;
      // let name = newData[findId].prodName;
      // let qty = newData[findId].prodQty;
      // let catagory = newData[findId]['prodCatagory'];
      // let prodPurchasePrice = newData[findId]['prodPurcahsePrice'];
      // let mfr = newData[findId]['prodMfr'];
      // let mrp = newData[findId]['prodMrpPrice'];
      // let batch = newData[findId]['prodBatch'];
      // let sgstperc = newData[findId]['prodSGST'];
      // let cgstPerc = newData[findId]['prodCGST'];
      // let totalPrice = newData[findId]['prodAmountWithoutGst'];
      // let expDate = newData[findId]['prodExpDate'];
      // let hsn = newData[findId]['prodHsn'];
      // let totalPriceWithGst = newData[findId]['prodAmountWithGst'];
      // if (formData.name != '') {
      //   name = formData.name;
      // }
      // if (formData.mfr != '') {
      //   mfr = formData.mfr;
      // }
      // if (formData.qty != '') {
      //   qty = formData.qty;
      // }
      // if (formData.catagory != '') {
      //   catagory = formData.catagory;
      // }
      // if (formData.prodPurchasePrice != '') {
      //   prodPurchasePrice = formData.prodPurchasePrice;
      // }
      // if (formData.mrp != '') {
      //   mrp = formData.mrp;
      // }
      // if (formData.batch != '') {
      //   batch = formData.batch;
      // }
      // if (formData.sgstperc != '') {
      //   sgstperc = formData.sgstperc;
      // }
      // if (formData.cgstPerc != '') {
      //   cgstPerc = formData.cgstPerc;
      // }
      // if (formData.totalPrice != '') {
      //   totalPrice = formData.totalPrice;
      // }
      if (formData.expDate != '') {
        let newDate = new Date(formData.expDate);
        // console.log(newDate);
        let dd = '01';
        let mm = newDate.getMonth() + 1;
        if (mm < 10) {
          mm = '0' + mm;
        }
        // console.log(mm);
        let yy = newDate.getFullYear();
        let newDateData = yy + '-' + mm + '-' + dd;
        expDate = newDateData;
      }
      // if (formData.hsn != '') {
      //   hsn = formData.hsn;
      // }
      // if (formData.totalPriceWithGst != '') {
      //   totalPriceWithGst = formData.totalPriceWithGst;
      // }

      newData[findId] = {
        prodName: formData.name,
        prodQty: formData.qty,
        prodCatagory: formData.catagory,
        prodPurcahsePrice: formData.prodPurchasePrice,
        prodMfr: formData.mfr,
        prodMrpPrice: formData.mrp,
        prodBatch: formData.batch,
        prodSGST: formData.sgstperc,
        prodCGST: formData.cgstPerc,
        prodAmountWithoutGst: formData.totalPrice,
        prodExpDate: expDate,
        prodHsn: formData.hsn,
        prodAmountWithGst: formData.totalPriceWithGst
      };
      // }
      // console.log(newData);
      setStockData(newData);
    }
    handleCloseUpdate();
    // setStockData(newData);
  };
  let onloader = () => {
    setLoading(true);
  };
  let offloader = () => {
    setLoading(false);
  };

  let submitPurchaseOrder = () => {
    /// Check mand values
    let flag = 1;
    if (orderNumber == '') {
      flag = 0;
      setError({ err: true, message: 'Error: Enter Invoice No.' });
    } else if (supplierId == '') {
      flag = 0;
      setError({ err: true, message: 'Error: Select valid supplier name.' });
    } else if (purchaseDate == '') {
      flag = 0;
      setError({ err: true, message: 'Error: Pick a purchase date.' });
    } else if (stockData?.length == 0) {
      flag = 0;
      setError({ err: true, message: 'Error: Add atleast one product.' });
    } else if (modeOfPayment == '') {
      flag = 0;
      setError({ err: true, message: 'Error: Choose payment mode.' });
    }
    // alert('hi');
    if (flag) {
      onloader();
      let stockBody = [];
      stockData.forEach((e) => {
        let splitSupplierName = supplierName.split('--');
        stockBody = [
          ...stockBody,
          {
            productName: e.prodName,
            category: e.prodCatagory,
            supplierName: splitSupplierName[0],
            mfrCode: e.prodMfr,
            hsnCode: e.prodHsn,
            mfgDate: dayjs(e.prodExpDate).format('YYYYMMDD'),
            expDate: dayjs(e.prodExpDate).format('YYYYMMDD'),
            quantity: e.prodQty,
            supplierId: supplierId,
            rate: e.prodPurcahsePrice,
            sgst: parseFloat((e.prodPurcahsePrice * parseFloat(e.prodSGST)) / 100).toFixed(2),
            cgst: parseFloat((e.prodPurcahsePrice * parseFloat(e.prodCGST)) / 100).toFixed(2),
            mrp: e.prodMrpPrice,
            batchNumber: e.prodBatch,
            discount: '0'
          }
        ];
      });
      const purchaseOrderBody = {
        invoiceNumber: orderNumber,
        supplierId: supplierId,
        dateOfPruchase: dayjs(purchaseDate).format('YYYYMMDD'),
        paidAmount: paidAmount,
        modeOfPayment,
        dueDate: '20241231',
        addLessAmount: 'NA',
        crDrNote: 'NA'
      };
      onloader();
      // let baseURL = 'popo-backend-1.onrender.com';
      client
        .post('/purchaseorder', {
          purchaseOrderBody,
          stockBody
        })
        .then((res) => {
          setOrderNumber('');
          setSupplierName('');
          setSupplierId('');
          setPurchaseDate('');
          setPurchaseDate(dayjs().format('YYYY-MM-DD'));
          setTotalSGSTAmount(0);
          setTotalCGSTAmount(0);
          setTotalAmount(0);
          setPaidAmount(0);
          setCreditAmount(0);
          setStockData([]);
          setError({ err: false, message: res.data.message });
          setLoading(true);
        })
        .catch((err) => {
          setError({ err: true, message: err.response.data.errorMessage });
          setLoading(true);
        })
        .finally(() => {
          offloader();
        })
        .finally(() => {
          offloader();
        });
    } else {
      offloader();
    }
  };
  const [error, setError] = React.useState('');
  let handleCloseSnackBar = () => {
    setError('');
  };
  let vertical = 'top';
  let horizontal = 'center';
  let [supplierSearch, setSupplierSearch] = React.useState([]);
  const [supplierSearchParm, setSupplierSearchParm] = useState('');
  useEffect(() => {
    (async () => {
      const getData = setTimeout(async () => {
        // console.log(supplierName);
        let strLength = supplierName.length;
        // console.log(strLength);
        if (strLength >= 3) {
          // alert(strLength);
          client
            .get('/supplier/search', {
              params: { pattern: supplierName }
            })
            .then((res) => {
              // console.log(res.data.result.result)
              // setSupplierSearch([]);
              let top100Films = [];
              let dataResultArr = res.data.result.result;
              dataResultArr.forEach((element) => {
                // console.log(element.supplierName);
                top100Films = [
                  ...top100Films,
                  {
                    supplierName: element.supplierName,
                    supplierContactNo: element.supplierContactNo,
                    id: element._id
                  }
                ];
              });
              if (!top100Films.length) {
                top100Films = [
                  {
                    supplierName: 'NO DATA FOUND',
                    supplierContactNo: ''
                  }
                ];
              }
              setSupplierSearch(top100Films);
            })
            .catch(() => {
              let top100Films = [
                {
                  supplierName: 'NO DATA FOUND',
                  supplierContactNo: ''
                }
              ];
              setSupplierSearch(top100Films);
            });
        }
      }, 300);
      return () => clearTimeout(getData);
    })();
  }, [supplierSearchParm]);
  let [productSearch, setProductSearch] = useState([]);
  const [productSearchParm, setProductSearchParm] = useState('');
  // console.log('prod : ' + prodName);
  useEffect(() => {
    (async () => {
      const getData = setTimeout(() => {
        // console.log(supplierName);
        let strLength = prodName.length;
        // console.log(strLength);
        if (strLength >= 3) {
          // alert(strLength);
          client
            .get('/stock/search', {
              params: { pattern: productSearchParm }
            })
            .then((res) => {
              // console.log(res.data.result.result)
              // setSupplierSearch([]);
              let top100Films = [];
              let dataResultArr = res.data.result.result;
              dataResultArr.forEach((element) => {
                // console.log(element.supplierName);
                top100Films = [
                  ...top100Films,
                  {
                    productName: element
                  }
                ];
              });
              setProductSearch(top100Films);
            })
            .catch(() => {});
        }
      }, 300);

      return () => clearTimeout(getData);
    })();
  }, [productSearchParm]);
  // console.log(productSearch);
  let changeSupplierId = (e) => {
    //console.log(supplierSearch);
    let name = e;
    // console.log(name);
    let split_name = name.split('--');
    //console.log(split_name);
    let supName = split_name[0];
    let phNo = split_name[1];
    //console.log(name + '----' + supName + '----' + phNo);
    supplierSearch.forEach((value) => {
      if (value.supplierName == supName && value.supplierContactNo == phNo) {
        setSupplierId(value.id);
      }
    });
  };

  useEffect(() => {
    if (fullPaid) {
      return setPaidAmount(totalAmount);
    }

    return () => null;
  }, [fullPaid, totalAmount, paidAmount]);

  useEffect(() => {
    setCreditAmount((parseFloat(totalAmount) - parseFloat(paidAmount)).toFixed(2));
    return () => null;
  }, [paidAmount, totalAmount]);

  const [loading, setLoading] = useState(false);
  // console.log(rows);
  if (loading) {
    return <LottieAnimation />;
  }
  return (
    <Grid item style={{ padding: 0, margin: 0 }}>
      {/* <h3 className='ColorPrimary'>Purchase Order</h3> */}
      {/* {error && <Alert severity={error && error.err ? 'error' : 'success'}>{error.message}</Alert>} */}
      {/* <Stack spacing={2} sx={{ maxWidth: 1000 }}> */}
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
      {/* </Stack> */}

      <Divider></Divider>
      <Stack spacing={2} marginTop={3} marginBottom={3}>
        <TextField
          id="outlined-basic"
          label="Invoice No."
          variant="outlined"
          fullWidth
          autoComplete="off"
          value={orderNumber}
          onChange={(event) => setOrderNumber(event.target.value)}
        />

        <Autocomplete
          id="free-solo-demo"
          freeSolo
          options={supplierSearch.map((option) => option.supplierName + '--' + option.supplierContactNo)}
          value={supplierName}
          name="supplier"
          disableClearable="true"
          size="small"
          renderInput={(params) => (
            <TextField
              {...params}
              label="Supplier Name"
              variant="outlined"
              fullWidth
              autoComplete="off"
              onChange={(event) => {
                //console.log('name : ' + value);
                setSupplierName(event.target.value);
              }}
              onKeyUp={(event) => setSupplierSearchParm(event.target.value)}
            />
          )}
          onChange={(event, value) => {
            //console.log('name : ' + value);
            setSupplierName(value);
            changeSupplierId(value);
          }}
        />
        <LocalizationProvider dateAdapter={AdapterDayjs}>
          <DatePicker
            label="Purchase Date"
            fullWidth
            name="purchaseDate"
            selected={purchaseDate}
            onChange={(date) => setPurchaseDateFunction(date)}
          />
        </LocalizationProvider>
        <FormControlLabel
          control={
            <Switch
              checked={fullPaid}
              onChange={() => {
                if (modeOfPayment == 'CREDIT') {
                  setFullPaid(false);
                } else {
                  setFullPaid(!fullPaid);
                }
              }}
              aria-label="Full Paid"
            />
          }
          label="Full payment done"
        />
        <TextField
          id="outlined-basic"
          label="Paid Amount"
          variant="outlined"
          autoComplete="off"
          fullWidth
          disabled={modeOfPayment == 'CREDIT' || fullPaid ? true : false}
          value={paidAmount}
          onChange={(event) => changePaidAmount(event)}
        />
        {/*  */}

        <FormControl>
          <FormLabel id="demo-row-radio-buttons-group-label">Payment Mode</FormLabel>
          <RadioGroup row aria-labelledby="demo-row-radio-buttons-group-label" name="row-radio-buttons-group" value={modeOfPayment}>
            <FormControlLabel
              value="CARD"
              control={<Radio size="small" />}
              label="CARD"
              onClick={(event) => setModeofPayment(event.target.value)}
            />
            <FormControlLabel
              value="CASH"
              control={<Radio size="small" />}
              label="CASH"
              onClick={(event) => setModeofPayment(event.target.value)}
            />
            <FormControlLabel
              value="ONLINE"
              control={<Radio size="small" />}
              label="ONLINE"
              onClick={(event) => setModeofPayment(event.target.value)}
            />
            <FormControlLabel
              value="CREDIT"
              control={<Radio size="small" />}
              label="CREDIT"
              onClick={(event) => {
                setFullPaid(false);
                setPaidAmount(0);
                setModeofPayment(event.target.value);
              }}
            />
          </RadioGroup>
        </FormControl>
        <TextField id="outlined-basic" label="Total SGST Amount" variant="outlined" fullWidth value={totalSGSTAmount} disabled />
        <TextField id="outlined-basic" label="Total CGST Amount" variant="outlined" fullWidth value={totalCGSTAmount} disabled />
        <TextField id="outlined-basic" label="Total Amount" variant="outlined" fullWidth value={totalAmount} disabled />

        <TextField id="outlined-basic" label="Credit Amount" variant="outlined" fullWidth value={creditAmount} disabled />
      </Stack>
      <Stack direction="row" spacing={2}>
        <Button variant="contained" color="secondary" onClick={handleClickOpen} marginTop={3} style={{ width: '50%' }}>
          Add Stock
        </Button>
        <Button
          variant="contained"
          color="secondary"
          marginTop={3}
          style={{ width: '50%' }}
          onClick={() => {
            submitPurchaseOrder();
          }}
        >
          Submit
        </Button>
      </Stack>
      <Dialog open={open} fullWidth maxWidth="lg">
        <DialogTitle variant="h4" style={{ padding: '40px 40px', paddingBottom: '30px' }}>
          Add Stock
        </DialogTitle>

        <DialogContent>
          <DialogContentText></DialogContentText>
          <Stack spacing={2}>
            <Select
              labelId="sgstLavel"
              id="prodCat"
              value={prodCatagory}
              displayEmpty
              // label="Select GST"
              // onChange={handleChange}
              onChange={(event) => setProdCatagory(event.target.value)}
              onClick={() => setEmptyProdCategoryCheck('')}
            >
              <MenuItem value="" disabled>
                <em>Select Product Catagory</em>
              </MenuItem>
              {prodCatagoryArr.map((element) => (
                // console.log(element);
                <MenuItem value={element}>{element}</MenuItem>
              ))}

              {/* <MenuItem value={5}>SGST 5%</MenuItem>
              <MenuItem value={12}>SGST 12%</MenuItem>
              <MenuItem value={18}>SGST 18%</MenuItem> */}
            </Select>
            <Autocomplete
              id="free-solo-demo"
              freeSolo
              options={productSearch.map((option) => option.productName)}
              value={prodName}
              name="prodName"
              disableClearable="true"
              size="small"
              renderInput={(params) => (
                <TextField
                  {...params}
                  label="Product Name"
                  variant="outlined"
                  fullWidth
                  autoComplete="off"
                  onChange={(event) => {
                    setProdName(event.target.value);
                  }}
                  onKeyUp={(event) => setProductSearchParm(event.target.value)}
                />
              )}
              onChange={(event, value) => {
                setProdName(value);
              }}
            />

            <TextField
              id="outlined-basic"
              label="Mfr"
              variant="outlined"
              fullWidth
              autoComplete="off"
              value={prodMfr}
              onChange={(event) => {
                // fetchSupplier();
                setProdMfr(event.target.value);
              }}
            />
            <TextField
              id="outlined-basic"
              label="Batch"
              variant="outlined"
              autoComplete="off"
              name="prodBatch"
              value={prodBatch}
              onChange={(event) => setProdBatch(event.target.value)}
            ></TextField>
            <TextField
              id="outlined-basic"
              label="HSN"
              variant="outlined"
              autoComplete="off"
              name="hsn"
              value={prodHsn}
              onChange={(event) => setProdHsn(event.target.value)}
            ></TextField>
            <LocalizationProvider dateAdapter={AdapterDayjs}>
              <DatePicker
                label="Exp. Date"
                fullWidth
                views={['year', 'month']}
                name="expDate"
                value={dayjs(prodExpDate)}
                // defaultValue={}
                onChange={(date) => setExpDateFunction(date)}
              />
            </LocalizationProvider>
            <TextField
              id="outlined-basic"
              error={emptyProdQtyCheck}
              helperText={emptyProdQtyCheck ? emptyProdQtyCheck : ''}
              type="text"
              label="Quantity"
              variant="outlined"
              autoComplete="off"
              name="prodQuantity"
              value={prodQty}
              onChange={onProductQtyChagne}
              onClick={() => setEmptyProdQtyCheck('')}
            ></TextField>
            <TextField
              id="outlined-basic"
              error={emptyProdPurchasePriceCheck}
              helperText={emptyProdPurchasePriceCheck ? emptyProdPurchasePriceCheck : ''}
              type="text"
              label="Purchase Price"
              variant="outlined"
              autoComplete="off"
              name="prodPur"
              value={prodPurcahsePrice}
              onChange={onProductPurchasePriceChange}
              onClick={() => setEmptyProdPurchasePriceCheck('')}
            ></TextField>
            <TextField
              id="outlined-basic"
              error={emptyProdMrpCheck}
              helperText={emptyProdMrpCheck ? emptyProdMrpCheck : ''}
              type="text"
              label="MRP"
              variant="outlined"
              autoComplete="off"
              name="prodMrp"
              value={prodMrpPrice}
              onChange={(event) => setProdMrpPrice(event.target.value)}
              onClick={() => setEmptyProdMrpCheck('')}
            ></TextField>

            <TextField
              id="outlined-basic"
              error={emptyProdTotalPriceWithoutGstCheck && prodTotalPrice == '' ? true : false}
              helperText={emptyProdTotalPriceWithoutGstCheck && prodTotalPrice == '' ? emptyProdTotalPriceWithoutGstCheck : ''}
              label="Total Price"
              disabled
              variant="outlined"
              name="prodTotalPrice"
              value={prodTotalPrice}
              aria-readonly="true"
              onClick={() => setEmptyProdTotalPriceWithoutGstCheck('')}
            ></TextField>
            <Select
              labelId="sgstLavel"
              id="demo-simple-select-helper"
              value={sgstPerc}
              displayEmpty
              // label="Select GST"
              onChange={handleChange}
            >
              <MenuItem value="" disabled>
                <em>Select SGST</em>
              </MenuItem>
              {gstPercArr.map((gstV) => (
                <MenuItem value={gstV}>SGST {gstV}%</MenuItem>
              ))}
              {/* <MenuItem value={0}>SGST 0%</MenuItem>
              <MenuItem value={5}>SGST 5%</MenuItem>
              <MenuItem value={12}>SGST 12%</MenuItem>
              <MenuItem value={18}>SGST 18%</MenuItem> */}
            </Select>
            <Select
              labelId="demo-simple-select-helper-label"
              id="demo-simple-select-helper"
              value={cgstPerc}
              displayEmpty
              // label="Select GST"
              onChange={handleChangeCgst}
            >
              <MenuItem value="" disabled>
                <em>Select CGST</em>
              </MenuItem>
              {gstPercArr.map((gstV) => (
                <MenuItem value={gstV}>CGST {gstV}%</MenuItem>
              ))}
              {/* <MenuItem value={0}>CGST 0%</MenuItem>
              <MenuItem value={5}>CGST 5%</MenuItem>
              <MenuItem value={12}>CGST 12%</MenuItem>
              <MenuItem value={18}>CGST 18%</MenuItem> */}
            </Select>
            <TextField
              id="outlined-basic"
              error={emptyProdTotalPriceWithGstCheck && prodTotalPrice == '' ? true : false}
              helperText={emptyProdTotalPriceWithGstCheck && prodTotalPrice == '' ? emptyProdTotalPriceWithGstCheck : ''}
              label="Total Price With GST"
              disabled
              variant="outlined"
              name="prodTotalPriceWithGST"
              value={prodTotalPriceWithGST}
              aria-readonly="true"
              onClick={() => setEmptyProdTotalPriceWithGstCheck('')}
            ></TextField>
          </Stack>
        </DialogContent>

        <DialogActions>
          <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
            <Button variant="contained" color="secondary" onClick={handleClose} style={{ margin: '0 10px 0 0' }}>
              Cancel
            </Button>
            <Button variant="contained" color="secondary" onClick={() => addStock()}>
              Add
            </Button>
          </div>
        </DialogActions>
      </Dialog>
      <Divider style={{ margin: '20px 0px 20px 0px' }}></Divider>

      {/* <div style={stockData.length? {display:"flex", flexWrap:"wrap",justifyContent:"center",maxHeight:"500px",overflow:"scroll"} : {}}> */}

      {dataRows.length ? (
        <ProductTable
          handleClose={handleCloseUpdate}
          selectedRowData={selectedRowData}
          prodCatagoryArr={prodCatagoryArr}
          open={openUpdate}
          row={dataRows}
          column={dataColumns}
          // htmlData={htmlDataStockView}
          handleClickOpen={handleClickOpenUpdate}
          handleDelete={handleDelete}
          handleUpdate={handleUpdate}
        />
      ) : (
        ''
      )}
      {/* <DataGridDemo rows={dataRows} columns={dataColumns} />  */}
      {/* </div> */}
    </Grid>
  );
}
