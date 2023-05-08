const padTo2Digits = (num: number) => {
  return num.toString().padStart(2, '0');
};

export const formatDate = (dateString: string) => {
  const date = new Date(dateString);

  const day = date.getDate();
  const month = date.getMonth();
  const year = date.getFullYear();

  return `${padTo2Digits(day)}.${padTo2Digits(month)}.${year}`;
};

const wordAgeDeclination = (age: string) => /\d*1\d$/.test(age) || /[05-9]$/.test(age) ? 'лет' : ( /1$/.test(age) ? 'год' : 'года');

// TODO - [TEST] - add test for it
export const convertDateToAge = (timestamp: string) => {
  const age = String(Math.floor(((new Date()).getTime() - new Date(timestamp).getTime()) / (1000 * 60 * 60 * 24 * 365)));
  return `${age} ${wordAgeDeclination(age)}`;
};

