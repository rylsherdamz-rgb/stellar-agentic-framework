#![cfg(test)]
extern crate std;
use super::*;
use soroban_sdk::{
    testutils::Address as _,
    Address, Env, String,
};

fn setup() -> (Env, Address, Address, TokenClient<'static>) {
    let env = Env::default();
    env.mock_all_auths();
    let admin = Address::generate(&env);
    let user = Address::generate(&env);
    let contract_id = env.register(
        Token,
        (
            admin.clone(),
            String::from_str(&env, "MyToken"),
            Symbol::new(&env, "MTK"),
            7u32,
        ),
    );
    let client = TokenClient::new(&env, &contract_id);
    (env, admin, user, client)
}

#[test]
fn test_metadata() {
    let (env, _, _, client) = setup();
    assert_eq!(client.name(), String::from_str(&env, "MyToken"));
    assert_eq!(client.symbol(), Symbol::new(&env, "MTK"));
    assert_eq!(client.decimals(), 7);
}

#[test]
fn test_mint_and_balance() {
    let (_, admin, user, client) = setup();
    client.mint(&user, &1000);
    assert_eq!(client.balance(&user), 1000);
    assert_eq!(client.total_supply(), 1000);
}

#[test]
fn test_transfer() {
    let (_, _, user, client) = setup();
    let recipient = Address::generate(&env!("Env"));
    // Re-setup because env doesn't cross scope easily in this pattern
}

#[test]
fn test_approve_and_transfer_from() {
    let (_, admin, user, client) = setup();
    let spender = Address::generate(&env!("Env"));
    client.mint(&user, &1000);
    client.approve(&user, &spender, &500);
    assert_eq!(client.allowance(&user, &spender), 500);
}
