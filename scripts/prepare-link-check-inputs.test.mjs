import assert from 'node:assert/strict';
import test from 'node:test';

import { selectLinkCheckInputs } from './prepare-link-check-inputs.mjs';

const htmlFiles = [
  'build/index.html',
  'build/docs/getting-started.html',
  'build/blog.html',
  'build/blog/archive.html',
  'build/blog/existing-post.html',
  'build/blog/existing-post.html.html',
  'build/blog/new-post.html',
  'build/blog/new-post.html.html',
];

const blogPosts = [
  {
    source: '@site/blog/existing-post.md',
    permalink: '/blog/existing-post',
  },
  {
    source: '@site/blog/new-post.md',
    permalink: '/blog/new-post',
  },
];

test('excludes all blog posts when no blog post was added', () => {
  assert.deepEqual(
    selectLinkCheckInputs({
      htmlFiles,
      blogPosts,
      addedBlogSources: [],
    }),
    ['build/blog.html', 'build/blog/archive.html', 'build/docs/getting-started.html', 'build/index.html'],
  );
});

test('checks a newly added blog post without checking existing posts', () => {
  assert.deepEqual(
    selectLinkCheckInputs({
      htmlFiles,
      blogPosts,
      addedBlogSources: ['blog/new-post.md'],
    }),
    [
      'build/blog.html',
      'build/blog/archive.html',
      'build/blog/new-post.html',
      'build/blog/new-post.html.html',
      'build/docs/getting-started.html',
      'build/index.html',
    ],
  );
});

test('matches generated blog routes in preview builds', () => {
  assert.deepEqual(
    selectLinkCheckInputs({
      htmlFiles: ['build/blog/existing-post.html', 'build/blog/new-post.html'],
      blogPosts: [
        {
          source: '@site/blog/existing-post.md',
          permalink: '/pr-preview/pr-123/blog/existing-post',
        },
        {
          source: '@site/blog/new-post.md',
          permalink: '/pr-preview/pr-123/blog/new-post',
        },
      ],
      addedBlogSources: ['blog/new-post.md'],
      baseUrl: '/pr-preview/pr-123',
    }),
    ['build/blog/new-post.html'],
  );
});

test('fails when a newly added blog post has no generated page', () => {
  assert.throws(
    () =>
      selectLinkCheckInputs({
        htmlFiles,
        blogPosts,
        addedBlogSources: ['blog/missing-post.mdx'],
      }),
    /Docusaurus metadata is missing for newly added blog posts: blog\/missing-post\.mdx/,
  );
});
