import { Box, Grid, List, Skeleton, Stack, Typography } from '@mui/material';
import AnalyticEcommerce from 'components/cards/statistics/AnalyticEcommerce';
import MainCard from 'components/MainCard';
import React from 'react';
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

export default function DashboardSkeleton() {
  return (
    <Grid container rowSpacing={4.5} columnSpacing={1}>
      {/* row 1 */}
      <Grid item xs={12} sx={{ mb: -2.25 }}>
        <Typography variant="h5">Dashboard</Typography>
      </Grid>
      <Grid item xs={12} sm={6} md={4} lg={2.4}>
        <div>
          <Skeleton variant="rounded" height={135} />
        </div>
      </Grid>
      <Grid item xs={12} sm={6} md={4} lg={2.4}>
        <div>
          <Skeleton variant="rounded" height={135} />
        </div>
      </Grid>
      <Grid item xs={12} sm={6} md={4} lg={2.4}>
        <div>
          <Skeleton variant="rounded" height={135} />
        </div>
      </Grid>
      <Grid item xs={12} sm={6} md={4} lg={2.4}>
        <div>
          <Skeleton variant="rounded" height={135} />
        </div>
      </Grid>
      <Grid item xs={12} sm={6} md={4} lg={2.4}>
        <div>
          <Skeleton variant="rounded" height={135} />
        </div>
      </Grid>

      <Grid item md={8} sx={{ display: { sm: 'none', md: 'block', lg: 'none' } }} />

      <Grid item xs={12} md={5} lg={4}>
        <Grid container alignItems="center" justifyContent="space-between">
          {/* <Grid item>
          <Typography variant="h5">
            <Skeleton />
          </Typography>
          </Grid>
          <Grid item /> */}
          <div sx={{ width: 285 }}>
            <Skeleton variant="rounded" width={285} />
          </div>
        </Grid>
        <MainCard sx={{ mt: 2 }} content={false}>
          <Box>
            <Skeleton variant="rounded" height={480} />
          </Box>
        </MainCard>
      </Grid>

      {/* row 3 */}
      <Grid item xs={12} md={7} lg={8}>
        <Grid container alignItems="center" justifyContent="space-between">
          {/* <Grid item>
            <Typography variant="h5">
              <Skeleton />
            </Typography>
          </Grid>
          <Grid item /> */}
          <div>
            <Skeleton variant="rounded" width={400} />
          </div>
        </Grid>
        <MainCard sx={{ mt: 2 }} content={false}>
          {/* <OrdersTable /> */}
          <Box>
            <Skeleton variant="rounded" height={480} />
          </Box>
        </MainCard>
      </Grid>

      {/* row 4 */}
      <Grid item xs={12} md={7} lg={8}>
        {/* <SaleReportCard /> */}
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 9 }}>
          <div>
            <Skeleton variant="rounded" width={200} height={32} />
          </div>
          <div>
            <Skeleton variant="rounded" width={80} height={32} />
          </div>
        </div>
        <Box>
          <Skeleton variant="rounded" height={480} />
        </Box>
      </Grid>
      <Grid item xs={12} md={5} lg={4}>
        <Grid container alignItems="center" justifyContent="space-between">
          <div>
            <Skeleton variant="rounded" width={200} height={32} />
          </div>
        </Grid>
        <MainCard sx={{ mt: 1.5 }} content={false}>
          <Box>
            <Skeleton variant="rounded" height={65} />
          </Box>
        </MainCard>
        <MainCard sx={{ mt: 2 }} content={false}>
          <Box>
            <Skeleton variant="rounded" height={65} />
          </Box>
        </MainCard>
        <MainCard sx={{ mt: 2 }} content={false}>
          <Box>
            <Skeleton variant="rounded" height={65} />
          </Box>
        </MainCard>
        <MainCard sx={{ mt: 2 }} content={false}>
          <Box>
            <Skeleton variant="rounded" height={65} />
          </Box>
        </MainCard>
        <MainCard sx={{ mt: 2 }} content={false}>
          <Box>
            <Skeleton variant="rounded" height={65} />
          </Box>
        </MainCard>
        <MainCard sx={{ mt: 2 }} content={false}>
          <Box>
            <Skeleton variant="rounded" height={65} />
          </Box>
        </MainCard>
      </Grid>
    </Grid>
  );
}
