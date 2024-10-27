import Lottie from 'lottie-react';
import animationData from 'assets/third-party/loader.json';

const LottieAnimation = () => {
  return (
    <div>
      <Lottie
        animationData={animationData}
        loop={true}
        autoplay={true}
        style={{ width: 400, height: 400 }} // Set your desired size
      />
    </div>
  );
};

export default LottieAnimation;
