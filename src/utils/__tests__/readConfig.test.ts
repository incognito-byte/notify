import { readConfig } from "../readConfig";

// Mock fs/promises
jest.mock("fs/promises", () => ({
  readFile: jest.fn(),
}));

// Mock notifyFileExists
jest.mock("../notifyFileExists", () => ({
  notifyFileExists: jest.fn(),
}));

// Mock chalk
jest.mock("chalk", () => ({
  yellow: jest.fn((text) => text),
}));

// Mock console.log
const mockConsoleLog = jest.spyOn(console, "log").mockImplementation(() => {});

// Mock process.exit
const mockProcessExit = jest.spyOn(process, "exit").mockImplementation(() => {
  throw new Error("process.exit called");
});

describe("readConfig", () => {
  const mockReadFile = require("fs/promises")
    .readFile as jest.MockedFunction<any>;
  const mockNotifyFileExists = require("../notifyFileExists")
    .notifyFileExists as jest.MockedFunction<any>;

  beforeEach(() => {
    jest.clearAllMocks();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe("when .notify file exists and is readable", () => {
    it("should return parsed JSON config", async () => {
      const mockConfig = { repo: "testuser/testrepo" };
      const workingDir = "/test/working/dir";

      mockNotifyFileExists.mockResolvedValue({ exists: true, workingDir });
      mockReadFile.mockResolvedValue(JSON.stringify(mockConfig));

      const result = await readConfig();

      expect(result).toEqual(mockConfig);
      expect(mockNotifyFileExists).toHaveBeenCalled();
      expect(mockReadFile).toHaveBeenCalledWith(
        expect.stringContaining(".notify"),
        "utf8"
      );
    });
  });

  describe("when .notify file does not exist", () => {
    it("should log error messages and exit with code 1", async () => {
      const workingDir = "/test/working/dir";

      mockNotifyFileExists.mockResolvedValue({ exists: true, workingDir });
      mockReadFile.mockRejectedValue(
        new Error("ENOENT: no such file or directory")
      );

      await expect(readConfig()).rejects.toThrow("process.exit called");

      expect(mockConsoleLog).toHaveBeenCalledWith("No .notify file found");
      expect(mockConsoleLog).toHaveBeenCalledWith(
        "Please run `notify init` to create one"
      );
      expect(mockProcessExit).toHaveBeenCalledWith(1);
    });
  });
});
