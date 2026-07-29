#![cfg(test)]
extern crate std;
use super::*;
use soroban_sdk::{
    testutils::{Address as _, Events},
    Address, Env,
};

#[test]
fn test_increment() {
    let env = Env::default();
    env.mock_all_auths();
    let admin = Address::generate(&env);
    let contract_id = env.register(HelloWorld, (&admin,));
    let client = HelloWorldClient::new(&env, &contract_id);

    assert_eq!(client.increment(), 1);
    assert_eq!(client.increment(), 2);
    assert_eq!(client.get_count(), 2);
}

#[test]
fn test_initial_state() {
    let env = Env::default();
    let admin = Address::generate(&env);
    let contract_id = env.register(HelloWorld, (&admin,));
    let client = HelloWorldClient::new(&env, &contract_id);

    assert_eq!(client.get_count(), 0);
}

#[test]
fn test_events_emitted() {
    let env = Env::default();
    env.mock_all_auths();
    let admin = Address::generate(&env);
    let contract_id = env.register(HelloWorld, (&admin,));
    let client = HelloWorldClient::new(&env, &contract_id);

    client.increment();

    let events = env.events().all();
    assert!(!events.is_empty());

    let event = &events[0];
    assert_eq!(event.contract_id, contract_id);
}
