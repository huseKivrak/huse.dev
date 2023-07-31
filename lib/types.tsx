export type Project = {
    title: string,
    description: string,
    image: string,
    url?: string,
    github: string,
    tags: string[],
}

export type Tech = {
    title: string,
    Icon: React.ComponentType<React.HTMLAttributes<HTMLElement>>
    color: string,
}