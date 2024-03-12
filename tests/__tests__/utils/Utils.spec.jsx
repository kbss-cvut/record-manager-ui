import { extractLastPageNumber, paramsSerializer } from "../../../src/utils/Utils";
import { HttpHeaders } from "../../../src/constants/DefaultConstants";

describe("Utils", () => {
  describe("paramsSerializer", () => {
    it("serializes singular query parameters into request query string", () => {
      const parameters = {
        page: 1,
        size: 10,
        includeImported: true,
        searchString: "test",
      };
      const result = paramsSerializer(parameters);
      expect(result).toEqual("page=1&size=10&includeImported=true&searchString=test");
    });

    it("serializes parameter value 0", () => {
      const parameters = {
        page: 0,
        size: 10,
      };
      const result = paramsSerializer(parameters);
      expect(result).toEqual("page=0&size=10");
    });

    it("supports serializing plural query parameters", () => {
      const parameters = {
        includeTerms: ["a", "b", "c"],
      };
      const result = paramsSerializer(parameters);
      expect(result).toEqual("includeTerms=a&includeTerms=b&includeTerms=c");
    });

    it("encodes query parameters before putting them into the query string", () => {
      const parameters = {
        includeTerms: ["http://example.org/one", "http://example.org/two"],
      };
      const result = paramsSerializer(parameters);
      expect(result).toEqual(
        `includeTerms=${encodeURIComponent(
          parameters.includeTerms[0],
        )}&includeTerms=${encodeURIComponent(parameters.includeTerms[1])}`,
      );
    });
  });

  describe("extractLastPageNumber", () => {
    it("extracts last page number from last page rel link header URL", () => {
      const resp = {
        headers: {},
      };
      resp.headers[HttpHeaders.LINK] =
        '<http://localhost:8080/record-manager?page=1&size=5>; rel="next", <http://localhost:8080/record-manager?page=8&size=5>; rel="last"';
      expect(extractLastPageNumber(resp)).toEqual(8);
    });

    it("returns undefined when response does not contain link header", () => {
      expect(extractLastPageNumber({ headers: {} })).not.toBeDefined();
    });

    it("returns undefined when response link header does not contain last rel link", () => {
      const resp = {
        headers: {},
      };
      resp.headers[HttpHeaders.LINK] = '<http://localhost:8080/record-manager?page=1&size=5>; rel="next"';
      expect(extractLastPageNumber(resp)).not.toBeDefined();
    });
  });
});
