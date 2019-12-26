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
      error = {}
      Object.values(err.errors).forEach(({ properties }) => {
        const { message, path } = properties;
        error[path] = message;
      });
      code = 400;
  }
  else {
      showLog = true;
  }

  if (showLog) log(code, error);

  res.status(code).json({ error });
  };
};
