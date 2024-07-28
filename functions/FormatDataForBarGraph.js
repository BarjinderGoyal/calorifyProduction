const formatDataForChart = (data, key) => {
  const daysOfWeek = [
    { label: "Sun" },
    { label: "Mon" },
    { label: "Tue" },
    { label: "Wed" },
    { label: "Thu" },
    { label: "Fri" },
    { label: "Sat" },
  ];

  const formattedData = daysOfWeek.map(({ label }) => {
    const dayData = data?.find((item) => item.label === label);
    return {
      label,
      value: dayData ? dayData[key] : 0,
    };
  });

  console.log(formattedData, "inside analytics");
  return formattedData;
};

export default formatDataForChart;
