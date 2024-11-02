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
// import CloseIcon from '@mui/icons-material/Close';
import Slide from '@mui/material/Slide';
import { Box, Grid, TextField } from '@mui/material';
import { Stack } from '@mui/system';
import OnSearchItemBox from './OnSearchItemBox';
import { debounce } from 'utils/debounce';
import { useEffect } from 'react';
import { client } from 'api/client';
import { useState } from 'react';

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

export default function FullScreenDialog({ open, handleClose }) {
  const [productNameSearch, setProductNameSearch] = useState('');
  const [quantity, setQuantity] = useState('');
  const [sellingPrice, setSellingPrice] = useState('');
  const [productData, setProductData] = useState([]);
  const [selectedProducts, setSelectedProducts] = useState([]);
  const [quantityArray, setQuantityArray] = useState([]);

  useEffect(() => {
    let quantityArr = [];

    selectedProducts.map((e) => {
      if (e.quantity >= quantity) {
        quantityArr = [...quantityArr, { _id: e._id, quantity }];
      } else {
        quantityArr = [...quantityArr, { _id: e._id, quantity: e.quantity }];
      }
    });
    setQuantityArray(quantityArr);
  }, [selectedProducts]);

  const handleSelectedProductDelete = (id) => {
    const newArray = selectedProducts.filter((e) => e._id != id);
    setSelectedProducts(newArray);
  };

  const handleSelectedProducts = async (element) => {
    let matchFound = false;
    quantityArray.map((e) => {
      if (e.quantity >= quantity) {
        matchFound = true;
      }
    });
    if (!matchFound && !selectedProducts.find((e) => e._id == element._id)) {
      setSelectedProducts([...selectedProducts, element]);
    }
  };

  useEffect(() => {
    (async () =>
      client
        .get('/stock/searchfullproduct?pattern=' + productNameSearch)
        .then((res) => {
          const { result } = res.data.result;
          setProductData(result);
        })
        .catch((err) => console.log(err)))();
    return () => null;
  }, [productNameSearch]);

  return (
    <React.Fragment>
      {console.log(quantityArray)}
      <Dialog fullScreen open={open} onClose={() => handleClose()} TransitionComponent={Transition}>
        <AppBar sx={{ position: 'fixed' }} color="default" style={{ boxShadow: 'none' }}>
          <Toolbar style={{ justifyContent: 'space-between' }}>
            <Typography variant="h3" marginLeft={'25px'}>
              Add Items for Sale
            </Typography>
            <Button autoFocus color="success" variant="contained" onClick={() => handleClose()}>
              Add
            </Button>
          </Toolbar>
        </AppBar>
        <Grid padding={5} display={'flex'} justifyContent={'space-between'} paddingTop={'80px'}>
          <Grid flexGrow={1} padding={1}>
            <TextField
              variant="standard"
              fullWidth
              label="Search Products"
              autoFocus
              onChange={(e) => setProductNameSearch(e.target.value)}
            />
            <Stack direction={'row'} justifyContent={'space-between'}>
              <TextField
                variant="standard"
                label="Quantity"
                style={{ width: '300px', margin: '20px 0px' }}
                value={quantity}
                onChange={(e) => setQuantity(e.target.value)}
              />
              <TextField
                variant="standard"
                label="Selling Price"
                style={{ width: '300px', margin: '20px 0px' }}
                value={sellingPrice}
                onChange={(e) => setSellingPrice(e.target.value)}
              />
            </Stack>
            <Stack direction={'row'}>
              <Typography variant="h5">Discount:</Typography>
              <Typography style={{ marginLeft: '10px' }} variant="h5" color={'peru'}>
                ₹20
              </Typography>
            </Stack>
            <Typography variant="h5" marginTop={'20px'} marginBottom={'20px'}>
              Selcted Lots:
            </Typography>
            <Stack overflow={'auto'} maxHeight={500} paddingRight={'50px'}>
              <Box>
                {selectedProducts.map((e) => {
                  if (productData.find((el) => e._id == el._id)) {
                    return <OnSearchItemBox data={e} result={true} selected={true} onDelete={handleSelectedProductDelete} />;
                  } else return <OnSearchItemBox data={e} result={true} selected={false} onDelete={handleSelectedProductDelete} />;
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
                      return <OnSearchItemBox result={false} selected={true} data={e} onSelect={handleSelectedProducts} />;
                    } else return <OnSearchItemBox result={false} selected={false} data={e} onSelect={handleSelectedProducts} />;
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
