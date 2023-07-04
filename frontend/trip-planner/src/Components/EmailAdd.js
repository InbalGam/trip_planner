import { useState } from "react";
import { ReactMultiEmail, isEmail } from 'react-multi-email';
import 'react-multi-email/dist/style.css';

function Email(props) {
  //const [emails, setEmails] = useState([]);
  const [focused, setFocused] = useState(false);

  return (
    <form className='emails'>
      <h3 className="addEmailHeadline">Share trip</h3>
      <ReactMultiEmail
        placeholder='Input email'
        emails={props.emails}
        onChange={(_emails) => {props.setEmails(_emails);}}
        autoFocus={true}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
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
      {/* <h4>react-multi-email value</h4> */}
      {/* <h3>Focused: {focused ? 'true' : 'false'}</h3> */}
      {/* <p>{emails.join(', ') || 'empty'}</p> */}
    </form>
  );
};

export default Email;