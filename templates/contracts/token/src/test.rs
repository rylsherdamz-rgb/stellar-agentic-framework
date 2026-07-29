#![cfg(test)]
extern crate std;
use super::*;
use soroban_sdk::{
    testutils::{Address as _, Events},
    Address, Env, String, Symbol, vec,
};

fn setup() -> (Env, Address, Address, Address, TokenClient<'static>) {
    let env = Env::default();
    env.mock_all_auths();
    let admin = Address::generate(&env);
    let user = Address::generate(&env);
    let recipient = Address::generate(&env);
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
    (env, admin, user, recipient, client)
}

#[test]
fn test_metadata() {
    let (env, _, _, _, client) = setup();
    assert_eq!(client.name(), String::from_str(&env, "MyToken"));
    assert_eq!(client.symbol(), Symbol::new(&env, "MTK"));
    assert_eq!(client.decimals(), 7);
}

#[test]
fn test_mint_and_balance() {
    let (_, _, user, _, client) = setup();
    client.mint(&user, &1000);
    assert_eq!(client.balance(&user), 1000);
    assert_eq!(client.total_supply(), 1000);
}

#[test]
fn test_transfer() {
    let (_, _, user, recipient, client) = setup();
    client.mint(&user, &1000);
    client.transfer(&user, &recipient, &300);
    assert_eq!(client.balance(&user), 700);
    assert_eq!(client.balance(&recipient), 300);
}

#[test]
fn test_transfer_insufficient_balance() {
    let (_, _, user, recipient, client) = setup();
    let result = std::panic::catch_unwind(std::panic::AssertUnwindSafe(|| {
        client.transfer(&user, &recipient, &100);
    }));
    assert!(result.is_err());
}

#[test]
fn test_mint_events() {
    let (env, _, user, _, client) = setup();
    client.mint(&user, &500);

    let events = env.events().all();
    let mint_event = events.iter().find(|(_, topics, _)| {
        topics.get(0) == Some(Symbol::new(&env, "mint"))
    });
    assert!(mint_event.is_some());
}

#[test]
fn test_transfer_events() {
    let (env, _, user, recipient, client) = setup();
    client.mint(&user, &1000);
    client.transfer(&user, &recipient, &200);

    let events = env.events().all();
    let transfer_event = events.iter().find(|(_, topics, _)| {
        topics.get(0) == Some(Symbol::new(&env, "transfer"))
    });
    assert!(transfer_event.is_some());
}

#[test]
fn test_burn() {
    let (_, admin, _, _, client) = setup();
    client.mint(&admin, &500);
    client.burn(&admin, &200);
    assert_eq!(client.balance(&admin), 300);
    assert_eq!(client.total_supply(), 300);
}

#[test]
fn test_zero_transfer() {
    let (_, _, user, recipient, client) = setup();
    client.mint(&user, &100);
    client.transfer(&user, &recipient, &0);
    assert_eq!(client.balance(&user), 100);
    assert_eq!(client.balance(&recipient), 0);
}

#[test]
fn test_mint_to_multiple_recipients() {
    let (_, _, user, recipient, client) = setup();
    client.mint(&user, &500);
    client.mint(&recipient, &500);
    assert_eq!(client.balance(&user), 500);
    assert_eq!(client.balance(&recipient), 500);
    assert_eq!(client.total_supply(), 1000);
}
