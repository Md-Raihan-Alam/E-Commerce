class CustomAPIError extends Error {
  statusCode?: number;
  errors?: any;
  code?: number;
  keyValue?: any;
  value?: any;
  constructor(message: string) {
    super(message);
  }
}

export { CustomAPIError };
