// assets
import {
  AppstoreAddOutlined,
  AntDesignOutlined,
  BarcodeOutlined,
  BgColorsOutlined,
  FontSizeOutlined,
  LoadingOutlined,
  ProductFilled,
  CarryOutFilled,
  ReconciliationFilled,
  SkinFilled,
  TruckFilled
} from '@ant-design/icons';

// icons
const icons = {
  FontSizeOutlined,
  BgColorsOutlined,
  BarcodeOutlined,
  AntDesignOutlined,
  LoadingOutlined,
  AppstoreAddOutlined,
  ProductFilled,
  CarryOutFilled,
  ReconciliationFilled,
  SkinFilled,
  TruckFilled
};

// ==============================|| MENU ITEMS - UTILITIES ||============================== //

// export const stock = {
//   id: 'utilities',
//   title: 'Stock',
//   type: 'group',
//   children: [
//     {
//       id: 'util-typography',
//       title: 'Add Stock',
//       type: 'item',
//       url: '/typography',
//       icon: icons.FontSizeOutlined
//     },
//     {
//       id: 'util-shadow',
//       title: 'Manage Stock',
//       type: 'item',
//       url: '/shadow',
//       icon: icons.BarcodeOutlined
//     }
//   ]
// };

// export const sale = {
//   id: 'utilities',
//   title: 'Sale',
//   type: 'group',
//   children: [
//     {
//       id: 'util-typography',
//       title: 'Create Sale',
//       type: 'item',
//       url: '/typography',
//       icon: icons.FontSizeOutlined
//     },
//     {
//       id: 'util-shadow',
//       title: 'Manage Sale',
//       type: 'item',
//       url: '/shadow',
//       icon: icons.BarcodeOutlined
//     }
//   ]
// };

// export const purchase = {
//   id: 'utilities',
//   title: 'Purchase',
//   type: 'group',
//   children: [
//     {
//       id: 'util-typography',
//       title: 'Create Purchase',
//       type: 'item',
//       url: '/typography',
//       icon: icons.FontSizeOutlined
//     },
//     {
//       id: 'util-shadow',
//       title: 'Manage Purchase',
//       type: 'item',
//       url: '/purchase',
//       icon: icons.BarcodeOutlined
//     },
//   ]
// };

export const utilities = {
  id: 'utilities',
  title: 'Utilities',
  type: 'group',
  children: [
    {
      id: 'util-stock',
      title: 'Stock',
      type: 'collapse',
      url: '/stock',
      icon: (padding) => <ProductFilled style={padding} />,
      children: [
        // {
        //   id: 'util-stock-child1',
        //   title: 'Add Stock',
        //   type: 'item',
        //   url: '/stock/add',
        //   icon: (padding)=>(<ProductFilled style={padding} />),
        // },
        {
          id: 'util-stock-child2',
          title: 'Manage Stock',
          type: 'item',
          url: '/stock/manage',
          icon: (padding) => <ProductFilled style={padding} />
        }
      ]
    },
    {
      id: 'util-sale',
      title: 'Sale',
      type: 'collapse',
      url: '/sale',
      icon: (padding) => <ProductFilled style={padding} />,
      children: [
        {
          id: 'util-sale-child1',
          title: 'Create Sale Bill',
          type: 'item',
          url: '/sale/add',
          icon: (padding) => <ProductFilled style={padding} />
        },
        {
          id: 'util-sale-child2',
          title: 'Manage Sale Bill',
          type: 'item',
          url: '/sale/manage',
          icon: (padding) => <ProductFilled style={padding} />
        }
      ]
    },
    {
      id: 'util-purchase',
      title: 'Purchase Order',
      type: 'collapse',
      url: '/purchase',
      icon: (padding) => <ProductFilled style={padding} />,
      children: [
        {
          id: 'util-purchase-child1',
          title: 'Create Purchase Order',
          type: 'item',
          url: '/purchaseorder/add',
          icon: (padding) => <ProductFilled style={padding} />
        },
        {
          id: 'util-purchase-child2',
          title: 'Manage Purchase Order',
          type: 'item',
          url: '/purchaseorder/manage',
          icon: (padding) => <ProductFilled style={padding} />
        }
      ]
    },
    {
      id: 'util-customer',
      title: 'Customer',
      type: 'collapse',
      url: '/customer',
      icon: (padding) => <ProductFilled style={padding} />,
      children: [
        {
          id: 'util-customer-child1',
          title: 'Add Customer',
          type: 'item',
          url: '/customer/add',
          icon: (padding) => <ProductFilled style={padding} />
        },
        {
          id: 'util-customer-child2',
          title: 'Manage Customer',
          type: 'item',
          url: '/customer/manage',
          icon: (padding) => <ProductFilled style={padding} />
        }
      ]
    },
    {
      id: 'util-supplier',
      title: 'Supplier',
      type: 'collapse',
      url: '/supplier',
      icon: (padding) => <ProductFilled style={padding} />,
      children: [
        {
          id: 'util-supplier-child1',
          title: 'Add Supplier',
          type: 'item',
          url: '/supplier/add',
          icon: (padding) => <ProductFilled style={padding} />
        },
        {
          id: 'util-supplier-child2',
          title: 'Manage Supplier',
          type: 'item',
          url: '/supplier/manage',
          icon: (padding) => <ProductFilled style={padding} />
        }
      ]
    }
  ]
};

// export default utilities;
