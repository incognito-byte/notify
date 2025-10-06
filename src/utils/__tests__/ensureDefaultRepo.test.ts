import { ensureDefaultRepo } from "../ensureDefaultRepo";

// Mock child_process
jest.mock("child_process", () => ({
  execSync: jest.fn(),
}));

// Mock chalk
jest.mock("chalk", () => ({
  yellow: jest.fn((text) => text),
}));

// Mock console.log
const mockConsoleLog = jest.spyOn(console, "log").mockImplementation(() => {});

describe("ensureDefaultRepo", () => {
  const mockExecSync = require("child_process")
    .execSync as jest.MockedFunction<any>;

  beforeEach(() => {
    jest.clearAllMocks();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe("when repo exists", () => {
    beforeEach(() => {
      mockExecSync.mockImplementation((command: string) => {
        if (command.includes("gh repo view")) {
          return Buffer.from(""); // Success
        }
        throw new Error("Unexpected command");
      });
    });

    it("should only call gh repo view and not create repo", async () => {
      const config = { repo: "testuser/testrepo" };

      await ensureDefaultRepo(config);

      expect(mockExecSync).toHaveBeenCalledWith(
        "gh repo view testuser/testrepo",
        { stdio: "ignore" }
      );
      expect(mockExecSync).toHaveBeenCalledTimes(1);
      expect(mockConsoleLog).not.toHaveBeenCalled();
    });
  });

  describe("when repo does not exist", () => {
    beforeEach(() => {
      mockExecSync.mockImplementation((command: string) => {
        if (command.includes("gh repo view")) {
          throw new Error("Repository not found");
        }
        if (command.includes("gh repo create")) {
          return Buffer.from(""); // Success
        }
        throw new Error("Unexpected command");
      });
    });

    it("should create the repo when it doesn't exist", async () => {
      const config = { repo: "testuser/newrepo" };

      await ensureDefaultRepo(config);

      expect(mockExecSync).toHaveBeenCalledWith(
        "gh repo view testuser/newrepo",
        { stdio: "ignore" }
      );
      expect(mockConsoleLog).toHaveBeenCalledWith(
        "Creating repo: testuser/newrepo"
      );
      expect(mockExecSync).toHaveBeenCalledWith(
        "gh repo create testuser/newrepo --private",
        {
          stdio: "inherit",
        }
      );
      expect(mockExecSync).toHaveBeenCalledTimes(2);
    });
  });
});
