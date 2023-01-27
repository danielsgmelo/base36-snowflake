import http from "k6/http";
import { check, sleep } from "k6";

// Test configuration
export const options = {
  thresholds: {
    // Assert that 95% of requests finish within 5ms.
    http_req_duration: ["p(95) < 5"],
    // Assert that 99% of requests finish within 10ms.
    http_req_duration: ["p(99) < 10"],
  },
  // Ramp the number of virtual users up and down
  stages: [
    { duration: "10s", target: 100 },
    { duration: "30s", target: 200 },
    { duration: "10s", target: 0 },
  ],
};

// Simulated user behavior
export default function () {
  let res = http.post("http://nginx:4000");
  // Validate response status
  check(res, { "status was 201": (r) => r.status == 201 });
  // Validate response body
  check(res, { "id was generated": (r) => JSON.parse(r.body).id.match(/^[A-Z0-9]{7}$/) });
  sleep(1);
}