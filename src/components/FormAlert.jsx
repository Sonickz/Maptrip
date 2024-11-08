import { API_URL } from "@/config/config"
const FormAlert = ({ alerts }) => {

    if (!alerts) return
    const status = alerts.status ? alerts.status : null
    const httpCodeErrors = [400, 401, 403, 404, 405, 500]
    console.log(alerts)
    console.log(API_URL)
    return (
        <section className="flex flex-col gap-2 alert">
            {/* Alert Ok */}
            {!httpCodeErrors.includes(status) && alerts.data ? (
                <div className="p-4 mb-4 text-lg text-green-800 bg-green-100 rounded-lg" role="alert">
                    {alerts.data && alerts.data.message}
                </div>)
                // Alert Zod Errors
                : alerts.response && Array.isArray(alerts.response.data.message) ? alerts.response.data.message.map((message, i) => {
                    return (
                        <div key={i} className="p-4 mb-4 text-lg text-red-800 bg-red-100 rounded-lg" role="alert">
                            {message}
                        </div>
                    )
                    // Alert NextAuth Zod Errors    
                }) : alerts.error && Array.isArray(alerts.error) ? alerts.error.map((error, i) => {
                    return (
                        <div key={i} className="p-4 mb-4 text-lg text-red-800 bg-red-100 rounded-lg" role="alert">
                            {error}
                        </div>
                    )
                })
                    // Alert NextAuth Error
                    : alerts.error && <div className="p-4 mb-4 text-lg text-red-800 bg-red-100 rounded-lg" role="alert">
                        {alerts.error}
                    </div>
            }
        </section>
    )
}

export default FormAlert