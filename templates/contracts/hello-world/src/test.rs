#![cfg(test)]
extern crate std;
use super::*;
use soroban_sdk::{
    testutils::{Address as _, Events},
    Address, Env, Symbol, vec,
};

fn setup() -> (Env, Address, Address, HelloWorldClient<'static>) {
    let env = Env::default();
    env.mock_all_auths();
    let admin = Address::generate(&env);
    let contract_id = env.register(HelloWorld, (&admin,));
    let client = HelloWorldClient::new(&env, &contract_id);
    (env, admin, contract_id, client)
}

#[test]
fn test_initial_state() {
    let (_, _, _, client) = setup();
    assert_eq!(client.get_count(), 0);
}

#[test]
fn test_increment() {
    let (_, _, _, client) = setup();
    assert_eq!(client.increment(), Ok(1));
    assert_eq!(client.increment(), Ok(2));
    assert_eq!(client.get_count(), 2);
}

#[test]
fn test_increment_auth_required() {
    let env = Env::default();
    // No mock_all_auths — verify auth failure
    let admin = Address::generate(&env);
    let attacker = Address::generate(&env);
    let contract_id = env.register(HelloWorld, (&admin,));
    let client = HelloWorldClient::new(&env, &contract_id);

    let result = std::panic::catch_unwind(std::panic::AssertUnwindSafe(|| {
        // Attacker tries to call increment — requires admin auth
        let _ = client.increment();
    }));
    assert!(result.is_err(), "increment should panic without admin auth");
}

#[test]
fn test_increment_auth_passes() {
    let env = Env::default();
    env.mock_all_auths();
    let admin = Address::generate(&env);
    let contract_id = env.register(HelloWorld, (&admin,));
    let client = HelloWorldClient::new(&env, &contract_id);

    assert_eq!(client.increment(), Ok(1));
    assert_eq!(client.increment(), Ok(2));
    assert_eq!(client.get_count(), 2);
}

#[test]
fn test_events_emitted() {
    let (env, admin, contract_id, client) = setup();
    client.increment();

    let events = env.events().all();
    assert!(!events.is_empty(), "expected at least one event");

    let (event_contract, topics, _data) = &events[0];
    assert_eq!(topics.get(0).unwrap(), Symbol::new(&env, "Incremented"));
    assert_eq!(topics.get(1).unwrap(), admin.to_val());
    assert_eq!(*event_contract, contract_id);
}

#[test]
fn test_storage_ttl_extended() {
    let env = Env::default();
    env.mock_all_auths();
    let admin = Address::generate(&env);
    let contract_id = env.register(HelloWorld, (&admin,));
    let client = HelloWorldClient::new(&env, &contract_id);

    let key = DataKey::Counter;
    let ttl_before = env.storage().instance().get_ttl(&key);
    assert!(ttl_before > 0, "storage should have initial TTL");

    client.increment();

    let ttl_after = env.storage().instance().get_ttl(&key);
    assert!(ttl_after >= ttl_before, "TTL should be extended on write");
}
