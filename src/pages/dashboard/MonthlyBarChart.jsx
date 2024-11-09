import { useEffect, useState } from 'react';

// material-ui
import { useTheme } from '@mui/material/styles';
import Box from '@mui/material/Box';

// third-party
import ReactApexChart from 'react-apexcharts';
import { client } from 'api/client';
import dayjs from 'dayjs';

// chart options
const barChartOptions = {
  chart: {
    type: 'bar',
    height: 365,
    toolbar: {
      show: false
    }
  },
  plotOptions: {
    bar: {
      columnWidth: '45%',
      borderRadius: 6
    }
  },
  dataLabels: {
    enabled: false
  },
  xaxis: {
    categories: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
    axisBorder: {
      show: true
    },
    axisTicks: {
      show: true
    }
  },
  yaxis: {
    show: true
  },
  grid: {
    show: true
  }
};

// ==============================|| MONTHLY BAR CHART ||============================== //

export default function MonthlyBarChart({ onTotalSaleChange }) {
  const theme = useTheme();

  const { primary, secondary } = theme.palette.text;
  const [salesData, setSalesData] = useState('');
  const [totalSale, setTotalSale] = useState('');
  const info = theme.palette.info.light;

  const [series, setSeries] = useState([
    {
      data: [0, 0, 0, 0, 0, 0, 0]
    }
  ]);

  const [options, setOptions] = useState(barChartOptions);

  useEffect(() => {
    setOptions((prevState) => ({
      ...prevState,
      colors: [info],
      xaxis: {
        labels: {
          style: {
            colors: [secondary, secondary, secondary, secondary, secondary, secondary, secondary]
          }
        }
      }
    }));
  }, [primary, info, secondary]);
  useEffect(() => {
    (async () => {
      client.get('/sales/weeklysale').then((res) => {
        const salesArray = res.data.result.result.sort((a, b) => {
          if (a.date < b.date) return -1;
          if (a.date > b.date) return 1;
        });
        let dateArray = [];
        let resultArray = [];
        let sumSales = 0;
        salesArray.map((e) => {
          dateArray = [...dateArray, dayjs(e.date).format('ddd')];
          resultArray = [...resultArray, e.result];
          sumSales += parseFloat(e.result);
        });
        // console.log(dateArray);
        barChartOptions.xaxis.categories = dateArray;
        setOptions(barChartOptions);
        onTotalSaleChange(sumSales);
        setSeries([{ data: resultArray }]);
        setSalesData({ dateArray, resultArray });
      });
    })();
    return () => {
      return null;
    };
  }, []);

  return (
    <Box id="chart" sx={{ bgcolor: 'transparent' }}>
      <ReactApexChart options={options} series={series} type="bar" height={365} />
    </Box>
  );
}
