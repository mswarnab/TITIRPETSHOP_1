// project import
import dashboard from './dashboard';
import { utilities } from './utilities';
import support from './support';
import expense from './expense';
import { ImportOutlined } from '@ant-design/icons';

// ==============================|| MENU ITEMS ||============================== //

const menuItems = {
  items: [dashboard, utilities, expense]
};

export default menuItems;
