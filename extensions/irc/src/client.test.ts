// Irc tests cover client plugin behavior.
import { describe, expect, it } from "vitest";
import { buildIrcNickServCommands, formatIrcMessageTags } from "./client.js";

describe("irc client nickserv", () => {
  it("builds IDENTIFY command when password is set", () => {
    expect(
      buildIrcNickServCommands({
        password: "secret",
      }),
    ).toEqual(["PRIVMSG NickServ :IDENTIFY secret"]);
  });

  it("builds REGISTER command when enabled with email", () => {
    expect(
      buildIrcNickServCommands({
        password: "secret",
        register: true,
        registerEmail: "bot@example.com",
      }),
    ).toEqual([
      "PRIVMSG NickServ :IDENTIFY secret",
      "PRIVMSG NickServ :REGISTER secret bot@example.com",
    ]);
  });

  it("rejects register without registerEmail", () => {
    expect(() =>
      buildIrcNickServCommands({
        password: "secret",
        register: true,
      }),
    ).toThrow(/registerEmail/);
  });

  it("sanitizes outbound NickServ payloads", () => {
    expect(
      buildIrcNickServCommands({
        service: "NickServ\n",
        password: "secret\r\nJOIN #bad",
      }),
    ).toEqual(["PRIVMSG NickServ :IDENTIFY secret JOIN #bad"]);
  });

  it("formats IRCv3 message tags with escaped values", () => {
    expect(
      formatIrcMessageTags({
        "+openclaw.dev/reply-kind": "final",
        "+openclaw.dev/detail": "semi; space slash\\ cr\r lf\n",
        "+openclaw.dev/flag": true,
        "+openclaw.dev/skip": false,
      }),
    ).toBe(
      String.raw`@+openclaw.dev/reply-kind=final;+openclaw.dev/detail=semi\:\sspace\sslash\\\scr\r\slf\n;+openclaw.dev/flag `,
    );
  });
});
