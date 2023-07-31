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

export type Post = {
    id: string,
    created_at: string,
    name: string,
    content: string,
    tags: string[],
    is_published: boolean,
    published_on: string,
}