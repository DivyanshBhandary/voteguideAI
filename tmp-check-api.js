const url = 'http://localhost:3001/api/election-news';
fetch(url)
  .then(async (res) => {
    console.log('status', res.status);
    console.log('headers', Object.fromEntries(res.headers.entries()));
    const body = await res.text();
    console.log('body:', body);
  })
  .catch((err) => {
    console.error('ERR', err);
    process.exit(1);
  });
