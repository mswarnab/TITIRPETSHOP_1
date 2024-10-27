import { RouterProvider, useNavigate } from 'react-router-dom';

// project import
import { loginRouter, router } from 'routes';
import ThemeCustomization from 'themes';

import ScrollTop from 'components/ScrollTop';
import { useEffect, useState } from 'react';
import { client } from 'api/client';
import LottieAnimation from 'components/Animation';

// ==============================|| APP - THEME, ROUTER, LOCAL ||============================== //

export default function App() {
  return (
    <ThemeCustomization>
      <ScrollTop>
        <RouterProvider router={router} />
      </ScrollTop>
    </ThemeCustomization>
  );
}
