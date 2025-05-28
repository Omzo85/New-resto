module.exports = {
  formatResponse: (data, message = 'Success', status = 200) => {
    return {
      status,
      message,
      data,
    };
  },

  validateInput: (input, schema) => {
    const { error } = schema.validate(input);
    return error ? error.details[0].message : null;
  },

  paginate: (array, page, limit) => {
    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + limit;
    const result = array.slice(startIndex, endIndex);
    return {
      totalItems: array.length,
      totalPages: Math.ceil(array.length / limit),
      currentPage: page,
      items: result,
    };
  },
};