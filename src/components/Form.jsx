'use client'
import { Formik, Form, Field, ErrorMessage } from 'formik'
import { zodValidate } from '@/libs/libs'

const FormComponent = ({ fields, schemaValidate, onSubmit, title, buttonText, leyend, className }) => {
    if (!fields || !schemaValidate || !onSubmit) return;

    const initialValues = fields.reduce((acc, field) => {
        acc[field.field] = '';
        return acc;
    }, {});

    return (
        <Formik
            initialValues={initialValues}
            validate={zodValidate(schemaValidate)}
            onSubmit={onSubmit}>
            {({ handleReset }) => (
                <Form className={className && className}>
                    <h1 className="form__title">{title}</h1>
                    <section className="form__inputs">
                        {fields.map((field, index) => {
                            return (
                                <section key={index}>
                                    <div className="form__input-box">
                                        <Field name={field.field} type={field.type} placeholder="" />
                                        <label>{field.label}</label>
                                    </div>
                                    <ErrorMessage name={field.field} component="div" className="form__alert" />
                                </section>
                            )
                        })}
                    </section>
                    <footer className="form__footer">
                        <button type="submit" className="form__submit">{buttonText ? buttonText : title}</button>
                    </footer>
                </Form>
            )}
        </Formik>
    );
}

export default FormComponent;