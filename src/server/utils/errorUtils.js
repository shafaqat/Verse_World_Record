//{status: 400, error: 'message'};

const reportError = (res, status, error) => {
  res.status(status);
  res.send({message: error});
  return;
};

const caughtError = (res, error) => {
  
  if(error != null && (error instanceof BadRequestError || error instanceof InternalServerError || error instanceof NotFoundError)){
    console.log('Caught error: ' + error.message);
    
    if(error instanceof BadRequestError)
      res.status(400);    
    else if(error instanceof NotFoundError)
      res.status(404);    
    else if(error instanceof InternalServerError)
      res.status(500);    
    else if(error instanceof AccessDeniedError)
      res.status(401);    
      
    res.send({message: error.message});
    return;
  }
  else{      
    console.log('Caught error: ' + error);
    console.log(error.stack);
    res.status(500);
    res.send({message: 'Hmm, what you have encountered is unexpected. If problem persists, contact app provider.'});
    return;
  }
};

const NotFoundError = class NotFoundError extends Error {
  constructor(message) {
    super(message);
    this.message = message;
    this.name = 'NotFoundError';
  }
};

const BadRequestError = class BadRequestError extends Error {
  constructor(message) {
    super(message);
    this.message = message;
    this.name = 'BadRequestError';
  }
};

const InternalServerError = class InternalServerError extends Error {
  constructor(message) {
    super(message);
    this.message = message;
    this.name = 'InternalServerError';
  }
};

const AccessDeniedError = class AccessDeniedError extends Error {
  constructor(message) {
    super(message);
    this.message = message;
    this.name = 'AccessDeniedError';
  }
};

export default {
  reportError : reportError,
  NotFoundError: NotFoundError,
  AccessDeniedError: AccessDeniedError,
  BadRequestError: BadRequestError,
  InternalServerError: InternalServerError,
  caughtError: caughtError
};
