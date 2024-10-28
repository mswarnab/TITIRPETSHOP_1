import Lottie from 'lottie-react';
import animationData from 'assets/loader.json';
import { Typography } from '@mui/material';

const LottieAnimation = () => {
  return (
    <div
      style={{
        position: 'absolute',
        top: 0,
        zIndex: 999999999,
        left: 0,
        width: '100%',
        height: '100%',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        overflow: 'auto',
        backgroundColor: 'rgba(0,0,0,0.4);',
        flexDirection: 'column'
      }}
    >
      <Lottie
        animationData={animationData}
        loop={true}
        autoplay={true}
        style={{ width: 300, height: 300 }} // Set your desired size
      />
      <Typography variant="h2" color={`#AE6985`} margin={-2}>
        Loading...
      </Typography>
    </div>
  );
};

export default LottieAnimation;
