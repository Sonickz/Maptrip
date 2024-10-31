export const FormAlert = ({ alert }) => {
    const httpCodeErrors = [400, 401, 403, 404, 405, 500]

    return (
        <section className="flex flex-col gap-2 alert">
            {alert && !httpCodeErrors.includes(alert.status) ? (
                <div className="p-4 mb-4 text-lg text-green-800 bg-green-100 rounded-lg" role="alert">
                    {alert.data.message}
                </div>)
                : alert && (
                    alert.data.map((message, i) => {
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
