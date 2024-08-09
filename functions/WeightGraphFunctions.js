import { startOfDay, subDays, addDays, format, parseISO } from "date-fns";

export const getFilteredData = (days, data) => {
  const endDate = startOfDay(new Date());
  const startDate = subDays(endDate, days - 1);
  let lastLoggedWeight = null;
  const filledData = [];

  for (let date = startDate; date <= endDate; date = addDays(date, 1)) {
    const dateString = format(date, "yyyy-MM-dd");
    const loggedWeight = data.find(
      (item) => format(parseISO(item.date), "yyyy-MM-dd") === dateString
    );

    if (loggedWeight) {
      lastLoggedWeight = loggedWeight.weight;
      filledData.push({ date: dateString, weight: lastLoggedWeight });
    } else if (lastLoggedWeight !== null) {
      filledData.push({ date: dateString, weight: lastLoggedWeight });
    }
  }

  return filledData;
};

export const getXLabels = (data, maxLabels) => {
  const totalLabels = data.length;
  const labelInterval = Math.ceil(totalLabels / maxLabels);

  return data.map((dataPoint, index) => {
    return index % labelInterval === 0
      ? format(parseISO(dataPoint.date), "d/M")
      : "";
  });
};
