import {
  ResponsiveContainer,
  AreaChart,
  XAxis,
  YAxis,
  Area,
  Tooltip,
  CartesianGrid,
} from "recharts";
import { format, parseISO, subDays, subMonths } from "date-fns";
import { useEffect, useState } from "react";
import { getAuthToken } from "../../../util/auth";
import { APIRoutes, BASEURL } from "../../../configs/globalConfig";
import axios from "axios";
import classes from "./CatalogueChart.module.css";
import { Button, ButtonGroup, Card, CardBody } from "reactstrap";
import { useSelector } from "react-redux";

export default function CatalogueChart() {
  const [data, setData] = useState([]);
  const [placeHolderData, setPlaceHolderData] = useState([]);
  const [isLoaded, setIsLoaded] = useState(false);
  const [range, setRange] = useState("1M");
  const theme = useSelector((state) => state.Layout.theme);
  const isDarkMode = theme === "dark";

  const fetchData = async (selectedRange) => {
    try {
      const endpoint = `${BASEURL}${APIRoutes.getCatalogueChart}?&range=${selectedRange}`;
      const response = await axios.get(endpoint);

      const formattedData = response.data.report.map((val) => ({
        date: format(parseISO(val.date), "yyyy-MM-dd"),
        value: val.count,
      }));

      if (response.status === 200) {
        setIsLoaded(true);
        setData(formattedData);
      }
    } catch (error) {
      console.log(error);
      setIsLoaded(true);
    }
  };

  // Fetch data when component mounts or range changes
  useEffect(() => {
    const data = generateDateRangeData(range);
    setPlaceHolderData(data);
    fetchData(range); // Call fetchData with the selected range
  }, [range]);

  const generateDateRangeData = (range) => {
    let data = [];
    let currentDate = new Date();

    if (range === "7D") {
      // Last 7 days
      for (let i = 0; i < 7; i++) {
        let date = format(subDays(currentDate, i), "yyyy-MM-dd");
        data.push({ date, value: 0 });
      }
    } else if (range === "1M") {
      // Last 30 days
      for (let i = 0; i < 30; i++) {
        let date = format(subDays(currentDate, i), "yyyy-MM-dd");
        data.push({ date, value: 0 });
      }
    } else if (range === "3M") {
      // Last 3 months
      for (let i = 0; i < 3; i++) {
        let date = format(subMonths(currentDate, i), "yyyy-MM-dd");
        data.push({ date, value: 0 });
      }
    } else if (range === "6M") {
      // Last 6 months
      for (let i = 0; i < 6; i++) {
        let date = format(subMonths(currentDate, i), "yyyy-MM-dd");
        data.push({ date, value: 0 });
      }
    } else if (range === "1Y") {
      // Last 12 months
      for (let i = 0; i < 12; i++) {
        let date = format(subMonths(currentDate, i), "yyyy-MM-dd");
        data.push({ date, value: 0 });
      }
    }

    // Reverse the data to get it in reverse order
    return data.reverse();
  };

  const handleRangeChange = (selectedRange) => {
    setRange(selectedRange);
    const data = generateDateRangeData(selectedRange);
    setPlaceHolderData(data);
  };

  const formatXAxis = (str) => {
    const date = parseISO(str);
    if (range === "3M" || range === "6M" || range === "1Y") {
      return format(date, "MMM yy");
    }
    return format(date, "MMM, d");
  };
  const hasData = data && data.length > 0;

  return (
    <Card>
      <CardBody>
        <div className="float-end d-none d-md-inline-block">
          <ButtonGroup className="mb-2">
            <Button
              size="sm"
              active={range === "7D"}
              color="light"
              onClick={() => handleRangeChange("7D")}
            >
              7D
            </Button>
            <Button
              size="sm"
              active={range === "1M"}
              color="light"
              onClick={() => handleRangeChange("1M")}
            >
              1M
            </Button>
            <Button
              size="sm"
              active={range === "3M"}
              color="light"
              onClick={() => handleRangeChange("3M")}
            >
              3M
            </Button>
            <Button
              size="sm"
              active={range === "6M"}
              color="light"
              onClick={() => handleRangeChange("6M")}
            >
              6M
            </Button>
            <Button
              size="sm"
              active={range === "1Y"}
              color="light"
              onClick={() => handleRangeChange("1Y")}
            >
              1Y
            </Button>
          </ButtonGroup>
        </div>
        <h4 className="card-title mb-2">Daily Catalogue Sent Report</h4>
        <div className="position-relative">
          {isLoaded && (
            <ResponsiveContainer width="100%" height={400}>
              <AreaChart
                data={hasData ? data : placeHolderData}
                margin={{ top: 30, right: 0, left: 0, bottom: 0 }}
              >
                <defs>
                  <linearGradient id="color" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#2451B7" stopOpacity={0.4} />
                    <stop offset="75%" stopColor="#2451B7" stopOpacity={0.05} />
                  </linearGradient>
                </defs>

                <Area
                  dataKey="value"
                  stroke={hasData ? "#2451B7" : "#FFFFFF"}
                  fill="url(#color)"
                />

                <XAxis
                  dataKey="date"
                  axisLine={false}
                  tickLine={false}
                  tickFormatter={formatXAxis} // Use the formatter function here
                  tick={{ fill: isDarkMode ? "#FFF" : "#000" }}
                />

                <YAxis
                  datakey="value"
                  axisLine={false}
                  tickLine={false}
                  tickCount={8}
                  tickFormatter={(number) =>
                    hasData ? Math.round(number) : number
                  } // Ensure no decimals
                  allowDecimals={false} // Ensure no decimal values
                  tick={{ fill: isDarkMode ? "#FFF" : "#000" }}
                  padding={{
                    bottom: 20,
                  }}
                />

                <Tooltip content={<CustomTooltip isDarkMode={isDarkMode} />} />

                <CartesianGrid opacity={0.1} vertical={false} />
              </AreaChart>
            </ResponsiveContainer>
          )}
          {!hasData && isLoaded && (
            <div
              className="position-absolute w-100 h-100 d-flex justify-content-center align-items-center"
              style={{
                top: 0,
                left: 0,
                color: isDarkMode ? "#FFF" : "#000",
              }}
            >
              <p
                style={{
                  color: isDarkMode ? "#DADADA" : "black",
                  alignContent: "center",
                }}
              >
                No Data Available
              </p>
            </div>
          )}
        </div>
      </CardBody>
    </Card>
  );
}

function CustomTooltip({ active, payload, label, isDarkMode }) {
  if (active && payload && payload.length > 0) {
    return (
      <div className={isDarkMode ? classes.tooltipDarkMode : classes.tooltip}>
        <h6>{format(parseISO(label), "eeee, d MMM, yyyy")}</h6>
        <p style={{ color: isDarkMode ? "#FFF" : "#000" }}>
          {payload[0].value} {payload[0].value > 1 ? "catalogues" : "catalogue"}
        </p>
      </div>
    );
  }
  return null;
}
