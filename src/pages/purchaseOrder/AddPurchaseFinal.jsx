// import { Button } from '@mui/material'
// import { ThemeProvider } from '@emotion/react'
import { Box, Button, Card, CardActionArea, CardContent, CardMedia, Container, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, Divider,  MenuItem,  Select,  Stack, TextField, Typography } from '@mui/material'
import React from 'react'
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { DeleteFilled, DeleteOutlined, DeleteTwoTone } from '@ant-design/icons';
// import DeleteForeverIcon from '@mui/icons-material/DeleteForever';
import { DataGrid, GridToolbar } from '@mui/x-data-grid';


// import './Css/AddPurchase.css'
// import AddStockDiv from '../relationComponents/AddStockDiv';


export default function AddPurchase() {

  // dayjs.tz.setDefault("Asia/Kolkata");
  let today = new Date();
  let dd = String(today.getDate()).padStart(2, '0');
  let mm = String(today.getMonth() + 1).padStart(2, '0'); //January is 0!
  let yyyy = today.getFullYear();
  // today = dd + '/' + mm + '/' + yyyy;
  today = yyyy+ '-'+mm+'-'+dd;

  const [orderNumber,setOrderNumber]=React.useState('');
  const [supplierName,setSupplierName]=React.useState('');
  const [purchaseDate,setPurchaseDate]=React.useState(null);
  const [totalSGSTAmount,setTotalSGSTAmount]=React.useState(0);
  const [totalCGSTAmount,setTotalCGSTAmount]=React.useState(0);
  const [totalAmount,setTotalAmount]=React.useState(0);
  
  const [paidAmount,setPaidAmount]=React.useState(0);
  const [creditAmount,setCreditAmount]=React.useState(0);
  const [sgstPerc, setSgstPerc] = React.useState('');
  const [cgstPerc, setCgstPerc] = React.useState('');
  const [prodBatch,setProdBatch] = React.useState('');
  const [prodHsn,setProdHsn] = React.useState('');
  const [prodExpDate,setProdExpDate] = React.useState(null);
  const [open, setOpen] = React.useState(false);  
  const [prodTotalPrice,setProdTotalPrice]=React.useState('');
  const [prodTotalPriceWithGST,setProdTotalPriceWithGST]=React.useState('');
  const [stockData,setStockData]= React.useState([]);
  const [prodName,setProdName]= React.useState('');
  const [prodQty,setProdQty]= React.useState('');
  const [prodCatagory,setProdCatagory]= React.useState('');
  const [prodPurcahsePrice,setProdPurcahsePrice]= React.useState('');
  const [prodMrpPrice,setProdMrpPrice]= React.useState('');
  const [emptyProdNameCheck,setEmptyProdNameCheck]=React.useState('');
  const [emptyProdCategoryCheck,setEmptyProdCategoryCheck]=React.useState('');
  // const [emptyProdExpDateCheck,setEmptyProdExpDateCheck]=React.useState('');
  const [emptyProdQtyCheck,setEmptyProdQtyCheck]=React.useState('');
  const [emptyProdPurchasePriceCheck,setEmptyProdPurchasePriceCheck]=React.useState('');
  const [emptyProdMrpCheck,setEmptyProdMrpCheck]=React.useState('');
  const [emptyProdTotalPriceWithoutGstCheck,setEmptyProdTotalPriceWithoutGstCheck]=React.useState('');
  const [emptyProdTotalPriceWithGstCheck,setEmptyProdTotalPriceWithGstCheck]=React.useState('');
  /* all fucntion */
    let handleChange = (event) => {
      let sgstPercValue = event.target.value;
      setSgstPerc(sgstPercValue);
      totalProductPriceCal(prodQty,prodPurcahsePrice,cgstPerc,sgstPercValue);
    };
    let handleChangeCgst =(e)=>{
      let cgstPercAmount = e.target.value;
      setCgstPerc(cgstPercAmount);
      totalProductPriceCal(prodQty,prodPurcahsePrice,cgstPercAmount,sgstPerc);
    };
    let onProductQtyChagne = (event)=>{
      let productQuantity = event.target.value;
      // let productPrice = prodPurcahsePrice;
      setProdQty(productQuantity);
      totalProductPriceCal(productQuantity,prodPurcahsePrice,cgstPerc,sgstPerc);

    };
    let onProductPurchasePriceChange = (event)=>{
      // let productQuantity = prodQty;
      let productPrice = event.target.value;
      // let cgstPerc = cgstPerc;

      setProdPurcahsePrice(productPrice);
      totalProductPriceCal(prodQty,productPrice,cgstPerc,sgstPerc);

    };
    let totalProductPriceCal = (productQuantity,productPrice,cgstPerc,sgstPerc)=>{
      if(productQuantity!='' && productPrice!=''){
        let totalPriceWithoutGst = productQuantity*productPrice;
        let totalPriceWithGst = productQuantity*productPrice;
        setProdTotalPrice(totalPriceWithoutGst);
        // 
        if(cgstPerc!=''){
          let cgstAmount = (totalPriceWithoutGst*(cgstPerc/100)).toFixed(2);
          totalPriceWithGst = parseFloat(totalPriceWithGst) + parseFloat(cgstAmount);
        }
        if(sgstPerc!=''){
          let sgstAmount = (totalPriceWithoutGst*(sgstPerc/100)).toFixed(2);
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
    let addStock = () =>{
      let flag = 1;
      if(prodName=='' || prodName=='undefined'){
        setEmptyProdNameCheck('Please enter product name.');
        flag=0;
      }
      if(prodCatagory=='' || prodCatagory=='undefined'){
        setEmptyProdCategoryCheck('Please enter product category.');
        flag=0;
      }
      if(prodQty=='' || prodQty=='undefined'){
        setEmptyProdQtyCheck('Please enter product quantity.');
        flag=0;
      }
      if(prodQty<=0){
        if(prodQty<0){
          setEmptyProdQtyCheck('Quantity must be in positive figure.');
        }else if(prodQty==0){
          setEmptyProdQtyCheck('Quantity must be greater than \'0\'.');
        }
        flag=0;
      }
      if(prodPurcahsePrice=='' || prodPurcahsePrice=='undefined'){
        setEmptyProdPurchasePriceCheck('Please enter purchase rate.');
        flag=0;
      }
      if(prodPurcahsePrice<=0){
        if(prodPurcahsePrice<0){
          setEmptyProdPurchasePriceCheck('Purchase rate must be in positive figure.');
        }else if(prodPurcahsePrice==0){
          setEmptyProdPurchasePriceCheck('Purchase rate must be greater than \'0\'.');
        }
        flag=0;
      }setEmptyProdTotalPriceWithoutGstCheck
      if(prodMrpPrice=='' || prodMrpPrice=='undefined'){
        setEmptyProdMrpCheck('Please enter MRP.');
        flag=0;
      }
      if(prodMrpPrice<=0){
        if(prodMrpPrice<0){
          setEmptyProdMrpCheck('MRP must be in positive figure.');
        }else if(prodMrpPrice==0){
          setEmptyProdMrpCheck('MRP must be greater than \'0\'.');
        }
        flag=0;
      }
      if(prodMrpPrice>0){
        if(parseFloat(prodMrpPrice)<parseFloat(prodPurcahsePrice)){
          setEmptyProdMrpCheck('MRP must be greater than purchase rate.');
          flag=0;
        }
      }
      if(prodTotalPrice=='' || prodTotalPrice=='undefined'){
        setEmptyProdTotalPriceWithoutGstCheck('Please re-enter purchase rate or quantity.');
        flag=0;
      }
      if(prodTotalPrice<=0){
        if(prodTotalPrice<0){
          setEmptyProdTotalPriceWithoutGstCheck('Please re-enter purchase rate or quantity.');
        }else if(prodTotalPrice==0){
          setEmptyProdTotalPriceWithoutGstCheck('Please re-enter purchase rate or quantity.');
        }
        flag=0;
      }
      if(prodTotalPriceWithGST=='' || prodTotalPriceWithGST=='undefined'){
        setEmptyProdTotalPriceWithGstCheck('Please re-enter purchase rate or quantity.');
        flag=0;
      }
      if(prodTotalPriceWithGST<=0){
        if(prodTotalPriceWithGST<0){
          setEmptyProdTotalPriceWithGstCheck('Please re-enter purchase rate or quantity or GST.');
        }else if(prodTotalPriceWithGST==0){
          setEmptyProdTotalPriceWithGstCheck('Please re-enter purchase rate or quantity or GST.');
        }
        flag=0;
      }
      
      if(flag){
        let newGrandTotal = (parseFloat(totalAmount)+parseFloat(prodTotalPriceWithGST)).toFixed(2);
        setTotalAmount(newGrandTotal);
        let newCreditAmount = (parseFloat(newGrandTotal)-parseFloat(paidAmount)).toFixed(2);
        if(newCreditAmount<0){
          newCreditAmount=0;
        }
        setCreditAmount(newCreditAmount);
        setTotalSGSTAmount((prodTotalPrice*(sgstPerc/100)).toFixed(2));
        setTotalCGSTAmount((prodTotalPrice*(cgstPerc/100)).toFixed(2));
        const newDataForm = {
          prodName:prodName,
          prodQty:prodQty,
          prodCatagory:prodCatagory,
          prodPurcahsePrice:prodPurcahsePrice,
          prodMrpPrice:prodMrpPrice,
          prodBatch:prodBatch,
          prodSGST:sgstPerc,
          prodCGST:cgstPerc,
          prodAmountWithoutGst:prodTotalPrice,
          prodExpDate:prodExpDate,
          prodHsn:prodHsn,
          prodAmountWithGst:prodTotalPriceWithGST
        }
        setStockData([...stockData,newDataForm]);
        setProdName('');
        setProdQty('');
        setProdCatagory('');
        setProdPurcahsePrice('');
        setProdMrpPrice('');
        
        setSgstPerc('');
        setCgstPerc('');
        setProdBatch('');
        setProdHsn('');
        setProdExpDate(null);
        setProdTotalPriceWithGST('');
        setProdTotalPrice('');
      }
    }
    let deletestock = (e)=>{
      console.clear();
      console.log(stockData[e]);
      setStockData(l => l.filter((item,i) => i != e));
    };
    let orderNumberOnchange=(e)=>{
      const result = e.target.value.replace(/\D/g, '');

        setOrderNumber(result)
    }
  /* all fucntion */
  ///// table column
  const dataColumns = [
    { field: 'id', headerName: 'Sl No.', width: 90 },
    {
      field: 'productName',
      headerName: 'Product Name',
      width: 150,
      editable: true,
    },
    {
      field: 'productCategory',
      headerName: 'Product Categroy',
      width: 150,
      editable: true,
    },
    {
      field: 'mrp',
      headerName: 'MRP',
      type: 'number',
      width: 110,
      editable: true,
    },
    {
      field: 'batch',
      headerName: 'Batch No.',
      width: 160,
    },
    {
      field: 'expDate',
      headerName: 'Exp',
      width: 160,
    },
    {
      field: 'hsn',
      headerName: 'Hsn',
      width: 160,
    },
    {
      field: 'purchaseRate',
      headerName: 'Rate',
      width: 160,
    },
    {
      field: 'amount',
      headerName: 'Amount',
      width: 160,
    },
    {
      field: 'sgst',
      headerName: 'SGST',
      width: 160,
    },
    {
      field: 'cgst',
      headerName: 'CGST',
      width: 160,
    },
    {
      field: 'amountWithgst',
      headerName: 'Amount+GST',
      width: 160,
    },
  ];
  let count = 0;
  //// table row data
  function createDate(rowValues){
    count++;
    let sgstAmount = (rowValues.prodAmountWithoutGst*(rowValues.prodSGST/100)).toFixed(2);
    let cgstAmount = (rowValues.prodAmountWithoutGst*(rowValues.prodCGST/100)).toFixed(2);
    let months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
    let newDate = new Date(rowValues.prodExpDate);
    let mmmm= months[(newDate.getMonth())];
    let yy = newDate.getFullYear();
    let data={
      id:count,
      productName:rowValues.prodName,
      productCategory:rowValues.prodCatagory,
      mrp:rowValues.prodMrpPrice,
      batch:rowValues.prodBatch,
      expDate:mmmm+' ,'+yy,
      hsn:rowValues.prodHsn,
      purchaseRate:rowValues.prodPurcahsePrice,
      amount:rowValues.prodAmountWithoutGst,
      sgst:sgstAmount+' ('+rowValues.prodSGST+'%)',
      cgst:cgstAmount+' ('+rowValues.prodCGST+'%)',
      amountWithgst:rowValues.prodAmountWithGst,
    }
    return data;
  }
  let dataRows = [];
  stockData.map((e)=>{
    let newData = createDate(e);
    dataRows = ([...dataRows,newData]);
  });
  // alert(purchaseDate);
  let setPurchaseDateFunction = (date) =>{
    let newDate = new Date(date);
    // console.log(newDate);
    let dd =newDate.getDate();
    let mm =newDate.getMonth()+1;
    // console.log(mm);
    let yy =newDate.getFullYear();
    setPurchaseDate(yy+'-'+mm+'-'+dd);
  };
  let setExpDateFunction = (date) =>{
    let newDate = new Date(date);
    // console.log(newDate);
    let dd ='01';
    let mm =newDate.getMonth()+1;
    // console.log(mm);
    let yy =newDate.getFullYear();
    setProdExpDate(yy+'-'+mm+'-'+dd);
  };
  let changePaidAmount= (event) =>{
    let newPaidAmount = event.target.value;
    if(newPaidAmount<0||newPaidAmount==''){
      newPaidAmount=0;
    }else{
      newPaidAmount=parseFloat(newPaidAmount);
    }
    setPaidAmount(newPaidAmount);
    let newCreditAmount = (parseFloat(totalAmount)).toFixed(2);
    if(newPaidAmount>0){
      newCreditAmount = (parseFloat(totalAmount)-parseFloat(newPaidAmount)).toFixed(2);
      
    }
    if(newCreditAmount<0){
      newCreditAmount=0;
    }
    setCreditAmount(newCreditAmount);
  };
  return (
    <Container maxWidth='md' >
      {/* <h3 className='ColorPrimary'>Purchase Order</h3> */}
      <Divider ></Divider>
      <Stack spacing={2} marginTop={3} marginBottom={3}>          
        <TextField id="outlined-basic" label="Order Number" variant="outlined" fullWidth autoComplete='off' value={orderNumber} onChange={(event)=>setOrderNumber(event.target.value)}/>

        <TextField id="outlined-basic" label="Supplier Name" variant="outlined" fullWidth autoComplete='off' value={supplierName} onChange={(event)=>setSupplierName(event.target.value)}/>

        <LocalizationProvider dateAdapter={AdapterDayjs}>
          <DatePicker label='Purchase Date' fullWidth name="purchaseDate" selected={purchaseDate} onChange={(date)=>setPurchaseDateFunction(date)}/>{/*  */}
        </LocalizationProvider>
        <TextField id="outlined-basic" label="Total SGST Amount"  variant="outlined" fullWidth value={totalSGSTAmount} aria-readonly='true'/>
        <TextField id="outlined-basic" label="Total CGST Amount"  variant="outlined" fullWidth value={totalCGSTAmount} aria-readonly='true'/>
        <TextField id="outlined-basic" label="Total Amount"  variant="outlined" fullWidth value={totalAmount} aria-readonly='true'/>

        <TextField id="outlined-basic" label="Paid Amount" variant="outlined" autoComplete='off' fullWidth value={paidAmount} onChange={(event)=>changePaidAmount(event)}/>

        <TextField id="outlined-basic" label="Credit Amount"  variant="outlined" fullWidth value={creditAmount} aria-readonly='true'/>

        {/* <TextField id="outlined-basic" label="Order Number" variant="outlined" fullWidth/> */}
        </Stack>
        {/* <Divider ></Divider> */}
        <Stack direction="row" spacing={2}>
        <Button variant="contained" color='secondary' onClick={handleClickOpen} marginTop={3} style={{width:'50%'}} >
          Add Stock
        </Button>
        <Button variant="contained"  color='secondary' marginTop={3} style={{width:'50%'}}>
          Submit
        </Button>
        </Stack>
        
        <Dialog
          open={open}
          fullWidth
          maxWidth='lg'
          
        >
          {/* <DialogTitle>
          </DialogTitle> */}
          <Container >
                <DialogContent>
                  <DialogContentText>
                    <br></br>
                  </DialogContentText>
                  {/* <AddStockDiv data={{prodName,prodQty,prodCatagory,prodMrpPrice,prodPurcahsePrice}}/> */}
                  <Stack  spacing={2} >
                        <Typography variant='h4' style={{ paddingBottom:"10px"}} color="primary">Add Stock</Typography>
                        <TextField id="outlined-basic" error={emptyProdNameCheck} helperText={emptyProdNameCheck?emptyProdNameCheck:""} label="Product Name"  variant="outlined" autoComplete='off' name="prodName" value={prodName} onChange={(event)=>setProdName(event.target.value)} onClick={()=>setEmptyProdNameCheck('')}></TextField>
                        <TextField id="outlined-basic" error={emptyProdCategoryCheck} helperText={emptyProdCategoryCheck?emptyProdCategoryCheck:""} label="Product Catagory" variant="outlined" autoComplete='off' name="prodCat" value={prodCatagory} onChange={(event)=>setProdCatagory(event.target.value)} onClick={()=>setEmptyProdCategoryCheck('')}></TextField>
                        <TextField id="outlined-basic" label="Batch" variant="outlined" autoComplete='off' name="prodBatch" value={prodBatch} onChange={(event)=>setProdBatch(event.target.value)}></TextField>
                        <TextField id="outlined-basic" label="HSN" variant="outlined" autoComplete='off' name="hsn" value={prodHsn} onChange={(event)=>setProdHsn(event.target.value)}></TextField>
                        <LocalizationProvider dateAdapter={AdapterDayjs}>
                          <DatePicker label='Exp. Date' fullWidth views={["year","month"]} selected={prodExpDate} name="expDate" onChange={(date)=>setExpDateFunction(date)}/>
                        </LocalizationProvider>
                        <TextField id="outlined-basic" error={emptyProdQtyCheck} helperText={emptyProdQtyCheck?emptyProdQtyCheck:""} label="Quantity" variant="outlined" autoComplete='off' name="prodQuantity" value={prodQty} onChange={onProductQtyChagne} onClick={()=>setEmptyProdQtyCheck('')}></TextField>
                        <TextField id="outlined-basic" error={emptyProdPurchasePriceCheck} helperText={emptyProdPurchasePriceCheck?emptyProdPurchasePriceCheck:""} label="Purchase Price" variant="outlined" autoComplete='off' name="prodPur" value={prodPurcahsePrice} onChange={onProductPurchasePriceChange} onClick={()=>setEmptyProdPurchasePriceCheck('')}></TextField>
                        <TextField id="outlined-basic" error={emptyProdMrpCheck} helperText={emptyProdMrpCheck?emptyProdMrpCheck:""} label="MRP" variant="outlined" autoComplete='off' name="prodMrp" value={prodMrpPrice} onChange={(event)=>setProdMrpPrice(event.target.value)} onClick={()=>setEmptyProdMrpCheck('')}></TextField>
                        
                        <TextField id="outlined-basic" error={emptyProdTotalPriceWithoutGstCheck&&prodTotalPrice==''?true:false} helperText={emptyProdTotalPriceWithoutGstCheck && prodTotalPrice==''?emptyProdTotalPriceWithoutGstCheck:""} label="Total Price" disabled variant="outlined" name="prodTotalPrice" value={prodTotalPrice} aria-readonly='true' onClick={()=>setEmptyProdTotalPriceWithoutGstCheck('')}></TextField>
                        {/* <InputLabel id="sgstLavel">Select GST</InputLabel> */}
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
                          <MenuItem value={0}>SGST 0%</MenuItem>
                          <MenuItem value={5}>SGST 5%</MenuItem>
                          <MenuItem value={12}>SGST 12%</MenuItem>
                          <MenuItem value={18}>SGST 18%</MenuItem>
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
                          <MenuItem value={0} >CGST 0%</MenuItem>
                          <MenuItem value={5}>CGST 5%</MenuItem>
                          <MenuItem value={12}>CGST 12%</MenuItem>
                          <MenuItem value={18}>CGST 18%</MenuItem>
                        </Select>
                        <TextField id="outlined-basic" error={emptyProdTotalPriceWithGstCheck&&prodTotalPrice==''?true:false} helperText={emptyProdTotalPriceWithGstCheck&&prodTotalPrice==''?emptyProdTotalPriceWithGstCheck:""} label="Total Price With GST" disabled variant="outlined" name="prodTotalPriceWithGST" value={prodTotalPriceWithGST} aria-readonly='true' onClick={()=>setEmptyProdTotalPriceWithGstCheck('')}></TextField>

                  <div style={{display:"flex",justifyContent:"flex-end"}}>
                  <Button variant="outlined" onClick={handleClose} style={{margin:"0 10px 0 0"}}>Cancel</Button>
                  <Button variant="outlined" onClick={()=>addStock()}>Add</Button>
                  </div>
                  </Stack>
                </DialogContent>
                
                <DialogActions>
                  
                </DialogActions>
                
            </Container>
        </Dialog>
        <Divider style={{margin:"20px 0px 20px 0px"}}></Divider>
        {/* <Typography variant='h5'  > List of stocks added:</Typography> */}
          {/* {stockData.map((stockDtls,index)=>(
              <Card stockdtls={stockDtls} index={index}/>
            ))} */}
            {/* <DataGridDemo stockdata={stockData}/> */}
          <div style={stockData.length? {display:"flex", flexWrap:"wrap",justifyContent:"center",maxHeight:"500px",overflow:"scroll"} : {}}>
            {/* {
              stockData.map((e,i)=>{
                return ( */}
                
                  {/* <CardFunction prodData={e} prodIndex= {i} handleDelete={deletestock}/>                 */}
                
                {/* )
              })
            } */}

            {/* <DataGridDemo rows={dataRows} columns={dataColumns} /> handleDelete={deletestock} */}
          </div>
    </Container>
  )
}
function CardFunction({prodData,prodIndex,handleDelete}){
  // alert(proddata.prodName);
  // console.log(prodData);
  return(
    // <div >
      <Card  style={{margin:"8px 0px 8px 0px",display:"flex"}}>
        <CardActionArea>
          
          <CardContent style={{width:800}} >
            <div style={{display:"flex",justifyContent:"space-between"}}>
              <Typography gutterBottom variant="h5" component="div">
                  {prodData.prodName}
              </Typography>
              <div>QTY: {prodData.prodQty}</div>
            </div>
            <div style={{display:"flex",justifyContent:"space-between"}}>
              <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                  Category: {prodData.prodCatagory}
              </Typography>
              <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                  MRP: {prodData.prodMrpPrice}
              </Typography>
              <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                  Pruchase Price: {prodData.prodPurcahsePrice}
              </Typography>
            </div>

          </CardContent>
          
        </CardActionArea>
        <Button variant="outlined" color="error" onClick={()=>handleDelete(prodIndex)}>
        {/* error  */}
        <DeleteFilled style={{fontSize:"21px"}}/>
        {/* <DeleteForeverIcon/> */}
      </Button>
      </Card>
      
    // </div>  
  );
}

function DataGridDemo({rows,columns}) {
  return (
    <Box sx={{ height: 400, width: '100%' }}>
      <DataGrid
        rows={rows}
        columns={columns}
        initialState={{
          pagination: {
            paginationModel: {
              pageSize: 5,
            },
          },
        }}
        // slots={{
        //   toolbar: GridToolbar,
        // }}
        pageSizeOptions={[5]}
        // checkboxSelection
        disableRowSelectionOnClick
      />
    </Box>
  );
}


