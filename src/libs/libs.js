export const zodValidate = (schema) => (values) => {
    const result = schema.safeParse(values)
    if (result.success) return;
    const errors = {}
    result.error.issues.forEach(({ path, message }) => {
        errors[path[0]] = message
    })
    return errors
}