import { describe, it, expect, beforeEach, vi, afterEach } from "vitest";
import { drizzle } from "drizzle-orm/better-sqlite3";
import Database from "better-sqlite3";
import * as schema from "@/db/schema";
import { vigilEvents } from "@/db/schema";
import { GET, POST } from "./route";
import { checkAdminStatus } from "@/lib/auth";

vi.mock("@/lib/auth", () => ({
  checkAdminStatus: vi.fn(),
}));

let db: ReturnType<typeof drizzle>;

const sampleEvent = {
  city: "Toronto",
  province: "ON",
  date: new Date(), // Use Date object for DB insert
  time: "18:00",
  location: "Somewhere",
  details: "Details",
  organizers: "Org",
  links: [],
  image: "img.png",
};

beforeEach(async () => {
  // Set up in-memory SQLite DB and Drizzle
  const sqlite = new Database(":memory:");
  db = drizzle(sqlite, { schema });
  // Create table
  await db.run(`
    CREATE TABLE vigil_events (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      city VARCHAR(100) NOT NULL,
      province VARCHAR(100) NOT NULL,
      date DATE NOT NULL,
      time VARCHAR(50) NOT NULL,
      location TEXT NOT NULL,
      details TEXT NOT NULL,
      organizers TEXT NOT NULL DEFAULT '',
      links TEXT,
      image TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP NOT NULL,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP NOT NULL
    );
  `);
});

afterEach(async () => {
  // Drop table after each test
  await db.run("DROP TABLE IF EXISTS vigil_events;");
});

describe("GET /api/admin/vigil-events", () => {
  it("returns 401 if not admin", async () => {
    const mockedCheckAdminStatus = vi.mocked(checkAdminStatus);
    mockedCheckAdminStatus.mockResolvedValue(false);
    const res = await GET();
    expect(res.status).toBe(401);
  });

  it("returns 200 and events for admin", async () => {
    const mockedCheckAdminStatus = vi.mocked(checkAdminStatus);
    mockedCheckAdminStatus.mockResolvedValue(true);
    // Insert a sample event
    await db.insert(vigilEvents).values(sampleEvent).run();
    const res = await GET();
    expect(res.status).toBe(200);
    const json = await res.json();
    expect(Array.isArray(json)).toBe(true);
    expect(json[0].city).toBe(sampleEvent.city);
  });

  it("returns 500 on DB error", async () => {
    const mockedCheckAdminStatus = vi.mocked(checkAdminStatus);
    mockedCheckAdminStatus.mockResolvedValue(true);
    // Drop table to force error
    await db.run("DROP TABLE vigil_events;");
    const res = await GET();
    expect(res.status).toBe(500);
  });
});

// Minimal mock request type for POST
interface MockRequest {
  json: () => Promise<typeof sampleEvent>;
}

describe("POST /api/admin/vigil-events", () => {
  it("returns 401 if not admin", async () => {
    const mockedCheckAdminStatus = vi.mocked(checkAdminStatus);
    mockedCheckAdminStatus.mockResolvedValue(false);
    const req: MockRequest = { json: async () => sampleEvent };
    const res = await POST(req as Request);
    expect(res.status).toBe(401);
  });

  it("creates event for admin", async () => {
    const mockedCheckAdminStatus = vi.mocked(checkAdminStatus);
    mockedCheckAdminStatus.mockResolvedValue(true);
    const req: MockRequest = { json: async () => sampleEvent };
    const res = await POST(req as Request);
    expect(res.status).toBe(201);
    const json = await res.json();
    expect(json.city).toBe(sampleEvent.city);
  });

  it.only("returns 500 on DB error", async () => {
    const mockedCheckAdminStatus = vi.mocked(checkAdminStatus);
    mockedCheckAdminStatus.mockResolvedValue(true);

    // mock db.insert to throw an error
    vi.mock("@/db", () => ({
      db: {
        insert: vi.fn().mockRejectedValue(new Error("DB error")),
      },
    }));

    const req: MockRequest = { json: async () => sampleEvent };
    const res = await POST(req as Request);
    expect(res.status).toBe(500);
  });
});
