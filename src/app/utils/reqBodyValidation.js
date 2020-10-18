export default async function reqBodyValidation(schema, body) {
  let errors;

  await schema.validate(body, { abortEarly: false }).catch((err) => {
    errors = err.inner.map((item) => {
      return {
        path: item.path,
        message: item.message,
      };
    });
  });

  return errors;
}
