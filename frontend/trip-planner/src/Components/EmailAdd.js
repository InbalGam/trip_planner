import { useState } from "react";
import { ReactMultiEmail, isEmail } from 'react-multi-email';
import 'react-multi-email/dist/style.css';
import tw from "twin.macro";
import {css} from "styled-components/macro"; //eslint-disable-line

function Email(props) {
  const [focused, setFocused] = useState(false);

  return (
    <div className='emails'>
      <h3 className="addEmailHeadline" tw="mt-4">Share trip</h3>
      <ReactMultiEmail
        placeholder='Input email'
        emails={props.emails}
        onChange={(_emails) => {props.setEmails(_emails);}}
        autoFocus={true}
        getLabel={(email, index, removeEmail) => {
          return (
            <div data-tag key={index}>
              <div data-tag-item>{email}</div>
              <span data-tag-handle onClick={() => removeEmail(index)}>
                ×
              </span>
            </div>
          );
        }}
      />
      <br />
    </div>
  );
};

export default Email;