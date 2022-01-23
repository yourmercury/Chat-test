import React, { useState } from 'react';
import PropTypes from 'prop-types';
import Big from 'big.js';
const BOATLOAD_OF_GAS = Big(3).times(10 ** 13).toFixed();

export default function Messages({ messages, user, contract }) {

  async function likeUnlike(username, id) {
    await contract.likeUnlike(
      { user: username, id: id },
      BOATLOAD_OF_GAS,
    )


    window.location.reload();
  }

  if (!messages) return null;
  return (
    <>
      <h2>Messages</h2>
      {messages.map((message, i) =>
        // TODO: format as cards, add timestamp
        <p key={i} className={true ? 'is-premium' : ''}>
          <strong>{message.sender}</strong>:<br />
          <strong>Message:</strong> {message.message} <br />
          <strong>Likes:</strong> {message.likes?.length} <div style={{
            height: "15px",
            width: "15px",
            background: message.likes?.includes(user) ? "blue" : "white",
            border: "solid black 0.5px",
            borderRadius: "50%",
            display: "inline-block",
            marginLeft: "10px"
          }}
          
            
            onClick={() => {
              likeUnlike(message.sender, message.id)
            }}
          ></div> <br />
          <strong>Date:</strong> {message.createdAt && (new Date(Number(message.createdAt)/1000000)).toLocaleDateString()} <br />
        </p>
      )}
    </>
  );
}

Messages.propTypes = {
  messages: PropTypes.array
};
