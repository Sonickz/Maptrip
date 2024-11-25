import { API_URL } from "@/config/config"
const FormAlert = ({ alerts }) => {

    if (!alerts) return

    const status = alerts.status
    const isSuccess = () => {
        const httpCodeErrors = [400, 401, 403, 404, 405, 500]
        return !httpCodeErrors.includes(status)
    }

    const AlertComponent = ({ type, message }) => {
        return (
            <div className={`p-4 mb-4 text-lg ${type === 'error' ? 'text-red-800 bg-red-100' : 'text-green-800 bg-green-100'}  rounded-lg`} role="alert">
                {message}
            </div>
        )
    }

    return (
        <section className="flex flex-col gap-2 alert">
            {/* Success */}
            {isSuccess() && alerts.data && <AlertComponent type="success" message={alerts.data.message} />}
            {/* Error */}
            {!isSuccess() && alerts.response?.data.message && !Array.isArray(alerts.response.data.message) && <AlertComponent type="error" message={alerts.response.data.message} />}
            {/* Zod errors */}
            {!isSuccess() && alerts.response?.data.message && Array.isArray(alerts.response.data.message) && alerts.response.data.message.map((message, i) => { return <AlertComponent key={i} type="error" message={message} /> })}
            {/* NextAuth Error */}
            {!isSuccess() && alerts.error && !Array.isArray(alerts.error) && <AlertComponent type="error" message={alerts.error} />}
            {/* NextAuth - Zod errors */}
            {!isSuccess() && alerts.error && Array.isArray(alerts.error) && alerts.error.map((error, i) => { return <AlertComponent key={i} type="error" message={error} /> })}
            {/* Any other error */}
            {!isSuccess() && alerts.response?.data && !alerts.response.data.message && <AlertComponent type="error" message={alerts.response.data} />}
        </section>
    )
}

export const alertTypes = {
    successAlert: {
        data: {
            message: 'Operacion ejecutada correctamente',
            data: {}
        },
        status: 200
    },
    errorAlert: {
        response: {
            data: {
                message: 'Error en la operacion'
            }
        },
        status: 400
    },
    zodErrorsAlert: {
        response: {
            data: {
                message: ["Error 1", "Error 2"]
            }
        },
        status: 400
    },
    nextAuthZodErrorsAlert: {
        error: ["Error NextAuth 1", "Error NextAuth 2"],
        status: 400
    },
    nextAuthErrorAlert: {
        error: "Error NextAuth",
        status: 400
    },
    otherErrorAlert: {
        response: {
            data: "Error"
        },
        status: 400
    }
}

export default FormAlert