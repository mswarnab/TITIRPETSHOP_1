import { Grid, List } from '@mui/material';
import React from 'react';

export default function Summarysection() {
  return (
    <Grid item xs={12} md={6} lg={6} style={{ paddingTop: 10, margin: 0 }}>
      <List sx={{ width: '100%', bgcolor: 'background.paper' }} aria-label="contacts"></List>
    </Grid>
  );
}
