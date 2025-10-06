import { execSync } from "child_process";
import { getDefaultUsername } from "../getDefaultUsername";

// Mock child_process
jest.mock("child_process");

const mockExecSync = execSync as jest.MockedFunction<typeof execSync>;

describe("getDefaultUsername", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  describe("when gh api user command succeeds", () => {
    it("should return the username from gh api user --jq .login", () => {
      mockExecSync.mockReturnValue("testuser\n" as any);

      const result = getDefaultUsername();

      expect(result).toBe("testuser");
      expect(mockExecSync).toHaveBeenCalledWith("gh api user --jq .login", {
        encoding: "utf-8",
      });
    });

    it("should trim whitespace from the result", () => {
      mockExecSync.mockReturnValue("  testuser  \n" as any);

      const result = getDefaultUsername();

      expect(result).toBe("testuser");
    });

    it("should handle username with special characters", () => {
      mockExecSync.mockReturnValue("test-user-123\n" as any);

      const result = getDefaultUsername();

      expect(result).toBe("test-user-123");
    });

    it("should handle username with numbers", () => {
      mockExecSync.mockReturnValue("user123\n" as any);

      const result = getDefaultUsername();

      expect(result).toBe("user123");
    });

    it("should handle empty response", () => {
      mockExecSync.mockReturnValue("\n" as any);

      const result = getDefaultUsername();

      expect(result).toBe("");
    });

    it("should handle response with only whitespace", () => {
      mockExecSync.mockReturnValue("   \n" as any);

      const result = getDefaultUsername();

      expect(result).toBe("");
    });

    it("should handle response without newline", () => {
      mockExecSync.mockReturnValue("testuser" as any);

      const result = getDefaultUsername();

      expect(result).toBe("testuser");
    });

    it("should handle response with multiple lines", () => {
      mockExecSync.mockReturnValue("testuser\notherdata\nmore" as any);

      const result = getDefaultUsername();

      expect(result).toBe("testuser\notherdata\nmore"); // trim() only removes leading/trailing whitespace, not newlines in middle
    });
  });

  describe("when gh api user command fails", () => {
    it("should throw the error from execSync", () => {
      const error = new Error("GitHub API error");
      mockExecSync.mockImplementation(() => {
        throw error;
      });

      expect(() => getDefaultUsername()).toThrow("GitHub API error");
      expect(mockExecSync).toHaveBeenCalledWith("gh api user --jq .login", {
        encoding: "utf-8",
      });
    });

    it("should handle different types of errors", () => {
      mockExecSync.mockImplementation(() => {
        throw "String error";
      });

      expect(() => getDefaultUsername()).toThrow("String error");
    });

    it("should handle null errors", () => {
      mockExecSync.mockImplementation(() => {
        throw null;
      });

      expect(() => getDefaultUsername()).toThrow();
    });

    it("should handle undefined errors", () => {
      mockExecSync.mockImplementation(() => {
        throw undefined;
      });

      expect(() => getDefaultUsername()).toThrow();
    });
  });
});
