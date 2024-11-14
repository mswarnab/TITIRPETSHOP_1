// material-ui
import React from 'react';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';

// project import
import MainCard from 'components/MainCard';
import AddPurchase from './AddPurchaseFinal';

// ==============================|| DASHBOARD - DEFAULT ||============================== //

export default function PurchaseOrder() {
  return (
    <Grid container rowSpacing={4.5} columnSpacing={2.75} justifyContent={'center'} alignItems={'center'} direction={'row'}>
      <Grid item md={8} xs={12} sx={{ display: { sm: 'none', md: 'block', lg: 'none' } }} />
      <Grid item xs={12} md={12} lg={12}>
        <Grid item />
        <MainCard sx={{ p: '5% 5%' }} content={false}>
          <Typography variant="h4" style={{ marginBottom: 10 }}>
            Create New Purchase Order
          </Typography>
          <AddPurchase />
        </MainCard>
      </Grid>
    </Grid>
  );
}
