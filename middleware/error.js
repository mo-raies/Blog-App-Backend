class errorHandler extends Error {
  constructor(statusCode,message){
    super(message);
    this.statusCode = statusCode
  }
}

export const ErrorMiddleware = (err,req,res,next) =>{
  err.message = err.message || "Internal server Error";
  err.statusCode = err.statusCode || 500 ;

  if (err.name === "castError"){
    const message = `Invalid: Resource not found: ${err.path}`
    err = new errorHandler (message, 404)
  }
  return res.status(err.statusCode).json({
    success: false,
    message: err.message
  });
}

export default errorHandler