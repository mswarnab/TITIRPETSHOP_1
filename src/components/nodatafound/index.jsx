import Lottie from 'lottie-react';
import animationData from 'assets/notFound.json';
import { Typography } from '@mui/material';

const NoDataFoundAnimation = () => {
  return (
    <div
      style={{
        // position: 'absolute',
        // top: 0,
        paddingTop: 50,
        width: '100%',
        height: '66.78vh',
        backgroundColor: '#fafafb',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'flex-start',
        overflow: 'hidden' /* Enable scroll if needed */
        // backgroundColor: "rgb(0,0,0)"; /* Fallback color */
        // backgroundColor: 'rgba(0,0,0,0.4)',
        // flexDirection: 'column'
      }}
    >
      <Lottie
        animationData={animationData}
        loop={true}
        autoplay={true}
        style={{ width: 300, height: 300 }} // Set your desired size
      />
    </div>
  );
};

export default NoDataFoundAnimation;
