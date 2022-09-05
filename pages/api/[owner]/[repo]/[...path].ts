import fetch from "isomorphic-unfetch";
import fm from "front-matter";
import { Octokit } from "@octokit/rest"
import { NextApiRequest, NextApiResponse } from "next"

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { owner, repo, path } = req.query;
  const { authorization } = req.headers
  console.log(Date.now(), 'got query', req.query)

  if (![owner, repo, path, /^Bearer ghp_/.test(authorization as string)].every(Boolean)) {
    res.status(400).json({ message: "Please provide owner, repo and path" });
    return
  }

  const token = authorization.split(' ')[1]
  const octokit = new Octokit({ auth: token });

  const files = await octokit.rest.repos.getContent({
    owner: owner as string,
    repo: repo as string,
    path: path as string,
  });

  if (Array.isArray(files.data)) {
    const urls = files.data
      .filter(({ path }) => /.md$/.test(path))

    const results = await Promise.all(urls.map(
      async ({ name, path, download_url }) => {
        const res = await fetch(download_url)
        const text = await res.text()
        try {
          const meta = fm<{ title?: string }>(text)
          return {
            id: path,
            title: meta.attributes.title ?? name,
            owner,
            repo,
            metadata: meta.attributes
          }
        } catch (e) {
          console.log('Error parsing fm', e.message)
          return {
            id: path,
            title: path,
            owner,
            repo,
            metadata: {
              error: 'Error parsing markdown'
            }
          }
        }
      })
    )
    res.setHeader(
      'Cache-Control',
      'private, max-age=30, stale-while-revalidate=59'
    )
    res.status(200).json(results);
  } else {
    res.status(200).json([]);
  }

}
