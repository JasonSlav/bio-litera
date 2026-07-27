export function PageHeading({
  title,
  description,
}: {
  title: string
  description?: string
}) {
  return (
    <div className="mb-6">
      <h1 className="font-heading text-2xl font-bold text-foreground text-balance sm:text-3xl">
        {title}
      </h1>
      {description ? (
        <p className="mt-1 max-w-2xl text-sm leading-relaxed text-muted-foreground text-pretty">
          {description}
        </p>
      ) : null}
    </div>
  )
}
