import { lazy } from 'react';

// project import
import Loadable from 'components/Loadable';
import Dashboard from 'layout/Dashboard';
import ManageStock from '../pages/stock';
import PurchaseOrder from 'pages/purchaseOrder/AddPurchase';
import AddSale from 'pages/sales/addSale';
import AddCustomer from 'pages/customer/addCustomer';
import AddSupplier from 'pages/supplier/AddSupplier';
import ManageCustomer from 'pages/customer/CustomerUpdateView';
import ManageSupplier from 'pages/supplier/SupplierUpdateView';
import AddPurchase from 'pages/purchaseOrder/AddPurchaseFinal';
import Login from 'pages/login/Login';
import { element } from 'prop-types';
import PageNotFoundAnimation from '../../src/components/pageNotFound';
import ExpiryDateProducts from 'pages/extra-pages/ExpiryDateProducts';
import ManagePurchaseOrder from 'pages/purchaseOrder/PurchaseOrderUpdateView';
import ManageSaleView from 'pages/sales/SaleUpdateView';
import CustomerBillGenarate from 'pages/customer/CustomerBillGenarate';
import MonthlyReport from 'pages/monthlyReport/Index';
import ExpenseDefault from 'pages/Expense/Index';
import SaleInvoice from 'pages/sales/SaleInvoice';
const Color = Loadable(lazy(() => import('pages/component-overview/color')));
const Typography = Loadable(lazy(() => import('pages/component-overview/typography')));
const Shadow = Loadable(lazy(() => import('pages/component-overview/shadows')));
const DashboardDefault = Loadable(lazy(() => import('pages/dashboard/index')));

// render - sample page
const SamplePage = Loadable(lazy(() => import('pages/extra-pages/ExpiryDateProducts')));

// ==============================|| MAIN ROUTING ||============================== //

const MainRoutes = {
  path: '/',
  element: <Dashboard />,

  children: [
    {
      path: '/stock/manage',
      element: <ManageStock />
    },
    {
      path: '/stock/expired',
      element: <ExpiryDateProducts />
    },
    {
      path: '/purchaseorder/add',
      element: <PurchaseOrder />
    },
    {
      path: '/purchaseorder/manage',
      element: <ManagePurchaseOrder />
    },
    {
      path: '/sale/edit/:id',
      element: <AddSale />
    },
    {
      path: '/sale/add/',
      element: <AddSale />
    },
    {
      path: '/sale/manage',
      element: <ManageSaleView />
    },
    {
      path: '/customer/add',
      element: <AddCustomer />
    },
    {
      path: '/supplier/add',
      element: <AddSupplier />
    },
    {
      path: '/customer/manage',
      element: <ManageCustomer />
    },
    {
      path: '/supplier/manage',
      element: <ManageSupplier />
    },
    {
      path: '/login',
      element: <Login />
    },
    {
      path: '/',
      element: <DashboardDefault />
    },
    {
      path: '/dashboard',
      element: <DashboardDefault />
    },
    {
      path: '/customerbill/:id',
      element: <CustomerBillGenarate />
    },
    {
      path: '/saleinvoice/:id',
      element: <SaleInvoice />
    },

    {
      path: '/monthly/report',
      element: <MonthlyReport />
    },
    {
      path: '/expense',
      element: <ExpenseDefault />
    },
    {
      path: '/*',
      element: <PageNotFoundAnimation />
    }
    // {
    // //   path: 'dashboard',
    // //   children: [
    // //     {
    // //       path: 'default',
    // //       element: <DashboardDefault />
    // //     }
    // //   ]
    // // }
  ]
};

export default MainRoutes;
