import { RouterProvider } from 'react-router-dom';
import 'css/index.css';
// project import
import { router } from 'routes';
import ThemeCustomization from 'themes';

import ScrollTop from 'components/ScrollTop';
// "Hello"

// ==============================|| APP - THEME, ROUTER, LOCAL ||============================== //
//
export default function App() {
  return (
    <ThemeCustomization>
      <ScrollTop>
        <RouterProvider router={router} />
      </ScrollTop>
    </ThemeCustomization>
  );
}
