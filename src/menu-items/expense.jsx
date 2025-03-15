// assets
import { DashboardFilled, HighlightOutlined } from '@ant-design/icons';

// icons
const icons = {
  DashboardFilled
};

// ==============================|| MENU ITEMS - DASHBOARD ||============================== //

const expense = {
  id: 'group-expense',
  title: 'Utilities',
  type: 'group',
  children: [
    {
      id: 'expense',
      title: 'Expense',
      type: 'item',
      url: '/expense',
      icon: (padding) => <HighlightOutlined style={padding} />,
      breadcrumbs: false
    }
  ]
};

export default expense;
