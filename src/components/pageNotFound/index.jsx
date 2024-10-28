import Lottie from 'lottie-react';
import animationData from 'assets/pageNotFound.json';
import { Typography } from '@mui/material';

const PageNotFoundAnimation = () => {
  return (
    <div
      style={{
        top: 0,
        zIndex: 999999999,
        left: 0,
        width: '100%',
        height: '70vh',
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
        style={{ width: 500, height: 500 }} // Set your desired size
      />
    </div>
  );
};

export default PageNotFoundAnimation;
