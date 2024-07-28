// import {
//   format,
//   parseISO,
//   subDays,
//   isAfter,
//   addDays,
//   startOfDay,
// } from "date-fns";

// export const data = [
//   { date: "2024-01-01", weight: 70 },
//   { date: "2024-01-02", weight: 69 },
//   { date: "2024-01-09", weight: 68 },
//   { date: "2024-01-16", weight: 67 },
//   { date: "2024-01-28", weight: 66 },
//   { date: "2024-02-06", weight: 64 },
//   { date: "2024-02-14", weight: 65 },
//   { date: "2024-02-26", weight: 63 },
//   { date: "2024-03-07", weight: 62 },
//   { date: "2024-03-19", weight: 61 },
//   { date: "2024-03-29", weight: 59 },
//   { date: "2024-04-05", weight: 58 },
//   { date: "2024-04-15", weight: 59 },
//   { date: "2024-04-27", weight: 57 },
//   { date: "2024-05-04", weight: 56 },
//   { date: "2024-05-10", weight: 59 },
//   { date: "2024-05-20", weight: 58 },
//   { date: "2024-05-28", weight: 60 },
//   { date: "2024-06-09", weight: 61 },
//   { date: "2024-06-15", weight: 78 },
//   { date: "2024-06-28", weight: 77 },
//   { date: "2024-07-09", weight: 75 },
//   { date: "2024-07-19", weight: 80 },
//   // Add more data points as needed
// ];

// export const getFilteredData = (days, data) => {
//   console.log(
//     "LOGGED WEIGHT DATA INSIDE FUNCTION FOLDER INSIDE ETFILTERTEDDATA",
//     data
//   );
//   const endDate = startOfDay(new Date());
//   const startDate = subDays(endDate, days - 1);
//   let lastLoggedWeight = null;
//   const filledData = [];

//   for (let date = startDate; date <= endDate; date = addDays(date, 1)) {
//     const dateString = format(date, "yyyy-MM-dd");
//     const loggedWeight = data.find((item) => item.date === dateString);

//     if (loggedWeight) {
//       lastLoggedWeight = loggedWeight.weight;
//       filledData.push({ date: dateString, weight: lastLoggedWeight });
//     } else if (lastLoggedWeight !== null) {
//       filledData.push({ date: dateString, weight: lastLoggedWeight });
//     }
//   }

//   return filledData;
// };

// export const getXLabels = (data, maxLabels) => {
//   const totalLabels = data.length;
//   const labelInterval = Math.ceil(totalLabels / maxLabels);

//   return data.map((dataPoint, index) => {
//     return index % labelInterval === 0
//       ? format(parseISO(dataPoint.date), "d/M")
//       : "";
//   });
// };

// import { startOfDay, subDays, addDays, format, parseISO } from "date-fns";

// export const getFilteredData = (days, data) => {
//   const endDate = startOfDay(new Date());
//   const startDate = subDays(endDate, days - 1);
//   let lastLoggedWeight = null;
//   const filledData = [];

//   for (let date = startDate; date <= endDate; date = addDays(date, 1)) {
//     const dateString = format(date, "yyyy-MM-dd");
//     const loggedWeight = data.find(
//       (item) => format(parseISO(item.date), "yyyy-MM-dd") === dateString
//     );

//     if (loggedWeight) {
//       lastLoggedWeight = loggedWeight.weight;
//       filledData.push({ date: dateString, weight: lastLoggedWeight });
//     } else if (lastLoggedWeight !== null) {
//       filledData.push({ date: dateString, weight: lastLoggedWeight });
//     }
//   }

//   return filledData;
// };

// export const getXLabels = (data, maxLabels) => {
//   const totalLabels = data.length;
//   const labelInterval = Math.ceil(totalLabels / maxLabels);

//   return data.map((dataPoint, index) => {
//     return index % labelInterval === 0
//       ? format(parseISO(dataPoint.date), "d/M")
//       : "";
//   });
// };

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
