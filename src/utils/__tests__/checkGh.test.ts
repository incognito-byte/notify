import { checkGh } from "../checkGh";

// Mock child_process
jest.mock("child_process", () => ({
  execSync: jest.fn(),
}));

// Mock chalk
jest.mock("chalk", () => ({
  red: jest.fn((text) => text),
  yellow: jest.fn((text) => text),
}));

// Mock console.log
const mockConsoleLog = jest.spyOn(console, "log").mockImplementation(() => {});

// Mock process.exit
const mockProcessExit = jest.spyOn(process, "exit").mockImplementation(() => {
  throw new Error("process.exit called");
});

describe("checkGh", () => {
  const mockExecSync = require("child_process")
    .execSync as jest.MockedFunction<any>;

  beforeEach(() => {
    jest.clearAllMocks();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe("when gh command succeeds", () => {
    it("should not log any error messages", async () => {
      mockExecSync.mockReturnValue(Buffer.from(""));

      await checkGh();

      expect(mockConsoleLog).not.toHaveBeenCalled();
      expect(mockProcessExit).not.toHaveBeenCalled();
    });
  });

  describe("when gh command fails", () => {
    it("should log error messages and exit with code 1", async () => {
      mockExecSync.mockImplementation(() => {
        throw new Error("Command failed");
      });

      await expect(checkGh()).rejects.toThrow("process.exit called");

      expect(mockConsoleLog).toHaveBeenCalledWith("GitHub CLI (gh) not found.");
      expect(mockConsoleLog).toHaveBeenCalledWith(
        "Visit https://cli.github.com/ to install `gh`"
      );
      expect(mockProcessExit).toHaveBeenCalledWith(1);
    });
  });
});
