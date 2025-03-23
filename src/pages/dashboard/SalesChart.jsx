import { useEffect, useState } from 'react';

// material-ui
import { useTheme } from '@mui/material/styles';
import useMediaQuery from '@mui/material/useMediaQuery';
import Checkbox from '@mui/material/Checkbox';
import FormControl from '@mui/material/FormControl';
import FormGroup from '@mui/material/FormGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';

// project import
import MainCard from 'components/MainCard';

// third-party
import ReactApexChart from 'react-apexcharts';
import { client } from 'api/client';
import dayjs from 'dayjs';

// chart options

// ==============================|| SALES COLUMN CHART ||============================== //

export default function SalesChart({ duration }) {
  const theme = useTheme();

  const [columnChartOptions, setColumnChartOptions] = useState({
    chart: {
      type: 'bar',
      height: 430,
      toolbar: {
        show: false
      }
    },
    plotOptions: {
      bar: {
        columnWidth: '30%',
        borderRadius: 4
      }
    },
    dataLabels: {
      enabled: false
    },
    stroke: {
      show: true,
      width: 8,
      colors: ['transparent']
    },
    xaxis: {
      categories: []
    },
    yaxis: {
      title: {
        text: '₹ (Rupees)'
      }
    },
    fill: {
      opacity: 1
    },
    tooltip: {
      y: {
        formatter(val) {
          return `₹ ${val} rupees`;
        }
      }
    },
    legend: {
      show: false
    },
    responsive: [
      {
        breakpoint: 600,
        options: {
          yaxis: {
            show: false
          }
        }
      }
    ]
  });

  const [costSeries, setCostSeries] = useState([]);
  const [profitSeries, setProfitSeries] = useState([]);
  const [dateSeries, setDateSeries] = useState([]);

  const [legend, setLegend] = useState({
    income: true,
    cos: true
  });

  const [initialSeries, setInitialSeries] = useState([
    {
      name: 'Income',
      data: [...profitSeries]
    },
    {
      name: 'Cost Of Sales',
      data: [...costSeries]
    }
  ]);

  const { income, cos } = legend;

  const { primary, secondary } = theme.palette.text;
  const line = theme.palette.divider;

  const warning = theme.palette.warning.main;
  const primaryMain = theme.palette.primary.main;
  const successDark = theme.palette.success.dark;

  const [series, setSeries] = useState(initialSeries);
  const [totalProfit, setTotalProfit] = useState(0);

  const handleLegendChange = (event) => {
    setLegend({ ...legend, [event.target.name]: event.target.checked });
  };

  const xsDown = useMediaQuery(theme.breakpoints.down('sm'));
  const [options, setOptions] = useState(columnChartOptions);

  useEffect(() => {
    setOptions({
      chart: {
        type: 'bar',
        height: 430,
        toolbar: {
          show: false
        }
      },
      plotOptions: {
        bar: {
          columnWidth: '30%',
          borderRadius: 4
        }
      },
      dataLabels: {
        enabled: false
      },
      stroke: {
        show: true,
        width: 8,
        colors: ['transparent']
      },
      xaxis: {
        categories: [...dateSeries]
      },
      yaxis: {
        title: {
          text: '₹ (Rupees)'
        }
      },
      fill: {
        opacity: 1
      },
      tooltip: {
        y: {
          formatter(val) {
            return `₹ ${parseFloat(val).toFixed(2)} Rupees`;
          }
        }
      },
      legend: {
        show: false
      },
      responsive: [
        {
          breakpoint: 600,
          options: {
            yaxis: {
              show: false
            }
          }
        }
      ]
    });
  }, [dateSeries]);

  useEffect(() => {
    if (income && cos) {
      setSeries([
        {
          name: 'Total Profit',
          data: [...profitSeries]
        },
        {
          name: 'Total sales',
          data: [...costSeries]
        }
      ]);
    } else if (income) {
      setSeries([
        {
          name: 'Total Profit',
          data: [...profitSeries]
        }
      ]);
    } else if (cos) {
      setSeries([
        {
          name: 'Total Sales',
          data: [...costSeries]
        }
      ]);
    } else {
      setSeries([]);
    }
  }, [income, cos, profitSeries, costSeries, dateSeries]);

  useEffect(() => {
    setOptions((prevState) => ({
      ...prevState,
      colors: !(income && cos) && cos ? [primaryMain] : [warning, primaryMain],
      xaxis: {
        labels: {
          style: {
            colors: [secondary, secondary, secondary, secondary, secondary, secondary]
          }
        }
      },
      yaxis: {
        labels: {
          style: {
            colors: [secondary]
          }
        }
      },
      grid: {
        borderColor: line
      },
      plotOptions: {
        bar: {
          columnWidth: xsDown ? '60%' : '30%'
        }
      }
    }));
  }, [primary, secondary, line, warning, primaryMain, successDark, income, cos, xsDown]);
  useEffect(() => {
    (async () => {
      // console.clear();
      // console.log('duration', duration);
      client.get('/sales/profit?duration=' + duration).then((res) => {
        let date = '';
        let tempProfitArray = [];
        let tempCostArray = [];
        let tempDateArray = [];
        let totalProfit = 0;
        res.data.result.result.map((e) => {
          switch (duration.toUpperCase()) {
            case 'YEARLY':
              date = dayjs(e.date).format('YYYY');
              break;
            case 'QUARTERLY':
              date = dayjs(e.date).format('MMMM');
              break;
            case 'MONTHLY':
              date = dayjs(e.date).format('MMMM');
              break;
            case 'WEEKLY':
              date = dayjs(e.date).format('MMM-DD');
              break;
            case 'DAILY':
              date = dayjs(e.date).format('dddd');
              break;
            default:
              break;
          }
          totalProfit += e.result[0]?.totalProfitSum || 0;
          tempProfitArray = [...tempProfitArray, e.result[0]?.totalProfitSum || 0];
          tempCostArray = [...tempCostArray, e.result[0]?.totalSoldSum ? parseFloat(e.result[0]?.totalSoldSum) : 0];
          tempDateArray = [...tempDateArray, date];
        });
        setCostSeries(tempCostArray);
        setProfitSeries(tempProfitArray);
        setDateSeries(tempDateArray);
        setTotalProfit(totalProfit);
      });
    })();
  }, [duration]);

  return (
    <MainCard sx={{ mt: 1 }} content={false}>
      <Box sx={{ p: 2.5, pb: 0 }}>
        <Stack direction="row" alignItems="center" justifyContent="space-between">
          <Stack spacing={1.5}>
            <Typography variant="h6" color="secondary">
              Net Profit
            </Typography>
            <Typography variant="h4">₹{totalProfit}</Typography>
          </Stack>
          <FormControl component="fieldset">
            <FormGroup row>
              <FormControlLabel
                control={<Checkbox color="warning" checked={income} onChange={handleLegendChange} name="income" />}
                label="Total Profit"
              />
              <FormControlLabel control={<Checkbox checked={cos} onChange={handleLegendChange} name="cos" />} label="Total Sales" />
            </FormGroup>
          </FormControl>
        </Stack>
        <Box id="chart" sx={{ bgcolor: 'transparent' }}>
          <ReactApexChart options={options} series={series} type="bar" height={360} />
        </Box>
      </Box>
    </MainCard>
  );
}
