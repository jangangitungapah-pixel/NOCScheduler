import { readFile } from "node:fs/promises";
import { afterAll, beforeAll, describe, it } from "vitest";
import {
  assertFails,
  initializeTestEnvironment,
  type RulesTestEnvironment,
} from "@firebase/rules-unit-testing";
import { doc, getDoc, setDoc } from "firebase/firestore";

let testEnv: RulesTestEnvironment;

beforeAll(async () => {
  testEnv = await initializeTestEnvironment({
    projectId: "demo-nocscheduler",
    firestore: {
      rules: await readFile("firestore.rules", "utf8"),
    },
  });

  await testEnv.withSecurityRulesDisabled(async (context) => {
    await setDoc(doc(context.firestore(), "employees/emp-member"), {
      displayName: "NOC Member",
      status: "ACTIVE",
    });
  });
});

afterAll(async () => {
  await testEnv.cleanup();
});

describe("F04R Firestore rules fail closed", () => {
  it("denies unauthenticated reads", async () => {
    const context = testEnv.unauthenticatedContext();
    await assertFails(getDoc(doc(context.firestore(), "employees/emp-member")));
  });

  it("denies authenticated direct reads until F05 capability rules exist", async () => {
    const context = testEnv.authenticatedContext("uid-member");
    await assertFails(getDoc(doc(context.firestore(), "employees/emp-member")));
  });

  it("denies authenticated direct writes", async () => {
    const context = testEnv.authenticatedContext("uid-admin", { role: "ADMINISTRATOR" });
    await assertFails(
      setDoc(doc(context.firestore(), "employees/emp-new"), {
        displayName: "Unauthorized direct write",
      }),
    );
  });

  it("denies direct audit mutation", async () => {
    const context = testEnv.authenticatedContext("uid-admin", { role: "ADMINISTRATOR" });
    await assertFails(
      setDoc(doc(context.firestore(), "auditEvents/audit-1"), {
        action: "tamper",
      }),
    );
  });
});
