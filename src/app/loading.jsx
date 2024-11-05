export default function Loading({ version }) {

    return version === 2 ? (
        <article className="z-10 flex flex-col items-center justify-center w-full bg-none">
            <div className="loader loader-v2"></div>
        </article>
    ) : (
        <article className="z-10 flex flex-col items-center justify-center w-full h-[75vh] bg-none">
            <div className="ml-6 text-primary loader"></div>
        </article>
    )
}