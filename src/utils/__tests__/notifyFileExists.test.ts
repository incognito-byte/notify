import { notifyFileExists } from "../notifyFileExists";

// Mock fs module
jest.mock("fs", () => ({
  existsSync: jest.fn(),
  promises: {
    writeFile: jest.fn(),
    appendFile: jest.fn(),
  },
}));

// Mock chalk
jest.mock("chalk", () => ({
  green: jest.fn((text) => text),
}));

// Mock console.log
const mockConsoleLog = jest.spyOn(console, "log").mockImplementation(() => {});

// Mock process.cwd and process.env
const originalCwd = process.cwd;
const originalEnv = process.env;

describe("notifyFileExists", () => {
  const mockExistsSync = require("fs").existsSync as jest.MockedFunction<any>;
  const mockWriteFile = require("fs").promises
    .writeFile as jest.MockedFunction<any>;
  const mockAppendFile = require("fs").promises
    .appendFile as jest.MockedFunction<any>;

  beforeEach(() => {
    jest.clearAllMocks();
    process.cwd = jest.fn().mockReturnValue("/test/working/dir");
    process.env = { ...originalEnv };
  });

  afterEach(() => {
    process.cwd = originalCwd;
    process.env = originalEnv;
  });

  describe("when .notify file exists", () => {
    beforeEach(() => {
      mockExistsSync.mockImplementation((filePath: any) => {
        return String(filePath).endsWith(".notify");
      });
    });

    it("should return exists: true and working directory", async () => {
      const result = await notifyFileExists();

      expect(result).toEqual({
        exists: true,
        workingDir: "/test/working/dir",
      });
      expect(mockExistsSync).toHaveBeenCalledWith(
        expect.stringContaining(".notify")
      );
    });
  });

  describe("when .notify file does not exist", () => {
    beforeEach(() => {
      mockExistsSync.mockReturnValue(false); // File doesn't exist
    });

    it("should return exists: false and working directory", async () => {
      const result = await notifyFileExists();

      expect(result).toEqual({
        exists: false,
        workingDir: "/test/working/dir",
      });
    });
  });

  describe("error handling", () => {
    it("should handle fs.promises.writeFile errors", async () => {
      mockExistsSync.mockReturnValue(false);
      mockWriteFile.mockRejectedValue(new Error("Write error"));
      mockAppendFile.mockResolvedValue(undefined);

      await expect(
        notifyFileExists(true, { repo: "test/repo" })
      ).rejects.toThrow("Write error");
    });
  });
});
