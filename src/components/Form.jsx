'use client'
import { Formik, Form, Field, ErrorMessage } from 'formik'
import { zodValidate } from '@/libs/libs'
import FormAlert from './FormAlert'
import Loading from '@/app/loading'

const FormComponent = ({ children, fields, schemaValidate, onSubmit, title, buttonText, className, alerts, renderChildren, renderHeader }) => {

    const initialValues = fields.reduce((acc, field) => {
        acc[field.field] = field.value ? field.value : ''
        return acc
    }, {})

    return (
        <section className={`section-form ${className && className}`}>
            <Formik
                initialValues={initialValues}
                validate={zodValidate(schemaValidate)}
                onSubmit={onSubmit}>
                {({ resetForm, isSubmitting }) => {
                    return (
                        <Form>
                            <header className='form__header'>
                                <h1 className="form__title">{title}</h1>
                                {renderHeader && renderHeader}
                            </header>
                            <section className="form__inputs">
                                <FormAlert alerts={alerts} />
                                {fields.map((field, i) => {
                                    return (
                                        <section key={i}>
                                            {field.type === 'select' ? (
                                                <div className="form__select">
                                                    <Field name={field.field} as="select">
                                                        <option value="">Selecciona tu {field.label.toLowerCase()}</option>
                                                        {field.options.map((option, i) => {
                                                            return <option key={i} value={option.value}>{option.label}</option>
                                                        })}
                                                    </Field>
                                                </div>
                                            ) : (
                                                <div className="form__input-box">
                                                    <Field name={field.field} type={field.type} placeholder="" onInput={field.onInput ? field.onInput : null} />
                                                    <div className='form__input-box--focus'></div>
                                                    <label>{field.label}</label>
                                                </div>
                                            )}
                                            <ErrorMessage name={field.field} component="div" className="form__alert" />
                                        </section>
                                    )
                                })}
                            </section>
                            <footer className="form__footer">
                                <button type="submit" className="form__submit">{isSubmitting ? <Loading version={2}/> : buttonText ? buttonText : title}</button>
                            </footer>
                            {renderChildren(resetForm)}
                            {children}
                        </Form>
                    )
                }}
            </Formik>
        </section>
    )
}

export default FormComponent 