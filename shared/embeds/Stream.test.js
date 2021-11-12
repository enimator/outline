/* eslint-disable flowtype/require-valid-file-annotation */
import Stream from "./Stream";

describe("Stream", () => {
  const match = Stream.ENABLED[0];
  test("to be enabled on video link", () => {
    expect(
      "https://web.microsoftstream.com/video/56ca1a4a-b5a2-4aa9-a133-958744ba39b9".match(match)
    ).toBeTruthy();
  });

  test("to be enabled on embed link", () => {
    expect(
      "https://web.microsoftstream.com/embed/video/56ca1a4a-b5a2-4aa9-a133-958744ba39b9?autoplay=false&showinfo=true".match(match)
    ).toBeTruthy();
  });

  test("to not be enabled elsewhere", () => {
    expect("https://web.microsoftstream.com".match(match)).toBe(null);
  });
});
