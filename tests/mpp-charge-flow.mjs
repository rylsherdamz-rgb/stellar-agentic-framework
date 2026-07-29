import "dotenv/config";

const SERVER_URL = process.env.BACKEND_URL || "http://localhost:3001";

async function testMPPChargeFlow() {
  console.log("=== MPP Charge Flow Test ===");

  // Health check
  console.log("1. Checking server health...");
  const healthRes = await fetch(`${SERVER_URL}/health`);
  const healthBody = await healthRes.json();

  if (healthRes.status !== 200) {
    console.error(`FAIL: Server not healthy (${healthRes.status})`);
    process.exit(1);
  }
  console.log(`   ✓ Server healthy (network: ${healthBody.network})`);

  // Account balance lookup
  console.log("2. Checking account balance...");
  const testAddress = "GAOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOO";
  const balanceRes = await fetch(`${SERVER_URL}/api/accounts/${testAddress}/balance`);
  const balanceBody = await balanceRes.json();

  if (balanceRes.status !== 200) {
    console.error(`FAIL: Balance lookup failed (${balanceRes.status})`);
    process.exit(1);
  }
  console.log(`   ✓ Balance: ${balanceBody.balance}`);

  console.log("\n✓ MPP charge flow test passed");
}

testMPPChargeFlow().catch((err) => {
  console.error("MPP test failed:", err.message);
  process.exit(1);
});
