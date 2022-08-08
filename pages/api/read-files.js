import { Octokit } from "@octokit/rest";
import fetch from "isomorphic-unfetch";
import fm from "front-matter";

export default async function handler(req, res) {
  // const { owner, repo, path } = req.query;

  // if (!owner || !repo || !path) {
  //   res.status(400).json({ message: "Please provide owner, repo and path" });
  // }

  // const octokit = new Octokit({
  //   auth: "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",
  // });

  // const files = await octokit.rest.repos.getContent({
  //   owner,
  //   repo,
  //   path,
  // });

  // const urls = files.data.map((file) => {
  //   return file.download_url;
  // });

  // Promise.all(urls.map((url) => fetch(url)))
  //   .then((responses) =>
  //     Promise.all(responses.map((response) => response.text()))
  //   )
  //   .then((testResults) =>
  //     Promise.all(testResults.map((response) => fm(response)))
  //   )
  //   .then((frontMatterResults) =>
  //     Promise.all(
  //       frontMatterResults.map((response) => {
  //         return {
  //           id: `${response.attributes.route.replace("/", "")}.md`,
  //           ...response.attributes,
  //         };
  //       })
  //     )
  //   )
  //   .then((result) => {
  //     res.status(200).json(result);
  //   });

  res.status(200).json([
    {
      id: "emcee",
      title: "Emcee",
      route: "/emcee",
      type: "richtext",
    },
    {
      id: "intro",
      title: "Intro",
      route: "/intro",
      type: "richtext",
    },
    {
      id: "long-bio",
      title: "Mini bio",
      route: "/long-bio",
      type: "richtext",
    },
    {
      id: "my-details",
      title: "Details",
      route: "/my-details",
      type: "data",
      data: [
        {
          label: "Name",
          val: "Tim Benniks",
        },
        {
          label: "Company",
          val: "Uniform",
          link: "https://uniform.dev",
        },
        {
          label: "Title",
          val: "Principal Developer Advocate",
        },
        {
          label: "Location",
          val: "Greater Toulouse Metropolitan Area, France",
        },
        {
          label: "E-mail",
          val: "timb@uniform.dev",
        },
        {
          label: "Website",
          val: "https://timbenniks.dev",
          link: "https://timbenniks.dev",
        },
      ],
    },
    {
      id: "short-bio",
      title: "Mini Bio condensed",
      route: "/short-bio",
      type: "richtext",
    },
  ]);
}
