const FormAlert = ({ alerts }) => {

    const status = alerts && alerts.status ? alerts.status : null
    const httpCodeErrors = [400, 401, 403, 404, 405, 500]

    return (
        <section className="flex flex-col gap-2 alert">
            {alerts && !httpCodeErrors.includes(status) ? (
                <div className="p-4 mb-4 text-lg text-green-800 bg-green-100 rounded-lg" role="alert">
                    {alerts.data.message}
                </div>)
                : alerts && (
                    alerts.response.data.message.map((message, i) => {
                        return (
                            <div key={i} className="p-4 mb-4 text-lg text-red-800 bg-red-100 rounded-lg" role="alert">
                                {message}
                            </div>
                        )
                    })
                )}
        </section>
    )
}

export default FormAlert