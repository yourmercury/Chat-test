import 'regenerator-runtime/runtime';
import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import Big from 'big.js';
import Form from './components/Form';
import SignIn from './components/SignIn';
import Messages from './components/Messages';
import { v4 as uuidV4 } from 'uuid';

const SUGGESTED_DONATION = '0';
const BOATLOAD_OF_GAS = Big(3).times(10 ** 13).toFixed();

const App = ({ contract, currentUser, nearConfig, wallet }) => {
  const [messages, setMessages] = useState([]);
  const [isMine, setIsMine] = useState(false);


  useEffect(() => {
    (async () => {
      try {

        let user = window.location.hash.split("#")[1];

        console.log(window.location.hash.split("#")[1])

        if (user == currentUser.accountId) {
          setIsMine(true);
        }

        let messages = await contract.getMessagesFrom({
          user: user || currentUser.accountId,
          length: 0,
        });

        console.log(messages, currentUser.accountId);

        setMessages(messages);
      } catch (error) {
        console.log(error);
        console.log(currentUser.accountId);
      }
    })();
  }, []);

  const onSubmit = (e) => {
    e.preventDefault();

    const { fieldset, message, donation } = e.target.elements;

    fieldset.disabled = true;

    // TODO: optimistically update page with new message,
    // update blockchain data in background
    // add uuid to each message, so we know which one is already known
    contract.sendMessage(
      { message: message.value, id: uuidV4() },
      BOATLOAD_OF_GAS,
      Big(donation.value || '0').times(10 ** 24).toFixed()
    ).then(() => {
      contract.getMessagesFrom(
        {
          user: currentUser.accountId,
          length: 0
        },
      ).then(messages => {
        setMessages(messages);
        message.value = '';
        donation.value = SUGGESTED_DONATION;
        fieldset.disabled = false;
        message.focus();
      });
    });
  };

  const signIn = () => {
    wallet.requestSignIn(
      // { contractId: nearConfig.contractName, methodNames: [contract.sendMessage.name, contract.likeUnlikePost.name] }, //contract requesting access
      { contractId: nearConfig.contractName, methodNames: [contract.sendMessage.name, contract.likeUnlike.name, contract.deleteMessage.name, contract.createUsers.name, contract.follow.name, contract.unFollow.name,] }, //contract requesting access
      'NEAR Guest Book', //optional name
      null, //optional URL to redirect to if the sign in was successful
      null //optional URL to redirect to if the sign in was NOT successful
    );
  };

  const signOut = () => {
    wallet.signOut();
    window.location.replace(window.location.origin + window.location.pathname);
  };

  return (
    <main>
      <header>
        <h1>NEAR Guest Book</h1>
        {currentUser
          ? <button onClick={signOut}>Log out</button>
          : <button onClick={signIn}>Log in</button>
        }
      </header>
      {currentUser
        ? <Form onSubmit={onSubmit} currentUser={currentUser} />
        : <SignIn />
      }
      {!!currentUser && !!messages?.length && <Messages messages={messages} user={currentUser.accountId} contract={contract} />}
    </main>
  );
};

App.propTypes = {
  contract: PropTypes.shape({
    addMessage: PropTypes.func.isRequired,
    getMessages: PropTypes.func.isRequired
  }).isRequired,
  currentUser: PropTypes.shape({
    accountId: PropTypes.string.isRequired,
    balance: PropTypes.string.isRequired
  }),
  nearConfig: PropTypes.shape({
    contractName: PropTypes.string.isRequired
  }).isRequired,
  wallet: PropTypes.shape({
    requestSignIn: PropTypes.func.isRequired,
    signOut: PropTypes.func.isRequired
  }).isRequired
};

export default App;
