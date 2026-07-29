import "dotenv/config";

const SERVER_URL = process.env.BACKEND_URL || "http://localhost:3001";

async function testX402Flow() {
  console.log("=== x402 Payment Flow Test ===");

  // Step 1: Request without payment — expect 402
  console.log("1. Requesting without payment...");
  const noPaymentRes = await fetch(`${SERVER_URL}/api/paid/data`);
  const noPaymentBody = await noPaymentRes.json();

  if (noPaymentRes.status !== 402) {
    console.error(`FAIL: Expected 402, got ${noPaymentRes.status}`);
    process.exit(1);
  }
  console.log("   ✓ Got 402 Payment Required");
  console.log(`   Payment requirements: ${JSON.stringify(noPaymentBody)}`);

  // Step 2: Request with payment header — expect 200
  // (In real flow, this would involve x402 auth entry signing)
  console.log("2. Requesting with payment header...");
  const withPaymentRes = await fetch(`${SERVER_URL}/api/paid/data`, {
    headers: { "x-payment": "simulated-payment" },
  });
  const withPaymentBody = await withPaymentRes.json();

  if (withPaymentRes.status !== 200) {
    console.error(`FAIL: Expected 200, got ${withPaymentRes.status}`);
    process.exit(1);
  }
  console.log("   ✓ Got 200 OK");
  console.log(`   Response: ${JSON.stringify(withPaymentBody)}`);

  console.log("\n✓ x402 flow test passed");
}

testX402Flow().catch((err) => {
  console.error("x402 test failed:", err.message);
  process.exit(1);
});
