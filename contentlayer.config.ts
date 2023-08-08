// contentlayer.config.ts
import { defineDocumentType, makeSource } from 'contentlayer/source-files';
import remarkGfm from 'remark-gfm';
import rehypePrettyCode from 'rehype-pretty-code';
import rehypeSlug from 'rehype-slug';
import rehypeAutolinkHeadings from 'rehype-autolink-headings';
import path from 'path';
import { readFileSync } from 'fs';

export const Post = defineDocumentType(() => ({
  name: 'Post',
  filePathPattern: `**/*.mdx`,
  contentType: 'mdx',
  fields: {
    title: {
      type: 'string',
      required: true,
      description: 'The title of the post',
    },
    date: {
      type: 'date',
      required: true,
      description: 'The date post was created',
    },
    description: {
      type: 'string',
      required: true,
      description: 'The brief description of the post',
    },
    tags: {
      type: 'list',
      of: { type: 'string' },
      required: false,
      description: 'Tags for the post',
    },
  },
  computedFields: {
    url: {
      type: 'string',
      resolve: (doc) => `/blog/${doc._raw.flattenedPath}`,
    },
    slug: {
      type: 'string',
      resolve: (doc) => `/${doc._raw.flattenedPath}`,
    },
    author: {
      type: 'string',
      resolve: () => 'Huse Kivrak',
    },
  },
}));

/** @type {import('rehype-pretty-code').Options} */
const options = {
  theme: JSON.parse(
    readFileSync(path.resolve('components/mdx/everforest-dark.json')).toString()
  ),

  onVisitLine(node: any) {
    //prevent lines from collapsing in 'display:grid' layout,
    //and allow lines to be copy/pasted
    if (node.children.length === 0) {
      node.children = [{ type: 'text', value: ' ' }];
    }
  },
  onVisitHighlightedLine(node: any) {
    node.properties.className.push('line--highlighted');
  },
  onVisitHighlightedWord(node: any) {
    node.properties.className = ['word--highlighted'];
  },
};

export default makeSource({
  contentDirPath: 'posts',
  documentTypes: [Post],
  mdx: {
    remarkPlugins: [remarkGfm],
    rehypePlugins: [
      rehypeSlug,
      [rehypePrettyCode, options],
      [
        rehypeAutolinkHeadings,
        {
          properties: {
            className: ['subheading-anchor'],
            ariaLabel: 'Link to section',
          },
        },
      ],
    ],
  },
});
