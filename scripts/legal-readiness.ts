import { legalReadiness } from "../src/config/legal";
const report = legalReadiness();
console.info(JSON.stringify(report, null, 2));
if (!report.ready) process.exitCode = 1;
