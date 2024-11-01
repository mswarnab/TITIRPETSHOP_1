// material-ui
import React, { useState } from 'react';

import Button from '@mui/material/Button';
import Grid from '@mui/material/Grid';

import Typography from '@mui/material/Typography';

// project import
import MainCard from 'components/MainCard';

import { TextField } from '@mui/material';
import FullScreenDialog from 'components/FullScreenModal';

// avatar style
const avatarSX = {
  width: 36,
  height: 36,
  fontSize: '1rem'
};

// action style
const actionSX = {
  mt: 0.75,
  ml: 1,
  top: 'auto',
  right: 'auto',
  alignSelf: 'flex-start',
  transform: 'none'
};

const data = {
  sales: {
    totalSale: 250000,
    percentage: 29,
    extraSale: 2000
  },
  stock: {
    expiredProducts: 299,
    expiryDate: 2024 - 10
  },
  customer: {
    totalCustomer: 280,
    totalCreditInMarket: 29000
  },
  purchaseOrder: {
    totalOrders: 188
  },
  supplier: {
    totalDue: 19999,
    totalSuppliers: 6
  }
};

// ==============================|| DASHBOARD - DEFAULT ||============================== //

export default function AddSale() {
  const [open, setOpen] = useState(false);
  const handleClose = () => {
    setOpen(false);
  };

  return (
    <>
      <Grid container rowSpacing={4.5} columnSpacing={2.75}>
        <Grid item md={8} sx={{ display: { sm: 'none', md: 'block', lg: 'none' } }} />
        <Grid item xs={12} md={12} lg={12}>
          <Grid item />
          <MainCard sx={{ ml: '15%', mr: '15%', p: '5% 10%' }} content={false}>
            <Typography variant="h4" style={{ marginBottom: 10 }}>
              Create New Selling Bill
            </Typography>
            <div>
              <TextField
                autoFocus
                required
                margin="normal"
                id="name"
                name="email"
                label="Bill Number"
                type="text"
                fullWidth
                variant="standard"
              />
              <TextField
                autoFocus
                required
                margin="normal"
                id="name"
                name="email"
                label="Customer Mobile No."
                type="number"
                fullWidth
                variant="standard"
              />
              <span style={{ position: 'relative', top: 17, fontSize: 12, color: 'rgb(22, 119, 255)' }}>Date of Sale</span>
              <TextField autoFocus required margin="normal" id="name" name="email" label="" type="date" fullWidth variant="standard" />
              <TextField
                autoFocus
                required
                margin="normal"
                id="name"
                name="email"
                label="Total Amount"
                type="number"
                fullWidth
                variant="standard"
              />
              <TextField
                autoFocus
                required
                margin="normal"
                id="name"
                name="email"
                label="Amount Paid"
                type="number"
                fullWidth
                variant="standard"
              />
              <TextField
                autoFocus
                required
                margin="normal"
                id="name"
                name="email"
                label="Amound Due"
                type="number"
                fullWidth
                variant="standard"
              />
              <span style={{ position: 'relative', top: 17, fontSize: 12, color: 'rgb(22, 119, 255)' }}>Due Date</span>
              <TextField
                autoFocus
                required
                margin="normal"
                id="name"
                name="email"
                label=""
                type="date"
                defaultValue={''}
                fullWidth
                variant="standard"
              />
            </div>
            <Button variant="contained" color="secondary" style={{ width: '100%', marginTop: '30px' }} onClick={() => setOpen(true)}>
              Add Items
            </Button>
          </MainCard>
        </Grid>
      </Grid>
      <FullScreenDialog open={open} handleClose={handleClose} />
    </>
  );
}
