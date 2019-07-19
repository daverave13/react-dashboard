let minDay = new Date();
minDay.setDate(minDay.getDate() - 7);
console.log(minDay.toISOString().split('T')[0]);
