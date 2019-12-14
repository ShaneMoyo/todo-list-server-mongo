module.exports = function createErrorHandler(log = console.log) {
  return (err, req, res, next) => {
  let showLog = process.env.NODE_ENV !== 'production';
  let code = 500;
  let error = 'Internal Server Error';

  if (err.code) {
      code = err.code;
      error = err.error;
  }
  else if (err.name === 'CastError') {
      code = 400;
      error = err
  }
  else if (err.name === 'ValidationError') {
      code = 400;
      error = Object.values(err.errors).map(e => e.path);
  }
  else {
      showLog = true;
  }

  if (showLog) log(code, error);

  res.status(code).json({ error });
  };
};
