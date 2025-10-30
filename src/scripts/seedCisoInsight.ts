import { faker } from "@faker-js/faker";
import fs from "fs";
import path from "path";

faker.seed(123);

const NUM_REPOS = 6;
const PRS_PER_REPO = 8;

type Severity = "CRITICAL" | "HIGH" | "MEDIUM" | "LOW" | "INFO";

interface CommentUser { login: string; type?: "User" | "Bot"; id?: number; avatar_url?: string }
interface Comment { id: string | number; user: CommentUser; body: string; createdAt: string; in_reply_to_id?: string | number; metadata?: { severity?: string; vulnerabilityTypes?: string[] } }
interface Finding { id: string; type: "SECRET_EXPOSURE" | "INJECTION" | "AUTHORIZATION" | "DEPENDENCY"; severity: Severity; message: string; file_path: string; line: number }
interface RiskSummary { overallSeverity: Severity; score: number; countsBySeverity?: Record<string, number>; categories?: Record<string, number>; mttr_days?: number }
interface PullRequest { id: string | number; number: number; title: string; state: "open" | "closed" | "merged"; author: string; repoId: string | number; createdAt: string; updatedAt: string; mergedAt: string | null; additions: number; deletions: number; changedFiles: number; riskSummary: RiskSummary; findings: Finding[]; comments: Comment[] }
interface Repository { id: string | number; name: string; owner: string; description?: string; createdAt: string; default_branch: string; html_url: string }
interface Contributor { id: string; login: string; avatar_url?: string }

const contributors: Contributor[] = Array.from({ length: 12 }).map(() => ({
  id: faker.string.uuid(),
  login: faker.internet.username().toLowerCase(),
  avatar_url: `https://i.pravatar.cc/100?u=${faker.string.uuid()}`,
}));

const repositories: Repository[] = Array.from({ length: NUM_REPOS }).map(() => {
  const name = faker.hacker.noun().replace(/\s+/g, "-") + "-service";
  return {
    id: faker.string.uuid(),
    name,
    owner: faker.internet.username().toLowerCase(),
    description: faker.hacker.phrase(),
    createdAt: faker.date.past({ years: 2 }).toISOString(),
    default_branch: "main",
    html_url: `https://github.com/example/${name}`,
  };
});

const severities: Severity[] = ["CRITICAL", "HIGH", "MEDIUM", "LOW", "INFO"];
const states: Array<"open" | "closed" | "merged"> = ["open", "closed", "merged"];

const pullRequests: PullRequest[] = [];

repositories.forEach((repo) => {
  for (let j = 0; j < PRS_PER_REPO; j++) {
    const createdAt = faker.date.recent({ days: 150 });
    const state = faker.helpers.arrayElement(states);
    const mergedAt = state === "merged" ? faker.date.between({ from: createdAt, to: new Date() }) : null;
    const updatedAt = faker.date.between({ from: createdAt, to: mergedAt ?? new Date() });

    const countsBySeverity: Record<string, number> = { CRITICAL:0, HIGH:0, MEDIUM:0, LOW:0, INFO:0 };
    const findings: Finding[] = Array.from({ length: faker.number.int({ min: 1, max: 6 }) }).map(() => {
      const sev = faker.helpers.arrayElement(severities);
      countsBySeverity[sev]++;
      return {
        id: faker.string.uuid(),
        type: faker.helpers.arrayElement(["SECRET_EXPOSURE", "INJECTION", "AUTHORIZATION", "DEPENDENCY"] as const),
        severity: sev,
        message: faker.hacker.phrase(),
        file_path: `src/${faker.system.fileName()}`,
        line: faker.number.int({ min: 1, max: 400 }),
      };
    });

    const overallSeverity = (Object.entries(countsBySeverity).sort((a, b) => b[1] - a[1])[0]?.[0] ?? "INFO") as Severity;
    const score = faker.number.int({ min: 0, max: 100 });

    const author = faker.helpers.arrayElement(contributors).login;
    const botUser: CommentUser = { login: "ciso-bot", type: "Bot", id: 999 };
    const devUser: CommentUser = { login: author, type: "User" };
    const comments: Comment[] = [
      { id: faker.string.uuid(), user: botUser, body: `Automated review: ${overallSeverity} risk. Score ${score}.`, createdAt: faker.date.between({ from: createdAt, to: updatedAt }).toISOString(), metadata: { severity: overallSeverity } },
      { id: faker.string.uuid(), user: devUser, body: "Thanks, addressing feedback.", createdAt: faker.date.between({ from: createdAt, to: updatedAt }).toISOString() },
    ];

    pullRequests.push({
      id: faker.string.uuid(),
      number: faker.number.int({ min: 1, max: 9999 }),
      title: faker.hacker.phrase(),
      state,
      author,
      repoId: repo.id,
      createdAt: createdAt.toISOString(),
      updatedAt: updatedAt.toISOString(),
      mergedAt: mergedAt ? mergedAt.toISOString() : null,
      additions: faker.number.int({ min: 5, max: 800 }),
      deletions: faker.number.int({ min: 0, max: 500 }),
      changedFiles: faker.number.int({ min: 1, max: 50 }),
      riskSummary: { overallSeverity, score, countsBySeverity, categories: { code: findings.length }, mttr_days: faker.number.int({ min: 1, max: 10 }) },
      findings,
      comments,
    });
  }
});

const dataDir = path.join(process.cwd(), "src/data");
if (!fs.existsSync(dataDir)) fs.mkdirSync(dataDir, { recursive: true });

fs.writeFileSync(
  path.join(dataDir, "seed.json"),
  JSON.stringify({ repositories, contributors, pullRequests }, null, 2) + "\n"
);

console.log("✅ Seed data generated at src/data/seed.json");
