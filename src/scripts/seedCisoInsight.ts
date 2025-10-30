import { faker } from "@faker-js/faker";
import fs from "fs";
import path from "path";

const NUM_REPOS = 3;
const PRS_PER_REPO = 5;
const COMMENTS_PER_PR = 3;

// 💬 Comment
interface Comment {
  id: string | number;
  user: string;
  body: string;
  createdAt: string;
}

// 🔄 Pull Request
interface PullRequest {
  id: string | number;
  number: number;
  title: string;
  state: "open" | "closed" | "merged";
  author: string;
  repoId: string | number;
  createdAt: string;
  updatedAt: string;
  mergedAt: string | null;
  riskScore: number;
  severity: "low" | "medium" | "high" | "critical";
  comments: Comment[];
}

// 🧩 Repository
interface Repository {
  id: string | number;
  name: string;
  owner: string;
  description?: string;
  createdAt: string;
}

const repositories: Repository[] = [];
const pullRequests: PullRequest[] = [];

for (let i = 0; i < NUM_REPOS; i++) {
  const repoId = faker.string.uuid();
  repositories.push({
    id: repoId,
    name: faker.word.noun() + "-service",
    owner: faker.internet.username(),
    description: faker.company.catchPhrase(),
    createdAt: faker.date.past().toISOString(),
  });

  for (let j = 0; j < PRS_PER_REPO; j++) {
    const prId = faker.string.uuid();
    const comments: Comment[] = [];

    for (let k = 0; k < COMMENTS_PER_PR; k++) {
      comments.push({
        id: faker.string.uuid(),
        user: faker.internet.username(),
        body: faker.hacker.phrase(),
        createdAt: faker.date.recent().toISOString(),
      });
    }

    const states: Array<"open" | "closed" | "merged"> = ["open", "closed", "merged"];
    const state = faker.helpers.arrayElement(states);

    pullRequests.push({
      id: prId,
      number: faker.number.int({ min: 1, max: 500 }),
      title: faker.hacker.phrase(),
      state,
      author: faker.person.fullName(),
      repoId,
      createdAt: faker.date.recent({ days: 30 }).toISOString(),
      updatedAt: faker.date.recent().toISOString(),
      mergedAt: state === "merged" ? faker.date.recent().toISOString() : null,
      riskScore: faker.number.int({ min: 0, max: 100 }),
      severity: faker.helpers.arrayElement(["low", "medium", "high", "critical"]),
      comments,
    });
  }
}

// 🗂 Ensure data directory exists
const dataDir = path.join(process.cwd(), "src/data");
if (!fs.existsSync(dataDir)) {
  fs.mkdirSync(dataDir, { recursive: true });
}

// 💾 Write the seed file
fs.writeFileSync(
  path.join(dataDir, "seed.json"),
  JSON.stringify({ repositories, pullRequests }, null, 2)
);

console.log("✅ Seed data generated at src/data/seed.json");
