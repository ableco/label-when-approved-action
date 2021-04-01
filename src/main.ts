import * as core from "@actions/core";
import { context, getOctokit } from "@actions/github";
import { Octokit } from "@octokit/core";

function splitLabel(s: string): string[] {
  return s === "" ? [] : s.split(",").map((l) => l.trim());
}

async function prNumberOfApprovals({
  client,
  owner,
  repo,
  number,
}: {
  client: InstanceType<typeof Octokit>;
  owner: string;
  repo: string;
  number: number;
}): Promise<number> {
  const {
    repository: {
      pullRequest: {
        reviews: { totalCount },
      },
    },
  } = await client.graphql<any>(
    `query ($owner: String!, $repo: String!, $number: Int!) {
       repository(owner:$owner, name:$repo) {
         pullRequest(number:$number) {
           reviews(states: APPROVED) { totalCount }
         }
       }
     }`,
    { owner, repo, number }
  );
  return totalCount;
}

async function run(): Promise<void> {
  const token = core.getInput("repo-token");
  const addLabel = core.getInput("add-label");
  const removeLabel = core.getInput("remove-label");
  const requiredApprovals = core.getInput("approvals");
  const octokit = getOctokit(token);
  let shouldLabel = removeLabel !== "" || addLabel !== "";

  if (requiredApprovals !== "") {
    const approvals = await prNumberOfApprovals({
      ...context.issue,
      client: octokit,
    });
    core.info(`approval: total=｢${approvals}｣ required=｢${requiredApprovals}｣`);
    shouldLabel = approvals >= Number(requiredApprovals);
  }
  if (!shouldLabel) return;

  core.info(`label: add=｢${addLabel}｣ remove=｢${removeLabel}｣`);
  if (removeLabel) {
    octokit.rest.issues.removeLabel({
      ...context.repo,
      issue_number: context.issue.number,
      name: removeLabel,
    });
  }
  if (addLabel) {
    octokit.rest.issues.addLabels({
      ...context.repo,
      issue_number: context.issue.number,
      labels: splitLabel(addLabel),
    });
  }
}

run().catch(core.setFailed);
