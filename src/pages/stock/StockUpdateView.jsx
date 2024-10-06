
import React from 'react';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import { Slide } from '@mui/material';

const Transition = React.forwardRef(function Transition(props, ref) {
    return <Slide direction="up" ref={ref} {...props} />;
  });

export default function StockUpdateView({open,handleClose}) {

  return (
    <>
      <Dialog
        open={open}
        onClose={()=>handleClose()}
        TransitionComponent={Transition}
        PaperProps={{
          component: 'form',
          onSubmit: (event) => {
            event.preventDefault();
            const formData = new FormData(event.currentTarget);
            const formJson = Object.fromEntries(formData.entries());
            const email = formJson.email;
            console.log(email);
            handleClose();
          },
        }}
      >
        <DialogTitle variant='h4' style={{padding:'40px 40px',paddingBottom:'30px'}}>Update Stock</DialogTitle>
        <DialogContent style={{padding:'0 40px',paddingBottom:'20px'}}>
          <DialogContentText>
            Update Existing Stocks
          </DialogContentText>
          <TextField
            autoFocus
            required
            margin="normal"
            id="name"
            name="email"
            label="Product Name"
            type="email"
            fullWidth
            variant="standard"
          />

        <TextField
            autoFocus
            required
            margin="normal"
            id="name"
            name="email"
            label="Product Quantity"
            type="number"
            fullWidth
            variant="standard"
          />
        <span style={{position:"relative",top:10,fontSize:12,color:'rgb(22, 119, 255)'}}>Purchase Date</span>
        <TextField
            autoFocus
            required
            margin="normal"
            id="name"
            name="email"
            label=""
            value={""}
            type="date"
            fullWidth
            variant="standard"
          />
        <span style={{position:"relative",top:10,fontSize:12,color:'rgb(22, 119, 255)'}}>Expiry Date</span>
        <TextField
            autoFocus
            required
            margin="normal"
            id="name"
            name="email"
            label=""
            slot="inputLabel"
            placeholder=''
            type="date"
            fullWidth
            variant="standard"
          />

        <TextField
            autoFocus
            required
            margin="normal"
            id="name"
            name="email"
            label="Supplier Name"
            type="email"
            fullWidth
            variant="standard"
          />

        <TextField
            autoFocus
            required
            margin="normal"
            id="name"
            name="email"
            label="Batch Number"
            type="text"
            fullWidth
            variant="standard"
          />
        </DialogContent>
        <DialogActions style={{paddingBottom:'40px',paddingRight:'40px'}}        >
          <Button variant='contained' color='secondary' onClick={()=>handleClose()}>Cancel</Button>
          <Button variant='contained' color='success' type="submit" success>Update</Button>
          <Button variant='contained' color='error' type="submit">Delete</Button>
        </DialogActions>
      </Dialog>
    </>
  );
}