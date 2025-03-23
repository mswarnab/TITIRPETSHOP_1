import {
  Alert,
  Autocomplete,
  Button,
  Chip,
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
  Slide,
  Snackbar,
  Stack,
  Switch,
  TextField,
  Typography
} from '@mui/material';
import { client } from '../../api/client';
import React, { useEffect, useState } from 'react';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import ProductTable from 'pages/dashboard/ProductTable';
import dayjs from 'dayjs';
import { prodCatagoryArr, gstPercArr, generateUniqueCode } from 'static';
import LottieAnimation from 'components/loaderDog';
import { isNumber } from 'utils/password-validation';
import { use } from 'react';

// import './Css/AddPurchase.css'
// import AddStockDiv from '../relationComponents/AddStockDiv';
const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

export default function AddPurchase() {
  // dayjs.tz.setDefault("Asia/Kolkata");
  let today = new Date();
  let dd = String(today.getDate()).padStart(2, '0');
  let mm = String(today.getMonth() + 1).padStart(2, '0'); //January is 0!
  let yyyy = today.getFullYear();
  // today = dd + '/' + mm + '/' + yyyy;
  today = yyyy + '-' + mm + '-' + dd;
  // const prodCatagoryArr = ['FOOD', 'MEDICINE', 'ACCESSORIES'];
  const [discountSelect, setDiscountSelect] = useState(1);
  const [orderNumber, setOrderNumber] = React.useState('');
  const [supplierName, setSupplierName] = React.useState('');
  const [supplierId, setSupplierId] = React.useState('');
  const [purchaseDate, setPurchaseDate] = React.useState();
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
  const [userInputTotalAmount, setUserInputTotalAmount] = useState('');
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
  const [discountPerc, setDiscountPerc] = useState(0);
  const [discountScheme, setDiscountScheme] = useState(0);
  const [productPurchasePriceAfterDiscount, setProductPurchasePriceAfterDiscount] = useState(0);
  // let oldInvNo = '';
  const [oldInvNo, setOldInvNo] = useState('');
  // const [emptyProdExpDate, setEmptyProdExpDate] = React.useState();
  /* all fucntion */
  let handleChange = (event) => {
    let sgstPercValue = event.target.value / 2;
    setSgstPerc(sgstPercValue);
    let cgstPercAmount = event.target.value / 2;
    setCgstPerc(cgstPercAmount);
    // totalProductPriceCal(prodQty, productPurchasePriceAfterDiscount, cgstPercAmount, sgstPercValue);
  };
  /** generate Product Code  */
  useEffect(() => {
    // alert(generateUniqueCode());
    setProdMfr(supplierName.substring(0, 2).toUpperCase() + generateUniqueCode());
  }, [prodQty, supplierName]);
  /** here problem */
  // useEffect(() => {
  //   setStockData([]);
  // }, [supplierName]);

  useEffect(() => {
    let tempProductPurchasePrice = 0;

    switch (discountSelect) {
      case 1:
        tempProductPurchasePrice = parseFloat(prodPurcahsePrice) * (1 - parseFloat(discountPerc / 100));
        if (discountScheme) {
          tempProductPurchasePrice = tempProductPurchasePrice * (1 - parseFloat(discountScheme) / 100);
          setProductPurchasePriceAfterDiscount(tempProductPurchasePrice);
        } else {
          setProductPurchasePriceAfterDiscount(tempProductPurchasePrice);
        }

        totalProductPriceCal(prodQty, tempProductPurchasePrice, cgstPerc, sgstPerc);

        break;
      // inactive
      case 2:
        tempProductPurchasePrice = parseFloat(prodMrpPrice).toFixed() * (1 - parseFloat(discountPerc / 100).toFixed(2));

        if (discountScheme) {
          tempProductPurchasePrice = (tempProductPurchasePrice * (1 - parseFloat(discountScheme).toFixed(2) / 100)).toFixed(2);
          setProductPurchasePriceAfterDiscount(tempProductPurchasePrice);
        } else {
          setProductPurchasePriceAfterDiscount(tempProductPurchasePrice);
        }
        totalProductPriceCal(prodQty, tempProductPurchasePrice, cgstPerc, sgstPerc);
        break;
      default:
        setProductPurchasePriceAfterDiscount(prodPurcahsePrice);

        break;
    }
  }, [discountSelect, discountPerc, discountScheme, prodQty, prodMrpPrice, prodPurcahsePrice, sgstPerc, cgstPerc]);
  // let handleChangeCgst = (e) => {
  //   let cgstPercAmount = e.target.value;
  //   setCgstPerc(cgstPercAmount);
  //   totalProductPriceCal(prodQty, prodPurcahsePrice, cgstPercAmount, sgstPerc);
  // };
  let onProductQtyChagne = (event) => {
    let productQuantity = event.target.value;
    // let productPrice = prodPurcahsePrice;
    setProdQty(productQuantity);
    // totalProductPriceCal(productQuantity, productPurchasePriceAfterDiscount, cgstPerc, sgstPerc);
  };
  let onProductPurchasePriceChange = (event) => {
    // let productQuantity = prodQty;
    let productPrice = event.target.value;
    // let cgstPerc = cgstPerc;

    setProdPurcahsePrice(productPrice);
    // totalProductPriceCal(prodQty, productPrice, cgstPerc, sgstPerc);
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
    if (supplierName) {
      setOpen(true);
    } else {
      setError({ err: true, message: 'Error: Please select Supplier first' });
    }
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
    if (prodPurcahsePrice < 0) {
      //if (prodPurcahsePrice < 0) {
      setEmptyProdPurchasePriceCheck('Purchase rate must be in positive figure.');
      // } else if (prodPurcahsePrice == 0) {
      //   setEmptyProdPurchasePriceCheck("Purchase rate must be greater than '0'.");
      // }
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
    if (prodTotalPrice == 'undefined') {
      setEmptyProdTotalPriceWithoutGstCheck('Please re-enter purchase rate or quantity.');
      flag = 0;
    }
    if (prodTotalPrice < 0) {
      // if (prodTotalPrice < 0) {
      setEmptyProdTotalPriceWithoutGstCheck('Please re-enter purchase rate or quantity.');
      // } else if (prodTotalPrice == 0) {
      //   setEmptyProdTotalPriceWithoutGstCheck('Please re-enter purchase rate or quantity.');
      // }
      flag = 0;
    }
    if (prodTotalPriceWithGST == '' || prodTotalPriceWithGST == 'undefined') {
      setEmptyProdTotalPriceWithGstCheck('Please re-enter purchase rate or quantity.');
      flag = 0;
    }
    if (prodTotalPriceWithGST < 0) {
      // if (prodTotalPriceWithGST < 0) {
      setEmptyProdTotalPriceWithGstCheck('Please re-enter purchase rate or quantity or GST.');
      // } else if (prodTotalPriceWithGST == 0) {
      //   setEmptyProdTotalPriceWithGstCheck('Please re-enter purchase rate or quantity or GST.');
      // }
      flag = 0;
    }
    if (!dayjs(prodExpDate).isValid()) {
      // setEmptyProdExpDate('Please enter valid Exp date.');
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
        prodAmountWithGst: prodTotalPriceWithGST,
        prodDiscountPerc: discountPerc,
        prodDiscountScheme: discountScheme
      };
      setStockData([...stockData, newDataForm]);
      setProdName('');
      setProdQty('');
      // setProdCatagory('');
      setProdPurcahsePrice('');
      // setProdMrpPrice('');
      // setProdMfr('');
      setSgstPerc(0);
      setCgstPerc(0);
      // setProdBatch('');
      // setProdHsn('');
      setProdExpDate(null);
      setProdTotalPriceWithGST('');
      setProdTotalPrice('');
      // setEmptyProdTotalPriceWithGstCheck('');
      // setEmptyProdTotalPriceWithoutGstCheck('');
      // setEmptyProdNameCheck('');
      // setEmptyProdCategoryCheck('');
      // setEmptyProdQtyCheck('');
      // setEmptyProdPurchasePriceCheck('');
      // setEmptyProdMrpCheck('');
    }
  };
  useEffect(() => {
    let totSgstAmount = 0;
    let totCgstAmount = 0;
    let totalAmount = 0;
    let totalDueAmount = 0;
    stockData.map((e) => {
      // console.log(e.prodAmountWithoutGst);
      // console.log(e.prodAmountWithoutGst * (e.prodSGST / 100));
      // console.log(e.prodCGST);

      totSgstAmount = parseFloat(parseFloat(totSgstAmount) + parseFloat(e.prodAmountWithoutGst * parseFloat(e.prodSGST / 100)));
      totCgstAmount = parseFloat(parseFloat(totCgstAmount) + parseFloat(e.prodAmountWithoutGst * parseFloat(e.prodCGST / 100)));
      // console.log(totSgstAmount);
      // console.log(totCgstAmount);
      // console.log('done');
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
    setTotalSGSTAmount(totSgstAmount.toFixed(2));
    setTotalCGSTAmount(totCgstAmount.toFixed(2));
    setTotalAmount(totalAmount);
    setCreditAmount(totalDueAmount);
  }, [stockData]);

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
      headerName: 'Product ID',
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
    },
    {
      field: 'discountPerc',
      headerName: 'Discount %',
      width: 0
    },
    {
      field: 'discountScheme',
      headerName: 'Scheme Discount %',
      width: 150
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
      pid: rowValues.pid,
      productName: rowValues.prodName,
      productCategory: rowValues.prodCatagory,
      mfr: rowValues.prodMfr,
      batch: rowValues.prodBatch,
      expDate: mmmm + ' ,' + yy,
      hsn: rowValues.prodHsn,
      qty: rowValues.prodQty,
      purchaseRate: parseFloat(rowValues.prodPurcahsePrice).toFixed(2),
      mrp: rowValues.prodMrpPrice,
      amount: parseFloat(rowValues.prodAmountWithoutGst).toFixed(2),
      sgst: parseFloat(sgstAmount).toFixed(2) + ' (' + rowValues.prodSGST + '%)',
      cgst: parseFloat(cgstAmount).toFixed(2) + ' (' + rowValues.prodCGST + '%)',
      amountWithgst: parseFloat(rowValues.prodAmountWithGst).toFixed(2),
      sgstPerc: rowValues.prodSGST,
      cgstPerc: rowValues.prodCGST,
      discountPerc: rowValues.prodDiscountPerc,
      discountScheme: rowValues.prodDiscountScheme
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
    // console.log(date);
    // let newDate = new Date(date);
    // // console.log(newDate);
    // let dd = newDate.getDate();
    // let mm = newDate.getMonth() + 1;
    // // console.log(mm);
    // let yy = newDate.getFullYear();
    setPurchaseDate(dayjs(date).format('DD-MM-YYYY'));
    // setPurchaseDate(dayjs('2021-02-01'));
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
      let flag = true;
      if (formData.qty <= 0) {
        flag = false;
      } else if (!formData.prodPurchasePrice) {
        flag = false;
      }
      if (flag) {
        newData[findId] = {
          prodName: formData.name,
          prodQty: formData.qty,
          prodCatagory: formData.catagory,
          prodPurcahsePrice: formData.prodPurchasePrice,
          prodMfr: formData.mfr,
          prodMrpPrice: formData.mrp,
          prodBatch: formData.batch,
          prodSGST: parseFloat(formData.sgstperc) / 2,
          prodCGST: parseFloat(formData.sgstperc) / 2,
          prodAmountWithoutGst: formData.totalPrice,
          prodExpDate: expDate,
          prodHsn: formData.hsn,
          prodAmountWithGst: formData.totalPriceWithGst,
          prodDiscountPerc: formData.discountPerc,
          prodDiscountScheme: formData.discountScheme
        };
        // }
        // console.log(newData);
        setStockData(newData);
        handleCloseUpdate();
      }
    } else {
      handleCloseUpdate();
    }

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
        if (!e.pid) {
          let splitSupplierName = supplierName.split('--');
          let gstAmt = parseFloat(e.prodPurcahsePrice * (1 - discountPerc / 100) * (1 - discountScheme / 100));
          gstAmt = (gstAmt * parseFloat(e.prodSGST)) / 100;
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
              sgst: gstAmt,
              cgst: gstAmt,
              mrp: e.prodMrpPrice,
              batchNumber: e.prodBatch,
              discount: e.prodDiscountPerc || 0,
              schemeDiscount: e.prodDiscountScheme || 0
            }
          ];
        }
      });
      const purchaseOrderBody = {
        invoiceNumber: orderNumber,
        supplierId: supplierId,
        dateOfPruchase: dayjs(purchaseDate).format('YYYYMMDD'),
        paidAmount: paidAmount,
        modeOfPayment,
        dueDate: '20241231',
        addLessAmount: 'NA',
        crDrNote: 'NA',
        finalAmount: userInputTotalAmount || totalAmount
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
          // setPurchaseDate('');
          setPurchaseDate();
          setTotalSGSTAmount(0);
          setTotalCGSTAmount(0);
          setTotalAmount(0);
          setPaidAmount(0);
          setCreditAmount(0);
          setStockData([]);
          setOldInvNo('');
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
    //console.log(supplierSearch);/
    // alert('hello');
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
  /** existing order data fetch */
  const searchExistingPurchaseOrder = () => {
    let invNo = orderNumber;
    if (invNo) {
      if (oldInvNo != invNo) {
        setLoading(true);
        client
          .get('/purchaseorder?filterByInvoiceNumber=' + invNo)
          .then((res) => {
            let dataResultArr = res.data.result.result[0];
            //console.log(dataResultArr);
            client
              .get('/purchaseorder/' + dataResultArr._id)
              .then((resBody) => {
                let purchaseDtls = { ...resBody.data.result.result.purchaseOrderDetails };
                // console.log(purchaseDtls);
                let productDtls = [...resBody.data.result.result.products];
                setOrderNumber(purchaseDtls.invoiceNumber);
                setSupplierName(purchaseDtls.supplierName);
                setSupplierId(purchaseDtls.supplierId);
                setPurchaseDate(dayjs(purchaseDtls.dateOfPruchase));
                parseFloat(purchaseDtls.grandTotalAmount).toFixed(2) - parseFloat(purchaseDtls.paidAmount).toFixed(2) == 0
                  ? setFullPaid(true)
                  : setFullPaid(false);
                setPaidAmount(parseFloat(purchaseDtls.paidAmount).toFixed(2));
                setCreditAmount(purchaseDtls.cerditAmount);
                setModeofPayment(purchaseDtls.modeOfPayment);
                setTotalSGSTAmount(purchaseDtls.sgst);
                setTotalCGSTAmount(purchaseDtls.cgst);
                setTotalAmount(parseFloat(purchaseDtls.grandTotalAmount).toFixed(2));
                // setSupplierName('hello');
                let prodDtlsArr = [];
                productDtls.map((e) => {
                  // let discountRate = e.discount / e.prodQty;
                  // let schemeDiscountRate = e.schemeDiscount / e.prodQty;
                  // let discountPer = (discountRate / e.rate) * 100;
                  let discountPer = e.discount;
                  // let schemeDiscountper = parseFloat((schemeDiscountRate / e.rate(1 - discountRate / 100)) * 100).toFixed(2);
                  let schemeDiscountper = e.schemeDiscount;
                  let gstperc = parseFloat((e.sgst / e.purchasePrice) * 100).toFixed(1);
                  let totalAmountWithGst = parseFloat((parseFloat(e.purchasePrice) + parseFloat(e.sgst * 2)) * e.purchaseQuantity).toFixed(
                    2
                  );
                  let newDataForm = {
                    pid: e._id,
                    prodName: e.productName,
                    prodQty: e.purchaseQuantity,
                    prodCatagory: e.category,
                    prodPurcahsePrice: e.rate,
                    prodMrpPrice: e.mrp,
                    prodBatch: e.batchNumber,
                    prodSGST: gstperc,
                    prodCGST: gstperc,
                    prodAmountWithoutGst: e.purchasePrice * e.purchaseQuantity,
                    prodExpDate: dayjs(e.expDate),
                    prodHsn: e.hsnCode,
                    prodAmountWithGst: totalAmountWithGst,
                    prodDiscountPerc: discountPer,
                    prodDiscountScheme: schemeDiscountper,
                    prodMfr: e.mfrCode
                  };

                  prodDtlsArr = [...prodDtlsArr, newDataForm];
                });
                setStockData(prodDtlsArr);
              })
              .catch()
              .finally(() => {
                setLoading(false);
              });
          })
          .catch((err) => {
            setSupplierName('');
            setPurchaseDate();
            setPaidAmount(0);
            setCreditAmount(0);
            setModeofPayment('');
            setTotalSGSTAmount(0);
            setTotalCGSTAmount(0);
            setTotalAmount(0);
            setFullPaid(false);
            setStockData([]);
          })
          .finally(() => {
            setLoading(false);
          });
        setOldInvNo(invNo);
      }
    }
  };
  // console.log(supplierName);
  useEffect(() => {
    if (fullPaid) {
      return setPaidAmount(userInputTotalAmount || totalAmount);
    }

    return () => null;
  }, [fullPaid, totalAmount, paidAmount, userInputTotalAmount]);

  useEffect(() => {
    let totAmount = userInputTotalAmount || totalAmount;
    setCreditAmount((parseFloat(totAmount) - parseFloat(paidAmount)).toFixed(2));
    return () => null;
  }, [paidAmount, totalAmount, userInputTotalAmount]);
  let checkUserInputTotalvalue = (value) => {
    let regex = /^-?\d*\.?\d*$/;
    if (regex.test(value)) {
      //console.log('ok');
      setUserInputTotalAmount(value);
    }
  };
  // console.log(userInputTotalAmount);
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
          onBlur={searchExistingPurchaseOrder}
        />

        <Autocomplete
          id="free-solo-demo"
          freeSolo
          options={supplierSearch.map((option) => option.supplierName + '--' + option.supplierContactNo)}
          value={supplierName}
          name="supplier"
          disableClearable={true}
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
            // console.log('name : ' + value);
            setSupplierName(value);
            changeSupplierId(value);
          }}
        />
        {/* <TextField
          id="outlined-basic"
          label="Purchase Date"
          variant="outlined"
          type="date"
          fullWidth
          autoComplete="off"
          value={purchaseDate ? dayjs(purchaseDate).format('DD-MM-YYYY') : ''}
          onChange={(event) => setPurchaseDateFunction(event.target.value)}
          // onBlur={searchExistingPurchaseOrder}
        /> */}
        <LocalizationProvider dateAdapter={AdapterDayjs}>
          <DatePicker
            label="Purchase Date"
            fullWidth
            name="purchaseDate"
            format="DD-MM-YYYY"
            // defaultValue={dayjs(purchaseDate)}
            // selected={dayjs(purchaseDate)}
            value={purchaseDate}
            onChange={(date, constext) => {
              // console.log(constext.validationError);
              if (constext.validationError == null) {
                setPurchaseDate(date);
              }
            }} //setPurchaseDate(dayjs('2020-01-02'))
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
        <TextField id="outlined-basic" label="Total GST Amount" variant="outlined" fullWidth value={totalSGSTAmount} disabled />
        <TextField id="outlined-basic" label="Total CGST Amount" variant="outlined" fullWidth value={totalCGSTAmount} disabled />
        <TextField id="outlined-basic" label="Total Amount" variant="outlined" fullWidth value={totalAmount} disabled />
        <TextField
          id="outlined-basic"
          label="Final Amount (If total amount does not match)"
          variant="outlined"
          fullWidth
          value={userInputTotalAmount}
          onChange={(event) => checkUserInputTotalvalue(event.target.value)}
        />
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
      <Dialog open={open} fullScreen={true} maxWidth="xl" TransitionComponent={Transition}>
        <DialogTitle variant="h4" style={{ padding: '40px 30px', paddingBottom: '20px' }}>
          Add Stock
        </DialogTitle>

        <DialogContentText></DialogContentText>
        <div style={{ margin: '10px 30px 10px 30px' }}>
          <Stack
            spacing={0.5}
            padding={2}
            paddingBottom={1}
            direction="row"
            style={{ overflow: 'auto', borderRadius: '5px', border: '1px solid #cccccc' }}
          >
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
              <MenuItem key={0} value="" disabled>
                <em>Catagory</em>
              </MenuItem>
              {prodCatagoryArr.map((element) => (
                // console.log(element);
                <MenuItem key={element} value={element}>
                  {element}
                </MenuItem>
              ))}

              {/* <MenuItem value={5}>SGST 5%</MenuItem>
              <MenuItem value={12}>SGST 12%</MenuItem>
              <MenuItem value={18}>SGST 18%</MenuItem> */}
            </Select>
            <TextField
              id="outlined-basic"
              error={emptyProdQtyCheck ? true : false}
              helperText={emptyProdQtyCheck ? emptyProdQtyCheck : ''}
              type="text"
              label="QTY"
              variant="outlined"
              autoComplete="off"
              name="prodQuantity"
              value={prodQty}
              style={{ width: 80 }}
              onChange={onProductQtyChagne}
              onClick={() => setEmptyProdQtyCheck('')}
            ></TextField>
            <Autocomplete
              id="free-solo-demo"
              freeSolo
              options={productSearch.map((option) => option.productName)}
              value={prodName}
              name="prodName"
              disableClearable={true}
              size="small"
              style={{ width: 250 }}
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

            {/*           <TextField
              id="outlined-basic"
              label="Mfr"
              variant="outlined"
              // fullWidth
              autoComplete="off"
              style={{ width: 280 }}
              value={supplierName.substring(0, 2).toUpperCase() + dayjs().format('YYMMDDhhmmss')}
              onChange={(event) => {
                // fetchSupplier();
                setProdMfr(event.target.value);
              }}
            /> */}
            <TextField
              id="outlined-basic"
              error={emptyProdMrpCheck ? true : false}
              helperText={emptyProdMrpCheck ? emptyProdMrpCheck : ''}
              type="text"
              label="MRP"
              variant="outlined"
              autoComplete="off"
              name="prodMrp"
              style={{ width: 90 }}
              value={prodMrpPrice}
              onChange={(event) => setProdMrpPrice(event.target.value)}
              onClick={() => setEmptyProdMrpCheck('')}
            ></TextField>
            <TextField
              id="outlined-basic"
              label="Batch"
              variant="outlined"
              autoComplete="off"
              name="prodBatch"
              value={prodBatch}
              style={{ width: 100 }}
              onChange={(event) => setProdBatch(event.target.value)}
            ></TextField>
            <LocalizationProvider dateAdapter={AdapterDayjs}>
              <DatePicker
                label="Exp. Date"
                sx={{ width: '180px' }}
                views={['year', 'month']}
                name="expDate"
                value={dayjs(prodExpDate)}
                // defaultValue={}

                onChange={(date) => setExpDateFunction(date)}
              />
            </LocalizationProvider>
            <TextField
              id="outlined-basic"
              label="HSN"
              variant="outlined"
              autoComplete="off"
              name="hsn"
              style={{ width: 100 }}
              value={prodHsn}
              onChange={(event) => setProdHsn(event.target.value)}
            ></TextField>
            <TextField
              id="outlined-basic"
              error={emptyProdPurchasePriceCheck ? true : false}
              helperText={emptyProdPurchasePriceCheck ? emptyProdPurchasePriceCheck : ''}
              type="text"
              label="Rate"
              variant="outlined"
              autoComplete="off"
              name="prodPur"
              style={{ width: 90 }}
              value={prodPurcahsePrice}
              onChange={onProductPurchasePriceChange}
              onClick={() => setEmptyProdPurchasePriceCheck('')}
            ></TextField>

            {/* <TextField
              id="outlined-basic"
              error={emptyProdMrpCheck}
              helperText={emptyProdMrpCheck ? emptyProdMrpCheck : ''}
              type="text"
              label="Discount"
              variant="outlined"
              autoComplete="off"
              name="prodMrp"
              style={{ width: 90 }}
              value={prodMrpPrice}
              onChange={(event) => setProdMrpPrice(event.target.value)}
              onClick={() => setEmptyProdMrpCheck('')}
            ></TextField> */}

            {/* <TextField
              id="outlined-basic"
              error={emptyProdTotalPriceWithoutGstCheck && prodTotalPrice == '' ? true : false}
              helperText={emptyProdTotalPriceWithoutGstCheck && prodTotalPrice == '' ? emptyProdTotalPriceWithoutGstCheck : ''}
              label="Total Price"
              disabled
              variant="outlined"
              name="prodTotalPrice"
              value={prodTotalPrice}
              style={{ width: 120 }}
              aria-readonly="true"
              onClick={() => setEmptyProdTotalPriceWithoutGstCheck('')}
              ></TextField> */}
            <Select
              labelId="sgstLavel"
              id="demo-simple-select-helper"
              value={sgstPerc * 2}
              displayEmpty
              // label="Select GST"
              onChange={handleChange}
            >
              <MenuItem value="" disabled>
                <em>Select GST</em>
              </MenuItem>
              {gstPercArr.map((gstV) => (
                <MenuItem value={gstV}>GST {gstV}%</MenuItem>
              ))}
              {/* <MenuItem value={0}>SGST 0%</MenuItem>
              <MenuItem value={5}>SGST 5%</MenuItem>
              <MenuItem value={12}>SGST 12%</MenuItem>
              <MenuItem value={18}>SGST 18%</MenuItem> */}
            </Select>
            {/* <Select
              labelId="demo-simple-select-helper-label"
              id="demo-simple-select-helper"
              value={cgstPerc}
              displayEmpty
              // label="Select GST"
              onChange={handleChangeCgst}
            >
              <MenuItem value="" disabled>
                <em>Select CGST</em>
              </MenuItem> */}

            {/* <MenuItem value={0}>CGST 0%</MenuItem>
              <MenuItem value={5}>CGST 5%</MenuItem>
              <MenuItem value={12}>CGST 12%</MenuItem>
              <MenuItem value={18}>CGST 18%</MenuItem> */}
            {/* </Select> */}
            {/* <TextField
              id="outlined-basic"
              error={emptyProdTotalPriceWithGstCheck && prodTotalPrice == '' ? true : false}
              helperText={emptyProdTotalPriceWithGstCheck && prodTotalPrice == '' ? emptyProdTotalPriceWithGstCheck : ''}
              label="Total Price With GST"
              disabled
              variant="outlined"
              style={{ width: 120 }}
              name="prodTotalPriceWithGST"
              value={prodTotalPriceWithGST}
              aria-readonly="true"
              onClick={() => setEmptyProdTotalPriceWithGstCheck('')}
            ></TextField> */}
            {/* <Select
              labelId="discountSelect"
              id="demo-simple-select-helper"
              value={discountSelect}
              defaultValue={1}
              displayEmpty
              // label="Select GST"
              onChange={(e) => setDiscountSelect(e.target.value)}
            >
              <MenuItem value="" disabled>
                <em>Select field</em>
              </MenuItem>
              <MenuItem value={1}>D% - RATE</MenuItem>
              <MenuItem value={2}>D% - MRP</MenuItem>
            </Select> */}
            <TextField
              id="outlined-basic"
              error={emptyProdPurchasePriceCheck ? true : false}
              helperText={emptyProdPurchasePriceCheck ? emptyProdPurchasePriceCheck : ''}
              type="text"
              label="D%"
              variant="outlined"
              autoComplete="off"
              name="prodPur"
              style={{ width: 70 }}
              value={discountPerc}
              onChange={(e) => setDiscountPerc(e.target.value)}
              // onClick={() => setEmptyProdPurchasePriceCheck('')}
            ></TextField>
            <TextField
              id="outlined-basic"
              error={emptyProdPurchasePriceCheck ? true : false}
              helperText={emptyProdPurchasePriceCheck ? emptyProdPurchasePriceCheck : ''}
              type="text"
              label="Scheme D%"
              variant="outlined"
              autoComplete="off"
              name="prodPur"
              style={{ width: 120 }}
              value={discountScheme}
              onChange={(e) => setDiscountScheme(e.target.value)}
              // onClick={() => setEmptyProdPurchasePriceCheck('')}
            ></TextField>
          </Stack>
          <Grid container sx={{ paddingTop: 2 }} justifyContent={'space-between'}>
            <Grid
              display={'flex'}
              sx={{
                backgroundColor: 'cornflowerblue',
                color: 'white',
                width: '85%',
                borderRadius: '18px',
                height: '100px',
                margin: 0,
                justifyContent: 'space-between',
                padding: '0px 50px'
              }}
            >
              <Grid sx={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }}>
                <Typography variant="h5">Purchase Price after Discount</Typography>
                <Typography variant="h4" sx={{ marginLeft: '20px' }} color={'lavender'}>
                  ₹
                  {parseFloat(productPurchasePriceAfterDiscount).toFixed(2) == 'NaN'
                    ? 0.0
                    : parseFloat(productPurchasePriceAfterDiscount).toFixed(2)}
                </Typography>
              </Grid>
              <Grid sx={{ display: 'flex', alignItems: 'center' }}>
                <div style={{ height: 30, width: '1px', backgroundColor: 'white' }} />
              </Grid>
              <Grid sx={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }}>
                <Typography variant="h5">Discounted ₹</Typography>
                <Typography variant="h4" sx={{ marginLeft: '20px' }} color={'lavender'}>
                  ₹{parseFloat(prodPurcahsePrice) ? parseFloat(prodPurcahsePrice - productPurchasePriceAfterDiscount).toFixed(2) : 0}
                </Typography>
              </Grid>
              <Grid sx={{ display: 'flex', alignItems: 'center' }}>
                <div style={{ height: 30, width: '1px', backgroundColor: 'white' }} />
              </Grid>
              <Grid sx={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }}>
                <Typography variant="h5">GST ₹</Typography>
                <Typography variant="h4" sx={{ marginLeft: '20px' }} color={'lavender'}>
                  ₹{sgstPerc ? parseFloat((productPurchasePriceAfterDiscount * (sgstPerc * 2)) / 100).toFixed(2) : 0}
                </Typography>
              </Grid>
              <Grid sx={{ display: 'flex', alignItems: 'center' }}>
                <div style={{ height: 30, width: '1px', backgroundColor: 'white' }} />
              </Grid>
              <Grid sx={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }}>
                <Typography variant="h5">Total amount</Typography>
                <Typography variant="h4" sx={{ marginLeft: '20px' }} color={'lavender'}>
                  ₹{parseFloat(prodTotalPrice).toFixed(2) == 'NaN' ? 0.0 : parseFloat(prodTotalPrice).toFixed(2)}
                </Typography>
              </Grid>
              <Grid sx={{ display: 'flex', alignItems: 'center' }}>
                <div style={{ height: 30, width: '1px', backgroundColor: 'white' }} />
              </Grid>
              <Grid sx={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }}>
                <Typography variant="h5">Total amount including GST</Typography>
                <Typography variant="h4" sx={{ marginLeft: '20px' }}>
                  ₹{parseFloat(prodTotalPriceWithGST).toFixed(2) == 'NaN' ? 0 : parseFloat(prodTotalPriceWithGST).toFixed(2)}
                </Typography>
              </Grid>
            </Grid>
            <Grid>
              <div style={{ display: 'flex', justifyContent: 'flex-end', margin: '0px 0 0 0' }}>
                <Button variant="outlined" color="error" onClick={handleClose} style={{ margin: '0 10px 0 0' }}>
                  Cancel
                </Button>
                <Button variant="outlined" color="success" onClick={() => addStock()}>
                  Add
                </Button>
              </div>
            </Grid>
          </Grid>

          <DialogActions></DialogActions>
          <Divider textAlign="center">
            <Chip label="Added Products" size="small" />
          </Divider>
          <DialogContent>
            <div style={{ height: 380 }}>
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
            </div>
          </DialogContent>
        </div>
      </Dialog>
      <Divider style={{ margin: '20px 0px 20px 0px' }}></Divider>
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

      {/* <div style={stockData.length? {display:"flex", flexWrap:"wrap",justifyContent:"center",maxHeight:"500px",overflow:"scroll"} : {}}> */}

      {/* <DataGridDemo rows={dataRows} columns={dataColumns} />  */}
      {/* </div> */}
    </Grid>
  );
}
