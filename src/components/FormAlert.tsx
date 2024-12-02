export type FormAlertsProps = {
    //Success alert
    data?: {
        message: string,
        data: object
    },

    //Error alert | Zod Errors Alert
    response?: {
        data: {
            message: string | string[]
        }
    }

    // NextAuth Errors | NextAuth Zod Errors
    error?: string | string[],

    //Status
    status: number,
} | null

export const FormAlert: React.FC<{ alerts: FormAlertsProps }> = ({ alerts }) => {

    const status = alerts ? alerts.status : null
    const isSuccess = () => {
        const httpCodeErrors = [400, 401, 403, 404, 405, 500]
        return status ? !httpCodeErrors.includes(status) : null
    }

    const AlertComponent: React.FC<{ type: string, message: string }> = ({ type, message }) => {
        return (
            <div className={`p-4 mb-4 text-lg ${type === 'error' ? 'text-red-800 bg-red-100' : 'text-green-800 bg-green-100'}  rounded-lg`} role="alert">
                {message}
            </div>
        )
    }

    return (
        <section className="flex flex-col gap-2 alert">
            {/* Success */}
            {isSuccess() && alerts?.data && <AlertComponent type="success" message={alerts.data.message} />}
            {/* Error */}
            {!isSuccess() && alerts?.response?.data.message && !Array.isArray(alerts.response.data.message) && <AlertComponent type="error" message={alerts.response.data.message} />}
            {/* Zod errors */}
            {!isSuccess() && alerts?.response?.data.message && Array.isArray(alerts.response.data.message) && alerts.response.data.message.map((message, i) => { return <AlertComponent key={i} type="error" message={message} /> })}
            {/* NextAuth Error */}
            {!isSuccess() && alerts?.error && !Array.isArray(alerts.error) && <AlertComponent type="error" message={alerts.error} />}
            {/* NextAuth - Zod errors */}
            {!isSuccess() && alerts?.error && Array.isArray(alerts.error) && alerts.error.map((error, i) => { return <AlertComponent key={i} type="error" message={error} /> })}
            {/* Any other error */}
            {/* {!isSuccess() && alerts.response?.data && !alerts.response.data.message && <AlertComponent type="error" message={alerts.response.data} />} */}
        </section>
    )
}