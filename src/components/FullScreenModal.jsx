import * as React from 'react';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import ListItemText from '@mui/material/ListItemText';
import ListItemButton from '@mui/material/ListItemButton';
import List from '@mui/material/List';
import Divider from '@mui/material/Divider';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import { CloseCircleFilled } from '@ant-design/icons';

// import CloseIcon from '@mui/icons-material/Close';
import Slide from '@mui/material/Slide';
import { Alert, Box, Grid, IconButton, Snackbar, TextField } from '@mui/material';
import { Stack } from '@mui/system';
import OnSearchItemBox from './OnSearchItemBox';
import { debounce } from 'utils/debounce';
import { useEffect } from 'react';
import { client } from 'api/client';
import { useState } from 'react';

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

export default function FullScreenDialog({ open, selectedLots, handleClose, handleAddItemSale }) {
  const [productNameSearch, setProductNameSearch] = useState('');
  const [quantity, setQuantity] = useState('');
  const [sellingPrice, setSellingPrice] = useState('');
  const [productData, setProductData] = useState([]);
  const [selectedProducts, setSelectedProducts] = useState([]);
  const [quantityArray, setQuantityArray] = useState([]);
  const [discount, setDiscount] = useState(0);
  const [sellingPricePerUnit, setSellingPricePerUnit] = useState(0);
  useEffect(() => {
    let quantityArr = [];
    let availableQuantity = parseInt(quantity);
    let discount = 0;
    selectedProducts.map((e) => {
      if (e.quantity >= availableQuantity) {
        discount = parseFloat(parseFloat(discount) + parseFloat((e.mrp - sellingPrice / availableQuantity) * availableQuantity)).toFixed(2);
        quantityArr = [...quantityArr, { _id: e._id, quantity: availableQuantity }];
      } else {
        discount = parseFloat(parseFloat(discount) + parseFloat((e.mrp - sellingPrice / e.quantity) * e.quantity)).toFixed(2);
        quantityArr = [...quantityArr, { _id: e._id, quantity: e.quantity }];
        availableQuantity -= e.quantity;
      }
    });
    setSellingPricePerUnit(parseFloat(sellingPrice / parseInt(quantity)).toFixed(2));
    setDiscount(discount);
    setQuantityArray(quantityArr);
  }, [selectedProducts, sellingPrice, quantity]);
  const handleSelectedProductDelete = (id) => {
    const newArray = selectedProducts.filter((e) => e._id != id);
    setSelectedProducts(newArray);
  };

  const handleSelectedProducts = async (element) => {
    let matchFound = false;
    if (parseInt(quantity) > 0) {
      quantityArray.map((e) => {
        if (e.quantity >= quantity) {
          matchFound = true;
        }
      });
      if (!matchFound && !selectedProducts.find((e) => e._id == element._id)) {
        setSelectedProducts([...selectedProducts, element]);
      }
    } else {
      setError({ err: true, message: 'Please Enter valid Quantity.' });
    }
  };

  useEffect(() => {
    // console.clear();

    productNameSearch?.length > 2 &&
      (async () =>
        client.get('/stock/searchfullproduct?pattern=' + productNameSearch).then((res) => {
          const { result } = res.data.result;
          if (selectedLots?.length) {
            // console.log(result);
            let newArray = [];
            // const newArray = result.filter((e) => {
            //   const tempObj = selectedLots.find((el) => el._id == e._id);
            //   console.log(e._id, tempObj?._id);
            //   if(new)
            //   return e._id != tempObj?._id || e.quantity != tempObj?.quantity;
            // });

            result.map((e) => {
              const tempObj = selectedLots.find((el) => el._id == e._id);
              if (tempObj) {
                if (parseInt(e.quantity - tempObj.quantity) != 0) {
                  newArray = [...newArray, { ...tempObj, quantity: e.quantity - tempObj.quantity }];
                }
              } else {
                newArray = [...newArray, e];
              }
            });

            setProductData(newArray);
          } else {
            setProductData(result);
          }
        }))();
    return () => null;
  }, [productNameSearch, open]);

  let addSaleItem = () => {
    let message = '';
    if (quantityArray?.length == 0) {
      message = 'Select atlease one product.';
    } else if (sellingPrice == '') {
      message = 'Please enter selling price.';
    } else if (sellingPrice == 0) {
      message = 'Selling price must be greater than 0.';
    }
    if (message == '') {
      handleAddItemSale(selectedProducts, quantityArray, sellingPrice);
      setProductNameSearch('');
      setQuantity('');
      setSellingPrice('');
      setProductData([]);
      setSelectedProducts([]);
      setQuantityArray([]);
      setDiscount(0);
    } else {
      setError({ err: true, message });
    }
  };
  const [error, setError] = useState('');
  let handleCloseSnackBar = () => {
    setError('');
  };
  let vertical = 'top';
  let horizontal = 'center';
  return (
    <React.Fragment>
      {/* {console.log(selectedProducts)} */}
      <Dialog fullScreen open={open} onClose={() => handleClose()} TransitionComponent={Transition}>
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

        <AppBar sx={{ position: 'fixed' }} color="default" style={{ boxShadow: 'none' }}>
          <Toolbar style={{ justifyContent: 'space-between' }}>
            <IconButton color="error" sx={{ padding: '0px 60px', border: '1px soild red' }} onClick={() => handleClose()}>
              <CloseCircleFilled /> <span style={{ marginLeft: 10 }}> EXIT</span>
            </IconButton>
            <Typography variant="h3" marginLeft={'25px'}>
              Add Items for Sale
            </Typography>
            <Button autoFocus color="success" variant="contained" onClick={() => addSaleItem()}>
              Add Item
            </Button>
          </Toolbar>
        </AppBar>
        <Grid padding={5} display={'flex'} justifyContent={'space-between'} paddingTop={'80px'}>
          <Grid flexGrow={1} padding={1}>
            <Stack direction={'row'} justifyContent={'space-between'}>
              <TextField
                variant="standard"
                label="Quantity"
                style={{ width: '300px', margin: '20px 0px', marginTop: 0 }}
                value={quantity}
                onChange={(e) => setQuantity(e.target.value)}
              />
              <TextField
                variant="standard"
                label="Selling Price"
                style={{ width: '300px', margin: '20px 0px', marginTop: 0 }}
                value={sellingPrice}
                onChange={(e) => setSellingPrice(e.target.value)}
              />
            </Stack>
            <TextField
              variant="standard"
              fullWidth
              label="Search Products"
              sx={{ mb: 4 }}
              autoFocus
              onChange={(e) => setProductNameSearch(e.target.value)}
            />
            <Stack direction={'row'} justifyContent={'space-between'}>
              <Grid display={'flex'}>
                <Typography variant="h5" style={{ paddingTop: '5px' }}>
                  Discount:
                </Typography>
                <Typography style={{ marginLeft: '10px', paddingTop: '6px' }} variant="h5" color={'peru'}>
                  ₹{discount || 0}
                </Typography>
              </Grid>
              <Stack direction={'row'}>
                <Button autoFocus color="success" variant="contained" onClick={() => addSaleItem()}>
                  Add Item for Sale
                </Button>
                <Button
                  variant="contained"
                  style={{ backgroundColor: 'cornflowerblue', marginLeft: 10 }}
                  onClick={() => {
                    setProductNameSearch('');
                    window.open('https://titirpetshop-1-ez7f.vercel.app/purchaseorder/add', '_blank');
                  }}
                >
                  Create new Stock
                </Button>
              </Stack>
            </Stack>
            <Stack direction={'row'} justifyContent={'space-between'}>
              <Grid display={'flex'}>
                <Typography variant="h5" style={{ paddingTop: '5px' }}>
                  Selling price per unit:
                </Typography>
                <Typography style={{ marginLeft: '10px', paddingTop: '6px' }} variant="h5" color={'peru'}>
                  ₹{sellingPricePerUnit == 'NaN' ? 0 : sellingPricePerUnit}
                </Typography>
              </Grid>
            </Stack>
            <Typography variant="h5" marginTop={'20px'} marginBottom={'20px'}>
              Selcted Lots:
            </Typography>
            <Stack overflow={'auto'} maxHeight={500} paddingRight={'50px'}>
              <Box>
                {selectedProducts.map((e) => {
                  if (productData.find((el) => e._id == el._id)) {
                    return <OnSearchItemBox data={e} result={true} selected={true} added={false} onDelete={handleSelectedProductDelete} />;
                  } else
                    return <OnSearchItemBox data={e} result={true} selected={false} added={false} onDelete={handleSelectedProductDelete} />;
                })}
              </Box>
            </Stack>
          </Grid>
          <Grid flexGrow={1} style={{ padding: 0, margin: 0, width: '600px', borderLeft: '1px solid #cccccc', marginLeft: '40px' }}>
            <Box sx={{ width: '100%', height: '100px', padding: 0, margin: 0 }}>
              <Stack sx={{ padding: '10px', paddingLeft: '40px' }}>
                <Typography variant="h5" style={{ marginBottom: '20px' }}>
                  {productData.length} Products found
                </Typography>
                <Stack overflow={'auto'} height={'600px'}>
                  {productData.map((e) => {
                    if (selectedProducts.find((el) => el._id == e._id)) {
                      return <OnSearchItemBox result={false} selected={true} added={false} data={e} onSelect={handleSelectedProducts} />;
                    } else
                      return <OnSearchItemBox result={false} selected={false} added={false} data={e} onSelect={handleSelectedProducts} />;
                  })}
                </Stack>
              </Stack>
            </Box>
          </Grid>
        </Grid>
      </Dialog>
    </React.Fragment>
  );
}
