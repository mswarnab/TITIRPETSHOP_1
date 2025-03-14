import PropTypes from 'prop-types';

// material-ui
import Chip from '@mui/material/Chip';
import Grid from '@mui/material/Grid';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';

// project import
import MainCard from 'components/MainCard';

// assets
import RiseOutlined from '@ant-design/icons/RiseOutlined';
import FallOutlined from '@ant-design/icons/FallOutlined';

const iconSX = { fontSize: '0.75rem', color: 'inherit', marginLeft: 0, marginRight: 0 };

export default function AnalyticEcommerce({
  color = 'primary',
  title,
  count,
  percentage,
  isLoss,
  extra,
  extraLabel,
  expiredProducts,
  onHandleClick
}) {
  return (
    <MainCard contentSX={{ p: 2.25 }} style={expiredProducts ? { backgroundColor: '#ffe6e6', cursor: 'pointer' } : {}}>
      <div onClick={() => onHandleClick()}>
        <Stack spacing={0.5}>
          <Typography variant="h6" color="text.secondary">
            {expiredProducts ? <span style={{ fontWeight: 'bold' }}>{title}</span> : title}
          </Typography>
          <Grid container alignItems="center">
            <Grid item>
              <Typography variant="h4" color="inherit">
                {count}
              </Typography>
            </Grid>
            {percentage && (
              <Grid item>
                <Chip
                  variant="combined"
                  color={color}
                  icon={isLoss ? <FallOutlined style={iconSX} /> : <RiseOutlined style={iconSX} />}
                  label={`${percentage}%`}
                  sx={{ ml: 1.25, pl: 1 }}
                  size="small"
                />
              </Grid>
            )}
          </Grid>
        </Stack>
      </div>
      <Box sx={{ pt: 2.25 }}>
        <Typography variant="caption" color="text.secondary">
          {extraLabel + ' '}
          <Typography variant="caption" sx={{ color: `${color || 'primary'}.main` }}>
            {extra}
          </Typography>{' '}
        </Typography>
      </Box>
    </MainCard>
  );
}

AnalyticEcommerce.propTypes = {
  color: PropTypes.string,
  title: PropTypes.string,
  count: PropTypes.string,
  percentage: PropTypes.number,
  isLoss: PropTypes.bool,
  extra: PropTypes.string
};
