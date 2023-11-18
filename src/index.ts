import express from "express";
import { google, type youtube_v3 } from "googleapis";
import inquirer from "inquirer";
import { performance } from "node:perf_hooks";
import open from "open";
import json from "./config.json" assert { type: "json" };

const { client_id, client_secret, redirect_url } = json;

if (
  client_id.length < 1 ||
  client_secret.length < 1 ||
  redirect_url.length < 1
) {
  console.error("Please fill in the config.json file.");
  process.exit(1);
}

const oauth = new google.auth.OAuth2(client_id, client_secret, redirect_url);
const scopes = [
  "https://www.googleapis.com/auth/youtube",
  "https://www.googleapis.com/auth/youtube.upload",
];
const url = oauth.generateAuthUrl({ scope: scopes });

const server = express();
server.listen(3000, () => {
  open(url);
});

server.get("/oauth2callback", async (req, res) => {
  const { code } = req.query;
  if (!code) return res.end("login went wrong, try again.");

  const { tokens } = await oauth.getToken(code as string);
  oauth.setCredentials(tokens);

  const yt = google.youtube({ version: "v3", auth: oauth });

  const vids = await fetchVideos(yt);

  res.end(
    `Successfully logged in, fetched ${vids.length} videos. Return to the console to continue.`
  );

  return replace(yt, vids);
});

async function replace(
  yt: youtube_v3.Youtube,
  videos: youtube_v3.Schema$SearchResult[]
) {
  const { toReplace, replacee } = await inquirer.prompt([
    {
      name: "toReplace",
      message: "What text would you like to replace? (warning: CasE seNSiTiVe)",
    },
    {
      name: "replacee",
      message: "What would you like to replace the text with?",
    },
  ]);

  const filtered = videos.filter((video) =>
    video.snippet?.description?.includes(toReplace)
  );

  const { answer } = await inquirer.prompt([
    {
      name: "answer",
      message: `${filtered.length} descriptions are about to be updated... are you sure you want to do this?`,
      type: "confirm",
    },
  ]);

  if (!answer) {
    console.log("Cancelling operation...");
    return process.exit();
  }

  console.log(
    `Replacing the description for ${filtered.length} videos, this may take a while...`
  );

  const start = performance.now();
  for (const video of filtered) {
    const categoryId = await yt.videos.list({
      part: ["snippet"],
      id: [video.id?.videoId!],
    });

    await yt.videos.update({
      part: ["id", "snippet"],
      requestBody: {
        id: video.id?.videoId,
        snippet: {
          title: video.snippet?.title,
          description: video.snippet?.description?.replace(toReplace, replacee),
          categoryId: categoryId.data.items![0].snippet?.categoryId,
        },
      },
    });
  }
  const end = performance.now();

  console.log(`Great success! Took: ${(end - start).toPrecision(2)}ms`);
  process.exit();
}

async function fetchVideos(yt: youtube_v3.Youtube) {
  const vids = [];

  let nextPage = true;
  let nextPageToken = "";

  while (nextPage) {
    const results = await yt.search.list({
      part: ["snippet"],
      forMine: true,
      type: ["video"],
      maxResults: 50,
      order: "date",
      pageToken: nextPageToken,
    });

    vids.push(...results.data.items!);
    if (results.data.nextPageToken) {
      nextPageToken = results.data.nextPageToken;
    } else nextPage = false;
  }

  return vids;
}
